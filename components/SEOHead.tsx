
import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  url: string;
  schema?: Record<string, any> | Record<string, any>[];
}

const SEOHead: React.FC<SEOHeadProps> = ({ title, description, url, schema }) => {
  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | TrackingBolt`;

    // 2. Update Meta Description
    let metaDescription = document.querySelector("meta[name='description']");
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description.slice(0, 160)); // Standard SEO length limit

    // 3. Update Canonical URL
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // 4. Inject JSON-LD Schema
    if (schema) {
      let script = document.querySelector("script[type='application/ld+json']");
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }

    // Cleanup: We generally leave the tags as they are SPA compatible, 
    // but strict cleanup might remove them. For now, we overwrite.
  }, [title, description, url, schema]);

  return null;
};

export default SEOHead;
