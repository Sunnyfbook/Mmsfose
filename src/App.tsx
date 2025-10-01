import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { autoClearCacheOnLoad } from '@/utils/forceClearCache';
import Index from "./pages/Index";
import StreamingPage from "./pages/StreamingPage";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import VideoManager from "./pages/admin/VideoManager";
import AdManager from "./pages/admin/AdManager";
import ContentManager from "./pages/admin/ContentManager";
import SEOManager from "./pages/admin/SEOManager";
import SearchConsoleManager from "./pages/admin/SearchConsoleManager";
import ApiConfigManager from "./pages/admin/ApiConfigManager";
import SitemapPage from "./pages/SitemapPage";

const queryClient = new QueryClient();

const App = () => {
  // Auto-clear cache on app load (for deployed site cache issues)
  React.useEffect(() => {
    try {
      autoClearCacheOnLoad();
    } catch (error) {
      console.error('❌ Error in auto cache clear:', error);
    }
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sitemap.xml" element={<SitemapPage />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="videos" element={<VideoManager />} />
              <Route path="ads" element={<AdManager />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="seo" element={<SEOManager />} />
              <Route path="search-console" element={<SearchConsoleManager />} />
              <Route path="api-config" element={<ApiConfigManager />} />
            </Route>
            <Route path="/:videoSlug" element={<StreamingPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
  );
};

export default App;
