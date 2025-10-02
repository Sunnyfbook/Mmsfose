import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { fetchVideos, type VideoCardData } from '@/services/videoApi';

interface Video extends VideoCardData {
  created_at?: string;
}

export default function VideoManager() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApiVideos();
  }, []);

  const fetchApiVideos = async () => {
    try {
      setLoading(true);
      const fetchedVideos = await fetchVideos();
      // Convert VideoCardData to Video format
      const convertedVideos: Video[] = fetchedVideos.map(video => ({
        ...video,
        views: video.views || '0',
        likes: video.likes || '0',
        duration: video.duration || '0:00',
        created_at: new Date().toISOString()
      }));
      setVideos(convertedVideos);
    } catch (error) {
      console.error('Error fetching videos from API:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-viral bg-clip-text text-transparent">
            Video Manager
          </h1>
          <p className="text-muted-foreground">
            View videos from external API ({videos.length} videos)
          </p>
        </div>
        <Button variant="viral" onClick={fetchApiVideos}>
          <Plus className="h-4 w-4 mr-2" />
          Refresh Videos
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading videos from API...</p>
          </div>
        ) : videos.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No videos found from API.</p>
            </CardContent>
          </Card>
        ) : (
          videos.map((video) => (
            <Card key={video.id} className="border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">by {video.author}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">
                        API Source
                      </Badge>
                      {video.views && (
                        <Badge variant="outline">
                          {video.views} views
                        </Badge>
                      )}
                      {video.likes && (
                        <Badge variant="outline">
                          {video.likes} likes
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {video.videoUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(video.videoUrl, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-32 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Video ID: {video.id}
                    </p>
                    {video.duration && (
                      <p className="text-sm text-muted-foreground">
                        Duration: {video.duration}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Source: External API
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}