-- Create content management table for dynamic text content
CREATE TABLE public.content_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  description text,
  content_type text DEFAULT 'text',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(section, key)
);

-- Enable RLS
ALTER TABLE public.content_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Content settings are viewable by everyone" 
ON public.content_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage content settings" 
ON public.content_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default content for homepage
INSERT INTO public.content_settings (section, key, value, description) VALUES
-- Header content
('header', 'site_name', 'KingTube', 'Main site name displayed in header'),
('header', 'search_placeholder', 'Search viral videos...', 'Placeholder text for search input'),
('header', 'admin_button_text', 'Admin', 'Text for admin button'),
('header', 'sign_in_text', 'Sign In', 'Text for sign in button'),
('header', 'sign_out_text', 'Sign Out', 'Text for sign out button'),
('header', 'notifications_text', 'Notifications', 'Text for notifications menu item'),
('header', 'upload_video_text', 'Upload Video', 'Text for upload video menu item'),

-- Homepage hero section
('homepage_hero', 'badge_text', 'Live Videos Platform', 'Badge text above main title'),
('homepage_hero', 'main_title', 'KingTube', 'Main hero title'),
('homepage_hero', 'description', 'Discover amazing video content from creators around the world', 'Hero description text'),

-- Trending section
('trending_section', 'title', 'Trending Now', 'Trending section title'),
('trending_section', 'description', 'Hottest videos breaking the internet right now', 'Trending section description'),
('trending_section', 'view_all_text', 'View All Trending', 'View all trending button text'),
('trending_section', 'view_all_mobile_text', 'View All', 'View all trending button text for mobile'),

-- Latest videos section
('latest_section', 'title', 'Latest Videos', 'Latest videos section title'),
('latest_section', 'description', 'Fresh content just uploaded by creators', 'Latest videos description'),
('latest_section', 'view_all_text', 'View All Latest', 'View all latest button text'),
('latest_section', 'view_all_mobile_text', 'View All', 'View all latest button text for mobile'),

-- Streaming page
('streaming_page', 'back_to_home_text', 'Back to Home', 'Back to home button text'),
('streaming_page', 'video_not_found_title', 'Video Not Found', 'Video not found page title'),
('streaming_page', 'related_videos_title', 'Related Videos', 'Related videos section title'),
('streaming_page', 'subscribe_text', 'Subscribe', 'Subscribe button text'),
('streaming_page', 'share_text', 'Share', 'Share button text'),
('streaming_page', 'download_text', 'Download', 'Download button text'),
('streaming_page', 'content_creator_text', 'Owner', 'Content creator subtitle text');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_content_settings_updated_at
BEFORE UPDATE ON public.content_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();