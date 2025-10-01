import { getCachedApiConfigValue } from './apiConfigApi';

interface VideoPost {
  post_id: string;
  title: string;
  thumbnail: string;
  user_name: string;
  video: {
    stream_url: string;
    download_url: string;
  };
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  posts: VideoPost[];
}

export interface VideoCardData {
  id: string;
  title: string;
  thumbnail: string;
  author: string;
  authorAvatar: string;
  views: string;
  likes: string;
  duration: string;
  isTraending?: boolean;
  videoUrl?: string;
}

export const fetchVideos = async (): Promise<VideoCardData[]> => {
  try {
    // Get dynamic API configuration with fallback
    let baseUrl, endpoint, apiUrl;
    
    try {
      baseUrl = await getCachedApiConfigValue('video_api_base_url', 'https://campost.onrender.com/api');
      endpoint = await getCachedApiConfigValue('video_api_endpoint', '/posts');
      apiUrl = `${baseUrl}${endpoint}`;
      console.log('🔗 Using dynamic API config:', apiUrl);
    } catch (configError) {
      console.warn('⚠️ API config not available, using fallback URL');
      apiUrl = 'https://campost.onrender.com/api/posts';
    }
    
    console.log('🔗 Fetching videos from:', apiUrl);
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    let data: ApiResponse;
    
    try {
      const response = await fetch(apiUrl, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      console.log('📡 Response status:', response.status, response.statusText);
    
      if (!response.ok) {
        console.error('❌ HTTP error:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      data = await response.json();
      console.log('📊 Raw API response:', data);
      
      if (!data) {
        console.error('❌ No data in response');
        return [];
      }
      
      if (!data.success) {
        console.error('❌ API returned success: false');
        return [];
      }
      
      if (!data.posts || !Array.isArray(data.posts)) {
        console.error('❌ No posts array in response:', data);
        return [];
      }
      
      console.log('✅ API response looks good, processing', data.posts.length, 'posts');
      
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('❌ Request timeout - API did not respond within 10 seconds');
        throw new Error('API request timeout');
      } else {
        console.error('❌ Fetch error:', fetchError);
        throw fetchError;
      }
    }
    
    if (data.success && data.posts) {
      const videos = data.posts.map((post, index) => ({
        id: post.post_id || String(index),
        title: post.title,
        thumbnail: post.thumbnail,
        author: 'ɪɴᴠɪꜱɪʙʟᴇ ɢʜᴏꜱᴛ',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face&auto=format',
        views: '',
        likes: '',
        duration: '',
        videoUrl: post.video.stream_url
      }));
      
      console.log('✅ Successfully processed videos:', videos.length);
      return videos;
    }
    
    console.warn('⚠️ No videos found in API response');
    return [];
  } catch (error) {
    console.error('❌ Failed to fetch videos:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return [];
  }
};
