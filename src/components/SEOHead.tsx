import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  pageType?: string;
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  seoData?: any; // Pre-loaded SEO data
}

export default function SEOHead({ 
  pageType = 'global', 
  title: propTitle,
  description: propDescription,
  ogImage: propOgImage,
  canonical: propCanonical,
  seoData
}: SEOHeadProps) {

  //# If no SEO data, use default fallback values
  if (!seoData) {
    console.warn('No SEO data provided to SEOHead component');
    // Return basic fallback meta tags
    return (
      <Helmet key={`seo-fallback-${pageType}`}>
        <title>Mmsfose - Video Platform</title>
        <meta name="description" content="Discover amazing video content from creators around the world" />
        <meta name="keywords" content="video, streaming, entertainment, videos" />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content="Mmsfose - Video Platform" />
        <meta property="og:description" content="Discover amazing video content from creators around the world" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
    );
  }

  // Use props if provided, otherwise use SEO data, no fallbacks
  const hasValidSeoData = !!seoData && Object.keys(seoData).length > 0;
  
  const title = propTitle || 
    (hasValidSeoData && seoData.title && seoData.title.trim() !== '' ? seoData.title : undefined);
    
  const description = propDescription || 
    (hasValidSeoData && seoData.description && seoData.description.trim() !== '' ? seoData.description : undefined);
    
  const ogTitle = (hasValidSeoData && seoData.og_title && seoData.og_title.trim() !== '' ? seoData.og_title : undefined) || title;
  const ogDescription = (hasValidSeoData && seoData.og_description && seoData.og_description.trim() !== '' ? seoData.og_description : undefined) || description;
  const ogImage = propOgImage || (hasValidSeoData && seoData.og_image && seoData.og_image.trim() !== '' ? seoData.og_image : undefined);
  const canonical = propCanonical || (hasValidSeoData && seoData.canonical_url && seoData.canonical_url.trim() !== '' ? seoData.canonical_url : undefined);
  const keywords = (hasValidSeoData && seoData.keywords && Array.isArray(seoData.keywords) ? seoData.keywords.join(', ') : undefined);
  const robots = (hasValidSeoData && seoData.meta_robots && seoData.meta_robots.trim() !== '' ? seoData.meta_robots : undefined);

  return (
    <Helmet key={`seo-${pageType}-${seoData?.id || 'default'}`}>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {robots && <meta name="robots" content={robots} />}
      
      {/* Open Graph */}
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {ogTitle && <meta name="twitter:title" content={ogTitle} />}
      {ogDescription && <meta name="twitter:description" content={ogDescription} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
}