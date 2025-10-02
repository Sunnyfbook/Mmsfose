import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import TrendingSection from "@/components/TrendingSection";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import GoogleSearchConsole from "@/components/GoogleSearchConsole";
import { useSitemapAutoUpdate } from '@/hooks/useSitemap';
import { useContent } from '@/hooks/useContent';
import { useSEO } from '@/contexts/SEOContext';
import { AdComponent } from "@/components/ads/AdComponent";
import { Button } from "@/components/ui/button";
import { Play, TrendingUp } from "lucide-react";

const Index = () => {
  const [gscVerificationCode, setGscVerificationCode] = useState('');
  const seoData = useSEO();

  // Auto-update sitemap when the app loads
  useSitemapAutoUpdate();
  
  // Load dynamic content for homepage
  const { getContent: getHeroContent } = useContent('homepage_hero');
  const { getContent: getTrendingContent } = useContent('trending_section');
  const { getContent: getLatestContent } = useContent('latest_section');

  useEffect(() => {
    const savedCode = localStorage.getItem('gsc_verification_code');
    if (savedCode) {
      setGscVerificationCode(savedCode);
    }
  }, []);

  return (
    <>
      <SEOHead pageType="home" seoData={seoData?.home} />
      <GoogleSearchConsole verificationCode={gscVerificationCode} />
      <StructuredData type="organization" data={{}} />
      <StructuredData type="website" data={{}} />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <Header />
      <main className="relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-viral opacity-10 rounded-full blur-2xl sm:blur-3xl animate-float"></div>
          <div className="absolute top-20 sm:top-40 right-8 sm:right-20 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-trending opacity-15 rounded-full blur-xl sm:blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-16 sm:bottom-32 left-1/4 w-24 h-24 sm:w-40 sm:h-40 bg-gradient-hero opacity-5 rounded-full blur-2xl sm:blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-6 sm:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-viral/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary">
                <Play className="w-4 h-4" />
                {getHeroContent('badge_text', 'Live Videos Platform')}
              </div>
              
              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-viral bg-clip-text text-transparent leading-tight">
                {getHeroContent('main_title', 'KingTube')}
              </h1>
              
              {/* Description */}
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {getHeroContent('description', 'Discover amazing video content from creators around the world')}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" className="bg-gradient-viral hover:shadow-viral transition-all duration-300">
                  <Play className="w-5 h-5 mr-2" />
                  Start Watching
                </Button>
                <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trending Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <AdComponent className="mb-8" maxAds={1} placement="content" />
        </div>
        
        <TrendingSection />
        
        {/* Footer ad */}
        <div className="container mx-auto px-4 py-8">
          <AdComponent className="mb-8" maxAds={1} placement="footer" />
        </div>
      </main>
    </div>
    </>
  );
};

export default Index;