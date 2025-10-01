import { Helmet } from 'react-helmet-async';
import { VideoCardData } from '@/services/videoApi';

interface VideoSEOProps {
  video: VideoCardData;
  seoSettings?: any; // Pre-loaded SEO settings
}

const VideoSEO = ({ video, seoSettings }: VideoSEOProps) => {

  // Generate fallback SEO data if no specific settings exist
  const fallbackSEO = {
    title: `${video.title} - KingTube`,
    description: `Watch ${video.title} by ${video.author}${video.views ? `. ${video.views} views` : ''}.`,
    keywords: [video.title, video.author, 'video', 'streaming', 'entertainment'],
    og_title: video.title,
    og_description: `Watch ${video.title} by ${video.author}`,
    og_image: video.thumbnail,
    canonical_url: window.location.href,
  };

  const seo = seoSettings || fallbackSEO;

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords && (
        <meta name="keywords" content={Array.isArray(seo.keywords) ? seo.keywords.join(', ') : seo.keywords} />
      )}
      <meta name="robots" content={seo.meta_robots || 'index,follow'} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seo.og_title} />
      <meta property="og:description" content={seo.og_description} />
      <meta property="og:image" content={seo.og_image} />
      <meta property="og:url" content={seo.canonical_url} />
      <meta property="og:type" content="video.other" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.og_title} />
      <meta name="twitter:description" content={seo.og_description} />
      <meta name="twitter:image" content={seo.og_image} />
      
      {/* Video specific meta tags */}
      {video.duration && <meta property="video:duration" content={video.duration} />}
      <meta property="video:director" content={video.author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seo.canonical_url} />
    </Helmet>
  );
};

export default VideoSEO;