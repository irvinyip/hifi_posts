'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { resizeImage } from '@/lib/image-utils'

import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPhoto(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      let photoUrl: string | null = null

      if (photo) {
        let fileToUpload: File | Blob = photo;
        if (photo.type.startsWith('image/')) {
          fileToUpload = await resizeImage(photo);
        }
        const fileExt = photo.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const { data, error } = await supabase.storage
          .from('post-photos')
          .upload(fileName, fileToUpload)

        if (error) {
          console.error('Error uploading file:', error)
          return
        }

        const { data: { publicUrl } } = supabase.storage
          .from('post-photos')
          .getPublicUrl(fileName)
        photoUrl = publicUrl
      }

      const { error } = await supabase.from('posts').insert({ content, user_id: user.id, photo_url: photoUrl, photo_content_type: photo?.type })
      if (!error) {
        setContent('')
        setPhoto(null)
        setPreviewUrl(null)
        alert('Post created successfully!');
        router.push('/');
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6 text-stone-950">
            <div className="mt-2">
              <label htmlFor="file-upload" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                <span>Upload Photo or Audio</span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*,audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      ></textarea>

      {previewUrl && photo && (
        <div className="mt-4">
          {photo.type.startsWith('image/') ? (
            <img src={previewUrl} alt="Preview" className="rounded-md max-h-60" />
          ) : (
            <audio controls src={previewUrl} className="w-full">
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      )}
      <button
        type="submit"
        className="mt-4 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Post
      </button>
    </form>
  )
}