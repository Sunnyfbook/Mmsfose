import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ThumbsUp, Share, Download, Eye, Clock, TrendingUp, Play } from "lucide-react";
import Header from "@/components/Header";
import VideoSEO from "@/components/VideoSEO";
import StructuredData from "@/components/StructuredData";
import { fetchVideos, type VideoCardData } from "@/services/videoApi";
import { slugToSearchTerm } from "@/utils/urlUtils";
import { useContent } from "@/hooks/useContent";
import { AdComponent } from "@/components/ads/AdComponent";

const StreamingPage = () => {
  const { videoSlug } = useParams<{ videoSlug: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<VideoCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState<VideoCardData[]>([]);
  const { getContent } = useContent('streaming_page');

  useEffect(() => {
    const loadVideo = async () => {
      if (!videoSlug) return;
      
      setLoading(true);
      const videos = await fetchVideos();
      
      // Find video by matching slug with title
      const searchTerm = slugToSearchTerm(videoSlug);
      const foundVideo = videos.find(v => 
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm.toLowerCase().includes(v.title.toLowerCase().substring(0, 20))
      );

      if (foundVideo) {
        setVideo(foundVideo);
        // Set related videos (excluding current video)
        setRelatedVideos(videos.filter(v => v.id !== foundVideo.id).slice(0, 6));
      }
      
      setLoading(false);
    };

    loadVideo();
  }, [videoSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="aspect-video bg-muted rounded-lg"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">{getContent('video_not_found_title', 'Video Not Found')}</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {getContent('back_to_home_text', 'Back to Home')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/50">
      {video && (
        <>
          <VideoSEO video={video} />
          <StructuredData 
            type="video" 
            data={{
              ...video,
              created_at: new Date().toISOString(),
              description: `Watch ${video.title} by ${video.author}${video.views ? `. ${video.views} views` : ''}.`
            }} 
          />
          <StructuredData 
            type="breadcrumb" 
            data={{
              items: [
                { name: 'Home', url: window.location.origin },
                { name: video.title, url: window.location.href }
              ]
            }} 
          />
        </>
      )}
      <Header />
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-viral opacity-5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-gradient-trending opacity-10 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      <div className="relative container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Video Section */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Back Button */}
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {getContent('back_to_home_text', 'Back to Home')}
            </Button>

            {/* Video Player */}
            <div className="relative bg-gradient-to-br from-card via-card to-card/80 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden border border-border/50 shadow-2xl backdrop-blur-sm">
              <div className="relative bg-black rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden">
                <video
                  className="w-full aspect-video"
                  controls
                  autoPlay
                  poster={video.thumbnail}
                  onError={(e) => {
                    console.error('Video failed to load:', e);
                  }}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Video overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Ad below video */}
            <AdComponent className="mb-6" maxAds={1} placement="content" />

            {/* Video Info */}
            <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border border-border/50 shadow-lg">
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground leading-tight mb-4 sm:mb-6">
                {video.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                  {video.views && (
                    <div className="flex items-center gap-2 bg-muted/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="font-medium text-xs sm:text-sm">{video.views}</span>
                    </div>
                  )}
                  {video.duration && (
                    <div className="flex items-center gap-2 bg-muted/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="font-medium text-xs sm:text-sm">{video.duration}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  {video.likes && (
                    <Button variant="viral" size="sm" className="shadow-viral hover:shadow-glow transition-all duration-300 flex-1 sm:flex-none">
                      <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">{video.likes}</span>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="hover:bg-accent/10 hover:border-accent/30 transition-all duration-300 flex-1 sm:flex-none">
                    <Share className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">{getContent('share_text', 'Share')}</span>
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hidden sm:flex">
                    <Download className="h-4 w-4 mr-2" />
                    {getContent('download_text', 'Download')}
                  </Button>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg sm:rounded-xl border border-border/30">
                <div className="relative">
                  {video.authorAvatar ? (
                    <img
                      src={video.authorAvatar}
                      alt={video.author}
                      className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full object-cover shadow-lg border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-viral rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                      {video.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-card"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-base sm:text-lg">{video.author}</h3>
                  <p className="text-muted-foreground text-sm">{getContent('content_creator_text', 'Owner')}</p>
                </div>
              </div>
            </div>
            
          </div>

          {/* Related Videos Sidebar */}
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-border/50 shadow-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-hero rounded-md sm:rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-white" />
                </div>
                <span className="text-base sm:text-lg lg:text-xl">{getContent('related_videos_title', 'Related Videos')}</span>
              </h2>
              
              {/* Ad positioned at top of sidebar */}
              <AdComponent className="mb-6" maxAds={1} placement="sidebar" />
              
              <div className="space-y-3 sm:space-y-4">
                {relatedVideos.map((relatedVideo) => (
                  <div
                    key={relatedVideo.id}
                    className="group flex gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-muted/20 to-muted/10 rounded-lg sm:rounded-xl border border-border/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                    onClick={() => {
                      const slug = relatedVideo.title
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim()
                        .substring(0, 100);
                      navigate(`/${slug}`);
                    }}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={relatedVideo.thumbnail}
                        alt={relatedVideo.title}
                        className="w-20 h-12 sm:w-24 sm:h-14 lg:w-28 lg:h-16 object-cover rounded-md sm:rounded-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md sm:rounded-lg flex items-center justify-center">
                        <Play className="h-3 w-3 sm:h-4 sm:w-4 text-white fill-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-2 leading-tight mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                        {relatedVideo.title}
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium mb-1 sm:mb-2">{relatedVideo.author}</p>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                        {relatedVideo.views && <span className="bg-muted/50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs">{relatedVideo.views}</span>}
                        {relatedVideo.duration && <span className="bg-muted/50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs">{relatedVideo.duration}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingPage;