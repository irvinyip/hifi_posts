'use client'

import CreatePost from '@/app/components/CreatePost';
import Header from '@/app/components/Header';

export default function NewPostPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <CreatePost />
      </main>
    </div>
  );
}