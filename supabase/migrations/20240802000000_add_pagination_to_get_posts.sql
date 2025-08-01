-- Drop existing get_posts_with_author function
DROP FUNCTION IF EXISTS public.get_posts_with_author();

-- Recreate get_posts_with_author with pagination
CREATE OR REPLACE FUNCTION public.get_posts_with_author(p_limit integer DEFAULT NULL, p_offset integer DEFAULT 0)
RETURNS TABLE (
  id uuid,
  content text,
  created_at timestamptz,
  user_id uuid,
  photo_url text,
  photo_content_type text,
  username text,
  full_name text,
  email text,
  media jsonb
)
AS $$
SELECT 
  p.id,
  p.content,
  p.created_at,
  p.user_id,
  p.photo_url,
  p.photo_content_type,
  pr.username,
  pr.full_name,
  pr.email,
  p.media
FROM public.posts p
LEFT JOIN public.profiles pr ON p.user_id = pr.id
ORDER BY p.created_at DESC
LIMIT p_limit
OFFSET p_offset;
$$ LANGUAGE sql;