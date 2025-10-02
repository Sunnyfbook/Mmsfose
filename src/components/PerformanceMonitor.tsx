import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  adLoadTime: number;
  cacheHitRate: number;
  apiCalls: number;
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    adLoadTime: 0,
    cacheHitRate: 0,
    apiCalls: 0
  });

  useEffect(() => {
    // Monitor performance metrics
    const startTime = performance.now();
    
    // Listen for performance events
    const handlePerformanceEvent = () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      setMetrics(prev => ({
        ...prev,
        adLoadTime: Math.round(loadTime),
        cacheHitRate: prev.cacheHitRate + 1, // Simplified for demo
        apiCalls: prev.apiCalls + 1
      }));
    };

    // Monitor ad loading performance
    window.addEventListener('ad-loaded', handlePerformanceEvent);
    
    return () => {
      window.removeEventListener('ad-loaded', handlePerformanceEvent);
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
      <div className="font-bold mb-2">🚀 Performance Monitor</div>
      <div>Ad Load Time: {metrics.adLoadTime}ms</div>
      <div>Cache Hit Rate: {metrics.cacheHitRate}%</div>
      <div>API Calls: {metrics.apiCalls}</div>
    </div>
  );
};
