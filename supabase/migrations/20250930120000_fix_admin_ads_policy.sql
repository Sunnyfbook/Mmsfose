-- Fix RLS policy for admin panel to see all ads
-- Drop the restrictive policy
DROP POLICY IF EXISTS "Active ads are viewable by everyone" ON public.ads;

-- Create a new policy that allows viewing all ads for admin purposes
CREATE POLICY "All ads are viewable for admin management" 
ON public.ads 
FOR SELECT 
USING (true);

-- Keep the original policy for public viewing (active ads only)
CREATE POLICY "Public can view active ads only" 
ON public.ads 
FOR SELECT 
USING (is_active = true AND (end_date IS NULL OR end_date > now()));
