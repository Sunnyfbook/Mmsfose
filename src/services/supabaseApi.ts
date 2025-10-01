import { supabase } from '@/integrations/supabase/client';

export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  author: string;
  views: string;
  likes: string;
  duration: string;
  video_url?: string;
  is_trending?: boolean;
  is_featured?: boolean;
  description?: string;
  tags?: string[];
  created_at: string;
}

export const fetchVideosFromSupabase = async (): Promise<VideoData[]> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch videos from Supabase:', error);
    return [];
  }
};

export const fetchTrendingVideos = async (): Promise<VideoData[]> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('is_trending', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trending videos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch trending videos:', error);
    return [];
  }
};

export const fetchFeaturedVideos = async (): Promise<VideoData[]> => {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured videos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch featured videos:', error);
    return [];
  }
};

export const fetchSEOSettings = async (pageType: string) => {
  try {
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_type', pageType)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching SEO settings:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch SEO settings:', error);
    return null;
  }
};

export const fetchVideoSEOSettings = async (videoId: string) => {
  try {
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_type', `video_${videoId}`)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching video SEO settings:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch video SEO settings:', error);
    return null;
  }
};