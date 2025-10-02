import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'organization' | 'video' | 'website' | 'breadcrumb';
  data: any;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  const generateSchema = () => {
    const baseUrl = window.location.origin;
    
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "KingTube",
          "description": "Discover amazing video content from creators around the world",
          "url": baseUrl,
          "logo": `${baseUrl}/favicon.ico`,
          "sameAs": [
            // Add social media URLs when available
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service"
          }
        };
        
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "KingTube",
          "description": "Watch Amazing Videos - Discover trending videos and amazing content",
          "url": baseUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        };
        
      case 'video':
        return {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": data.title,
          "description": data.description || `Watch ${data.title} by ${data.author}`,
          "thumbnailUrl": data.thumbnail,
          "uploadDate": data.created_at || new Date().toISOString(),
          "duration": data.duration ? `PT${data.duration}` : undefined,
          "contentUrl": data.videoUrl,
          "embedUrl": data.videoUrl,
          "interactionStatistic": [
            {
              "@type": "InteractionCounter",
              "interactionType": { "@type": "WatchAction" },
              "userInteractionCount": parseInt(data.views?.replace(/[^\d]/g, '') || '0')
            },
            {
              "@type": "InteractionCounter", 
              "interactionType": { "@type": "LikeAction" },
              "userInteractionCount": parseInt(data.likes?.replace(/[^\d]/g, '') || '0')
            }
          ],
          "author": {
            "@type": "Person",
            "name": data.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "KingTube",
            "url": baseUrl
          }
        };
        
      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
          }))
        };
        
      default:
        return null;
    }
  };

  const schema = generateSchema();
  
  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema, null, 2)}
      </script>
    </Helmet>
  );
};

export default StructuredData;