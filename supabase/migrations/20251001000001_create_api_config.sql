-- Create API configuration table
CREATE TABLE public.api_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT NOT NULL UNIQUE,
  config_value TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.api_config ENABLE ROW LEVEL SECURITY;

-- Create policies for API config
CREATE POLICY "API config is viewable by everyone" 
ON public.api_config 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can manage API config" 
ON public.api_config 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Insert default API configuration
INSERT INTO public.api_config (config_key, config_value, description) VALUES
('video_api_base_url', 'https://campost.onrender.com/api', 'Base URL for video API'),
('video_api_endpoint', '/posts', 'Endpoint for fetching videos');

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_api_config_updated_at
BEFORE UPDATE ON public.api_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
