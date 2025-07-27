'use client'

import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'

import PostList from './components/PostList';

export default function Home() {
  

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        <PostList />
      </main>
    </div>
  );
}
