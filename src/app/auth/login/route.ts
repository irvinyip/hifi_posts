import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Provider } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const provider = searchParams.get('provider')
  const supabase = createClient()

  if (provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/auth/callback`
          : `${origin}/auth/callback`,
      },
    })

    if (error) {
      return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
    }

    return NextResponse.redirect(data.url)
  }

  return NextResponse.redirect(`${origin}/login?error=No provider selected`)
}