-- Add RLS policies for ads table management
-- Allow anyone to insert ads (for admin panel)
CREATE POLICY "Anyone can insert ads"
ON public.ads
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update ads (for admin panel)
CREATE POLICY "Anyone can update ads"
ON public.ads
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow anyone to delete ads (for admin panel)
CREATE POLICY "Anyone can delete ads"
ON public.ads
FOR DELETE
USING (true);