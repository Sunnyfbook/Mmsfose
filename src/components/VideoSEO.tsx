import { Helmet } from 'react-helmet-async';
import { VideoCardData } from '@/services/videoApi';

interface VideoSEOProps {
  video: VideoCardData;
  seoSettings?: any; // Pre-loaded SEO settings
}

const VideoSEO = ({ video, seoSettings }: VideoSEOProps) => {

  // Only use SEO data if provided, no fallbacks
  const seo = seoSettings;

  // Only render if we have SEO data
  if (!seo) {
    return null;
  }

  return (
    <Helmet>
      {seo.title && <title>{seo.title}</title>}
      {seo.description && <meta name="description" content={seo.description} />}
      {seo.keywords && (
        <meta name="keywords" content={Array.isArray(seo.keywords) ? seo.keywords.join(', ') : seo.keywords} />
      )}
      <meta name="robots" content={seo.meta_robots || 'index,follow'} />
      
      {/* Open Graph */}
      {seo.og_title && <meta property="og:title" content={seo.og_title} />}
      {seo.og_description && <meta property="og:description" content={seo.og_description} />}
      {seo.og_image && <meta property="og:image" content={seo.og_image} />}
      {seo.canonical_url && <meta property="og:url" content={seo.canonical_url} />}
      <meta property="og:type" content="video.other" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {seo.og_title && <meta name="twitter:title" content={seo.og_title} />}
      {seo.og_description && <meta name="twitter:description" content={seo.og_description} />}
      {seo.og_image && <meta name="twitter:image" content={seo.og_image} />}
      
      {/* Video specific meta tags */}
      {video.duration && <meta property="video:duration" content={video.duration} />}
      <meta property="video:director" content={video.author} />
      
      {/* Canonical URL */}
      {seo.canonical_url && <link rel="canonical" href={seo.canonical_url} />}
    </Helmet>
  );
};

export default VideoSEO;