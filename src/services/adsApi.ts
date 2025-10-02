import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type AdData = Tables<'ads'>;

// Cache for ads to avoid repeated database calls
let adsCache: AdData[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchAds = async (): Promise<AdData[]> => {
  try {
    console.log('🔍 fetchAds called');
    
    // Check cache first
    const now = Date.now();
    if (adsCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('📦 Using cached ads data:', adsCache.length, 'ads');
      return adsCache;
    }

    console.log('🔄 Fetching fresh ads data from database...');
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching ads:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      return [];
    }

    console.log('📊 Raw database response:', {
      count: data?.length || 0,
      data: data
    });

    // Update cache
    adsCache = (data || []) as AdData[];
    cacheTimestamp = now;
    console.log('✅ Ads data cached for 5 minutes:', adsCache.length, 'ads');
    return adsCache;
  } catch (error) {
    console.error('❌ Failed to fetch ads:', error);
    return [];
  }
};

export const fetchAdsByPlacement = async (placement: string): Promise<AdData[]> => {
  try {
    console.log('🔍 fetchAdsByPlacement called for placement:', placement);
    
    // Use cached data if available, otherwise fetch fresh
    const allAds = await fetchAds();
    console.log('📊 All ads fetched:', allAds.length);
    
    // Filter from cached data for better performance
    const filteredAds = allAds.filter(ad => {
      // Map between-videos to content for compatibility
      const adPlacement = ad.placement === 'between-videos' ? 'content' : ad.placement;
      return adPlacement === placement && 
        ad.is_active && 
        (!ad.end_date || new Date(ad.end_date) > new Date())
    });
    
    console.log('🎯 Filtered ads for placement', placement, ':', {
      count: filteredAds.length,
      ads: filteredAds.map(ad => ({
        id: ad.id,
        title: ad.title,
        placement: ad.placement,
        is_active: ad.is_active,
        ad_type: ad.ad_type
      }))
    });
    
    // Sort by priority
    const sortedAds = filteredAds.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    console.log('✅ Returning', sortedAds.length, 'ads for placement', placement);
    return sortedAds;
  } catch (error) {
    console.error('❌ Failed to fetch ads by placement:', error);
    return [];
  }
};

// Function to clear cache when ads are modified
const clearAdsCache = () => {
  adsCache = null;
  cacheTimestamp = 0;
  console.log('🗑️ Ads cache cleared');
};

export const createAd = async (adData: Omit<AdData, 'id' | 'created_at' | 'updated_at' | 'click_count' | 'impression_count'>): Promise<AdData | null> => {
  try {
    console.log('🔄 Creating ad with data:', adData);
    const { data, error } = await supabase
      .from('ads')
      .insert([adData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating ad:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return null;
    }

    console.log('✅ Ad created successfully:', data);
    clearAdsCache(); // Clear cache after creating new ad
    return data as AdData;
  } catch (error) {
    console.error('❌ Exception creating ad:', error);
    return null;
  }
};

export const updateAd = async (id: string, updates: Partial<AdData>): Promise<AdData | null> => {
  try {
    const { data, error } = await supabase
      .from('ads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating ad:', error);
      return null;
    }

    clearAdsCache(); // Clear cache after updating ad
    return data as AdData;
  } catch (error) {
    console.error('Failed to update ad:', error);
    return null;
  }
};

export const deleteAd = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting ad:', error);
      return false;
    }

    clearAdsCache(); // Clear cache after deleting ad
    return true;
  } catch (error) {
    console.error('Failed to delete ad:', error);
    return false;
  }
};

// Batch impression tracking to reduce API calls
let impressionQueue: string[] = [];
let impressionTimeout: NodeJS.Timeout | null = null;

export const trackAdImpression = async (adId: string): Promise<void> => {
  // Add to queue instead of immediate API call
  if (!impressionQueue.includes(adId)) {
    impressionQueue.push(adId);
  }
  
  // Batch process impressions every 2 seconds
  if (impressionTimeout) {
    clearTimeout(impressionTimeout);
  }
  
  impressionTimeout = setTimeout(async () => {
    if (impressionQueue.length > 0) {
      try {
        console.log('📊 Batch tracking impressions for:', impressionQueue);
        const { error } = await supabase.functions.invoke('increment-impression', {
          body: { ad_ids: impressionQueue }
        });
        
        if (error) {
          console.error('Error batch tracking impressions:', error);
        } else {
          console.log('✅ Batch impressions tracked successfully');
        }
      } catch (error) {
        console.error('Failed to batch track impressions:', error);
      } finally {
        impressionQueue = [];
      }
    }
  }, 2000);
};

export const trackAdClick = async (adId: string): Promise<void> => {
  try {
    const { error } = await supabase.functions.invoke('increment-click', {
      body: { ad_id: adId }
    });
    
    if (error) {
      console.error('Error tracking click:', error);
    }
  } catch (error) {
    console.error('Failed to track click:', error);
  }
};