import { useEffect, useState } from 'react';
import { generateSitemap } from '@/utils/sitemapGenerator';

export default function SitemapPage() {
  const [sitemapXML, setSitemapXML] = useState('');

  useEffect(() => {
    const generateAndSetSitemap = async () => {
      try {
        const xml = await generateSitemap();
        setSitemapXML(xml);
        
        // Set proper XML content type
        document.title = 'Sitemap';
        const head = document.head;
        let metaTag = document.querySelector('meta[http-equiv="Content-Type"]');
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('http-equiv', 'Content-Type');
          head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', 'application/xml; charset=utf-8');
      } catch (error) {
        console.error('Error generating sitemap:', error);
      }
    };

    generateAndSetSitemap();
  }, []);

  return (
    <div style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {sitemapXML || 'Generating sitemap...'}
    </div>
  );
}