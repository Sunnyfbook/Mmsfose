import { supabase } from '@/integrations/supabase/client';

export interface ApiConfig {
  id: string;
  config_key: string;
  config_value: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchApiConfig = async (): Promise<ApiConfig[]> => {
  try {
    const { data, error } = await supabase
      .from('api_config')
      .select('*')
      .eq('is_active', true)
      .order('config_key');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching API config:', error);
    return [];
  }
};

export const getApiConfigValue = async (key: string, defaultValue: string = ''): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('api_config')
      .select('config_value')
      .eq('config_key', key)
      .eq('is_active', true)
      .single();

    if (error) {
      console.warn(`API config key '${key}' not found, using default:`, defaultValue);
      return defaultValue;
    }

    return data?.config_value || defaultValue;
  } catch (error) {
    console.error(`Error fetching API config for key '${key}':`, error);
    return defaultValue;
  }
};

export const updateApiConfig = async (key: string, value: string, description?: string): Promise<boolean> => {
  try {
    // First, try to update existing record
    const { data: existingData, error: selectError } = await supabase
      .from('api_config')
      .select('id')
      .eq('config_key', key)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from('api_config')
        .update({
          config_value: value,
          description: description,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('config_key', key);

      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase
        .from('api_config')
        .insert({
          config_key: key,
          config_value: value,
          description: description,
          is_active: true
        });

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating API config:', error);
    return false;
  }
};

export const deleteApiConfig = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('api_config')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting API config:', error);
    return false;
  }
};

// Cache for API config values
let apiConfigCache: Map<string, string> = new Map();
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedApiConfigValue = async (key: string, defaultValue: string = ''): Promise<string> => {
  const now = Date.now();
  
  // Check if cache is still valid
  if (cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION && apiConfigCache.has(key)) {
    const cachedValue = apiConfigCache.get(key) || defaultValue;
    console.log(`📦 Using cached API config for ${key}:`, cachedValue);
    return cachedValue;
  }

  console.log(`🔍 Fetching fresh API config for ${key}...`);
  // Fetch fresh data
  const value = await getApiConfigValue(key, defaultValue);
  apiConfigCache.set(key, value);
  cacheTimestamp = now;
  
  console.log(`✅ API config fetched for ${key}:`, value);
  return value;
};

export const clearApiConfigCache = (): void => {
  apiConfigCache.clear();
  cacheTimestamp = 0;
};
