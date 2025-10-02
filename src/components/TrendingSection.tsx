import { TrendingUp, Flame, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoCard from "./VideoCard";
import { fetchVideos, type VideoCardData } from "@/services/videoApi";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useContent } from "@/hooks/useContent";
import { AdComponent } from "@/components/ads/AdComponent";

const TrendingSection = () => {
  const [videos, setVideos] = useState<VideoCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const { getContent: getHeroContent } = useContent('homepage_hero');
  const { getContent: getTrendingContent } = useContent('trending_section');
  const { getContent: getLatestContent } = useContent('latest_section');

  useEffect(() => {
    const loadVideos = async () => {
      console.log('🔄 TrendingSection: Loading videos...');
      setLoading(true);
      const fetchedVideos = await fetchVideos();
      console.log('📊 TrendingSection: Fetched videos:', fetchedVideos.length, fetchedVideos);
      setVideos(fetchedVideos);
      setLoading(false);
    };

    loadVideos();
  }, []);

  // Split videos for trending and latest sections
  const trendingVideos = videos.slice(0, 6);
  
  const latestVideos = videos.slice(6, 12);

  return (
    <div className="relative">
      {/* Hero banner with gradient */}
      <div className="relative bg-gradient-to-r from-primary/20 via-viral-pink/10 to-accent/20 border-b border-border/50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-16 text-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3 mb-4 sm:mb-6 animate-glow">
          <Flame className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-primary animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold bg-gradient-viral bg-clip-text text-transparent">
            {getHeroContent('badge_text', 'Live Videos Platform')}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
          <span className="bg-gradient-to-r from-primary via-viral-pink to-accent bg-clip-text text-transparent">
            {getHeroContent('main_title', 'KingTube')}
          </span>
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto leading-relaxed px-4">
          {getHeroContent('description', 'Discover amazing video content from creators around the world')}
        </p>
      </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-16 space-y-12 sm:space-y-16 lg:space-y-20">
        {/* Trending Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-trending-red/5 to-viral-orange/5 rounded-3xl blur-3xl"></div>
          <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-trending rounded-xl sm:rounded-2xl flex items-center justify-center shadow-viral">
                    <Flame className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white animate-pulse" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-trending-red rounded-full flex items-center justify-center">
                    <TrendingUp className="h-2 w-2 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-trending bg-clip-text text-transparent mb-1 sm:mb-2">
                    {getTrendingContent('title', 'Trending Now')}
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                    {getTrendingContent('description', 'Hottest videos breaking the internet right now')}
                  </p>
                </div>
              </div>
                <Button variant="viral" size={useIsMobile() ? "sm" : "lg"} className="shadow-viral hover:shadow-glow transition-all duration-300 w-full sm:w-auto">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">{getTrendingContent('view_all_text', 'View All Trending')}</span>
                  <span className="sm:hidden">{getTrendingContent('view_all_mobile_text', 'View All')}</span>
                </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-card/80 border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-sm">
                      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50"></div>
                      <div className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
                        <div className="h-4 sm:h-5 bg-gradient-to-r from-muted to-muted/50 rounded-lg w-3/4"></div>
                        <div className="h-3 sm:h-4 bg-gradient-to-r from-muted to-muted/50 rounded-lg w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {trendingVideos.map((video, index) => (
                  <VideoCard 
                    key={video.id} 
                    video={video}
                    className="animate-fade-in hover:shadow-2xl transition-all duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Ad between trending and latest videos */}
        <div className="container mx-auto px-4 py-8">
          <AdComponent className="mb-8" maxAds={1} placement="sidebar" />
        </div>

        {/* Latest Videos Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl blur-3xl"></div>
          <div className="relative bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-hero rounded-xl sm:rounded-2xl flex items-center justify-center shadow-glow">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-1 sm:mb-2">
                    {getLatestContent('title', 'Latest Videos')}
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                    {getLatestContent('description', 'Fresh content just uploaded by creators')}
                  </p>
                </div>
              </div>
              <Button variant="outline" size={useIsMobile() ? "sm" : "lg"} className="border-primary/30 hover:bg-primary/10 transition-all duration-300 w-full sm:w-auto">
                <span className="hidden sm:inline">{getLatestContent('view_all_text', 'View All Latest')}</span>
                <span className="sm:hidden">{getLatestContent('view_all_mobile_text', 'View All')}</span>
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-card/60 border border-border/30 rounded-lg sm:rounded-xl overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50"></div>
                      <div className="p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3">
                        <div className="h-3 sm:h-4 bg-gradient-to-r from-muted to-muted/50 rounded w-3/4"></div>
                        <div className="h-2 sm:h-3 bg-gradient-to-r from-muted to-muted/50 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                {latestVideos.map((video, index) => (
                  <VideoCard 
                    key={video.id} 
                    video={video}
                    className="scale-95 hover:scale-100 transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TrendingSection;