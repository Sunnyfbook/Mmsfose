import { supabase } from '@/integrations/supabase/client';

export interface SEOSettings {
  id: string;
  page_type: string;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  meta_robots: string | null;
  created_at: string;
  updated_at: string;
}

// Cache for SEO settings - DISABLED FOR DEBUGGING
let seoCache: Map<string, SEOSettings> = new Map();
let cacheTimestamp: number = 0;
const CACHE_DURATION = 0; // DISABLED - Always fetch fresh data

// Listen for force cache clear events
if (typeof window !== 'undefined') {
  window.addEventListener('force-clear-cache', () => {
    console.log('🗑️ Force clearing SEO cache due to event');
    seoCache.clear();
    cacheTimestamp = 0;
  });
}

export const fetchSEOSettings = async (pageType: string): Promise<SEOSettings | null> => {
  try {
    console.log(`🔍 Fetching SEO settings for page type: ${pageType}`);
    
    // Check cache first
    const now = Date.now();
    if (cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION && seoCache.has(pageType)) {
      const cached = seoCache.get(pageType);
      console.log(`📦 Using cached SEO settings for ${pageType}:`, cached);
      return cached || null;
    }

    console.log(`🔄 Making database request for ${pageType}...`);
    
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_type', pageType)
      .single();
    
    console.log(`📡 Database response for ${pageType}:`, { data, error });

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`⚠️ No SEO settings found for ${pageType} (this is normal for new page types)`);
        return null;
      } else {
        console.error(`❌ Database error fetching SEO settings for ${pageType}:`, error);
        console.error(`❌ Error details:`, {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return null;
      }
    }

    console.log(`✅ SEO settings fetched for ${pageType}:`, data);
    
    // Update cache
    if (data) {
      seoCache.set(pageType, data);
      cacheTimestamp = now;
      console.log(`💾 SEO settings cached for ${pageType}`);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Failed to fetch SEO settings for ${pageType}:`, error);
    console.error(`❌ Error details:`, error);
    return null;
  }
};

export const fetchVideoSEOSettings = async (videoId: string): Promise<SEOSettings | null> => {
  try {
    console.log(`🔍 Fetching video SEO settings for video: ${videoId}`);
    
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_type', `video-${videoId}`)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error(`❌ Error fetching video SEO settings for ${videoId}:`, error);
      return null;
    }

    console.log(`✅ Video SEO settings fetched for ${videoId}:`, data);
    return data;
  } catch (error) {
    console.error(`❌ Failed to fetch video SEO settings for ${videoId}:`, error);
    return null;
  }
};

export const clearSEOCache = (): void => {
  console.log('🗑️ Clearing SEO cache');
  seoCache.clear();
  cacheTimestamp = 0;
};

export const updateSEOSettings = async (
  pageType: string,
  settings: Partial<SEOSettings>
): Promise<boolean> => {
  try {
    console.log(`🔄 Updating SEO settings for ${pageType}:`, settings);
    
    const { data, error } = await supabase
      .from('seo_settings')
      .upsert({
        page_type: pageType,
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error(`❌ Error updating SEO settings for ${pageType}:`, error);
      return false;
    }

    console.log(`✅ SEO settings updated for ${pageType}:`, data);
    
    // Clear cache to force refresh
    clearSEOCache();
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to update SEO settings for ${pageType}:`, error);
    return false;
  }
};
