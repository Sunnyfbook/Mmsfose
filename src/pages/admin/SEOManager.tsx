import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, X, RefreshCw, Video, ExternalLink, Zap, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchVideosFromSupabase, VideoData } from '@/services/supabaseApi';
import { fetchVideos, VideoCardData } from '@/services/videoApi';

interface SEOSettings {
  id: string;
  page_type: string;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical_url: string | null;
  meta_robots: string | null;
}

export default function SEOManager() {
  const [seoSettings, setSeoSettings] = useState<SEOSettings[]>([]);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [apiVideos, setApiVideos] = useState<VideoCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [activeTab, setActiveTab] = useState('global');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    meta_robots: 'index,follow',
  });

  useEffect(() => {
    fetchSEOSettings();
    fetchSupabaseVideos();
    fetchApiVideos();
  }, []);

  useEffect(() => {
    const currentSettings = seoSettings.find(s => s.page_type === activeTab);
    if (currentSettings) {
      setFormData({
        title: currentSettings.title || '',
        description: currentSettings.description || '',
        keywords: currentSettings.keywords?.join(', ') || '',
        og_title: currentSettings.og_title || '',
        og_description: currentSettings.og_description || '',
        og_image: currentSettings.og_image || '',
        canonical_url: currentSettings.canonical_url || '',
        meta_robots: currentSettings.meta_robots || 'index,follow',
      });
    } else {
      resetForm();
    }
  }, [activeTab, seoSettings]);

  const fetchSEOSettings = async () => {
    try {
      console.log('🔍 Fetching SEO settings...');
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .order('page_type');

      if (error) {
        console.error('❌ Error fetching SEO settings:', error);
        throw error;
      }
      
      console.log('✅ SEO settings fetched successfully:', data);
      setSeoSettings(data || []);
    } catch (error) {
      console.error('❌ Error fetching SEO settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to fetch SEO settings: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSupabaseVideos = async () => {
    try {
      const videoData = await fetchVideosFromSupabase();
      setVideos(videoData);
    } catch (error) {
      console.error('Error fetching Supabase videos:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch Supabase videos',
      });
    }
  };

  const fetchApiVideos = async () => {
    try {
      const apiVideoData = await fetchVideos();
      setApiVideos(apiVideoData);
    } catch (error) {
      console.error('Error fetching API videos:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch API videos',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      keywords: '',
      og_title: '',
      og_description: '',
      og_image: '',
      canonical_url: '',
      meta_robots: 'index,follow',
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('🔄 Saving SEO settings for page type:', activeTab);
      
      const keywordsArray = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);

      const seoData = {
        page_type: activeTab,
        title: formData.title || null,
        description: formData.description || null,
        keywords: keywordsArray.length > 0 ? keywordsArray : null,
        og_title: formData.og_title || null,
        og_description: formData.og_description || null,
        og_image: formData.og_image || null,
        canonical_url: formData.canonical_url || null,
        meta_robots: formData.meta_robots || null,
        updated_at: new Date().toISOString()
      };

      console.log('📊 SEO data to save:', seoData);

      const existingSettings = seoSettings.find(s => s.page_type === activeTab);

      if (existingSettings) {
        console.log('🔄 Updating existing SEO settings:', existingSettings.id);
        const { data, error } = await supabase
          .from('seo_settings')
          .update(seoData)
          .eq('id', existingSettings.id)
          .select();

        if (error) {
          console.error('❌ Error updating SEO settings:', error);
          throw error;
        }
        console.log('✅ SEO settings updated successfully:', data);
      } else {
        console.log('➕ Creating new SEO settings');
        const { data, error } = await supabase
          .from('seo_settings')
          .insert([seoData])
          .select();

        if (error) {
          console.error('❌ Error creating SEO settings:', error);
          throw error;
        }
        console.log('✅ SEO settings created successfully:', data);
      }

      toast({
        title: 'Success',
        description: 'SEO settings saved successfully',
      });
      
      fetchSEOSettings();
    } catch (error) {
      console.error('❌ Error saving SEO settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to save SEO settings: ${error.message}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const generateVideoSEO = async (video: VideoData | VideoCardData) => {
    try {
      const videoSlug = video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const isApiVideo = 'videoUrl' in video;
      const author = isApiVideo ? video.author : (video as VideoData).author;
      const description = isApiVideo ? undefined : (video as VideoData).description;
      const tags = isApiVideo ? [] : (video as VideoData).tags || [];
      
      const seoData = {
        page_type: `video_${video.id}`,
        title: video.title,
        description: description || `Watch ${video.title} by ${author}. ${video.views} views.`,
        keywords: [`${video.title}`, `${author}`, 'video', 'streaming', ...tags],
        og_title: video.title,
        og_description: description || `Watch ${video.title} by ${author}`,
        og_image: video.thumbnail,
        canonical_url: `${window.location.origin}/${videoSlug}`,
        meta_robots: 'index,follow',
      };

      // Check if SEO settings already exist for this video
      const { data: existing } = await supabase
        .from('seo_settings')
        .select('id')
        .eq('page_type', `video_${video.id}`)
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('seo_settings')
          .update(seoData)
          .eq('page_type', `video_${video.id}`);
        
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('seo_settings')
          .insert([seoData]);
        
        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Error generating SEO for video:', error);
      return false;
    }
  };

  const generateAllVideoSEO = async () => {
    try {
      setGeneratingAll(true);
      let successCount = 0;
      let errorCount = 0;

      // Generate SEO for both Supabase and API videos
      const allVideos = [...videos, ...apiVideos];
      for (const video of allVideos) {
        const success = await generateVideoSEO(video);
        if (success) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      toast({
        title: 'SEO Generation Complete',
        description: `Successfully generated SEO for ${successCount} videos${errorCount > 0 ? `. ${errorCount} failed.` : '.'}`,
      });

      fetchSEOSettings();
    } catch (error) {
      console.error('Error generating all video SEO:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate video SEO settings',
      });
    } finally {
      setGeneratingAll(false);
    }
  };

  const getVideoSEOCount = () => {
    return seoSettings.filter(s => s.page_type.startsWith('video_')).length;
  };

  const getTotalVideoCount = () => {
    return videos.length + apiVideos.length;
  };

  const pageTypes = [
    { id: 'global', label: 'Global Settings', description: 'Default SEO settings for all pages' },
    { id: 'home', label: 'Home Page', description: 'SEO settings for the main page' },
    { id: 'video', label: 'Video Pages', description: 'SEO settings for individual video pages' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-viral bg-clip-text text-transparent">
            SEO Manager
          </h1>
          <p className="text-muted-foreground">
            Manage search engine optimization settings
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          {pageTypes.map((type) => (
            <TabsTrigger key={type.id} value={type.id}>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {pageTypes.map((type) => (
          <TabsContent key={type.id} value={type.id}>
            {type.id === 'video' ? (
              <div className="space-y-4">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Video SEO Management
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {getVideoSEOCount()}/{getTotalVideoCount()} Generated
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateAllVideoSEO}
                          disabled={generatingAll || getTotalVideoCount() === 0}
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${generatingAll ? 'animate-spin' : ''}`} />
                          {generatingAll ? 'Generating...' : 'Generate All'}
                        </Button>
                      </div>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate SEO settings for all video pages based on video data
                    </p>
                  </CardHeader>
                  <CardContent>
                    {getTotalVideoCount() === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No videos found. Add videos to generate SEO settings.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {/* Supabase Videos */}
                        {videos.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground border-b pb-1">
                              Supabase Videos ({videos.length})
                            </h3>
                            {videos.map((video) => {
                              const hasSEO = seoSettings.some(s => s.page_type === `video_${video.id}`);
                              const videoSlug = video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                              
                              return (
                                <div key={`supabase-${video.id}`} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg">
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-16 h-10 object-cover rounded"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium truncate">{video.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      By {video.author} • {video.views} views
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      URL: /{videoSlug} • Source: Supabase
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={hasSEO ? "default" : "secondary"}>
                                      {hasSEO ? "SEO Ready" : "No SEO"}
                                    </Badge>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => generateVideoSEO(video)}
                                      disabled={generatingAll}
                                    >
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      {hasSEO ? 'Update' : 'Generate'}
                                    </Button>
                                    {hasSEO && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => window.open(`/${videoSlug}`, '_blank')}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {/* API Videos */}
                        {apiVideos.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground border-b pb-1">
                              API Videos ({apiVideos.length})
                            </h3>
                            {apiVideos.map((video) => {
                              const hasSEO = seoSettings.some(s => s.page_type === `video_${video.id}`);
                              const videoSlug = video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                              
                              return (
                                <div key={`api-${video.id}`} className="flex items-center gap-4 p-4 border border-border/50 rounded-lg bg-accent/20">
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-16 h-10 object-cover rounded"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/placeholder.svg';
                                    }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium truncate">{video.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      By {video.author} • {video.views || 'N/A'} views
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      URL: /{videoSlug} • Source: API
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={hasSEO ? "default" : "secondary"}>
                                      {hasSEO ? "SEO Ready" : "No SEO"}
                                    </Badge>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => generateVideoSEO(video)}
                                      disabled={generatingAll}
                                    >
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      {hasSEO ? 'Update' : 'Generate'}
                                    </Button>
                                    {hasSEO && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => window.open(`/${videoSlug}`, '_blank')}
                                      >
                                        <ExternalLink className="h-4 w-4" />
                                      </Button>
                                    )}
                                    {video.videoUrl && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => window.open(video.videoUrl, '_blank')}
                                        title="View original video"
                                      >
                                        <Video className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {type.label}
                    <Badge variant="outline">
                      {seoSettings.find(s => s.page_type === type.id) ? 'Configured' : 'Not Set'}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Page Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter page title (60 chars max)"
                        maxLength={60}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.title.length}/60 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="canonical_url">Canonical URL</Label>
                      <Input
                        id="canonical_url"
                        value={formData.canonical_url}
                        onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                        placeholder="https://yourdomain.com/page"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Meta Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter meta description (160 chars max)"
                      maxLength={160}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.description.length}/160 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      placeholder="video, streaming, entertainment (comma separated)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="og_title">Open Graph Title</Label>
                      <Input
                        id="og_title"
                        value={formData.og_title}
                        onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                        placeholder="Title for social media sharing"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="og_image">Open Graph Image</Label>
                      <Input
                        id="og_image"
                        value={formData.og_image}
                        onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                        placeholder="https://yourdomain.com/og-image.jpg"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="og_description">Open Graph Description</Label>
                    <Textarea
                      id="og_description"
                      value={formData.og_description}
                      onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                      placeholder="Description for social media sharing"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_robots">Meta Robots</Label>
                    <Input
                      id="meta_robots"
                      value={formData.meta_robots}
                      onChange={(e) => setFormData({ ...formData, meta_robots: e.target.value })}
                      placeholder="index,follow"
                    />
                    <p className="text-xs text-muted-foreground">
                      Common values: index,follow | noindex,nofollow | index,nofollow
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      variant="viral" 
                      onClick={handleSave}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}