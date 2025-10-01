import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Video, Settings, TrendingUp } from 'lucide-react';
import { fetchVideos } from '@/services/videoApi';
import { fetchVideosFromSupabase } from '@/services/supabaseApi';

interface DashboardStats {
  totalVideos: number;
  trendingVideos: number;
  featuredVideos: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVideos: 0,
    trendingVideos: 0,
    featuredVideos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch data from both sources
      const [
        supabaseVideos,
        apiVideos,
        trendingResult,
        featuredResult
      ] = await Promise.all([
        fetchVideosFromSupabase(),
        fetchVideos(),
        supabase.from('videos').select('*', { count: 'exact', head: true }).eq('is_trending', true),
        supabase.from('videos').select('*', { count: 'exact', head: true }).eq('is_featured', true),
      ]);

      // Count trending videos from API (treat first 6 as trending as per TrendingSection logic)
      const apiTrendingCount = Math.min(apiVideos.length, 6);
      
      // Count featured videos from API (for now, treat isTraending videos as featured)
      const apiFeaturedCount = apiVideos.filter(video => video.isTraending).length;

      setStats({
        totalVideos: supabaseVideos.length + apiVideos.length,
        trendingVideos: (trendingResult.count || 0) + apiTrendingCount,
        featuredVideos: (featuredResult.count || 0) + apiFeaturedCount,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Videos',
      value: stats.totalVideos,
      description: 'Videos from all sources',
      icon: Video,
      color: 'text-primary',
    },
    {
      title: 'Trending Videos',
      value: stats.trendingVideos,
      description: 'Currently trending',
      icon: TrendingUp,
      color: 'text-trending-red',
    },
    {
      title: 'Featured Videos',
      value: stats.featuredVideos,
      description: 'Featured content',
      icon: Settings,
      color: 'text-viral-pink',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-viral bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your video platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">{/* Changed from lg:grid-cols-4 to md:grid-cols-3 since we have 3 cards now */}
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-border/50 hover:shadow-viral transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? '...' : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <span className="text-sm">Add New Video</span>
                <Video className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <span className="text-sm">Manage SEO Settings</span>
                <Settings className="h-4 w-4 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates to your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">
                  Admin panel initialized
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span className="text-sm text-muted-foreground">
                  Database connected
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-viral-pink rounded-full"></div>
                <span className="text-sm text-muted-foreground">
                  SEO settings configured
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}