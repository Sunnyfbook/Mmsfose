import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchAds, 
  createAd, 
  updateAd, 
  deleteAd, 
  type AdData 
} from '@/services/adsApi';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const AdManager = () => {
  const [ads, setAds] = useState<AdData[]>([]);
  const [filteredAds, setFilteredAds] = useState<AdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState<AdData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    ad_type: 'banner',
    placement: 'header',
    ad_code: '',
    image_url: '',
    link_url: '',
    is_active: true,
    priority: 1,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    setLoading(true);
    console.log('🔄 Starting to fetch ads...');
    const adsData = await fetchAds();
    console.log('📊 Fetched ads result:', {
      count: adsData.length,
      ads: adsData,
      timestamp: new Date().toISOString()
    });
    setAds(adsData);
    setFilteredAds(adsData);
    setLoading(false);
    console.log('✅ Ads loaded into state');
  };

  // Filter ads based on status
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredAds(ads);
    } else if (statusFilter === 'active') {
      setFilteredAds(ads.filter(ad => ad.is_active));
    } else {
      setFilteredAds(ads.filter(ad => !ad.is_active));
    }
  }, [ads, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const adData = {
      ...formData,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined,
    };

    console.log('🔄 Submitting ad:', {
      isEditing: !!editingAd,
      adData: adData,
      timestamp: new Date().toISOString()
    });

    try {
      if (editingAd) {
        console.log('📝 Updating existing ad:', editingAd.id);
        const updated = await updateAd(editingAd.id, adData);
        console.log('✅ Update result:', updated);
        if (updated) {
          toast({
            title: "Success",
            description: "Ad updated successfully",
          });
          loadAds();
        } else {
          toast({
            title: "Error",
            description: "Failed to update ad",
            variant: "destructive",
          });
        }
      } else {
        console.log('➕ Creating new ad...');
        const created = await createAd(adData);
        console.log('✅ Create result:', created);
        if (created) {
          toast({
            title: "Success",
            description: "Ad created successfully",
          });
          loadAds();
        } else {
          toast({
            title: "Error",
            description: "Failed to create ad",
            variant: "destructive",
          });
        }
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save ad",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (ad: AdData) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      ad_type: ad.ad_type,
      placement: ad.placement,
      ad_code: ad.ad_code,
      image_url: ad.image_url || '',
      link_url: ad.link_url || '',
      is_active: ad.is_active,
      priority: ad.priority,
      start_date: ad.start_date.split('T')[0],
      end_date: ad.end_date ? ad.end_date.split('T')[0] : '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteAd(id);
    if (success) {
      toast({
        title: "Success",
        description: "Ad deleted successfully",
      });
      loadAds();
    } else {
      toast({
        title: "Error",
        description: "Failed to delete ad",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      ad_type: 'banner',
      placement: 'header',
      ad_code: '',
      image_url: '',
      link_url: '',
      is_active: true,
      priority: 1,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
    });
    setEditingAd(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Ad Manager</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-20 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Ad Manager</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Ad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
            <DialogHeader>
              <DialogTitle>
                {editingAd ? 'Edit Ad' : 'Create New Ad'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ad_type">Ad Type</Label>
                  <Select value={formData.ad_type} onValueChange={(value: any) => setFormData({ ...formData, ad_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="display">Display</SelectItem>
                      <SelectItem value="native">Native</SelectItem>
                      <SelectItem value="popup">Popup</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="placement">Placement</Label>
                  <Select value={formData.placement} onValueChange={(value: any) => setFormData({ ...formData, placement: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header">Header</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="between-videos">Between Videos</SelectItem>
                      <SelectItem value="pre-roll">Pre-roll</SelectItem>
                      <SelectItem value="mid-roll">Mid-roll</SelectItem>
                      <SelectItem value="post-roll">Post-roll</SelectItem>
                      <SelectItem value="modal">Modal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="ad_code">Ad Code/HTML</Label>
                <Textarea
                  id="ad_code"
                  value={formData.ad_code}
                  onChange={(e) => setFormData({ ...formData, ad_code: e.target.value })}
                  placeholder="Enter your ad code or HTML content"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image_url">Image URL (optional)</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="link_url">Link URL (optional)</Label>
                  <Input
                    id="link_url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date (optional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAd ? 'Update Ad' : 'Create Ad'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label htmlFor="status-filter" className="text-sm font-medium">Filter by Status:</Label>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ads</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {filteredAds.length} of {ads.length} ads
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              console.log('🔄 Manual refresh triggered');
              loadAds();
            }}
            className="w-full sm:w-auto"
          >
            Refresh Ads
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              console.log('🔄 Force refresh with cache clear');
              // Clear any cached data
              setAds([]);
              setFilteredAds([]);
              // Force reload
              setTimeout(() => {
                loadAds();
              }, 100);
            }}
            className="w-full sm:w-auto"
          >
            Force Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={async () => {
            console.log('🧪 Testing direct database connection...');
            try {
              const { data, error } = await supabase
                .from('ads')
                .select('*')
                .order('created_at', { ascending: false });
              
              console.log('🔍 Direct database test:', {
                success: !error,
                error: error,
                count: data?.length || 0,
                data: data
              });
              
              if (error) {
                console.error('❌ Database error:', error);
              } else {
                console.log('✅ Database test successful:', data);
              }
            } catch (err) {
              console.error('❌ Exception during database test:', err);
            }
          }}
          className="w-full sm:w-auto"
        >
          Test DB
        </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAds.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {ads.length === 0 
                  ? "No ads found. Create your first ad to get started."
                  : `No ads found matching the current filter. Showing ${ads.length} total ads.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAds.map((ad) => (
            <Card key={ad.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-lg">{ad.title}</span>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant={ad.is_active ? "default" : "secondary"}>
                        {ad.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{ad.ad_type}</Badge>
                      <Badge variant="outline">{ad.placement}</Badge>
                    </div>
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        {ad.impression_count} views
                      </span>
                      <span>{ad.click_count} clicks</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(ad)}
                        className="flex-1 sm:flex-none"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        <span className="sm:hidden">Edit</span>
                      </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                          <Trash2 className="w-4 h-4 mr-1" />
                          <span className="sm:hidden">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Ad</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this ad? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(ad.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ad.image_url && (
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full max-w-md h-32 object-cover rounded border"
                    />
                  )}
                  <div className="bg-muted p-2 rounded text-sm font-mono overflow-x-auto">
                    {ad.ad_code.substring(0, 200)}
                    {ad.ad_code.length > 200 && '...'}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>Priority: {ad.priority}</div>
                    <div>
                      Start: {new Date(ad.start_date).toLocaleDateString()}
                    </div>
                    {ad.end_date && (
                      <div>End: {new Date(ad.end_date).toLocaleDateString()}</div>
                    )}
                    {ad.link_url && (
                      <div>
                        Link: <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {ad.link_url.substring(0, 50)}...
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdManager;