import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  schema?: object;
}

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage = '/logo.webp',
  schema,
}: SEOProps) {
  useEffect(() => {
    // 1. Dynamic Title
    document.title = title;

    // Helper to update or create meta tags
    const updateMetaTag = (nameAttr: string, valueAttr: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${valueAttr}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, valueAttr);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update or create link tags
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Meta Description
    updateMetaTag('name', 'description', description);

    // 3. Meta Keywords
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords);
    }

    // 4. Canonical Link
    const currentUrl = canonical || window.location.href;
    updateLinkTag('canonical', currentUrl);

    // 5. Open Graph Tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', currentUrl);
    updateMetaTag('property', 'og:image', ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`);

    // 6. Twitter Tags
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`);

    // 7. Schema.org JSON-LD (dynamic injection)
    let schemaScript = document.getElementById('dynamic-schema') as HTMLScriptElement | null;
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'dynamic-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else {
      if (schemaScript) {
        schemaScript.remove();
      }
    }
  }, [title, description, keywords, canonical, ogImage, schema]);

  return null;
}
