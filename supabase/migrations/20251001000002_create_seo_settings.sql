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
('global', 'KingTube - Professional Video Platform', 'Professional video streaming platform with high-quality content', ARRAY['video', 'streaming', 'entertainment', 'platform'], 'KingTube - Professional Video Platform', 'Professional video streaming platform with high-quality content', '/placeholder.svg', NULL, 'index,follow'),
('home', 'KingTube - Home', 'Discover amazing video content from creators around the world', ARRAY['video', 'streaming', 'entertainment', 'home'], 'KingTube - Home', 'Discover amazing video content from creators around the world', '/placeholder.svg', NULL, 'index,follow'),
('video', 'KingTube - Video', 'Watch high-quality videos on KingTube', ARRAY['video', 'streaming', 'entertainment'], 'KingTube - Video', 'Watch high-quality videos on KingTube', '/placeholder.svg', NULL, 'index,follow');

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_seo_settings_updated_at
BEFORE UPDATE ON public.seo_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
