'use client'

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import CreateComment from './CreateComment';
import CommentList from './CommentList';
import MediaPreview from './MediaPreview';

interface Post {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  photo_url: string | null;
  photo_content_type: string | null;
  username: string | null;
  full_name: string | null;
  email: string | null;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.rpc('get_posts_with_author');

      if (data) {
        console.log('Fetched posts data:', data);
        setPosts(data);
      }
      if (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [supabase]);



  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow-md">
          {post.photo_url && <MediaPreview url={post.photo_url} contentType={post.photo_content_type} />}

          <p className="text-stone-950">{post.content}</p>
          <div className="text-sm text-stone-400 mt-2">
            <span>Posted by {post.full_name || post.username || post.email} on {new Date(post.created_at).toLocaleString()}</span>
          </div>
          <div className="mt-4">
            <CommentList post_id={post.id} />
            <CreateComment post_id={post.id} />
          </div>
        </div>
      ))}
    </div>
  );
}