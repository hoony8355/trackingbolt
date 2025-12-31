import { TrackingEvent, TrackType } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

type EventListener = (events: TrackingEvent[]) => void;

export class MockRuntime {
  private events: TrackingEvent[] = [];
  private consoleLogs: string[] = [];
  private listeners: EventListener[] = [];

  constructor() {
    this.events = [];
    this.consoleLogs = [];
  }

  public getEvents(): TrackingEvent[] {
    return this.events;
  }

  public getLogs(): string[] {
    return this.consoleLogs;
  }

  public subscribe(listener: EventListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l([...this.events]));
  }

  public clear() {
    this.events = [];
    this.consoleLogs = [];
    // Clean up window pollution
    // @ts-ignore
    delete window.gtag;
    // @ts-ignore
    delete window.fbq;
    // @ts-ignore
    window.dataLayer = [];
    // @ts-ignore
    delete window.handleCartClick;
    // @ts-ignore
    delete window.handleSignupClick;
    
    this.notify();
  }

  private logEvent(type: TrackType, command: string, args: any[]) {
    this.events.push({
      id: generateId(),
      timestamp: Date.now(),
      type,
      command,
      args,
    });
    this.notify();
  }

  // Create the mock window objects and bind them to the REAL window 
  // so MockBrowser (React component) can access them via window.gtag()
  public createScope() {
    // Mock Document & Location
    const document = {
      title: '장바구니 | MyShop',
      referrer: 'https://google.com'
    };

    const location = {
      href: 'https://www.myshop.com/cart',
      origin: 'https://www.myshop.com',
      pathname: '/cart',
      search: '?id=123'
    };

    // Mock GA4
    const gtag = (command: string, ...args: any[]) => {
      this.logEvent('GA4', command, args);

      // --- GA4 Side Effect Logic ---
      // GA4 automatically sends a 'page_view' when 'config' is called,
      // unless 'send_page_view': false is specified.
      if (command === 'config') {
        const configOptions = args[1];
        let shouldSendPv = true;
        
        if (configOptions && typeof configOptions === 'object') {
          if (configOptions.send_page_view === false) {
            shouldSendPv = false;
          }
        }

        if (shouldSendPv) {
          // Trigger the implicit page_view
          // We wrap it in a setTimeout to simulate slight async or just order, 
          // but synchronous is fine for this mock to ensure validation logic catches it immediately.
          this.logEvent('GA4', 'event', ['page_view', {
             page_title: document.title,
             page_location: location.href,
             send_to: args[0] // The Measurement ID
          }]);
        }
      }
    };

    // Mock Meta Pixel
    const fbq = (command: string, ...args: any[]) => {
      this.logEvent('Meta', command, args);
    };

    // Mock GTM dataLayer
    const dataLayer: any[] = [];
    const originalPush = dataLayer.push.bind(dataLayer);
    dataLayer.push = (...args: any[]) => {
      args.forEach((arg) => {
        this.logEvent('GTM', 'push', [arg]);
      });
      return originalPush(...args);
    };

    // Bind to global window for interactivity
    // @ts-ignore
    window.gtag = gtag;
    // @ts-ignore
    window.fbq = fbq;
    // @ts-ignore
    window.dataLayer = dataLayer;
    // @ts-ignore
    window.handleCartClick = undefined; // Reset handlers

    // Mock Console
    const console = {
      log: (...args: any[]) => {
        const msg = args.map(a => String(a)).join(' ');
        this.consoleLogs.push(msg);
        // Treat console logs as trackable events for validation
        this.logEvent('Console', 'log', args);
      },
      warn: (...args: any[]) => {},
      error: (...args: any[]) => {}
    };

    return { gtag, fbq, dataLayer, document, location, console };
  }

  public execute(code: string, setupScript: string = ''): { success: boolean; error?: string } {
    this.clear();
    const scope = this.createScope();

    try {
      const fullScript = `
        "use strict";
        try {
          ${setupScript}
          ${code}
        } catch (e) {
          throw e;
        }
      `;

      const runCode = new Function(
        'gtag', 'fbq', 'dataLayer', 'document', 'location', 'console', 
        fullScript
      );

      runCode(
        scope.gtag, 
        scope.fbq, 
        scope.dataLayer, 
        scope.document, 
        scope.location,
        scope.console
      );
      
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}