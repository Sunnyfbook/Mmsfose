import { Search, Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useContent } from "@/hooks/useContent";
import { fetchAdsByPlacement, trackAdImpression, trackAdClick, type AdData } from "@/services/adsApi";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);  
  const [headerAds, setHeaderAds] = useState<AdData[]>([]);
  const isMobile = useIsMobile();
  const { getContent } = useContent('header');

  useEffect(() => {
    const loadHeaderAds = async () => {
      try {
        console.log('🔄 Header: Loading header ads...');
        const ads = await fetchAdsByPlacement('header');
        console.log('📊 Header: Header ads loaded:', {
          count: ads.length,
          ads: ads.map(ad => ({
            id: ad.id,
            title: ad.title,
            ad_type: ad.ad_type,
            placement: ad.placement,
            is_active: ad.is_active,
            has_image: !!ad.image_url,
            has_code: !!ad.ad_code
          }))
        });
        setHeaderAds(ads);
        
        console.log('✅ Header: Setting header ads state:', ads.length, 'ads');
        
        // Track impressions for header ads (now batched for better performance)
        ads.forEach(ad => {
          trackAdImpression(ad.id);
        });
      } catch (error) {
        console.error('❌ Header: Error loading header ads:', error);
      }
    };

    loadHeaderAds();
  }, []);

  const handleAdClick = (ad: AdData) => {
    trackAdClick(ad.id);
    if (ad.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Mobile Menu Button & Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-viral rounded-md sm:rounded-lg flex items-center justify-center font-bold text-white text-sm sm:text-lg">
                K
              </div>
              <span className="text-base sm:text-xl font-bold bg-gradient-viral bg-clip-text text-transparent">
                {getContent('site_name', 'KingTube')}
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-xl mx-4 sm:mx-6 lg:mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={getContent('search_placeholder', 'Search viral videos...')}
                className="pl-10 pr-4 bg-secondary/50 border-border/50 focus:ring-primary focus:bg-secondary/80 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex h-8 w-8 sm:h-10 sm:w-10">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-3 sm:pb-4 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={getContent('search_placeholder', 'Search viral videos...')}
                className="pl-10 pr-4 bg-secondary/50 border-border/50 focus:ring-primary w-full"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border shadow-lg animate-fade-in">
            <div className="container mx-auto px-3 sm:px-4 py-4 space-y-3">
              <Button variant="ghost" className="w-full justify-start text-left">
                <Bell className="h-4 w-4 mr-3" />
                {getContent('notifications_text', 'Notifications')}
              </Button>
            </div>
          </div>
        )}

        {/* Header Ads */}
        {headerAds.length > 0 && (
          <div className="border-t border-border/50 bg-muted/30">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-2">
              <div className="flex justify-center">
                {headerAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="relative group cursor-pointer rounded-lg overflow-hidden border bg-card hover:shadow-lg transition-all duration-300 max-w-md"
                    onClick={() => handleAdClick(ad)}
                  >
                    {/* Render all ad types in header */}
                    <div className="p-2">
                      {ad.image_url ? (
                        <img
                          src={ad.image_url}
                          alt={ad.title}
                          className="w-full h-12 object-cover rounded"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-12 flex items-center justify-center text-xs text-muted-foreground">
                          {ad.ad_code ? (
                            <div dangerouslySetInnerHTML={{ __html: ad.ad_code }} />
                          ) : (
                            <span className="text-center">{ad.title}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="absolute top-1 right-1">
                      <span className="bg-muted/80 text-muted-foreground px-1 py-0.5 rounded text-xs">
                        Ad
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;