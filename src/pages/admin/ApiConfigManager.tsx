import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
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
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { 
  ApiConfig, 
  fetchApiConfig, 
  updateApiConfig, 
  deleteApiConfig,
  clearApiConfigCache 
} from '@/services/apiConfigApi';
import { Plus, Edit, Trash2, Save, RefreshCw, ExternalLink } from 'lucide-react';

export default function ApiConfigManager() {
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ApiConfig | null>(null);
  const [formData, setFormData] = useState({
    config_key: '',
    config_value: '',
    description: ''
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const data = await fetchApiConfig();
      setConfigs(data);
    } catch (error) {
      console.error('Error loading API configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      config_key: '',
      config_value: '',
      description: ''
    });
    setEditingConfig(null);
  };

  const handleEdit = (config: ApiConfig) => {
    setFormData({
      config_key: config.config_key,
      config_value: config.config_value,
      description: config.description || ''
    });
    setEditingConfig(config);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await updateApiConfig(
        formData.config_key,
        formData.config_value,
        formData.description
      );
      
      if (success) {
        console.log('✅ API config updated successfully');
        await loadConfigs();
        clearApiConfigCache(); // Clear cache to force refresh
        setIsDialogOpen(false);
        resetForm();
      } else {
        console.error('❌ Failed to update API config');
      }
    } catch (error) {
      console.error('❌ Error updating API config:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await deleteApiConfig(id);
      if (success) {
        console.log('✅ API config deleted successfully');
        await loadConfigs();
        clearApiConfigCache(); // Clear cache to force refresh
      } else {
        console.error('❌ Failed to delete API config');
      }
    } catch (error) {
      console.error('❌ Error deleting API config:', error);
    }
  };

  const testApiConnection = async (baseUrl: string, endpoint: string) => {
    try {
      const apiUrl = `${baseUrl}${endpoint}`;
      console.log('🧪 Testing API connection to:', apiUrl);
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ API connection successful:', data);
        alert(`✅ API connection successful!\n\nURL: ${apiUrl}\nResponse: ${JSON.stringify(data, null, 2)}`);
      } else {
        console.error('❌ API connection failed:', response.status, response.statusText);
        alert(`❌ API connection failed!\n\nURL: ${apiUrl}\nStatus: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ API connection error:', error);
      alert(`❌ API connection error!\n\n${error}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">API Configuration</h1>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">API Configuration</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingConfig ? 'Edit API Configuration' : 'Add New API Configuration'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="config_key">Configuration Key</Label>
                <Input
                  id="config_key"
                  value={formData.config_key}
                  onChange={(e) => setFormData({ ...formData, config_key: e.target.value })}
                  placeholder="e.g., video_api_base_url"
                  required
                />
              </div>
              <div>
                <Label htmlFor="config_value">Configuration Value</Label>
                <Input
                  id="config_value"
                  value={formData.config_value}
                  onChange={(e) => setFormData({ ...formData, config_value: e.target.value })}
                  placeholder="e.g., https://campost.onrender.com/api"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description of this configuration..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {editingConfig ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {configs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No API configurations found. Add your first configuration to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          configs.map((config) => (
            <Card key={config.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">{config.config_key}</span>
                    <Badge variant="default">Active</Badge>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(config)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const baseUrl = configs.find(c => c.config_key === 'video_api_base_url')?.config_value || '';
                        const endpoint = configs.find(c => c.config_key === 'video_api_endpoint')?.config_value || '';
                        if (baseUrl && endpoint) {
                          testApiConnection(baseUrl, endpoint);
                        }
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete API Configuration</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this API configuration? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(config.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="bg-muted p-3 rounded text-sm font-mono break-all">
                    {config.config_value}
                  </div>
                  {config.description && (
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Updated: {new Date(config.updated_at).toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={loadConfigs}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            clearApiConfigCache();
            alert('✅ API configuration cache cleared!');
          }}
        >
          Clear Cache
        </Button>
      </div>
    </div>
  );
}
