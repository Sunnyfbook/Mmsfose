import { useEffect, useState } from 'react';
import { fetchAds, fetchAdsByPlacement, trackAdImpression, trackAdClick, type AdData } from '@/services/adsApi';

interface AdComponentProps {
  className?: string;
  maxAds?: number;
  placement?: string; // Optional placement filter
}

export const AdComponent = ({ className = '', maxAds = 1, placement }: AdComponentProps) => {
  const [ads, setAds] = useState<AdData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAds = async () => {
      try {
        console.log('🔄 AdComponent loading ads:', { placement, maxAds });
        setLoading(true);
        
        // Filter ads by placement if specified
        const adsData = placement 
          ? await fetchAdsByPlacement(placement)
          : await fetchAds().then(allAds => 
              allAds.filter(ad => 
                ad.is_active && 
                (!ad.end_date || new Date(ad.end_date) > new Date()) &&
                !['header', 'footer'].includes(ad.placement)
              )
            );
        
        console.log('📊 AdComponent received ads data:', {
          placement,
          count: adsData.length,
          ads: adsData.map(ad => ({
            id: ad.id,
            title: ad.title,
            placement: ad.placement,
            is_active: ad.is_active,
            ad_type: ad.ad_type
          }))
        });
        
        const activeAds = adsData.slice(0, maxAds);
        setAds(activeAds);
        
        console.log('✅ AdComponent setting ads:', {
          placement,
          finalCount: activeAds.length,
          ads: activeAds
        });
        
        // Track impressions for all loaded ads (now batched)
        activeAds.forEach(ad => {
          trackAdImpression(ad.id);
        });
      } catch (error) {
        console.error('❌ AdComponent error loading ads:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, [maxAds, placement]);

  const handleAdClick = (ad: AdData) => {
    trackAdClick(ad.id);
    if (ad.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse bg-muted rounded-lg ${className}`}>
        <div className="h-20 bg-muted-foreground/20 rounded"></div>
      </div>
    );
  }

  if (!ads.length) {
    console.log('⚠️ AdComponent: No ads found for placement:', placement);
    return (
      <div className={`${className} p-4 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center text-muted-foreground`}>
        <p className="text-sm">No ads available for this placement</p>
        <p className="text-xs mt-1">Placement: {placement || 'general'}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {ads.map((ad) => (
        <div
          key={ad.id}
          className="relative group cursor-pointer rounded-lg overflow-hidden border bg-card hover:shadow-lg transition-all duration-300"
          onClick={() => handleAdClick(ad)}
        >
          {/* Render all ad types */}
          <div className="p-4">
            {ad.image_url ? (
              <img
                src={ad.image_url}
                alt={ad.title}
                className="w-full h-auto rounded object-cover"
                loading="lazy"
              />
            ) : (
              <div
                className="w-full min-h-[100px] flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: ad.ad_code }}
              />
            )}
          </div>

          <div className="absolute top-2 right-2">
            <span className="bg-muted/80 text-muted-foreground px-2 py-1 rounded text-xs">
              Ad
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};