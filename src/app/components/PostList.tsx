'use client'
import PostItem from './PostItem';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useRef, useCallback } from 'react';

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  photo_url: string | null;
  photo_content_type: string | null;
  username: string | null;
  full_name: string | null;
  email: string | null;
  media: MediaItem[];
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const { data, error } = await supabase.rpc('get_posts_with_author', { p_limit: 5, p_offset: offset });

    if (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
      return;
    }

    if (data) {
      console.log('Fetched posts data:', data);
      setPosts((prevPosts) => {
        const newPosts = data.filter((newPost) => !prevPosts.some((p) => p.id === newPost.id));
        setOffset((prevOffset) => prevOffset + newPosts.length);
        setHasMore(newPosts.length === 5);
        return [...prevPosts, ...newPosts];
      });
    }
    setLoading(false);
  }, [loading, hasMore, offset, supabase]);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadPosts();
      }
    });

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [hasMore, loading, loadPosts]);

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
      <div ref={loadMoreRef}>
        {loading && <p>Loading more posts...</p>}
        {!hasMore && <p>No more posts to load.</p>}
      </div>
    </div>
  );
}
