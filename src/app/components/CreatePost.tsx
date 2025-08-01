'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { resizeImage } from '@/lib/image-utils'

import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<{url: string, type: string}[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const additionalFiles = Array.from(e.target.files).filter(file => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'mp3', 'flac'].includes(ext || '');
      });
      const totalFiles = [...files, ...additionalFiles];
      if (totalFiles.length > 5) {
        alert('Maximum 5 files allowed. Only the first 5 will be used.');
        totalFiles.splice(5);
      }
      setFiles(totalFiles);
      setPreviews(totalFiles.map(file => ({url: URL.createObjectURL(file), type: file.type})));
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setPreviews(newPreviews);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (content.length < 10) {
      setError('Type something in your post!')
      return
    }
    setError('')
    setIsUploading(true)
    setUploadProgress(0)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const media = [];
      const totalFiles = files.length;
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        let fileToUpload: File | Blob = file;
        if (file.type.startsWith('image/')) {
          fileToUpload = await resizeImage(file);
        }
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('post-photos')
          .upload(fileName, fileToUpload);
        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          continue;
        }
        const { data: { publicUrl } } = supabase.storage
          .from('post-photos')
          .getPublicUrl(fileName);
        media.push({ url: publicUrl, type: file.type, name: file.name });
        setUploadProgress(((i + 1) / totalFiles) * 100);
      }

      const { error } = await supabase.from('posts').insert({ content, user_id: user.id, media });
      if (!error) {
        setContent('')
        setFiles([])
        setPreviews([])
        alert('Post created successfully!');
        router.push('/');
      }
    }
    setIsUploading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6 text-stone-950">
            <div className="mt-2">
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-4 rounded inline-flex items-center justify-center w-full border-2 border-dashed border-gray-300"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) {
                    handleFileChange({ target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
              >
                <span>Upload Photo or Audio (Drag & Drop here)
                  <p>Max 5 files, 5MB each</p></span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/jpeg,image/png,audio/mpeg,audio/flac"
                multiple
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
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              {preview.type.startsWith('image/') ? (
                <img src={preview.url} alt={`Preview ${index}`} className="rounded-md max-h-40" />
              ) : (
                <audio controls src={preview.url} className="w-full">
                  Your browser does not support the audio element.
                </audio>
              )}
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center">
        <button
          type="submit"
          disabled={isUploading}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Post
        </button>
        {isUploading && (
          <div className="ml-4">
            <span>Saving files</span>
            <div className="w-32 bg-gray-200 rounded-full h-2.5 mt-1">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${uploadProgress}%`}}></div>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}