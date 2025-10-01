// Force clear all caches - for deployed site cache issues
export const forceClearAllCaches = () => {
  console.log('🚀 Force clearing ALL caches...');
  
  if (typeof window !== 'undefined') {
    try {
      // Clear specific cache items instead of clearing everything
      const keysToRemove = [
        'seo_cache',
        'seo_timestamp', 
        'last_cache_clear'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Dispatch global cache clear event
      const clearEvent = new CustomEvent('force-clear-cache', {
        detail: { timestamp: Date.now() }
      });
      window.dispatchEvent(clearEvent);
      
      console.log('✅ All caches cleared');
    } catch (error) {
      console.error('❌ Error clearing caches:', error);
    }
  }
};

// Auto-clear cache on page load (for deployed site)
export const autoClearCacheOnLoad = () => {
  if (typeof window !== 'undefined') {
    // Check if this is a fresh deployment
    const lastClear = localStorage.getItem('last_cache_clear');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    if (!lastClear || (now - parseInt(lastClear)) > oneHour) {
      console.log('🔄 Fresh deployment detected, clearing all caches...');
      forceClearAllCaches();
      localStorage.setItem('last_cache_clear', now.toString());
    }
  }
};
