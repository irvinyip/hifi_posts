'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
}

export default function CommentList({ post_id }: { post_id: number }) {
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>([]);
  const [visibleComments, setVisibleComments] = useState(3);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase.rpc('get_comments_with_author', { p_post_id: post_id });

      if (data) {
        console.log(`Fetched comments for post ${post_id}:`, data);
        setComments(data);
      }
      if (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();

    const channel = supabase
      .channel(`comments-for-post-${post_id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${post_id}` },
        (payload) => {
          setComments((prevComments) => [payload.new as Comment, ...prevComments]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [post_id, supabase]);

  const showMoreComments = () => {
    setVisibleComments(comments.length);
  };

  return (
    <div className="mt-4 space-y-2">
      {comments.slice(0, visibleComments).map((comment) => (
        <div key={comment.id} className="bg-gray-100 p-2 rounded-md">
          <p className="text-sm text-blue-500 whitespace-pre-wrap">{comment.content}</p>
          <div className="text-xs text-gray-500 mt-1">
            <span>Commented by {comment.full_name || comment.username || comment.email} on {new Date(comment.created_at).toLocaleString()}</span>
          </div>
        </div>
      ))}
      {comments.length > visibleComments && (
        <button onClick={showMoreComments} className="text-sm text-blue-500 hover:underline">
          More comments...
        </button>
      )}
    </div>
  );
}