import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { logger } from '@/utils/secureLogger';

interface GSCProps {
  verificationCode?: string;
  enableAnalytics?: boolean;
}

const GoogleSearchConsole = ({ verificationCode, enableAnalytics = true }: GSCProps) => {
  const [performanceData, setPerformanceData] = useState<any>(null);

  useEffect(() => {
    // Core Web Vitals monitoring
    if (enableAnalytics && typeof window !== 'undefined') {
      // Web Vitals measurement
      const measureWebVitals = async () => {
        try {
          const webVitals = await import('web-vitals');
          
          webVitals.onCLS((metric) => {
            logger.analytics('CLS:', metric);
            // Send to analytics or GSC API if available
          });
          
          webVitals.onINP((metric) => {
            logger.analytics('INP:', metric);
          });
          
          webVitals.onFCP((metric) => {
            logger.analytics('FCP:', metric);
          });
          
          webVitals.onLCP((metric) => {
            logger.analytics('LCP:', metric);
          });
          
          webVitals.onTTFB((metric) => {
            logger.analytics('TTFB:', metric);
          });
        } catch (error) {
          logger.warn('Web Vitals not available:', error);
        }
      };

      measureWebVitals();
    }
  }, [enableAnalytics]);

  return (
    <Helmet>
      {/* Google Search Console Verification */}
      {verificationCode && (
        <meta name="google-site-verification" content={verificationCode} />
      )}
      
      {/* Additional GSC Meta Tags */}
      <meta name="googlebot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      
      {/* Structured Data for GSC */}
      <meta name="application-name" content="KingTube" />
      <meta name="msapplication-TileColor" content="#6366f1" />
      <meta name="theme-color" content="#6366f1" />
      
      {/* Performance hints for Core Web Vitals */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://lbmortayknpfqkpwuvmy.supabase.co" />
      <link rel="dns-prefetch" href="https://campost.onrender.com" />
    </Helmet>
  );
};

export default GoogleSearchConsole;