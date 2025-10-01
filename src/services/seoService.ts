import { supabase } from '@/integrations/supabase/client';

// Simple synchronous SEO service - no caching, no delays
export const getSEOData = async (pageType: string) => {
  try {
    console.log(`🚀 Fetching SEO data immediately for ${pageType}`);
    
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_type', pageType)
      .single();

    if (error) {
      console.log(`⚠️ No SEO data found for ${pageType}:`, error.message);
      return null;
    }

    console.log(`✅ SEO data fetched immediately for ${pageType}:`, data);
    return data;
  } catch (error) {
    console.error(`❌ Error fetching SEO data for ${pageType}:`, error);
    return null;
  }
};

// Pre-load SEO data for common pages
export const preloadSEOData = async () => {
  console.log('🚀 Pre-loading SEO data for all pages...');
  
  const pages = ['global', 'home', 'video'];
  const seoData: Record<string, any> = {};
  
  for (const page of pages) {
    try {
      const data = await getSEOData(page);
      if (data) {
        seoData[page] = data;
      }
    } catch (error) {
      console.error(`❌ Error pre-loading SEO for ${page}:`, error);
    }
  }
  
  console.log('✅ Pre-loaded SEO data:', seoData);
  return seoData;
};
