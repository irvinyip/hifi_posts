'use client'

import { useState, useEffect } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createClient } from '@/lib/supabase/client';
import MediaPreview from './MediaPreview';
import CommentList from './CommentList';
import CreateComment from './CreateComment';
import ImageModal from './ImageModal';

export interface MediaItem {
  url: string;
  type: string;
  name: string;
}

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

export default function PostItem({ post }: { post: Post }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const images = post.media?.filter(m => m.type.startsWith('image/')) || [];

  useEffect(() => {
    const supabase = createClient();
    const fetchUserAndLikes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { count } = await supabase.from('likes').select('count(*)', { count: 'exact' }).eq('post_id', post.id);
      setLikeCount(count || 0);

      if (user) {
        const { data } = await supabase.from('likes').select('*').eq('post_id', post.id).eq('user_id', user.id);
        setHasLiked(Boolean(data && data.length > 0));
      }
    };
    fetchUserAndLikes();
  }, [post.id]);

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like');
      return;
    }
    const supabase = createClient();
    if (hasLiked) {
      const { error } = await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', user.id);
      if (!error) {
        setLikeCount(prev => prev - 1);
        setHasLiked(false);
      }
    } else {
      const { error } = await supabase.from('likes').insert({ post_id: post.id, user_id: user.id });
      if (!error) {
        setLikeCount(prev => prev + 1);
        setHasLiked(true);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {post.media && post.media.length > 0 && (
        <div>
          {(() => {
            const audios = post.media.filter(m => m.type.startsWith('audio/'));
            return (
              <>
                {images.length > 0 && (
                  <div className="relative">
                    <div className="overflow-hidden">
                      <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {images.map((img, index) => (
                          <div 
                            key={index} 
                            className="flex-shrink-0 w-full cursor-pointer"
                            onClick={() => {
                              setModalInitialIndex(index);
                              setShowModal(true);
                            }}
                          >
                            <MediaPreview url={img.url} contentType={img.type} />
                          </div>
                        ))}
                      </div>
                    </div>
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        >
                          &lt;
                        </button>
                        <button
                          onClick={() => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        >
                          &gt;
                        </button>
                      </>
                    )}
                  </div>
                )}
                {audios.map((audio, index) => (
                  <div key={index} className="mt-2">
                    <p>{audio.name}</p>
                    <MediaPreview url={audio.url} contentType={audio.type} />
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      )}
      {post.photo_url && (
        <div 
          className="cursor-pointer"
          onClick={() => {
            setModalInitialIndex(0);
            setShowModal(true);
          }}
        >
          <MediaPreview url={post.photo_url} contentType={post.photo_content_type} />
        </div>
      )}

      {showModal && (
        <ImageModal 
          images={post.photo_url ? [{url: post.photo_url, type: post.photo_content_type || 'image/jpeg', name: ''}] : images} 
          initialIndex={modalInitialIndex} 
          onClose={() => setShowModal(false)} 
        />
      )}

      <div className="text-stone-950 prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown></div>
      <div className="flex justify-end mt-2">
        <button onClick={handleLike} className="flex items-center text-gray-500 hover:text-blue-500">
          <FaThumbsUp className={hasLiked ? 'text-blue-500' : ''} />
          <span className="ml-1">{likeCount}</span>
        </button>
      </div>
      <div className="text-sm text-stone-400 mt-2">
        <span>Posted by {post.full_name || post.username || post.email} on {new Date(post.created_at).toLocaleString()}</span>
      </div>
      <div className="mt-4">
        <CommentList post_id={post.id} />
        <CreateComment post_id={post.id} />
      </div>
    </div>
  );
}