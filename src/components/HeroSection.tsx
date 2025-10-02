import { Play, TrendingUp, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={heroBackground} 
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
        <div className="absolute inset-0 bg-gradient-hero/20" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-16 h-16 bg-gradient-viral rounded-2xl flex items-center justify-center shadow-viral">
          <Play className="h-8 w-8 text-white fill-white" />
        </div>
      </div>
      
      <div className="absolute top-32 right-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-12 h-12 bg-gradient-trending rounded-xl flex items-center justify-center shadow-viral">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '4s' }}>
        <div className="w-14 h-14 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center shadow-glow">
          <Zap className="h-7 w-7 text-white fill-white" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-6 animate-glow">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Trending Platform</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-viral bg-clip-text text-transparent">
            Viral Videos
          </span>
          <br />
          <span className="text-foreground">Made Simple</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover, upload, and share the most viral content on the internet. 
          Join millions of creators making their mark on KingTube.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button variant="hero" size="lg" className="min-w-[200px]">
            <Play className="h-5 w-5 fill-white" />
            Start Watching
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">10M+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">50M+</div>
            <div className="text-sm text-muted-foreground">Videos Uploaded</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-viral-pink mb-2">1B+</div>
            <div className="text-sm text-muted-foreground">Views Daily</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;