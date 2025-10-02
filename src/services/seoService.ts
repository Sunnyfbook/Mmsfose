import { supabase } from '@/integrations/supabase/client';

// Simple synchronous SEO service - no caching, no delays
export const getSEOData = async (pageType: string) => {
  try {
    console.log(`🚀 Fetching SEO data immediately for ${pageType}`);
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Supabase Key configured:', !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_type', pageType);

    if (error) {
      console.log(`⚠️ Error fetching SEO data for ${pageType}:`, error.message);
      console.log('Error details:', error);
      return null;
    }

    if (!data || data.length === 0) {
      console.log(`⚠️ No SEO data found for ${pageType}`);
      console.log('Query result:', data);
      return null;
    }

    console.log(`✅ SEO data fetched immediately for ${pageType}:`, data[0]);
    return data[0];
  } catch (error) {
    console.error(`❌ Error fetching SEO data for ${pageType}:`, error);
    console.error('Error stack:', error.stack);
    return null;
  }
};

// Pre-load SEO data for common pages
export const preloadSEOData = async () => {
  console.log('🚀 Pre-loading SEO data for all pages...');
  console.log('Environment check:', {
    url: import.meta.env.VITE_SUPABASE_URL,
    hasKey: !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  });
  
  const pages = ['global', 'home', 'video'];
  const seoData: Record<string, any> = {};
  
  for (const page of pages) {
    try {
      console.log(`📄 Fetching SEO for page: ${page}`);
      const data = await getSEOData(page);
      if (data) {
        seoData[page] = data;
        console.log(`✅ Added SEO data for ${page}`);
      } else {
        console.log(`⚠️ No SEO data for ${page}`);
      }
    } catch (error) {
      console.error(`❌ Error pre-loading SEO for ${page}:`, error);
    }
  }
  
  console.log('✅ Pre-loaded SEO data result:', seoData);
  return seoData;
};