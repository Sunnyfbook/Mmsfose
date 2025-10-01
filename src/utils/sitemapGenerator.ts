import { fetchVideosFromSupabase, VideoData } from '@/services/supabaseApi';
import { logger } from '@/utils/secureLogger';

interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = async (): Promise<string> => {
  const baseUrl = window.location.origin;
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls: SitemapUrl[] = [
    {
      url: baseUrl,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/auth`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.3
    }
  ];

  // Add video streaming pages
  try {
    const videos = await fetchVideosFromSupabase();
    
    videos.forEach((video: VideoData) => {
      const videoSlug = video.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
        
      urls.push({
        url: `${baseUrl}/${videoSlug}`,
        lastmod: video.created_at?.split('T')[0] || currentDate,
        changefreq: 'weekly',
        priority: 0.8
      });
    });

    logger.sitemap(`Generated sitemap with ${videos.length} video pages`);
  } catch (error) {
    logger.error('Error fetching videos for sitemap:', error);
  }

  // Generate XML sitemap
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.url}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

export const generateRobotsTxt = (): string => {
  const baseUrl = window.location.origin;
  
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Block admin areas
Disallow: /admin/
Disallow: /auth/

# Allow video content
Allow: /videos/
Allow: /streaming/`;
};