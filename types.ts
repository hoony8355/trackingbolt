export type TrackType = 'GA4' | 'GTM' | 'Meta' | 'Console';

export interface TrackingEvent {
  id: string;
  timestamp: number;
  type: TrackType;
  command: string; // e.g., 'config', 'event', 'push', 'track', 'log'
  args: any[]; // The arguments passed to the function
}

export interface Task {
  id: string;
  description: string;
  // A function that takes the event history and returns true if passed, or an error string if failed logic
  validate: (events: TrackingEvent[]) => ValidationResult;
}

export interface ValidationResult {
  passed: boolean;
  message: string;
}

export interface Lesson {
  id: string;
  track: TrackType;
  title: string;
  description: string; // Markdown-like string
  
  // Visual Code Blocks
  preCode?: string;      // Read-only code displayed ABOVE the editor (simulates HTML/Context)
  initialCode: string;   // The editable part
  postCode?: string;     // Read-only code displayed BELOW the editor
  
  // Execution Logic
  setupScript?: string;  // Invisible JS code executed BEFORE the user code to set up variables (mocking the environment)
  
  tasks: Task[];
  solutionCode?: string;

  // External Links
  references?: { label: string; url: string; }[];
  
  // Optional hint for the user
  hint?: string;
}

export interface RuntimeContext {
  gtag: (...args: any[]) => void;
  fbq: (...args: any[]) => void;
  dataLayer: any[];
}