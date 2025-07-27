-- Function to get posts with author's username
CREATE OR REPLACE FUNCTION public.get_posts_with_author()
RETURNS TABLE (
  id uuid,
  content text,
  created_at timestamptz,
  user_id uuid,
  photo_url text,
  photo_content_type text,
  username text,
  full_name text,
  email text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.content,
    p.created_at,
    p.user_id,
    p.photo_url,
    p.photo_content_type,
    pr.username,
    pr.full_name,
    pr.email
  FROM
    public.posts p
    LEFT JOIN public.profiles pr ON p.user_id = pr.id
  ORDER BY
    p.created_at DESC;
END;
$$;

-- Function to get comments with author's username for a specific post
CREATE OR REPLACE FUNCTION public.get_comments_with_author(p_post_id uuid)
RETURNS TABLE (
  id bigint,
  content text,
  created_at timestamptz,
  user_id uuid,
  username text,
  full_name text,
  email text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.content,
    c.created_at,
    c.user_id,
    pr.username,
    pr.full_name,
    pr.email
  FROM
    public.comments c
    LEFT JOIN public.profiles pr ON c.user_id = pr.id
  WHERE
    c.post_id = p_post_id
  ORDER BY
    c.created_at DESC;
END;
$$;