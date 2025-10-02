import { useEffect } from 'react';
import { generateSitemap } from '@/utils/sitemapGenerator';
import { logger } from '@/utils/secureLogger';

// Hook to auto-update sitemap when videos change
export const useSitemapUpdate = () => {
  const updateSitemap = async () => {
    try {
      const xml = await generateSitemap();
      
      // Store updated sitemap in localStorage for caching
      localStorage.setItem('cached_sitemap', xml);
      localStorage.setItem('sitemap_last_updated', new Date().toISOString());
      
      logger.sitemap('Sitemap updated successfully');
    } catch (error) {
      logger.error('Error updating sitemap:', error);
    }
  };

  const getCachedSitemap = (): string | null => {
    return localStorage.getItem('cached_sitemap');
  };

  const isSitemapStale = (): boolean => {
    const lastUpdated = localStorage.getItem('sitemap_last_updated');
    if (!lastUpdated) return true;
    
    const updateTime = new Date(lastUpdated);
    const now = new Date();
    const hoursDiff = (now.getTime() - updateTime.getTime()) / (1000 * 60 * 60);
    
    // Consider stale after 24 hours
    return hoursDiff > 24;
  };

  return {
    updateSitemap,
    getCachedSitemap,
    isSitemapStale
  };
};

// Auto-update sitemap on app load and video changes
export const useSitemapAutoUpdate = () => {
  const { updateSitemap, isSitemapStale } = useSitemapUpdate();

  useEffect(() => {
    // Update sitemap if stale or missing
    if (isSitemapStale()) {
      updateSitemap();
    }
  }, []);

  return { updateSitemap };
};