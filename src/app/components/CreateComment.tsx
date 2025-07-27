'use client';

import { createClient } from '@/lib/supabase/client';
import { FormEvent, useState } from 'react';

export default function CreateComment({ post_id }: { post_id: number }) {
  const supabase = createClient();
  const [comment, setComment] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();

    if (user && comment.trim()) {
      const { error } = await supabase.from('comments').insert({ 
        content: comment.trim(), 
        user_id: user.id, 
        post_id: post_id 
      });

      if (error) {
        console.error('Error creating comment:', error);
      } else {
        setComment('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-start space-x-2">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onInput={(e) => {
            const textarea = e.currentTarget;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }}
        placeholder="Add a comment..."
        className="flex-grow p-2 border rounded-md resize-none overflow-y-hidden"
        rows={1}
      />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex-shrink-0">
        Comment
      </button>
    </form>
  );
}