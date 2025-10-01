import { Play, Eye, ThumbsUp, Share, MoreVertical, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { titleToSlug } from "@/utils/urlUtils";
import { VideoCardData } from "@/services/videoApi";

interface VideoCardProps {
  video: VideoCardData;
  className?: string;
  style?: React.CSSProperties;
}

const VideoCard = ({ 
  video,
  className = "",
  style
}: VideoCardProps) => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    const slug = titleToSlug(video.title);
    navigate(`/${slug}`);
  };

  const handleCardClick = () => {
    const slug = titleToSlug(video.title);
    navigate(`/${slug}`);
  };
  return (
    <Card style={style} className={`group relative overflow-hidden border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:scale-[1.02] sm:hover:scale-[1.03] cursor-pointer hover:border-primary/30 ${className}`} onClick={handleCardClick}>
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
        />
        
        {/* Stylish Multi-layer Overlay */}
        <div className="absolute inset-0">
          {/* Base gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
          {/* Corner highlights */}
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-white/20 to-transparent rounded-br-3xl"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-white/15 to-transparent rounded-tl-3xl"></div>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 border-2 border-white/10 rounded-lg group-hover:border-primary/30 transition-colors duration-500"></div>
        </div>
        
        {/* Stylish Play Button Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/10 to-transparent opacity-70 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center">
          <div className="relative group/play">
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border border-white/30 animate-pulse"></div>
            
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-accent/30 rounded-full blur-lg animate-pulse"></div>
            
            {/* Main play button */}
            <Button 
              size="icon" 
              variant="glass" 
              className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-md border-2 border-white/50 hover:from-white/60 hover:via-white/50 hover:to-white/40 hover:scale-110 shadow-2xl transition-all duration-300 group-hover/play:shadow-primary/50"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayClick();
              }}
            >
              {/* Play icon with gradient */}
              <Play className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 fill-white text-white ml-1 drop-shadow-lg" />
              
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/play:opacity-100 transition-opacity duration-300"></div>
            </Button>
            
            {/* Floating particles effect */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-white/60 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 -left-3 w-1.5 h-1.5 bg-accent/70 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Stylish Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-gradient-to-r from-black/90 via-black/80 to-black/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/30 shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              {video.duration}
            </div>
          </div>
        )}

        {/* Stylish Trending Badge */}
        {video.isTraending && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse border border-white/20">
            <div className="flex items-center gap-1">
              <span className="animate-bounce">🔥</span>
              <span>Trending</span>
            </div>
          </div>
        )}

        {/* Stylish View Count */}
        {video.views && (
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-gradient-to-r from-black/90 via-black/80 to-black/90 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full items-center gap-1.5 hidden sm:flex border border-white/20 shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
            <Eye className="h-3 w-3 text-primary" />
            <span className="font-bold">{video.views}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-5">
        <div className="flex gap-2 sm:gap-3">
          {/* Author Avatar */}
          <div className="relative flex-shrink-0">
            {video.authorAvatar ? (
              <img
                src={video.authorAvatar}
                alt={video.author}
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full object-cover shadow-lg border-2 border-white/20"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-gradient-viral rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg border-2 border-white/20">
                {video.author.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-card"></div>
          </div>

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors cursor-pointer text-sm sm:text-base leading-tight mb-1 sm:mb-2">
              {video.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-2 sm:mb-3">{video.author}</p>
            
            {/* Stats */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 text-xs text-muted-foreground">
              {video.views && (
                <div className="flex items-center gap-1 sm:gap-1.5 bg-muted/50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                  <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span className="font-medium text-xs">{video.views}</span>
                </div>
              )}
              {video.likes && (
                <div className="flex items-center gap-1 sm:gap-1.5 bg-muted/50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                  <ThumbsUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span className="font-medium text-xs">{video.likes}</span>
                </div>
              )}
            </div>
          </div>

          {/* More Actions - hidden on mobile for cleaner look */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10 self-start hidden sm:flex w-8 h-8 lg:w-10 lg:h-10"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        </div>

        {/* Action Buttons - simplified for mobile */}
        <div className="flex items-center gap-2 mt-3 sm:mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 bg-muted/30 hover:bg-primary/20 hover:text-primary transition-all duration-300 text-xs sm:text-sm h-7 sm:h-8 lg:h-9"
            onClick={(e) => e.stopPropagation()}
          >
            <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Like</span>
            <span className="sm:hidden">♥</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 bg-muted/30 hover:bg-accent/20 hover:text-accent transition-all duration-300 text-xs sm:text-sm h-7 sm:h-8 lg:h-9"
            onClick={(e) => e.stopPropagation()}
          >
            <Share className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Share</span>
            <span className="sm:hidden">↗</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;