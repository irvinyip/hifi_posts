'use client'

import CreatePost from '@/app/components/CreatePost';

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <CreatePost />
      </main>
    </div>
  );
}