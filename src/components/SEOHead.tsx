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

  // Only use fallback values if no SEO data is provided and no props are provided
  const hasSeoData = !!seoData;
  const title = propTitle || (hasSeoData ? seoData?.title : undefined) || 'KingTube - Professional Video Platform';
  const description = propDescription || (hasSeoData ? seoData?.description : undefined) || 'Professional video streaming platform with high-quality content';
  const ogTitle = seoData?.og_title || title;
  const ogDescription = seoData?.og_description || description;
  const ogImage = propOgImage || seoData?.og_image || '/placeholder.svg';
  const canonical = propCanonical || seoData?.canonical_url;
  const keywords = seoData?.keywords?.join(', ') || 'video, streaming, entertainment';
  const robots = seoData?.meta_robots || 'index,follow';

  return (
    <Helmet key={`seo-${pageType}-${seoData?.id || 'loading'}`}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
}