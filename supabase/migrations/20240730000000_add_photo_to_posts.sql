-- Add photo_url to posts table
ALTER TABLE public.posts ADD COLUMN photo_url TEXT;

-- Create a bucket for post photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-photos', 'post-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the post-photos bucket
-- 1. Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload" 
ON storage.objects FOR INSERT TO authenticated 
WITH CHECK (bucket_id = 'post-photos');

-- 2. Allow anyone to view files
CREATE POLICY "Allow public read access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'post-photos');