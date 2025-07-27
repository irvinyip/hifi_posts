'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const handleMicrosoftLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-center">Login</h1>
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
          >
            Sign in with Google
          </button>
          <button
            onClick={handleMicrosoftLogin}
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Sign in with Microsoft
          </button>
        </div>
      </div>
    </div>
  )
}