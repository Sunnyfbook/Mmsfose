-- Create SEO settings table for managing SEO metadata
CREATE TABLE public.seo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  meta_robots TEXT DEFAULT 'index,follow',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for SEO settings
CREATE POLICY "SEO settings are viewable by everyone" 
ON public.seo_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can manage SEO settings" 
ON public.seo_settings 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Insert default SEO settings
INSERT INTO public.seo_settings (page_type, title, description, keywords, og_title, og_description, og_image, canonical_url, meta_robots) VALUES
('global', 'Onlyfans Leaked: Discover Exclusive Content Here', 'Explore the hottest Onlyfans leaked videos and find the latest Onlyfans leaks. Don''t miss out on exclusive content that has recently surfaced!', ARRAY['Onlyfans Leaked', 'onlyfans leak', 'onlyfans leaks', 'leaked onlyfans', 'onlyfans leaked videos', 'onlyfan leak', 'leaked onlyfans videos', 'onlyfans leak porn', 'onlyfans nude leaks', 'onlyfans leaked video'], 'Onlyfans Leaked: Discover Exclusive Content Here', 'Explore the hottest Onlyfans leaked videos and find the latest Onlyfans leaks. Don''t miss out on exclusive content that has recently surfaced!', '/placeholder.svg', NULL, 'index,follow'),
('home', 'Onlyfans Leaked: Discover Exclusive Content Here', 'Explore the hottest Onlyfans leaked videos and find the latest Onlyfans leaks. Don''t miss out on exclusive content that has recently surfaced!', ARRAY['Onlyfans Leaked', 'onlyfans leak', 'onlyfans leaks', 'leaked onlyfans', 'onlyfans leaked videos', 'onlyfan leak', 'leaked onlyfans videos', 'onlyfans leak porn', 'onlyfans nude leaks', 'onlyfans leaked video'], 'Onlyfans Leaked: Discover Exclusive Content Here', 'Explore the hottest Onlyfans leaked videos and find the latest Onlyfans leaks. Don''t miss out on exclusive content that has recently surfaced!', '/placeholder.svg', NULL, 'index,follow'),
('video', 'Onlyfans Leaked: Discover Exclusive Content Here', 'Explore the hottest Onlyfans leaked videos and find the latest Onlyfans leaks. Don''t miss out on exclusive content that has recently surfaced!', ARRAY['Onlyfans Leaked', 'onlyfans leak', 'onlyfans leaks', 'leaked onlyfans', 'onlyfans leaked videos', 'onlyfan leak', 'leaked onlyfans videos', 'onlyfans leak porn', 'onlyfans nude leaks', 'onlyfans leaked video'], 'Onlyfans Leaked: Discover Exclusive Content Here', 'Explore the hottest Onlyfans leaked videos and find the latest Onlyfans leaks. Don''t miss out on exclusive content that has recently surfaced!', '/placeholder.svg', NULL, 'index,follow');

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_seo_settings_updated_at
BEFORE UPDATE ON public.seo_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();