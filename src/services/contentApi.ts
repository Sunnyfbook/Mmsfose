import { supabase } from '@/integrations/supabase/client';

export interface ContentSetting {
  id: string;
  section: string;
  key: string;
  value: string;
  description?: string;
  content_type?: string;
  created_at: string;
  updated_at: string;
}

export const fetchContentSettings = async (): Promise<ContentSetting[]> => {
  try {
    const { data, error } = await supabase
      .from('content_settings')
      .select('*')
      .order('section', { ascending: true })
      .order('key', { ascending: true });

    if (error) {
      console.error('Error fetching content settings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch content settings:', error);
    return [];
  }
};

export const fetchContentBySection = async (section: string): Promise<Record<string, string>> => {
  try {
    console.log(`🔍 Fetching content for section: ${section}`);
    const { data, error } = await supabase
      .from('content_settings')
      .select('key, value')
      .eq('section', section);

    if (error) {
      console.error(`❌ Error fetching content for section ${section}:`, error);
      return {};
    }

    console.log(`📊 Raw data for ${section}:`, data);
    const content: Record<string, string> = {};
    data?.forEach(item => {
      content[item.key] = item.value;
    });

    console.log(`✅ Processed content for ${section}:`, content);
    return content;
  } catch (error) {
    console.error(`❌ Failed to fetch content for section ${section}:`, error);
    return {};
  }
};

export const updateContentSetting = async (id: string, value: string): Promise<boolean> => {
  try {
    console.log(`🔄 Updating content setting ${id} with value:`, value);
    
    const { data, error } = await supabase
      .from('content_settings')
      .update({ 
        value,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Error updating content setting:', error);
      return false;
    }

    console.log('✅ Content setting updated successfully:', data);
    return true;
  } catch (error) {
    console.error('❌ Failed to update content setting:', error);
    return false;
  }
};

export const createContentSetting = async (
  section: string,
  key: string,
  value: string,
  description?: string
): Promise<boolean> => {
  try {
    console.log(`➕ Creating content setting: ${section}.${key} = ${value}`);
    
    const { data, error } = await supabase
      .from('content_settings')
      .insert({
        section,
        key,
        value,
        description
      })
      .select();

    if (error) {
      console.error('❌ Error creating content setting:', error);
      return false;
    }

    console.log('✅ Content setting created successfully:', data);
    return true;
  } catch (error) {
    console.error('❌ Failed to create content setting:', error);
    return false;
  }
};

export const deleteContentSetting = async (id: string): Promise<boolean> => {
  try {
    console.log(`🗑️ Deleting content setting: ${id}`);
    
    const { data, error } = await supabase
      .from('content_settings')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Error deleting content setting:', error);
      return false;
    }

    console.log('✅ Content setting deleted successfully:', data);
    return true;
  } catch (error) {
    console.error('❌ Failed to delete content setting:', error);
    return false;
  }
};