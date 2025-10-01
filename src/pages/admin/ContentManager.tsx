import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchContentSettings, 
  updateContentSetting, 
  createContentSetting, 
  deleteContentSetting,
  type ContentSetting 
} from '@/services/contentApi';
import { Save, Plus, Trash2, Edit3, Type, Settings } from 'lucide-react';

const ContentManager = () => {
  const [contentSettings, setContentSettings] = useState<ContentSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [newSetting, setNewSetting] = useState({
    section: '',
    key: '',
    value: '',
    description: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContentSettings();
  }, []);

  const loadContentSettings = async () => {
    setLoading(true);
    const settings = await fetchContentSettings();
    setContentSettings(settings);
    setLoading(false);
  };

  const handleSave = async (id: string) => {
    if (!editedValues[id]) return;
    
    setSaving(id);
    const success = await updateContentSetting(id, editedValues[id]);
    
    if (success) {
      toast({
        title: "Content Updated",
        description: "Content setting has been updated successfully.",
      });
      
      // Update local state
      setContentSettings(prev => 
        prev.map(setting => 
          setting.id === id 
            ? { ...setting, value: editedValues[id] }
            : setting
        )
      );
      
      // Clear edited value
      setEditedValues(prev => {
        const newValues = { ...prev };
        delete newValues[id];
        return newValues;
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update content setting.",
        variant: "destructive",
      });
    }
    
    setSaving(null);
  };

  const handleCreate = async () => {
    if (!newSetting.section || !newSetting.key || !newSetting.value) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSaving('new');
    const success = await createContentSetting(
      newSetting.section,
      newSetting.key,
      newSetting.value,
      newSetting.description
    );

    if (success) {
      toast({
        title: "Content Created",
        description: "New content setting has been created successfully.",
      });
      
      setNewSetting({ section: '', key: '', value: '', description: '' });
      setShowAddForm(false);
      loadContentSettings();
    } else {
      toast({
        title: "Error",
        description: "Failed to create content setting.",
        variant: "destructive",
      });
    }
    
    setSaving(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content setting?')) return;

    const success = await deleteContentSetting(id);
    
    if (success) {
      toast({
        title: "Content Deleted",
        description: "Content setting has been deleted successfully.",
      });
      
      setContentSettings(prev => prev.filter(setting => setting.id !== id));
    } else {
      toast({
        title: "Error",
        description: "Failed to delete content setting.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setEditedValues(prev => ({ ...prev, [id]: value }));
  };

  const groupedSettings = contentSettings.reduce((acc, setting) => {
    if (!acc[setting.section]) {
      acc[setting.section] = [];
    }
    acc[setting.section].push(setting);
    return acc;
  }, {} as Record<string, ContentSetting[]>);

  const sections = Object.keys(groupedSettings).sort();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Content Management</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-4 bg-muted rounded"></div>
                  ))}
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
        <div className="flex items-center gap-2">
          <Type className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Content Management</h1>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Content
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Dynamic Content System
          </CardTitle>
          <CardDescription>
            Manage all text content across your website. Changes will be reflected immediately on the live site.
          </CardDescription>
        </CardHeader>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Content Setting</CardTitle>
            <CardDescription>
              Create a new editable text content for your website.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  value={newSetting.section}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, section: e.target.value }))}
                  placeholder="e.g., header, homepage_hero"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key">Key</Label>
                <Input
                  id="key"
                  value={newSetting.key}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="e.g., title, description"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Textarea
                id="value"
                value={newSetting.value}
                onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Enter the text content"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={newSetting.description}
                onChange={(e) => setNewSetting(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this content"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleCreate}
                disabled={saving === 'new'}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {saving === 'new' ? 'Creating...' : 'Create'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={sections[0]} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {sections.map((section) => (
            <TabsTrigger key={section} value={section} className="text-xs">
              {section.replace(/_/g, ' ')}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section} value={section}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 capitalize">
                  <Edit3 className="h-4 w-4" />
                  {section.replace(/_/g, ' ')} Content
                </CardTitle>
                <CardDescription>
                  Edit text content for the {section.replace(/_/g, ' ')} section.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {groupedSettings[section].map((setting) => (
                  <div key={setting.id} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{setting.key}</Badge>
                        {setting.description && (
                          <span className="text-sm text-muted-foreground">
                            {setting.description}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(setting.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Current Value</Label>
                      <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        {setting.value}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>New Value</Label>
                      <Textarea
                        value={editedValues[setting.id] || setting.value}
                        onChange={(e) => handleInputChange(setting.id, e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    {editedValues[setting.id] && editedValues[setting.id] !== setting.value && (
                      <Button
                        onClick={() => handleSave(setting.id)}
                        disabled={saving === setting.id}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saving === setting.id ? 'Saving...' : 'Save Changes'}
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ContentManager;