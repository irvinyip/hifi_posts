import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Provider } from '@supabase/supabase-js'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const provider = searchParams.get('provider')
  const supabase = createClient()

  const headersList = headers()
  const host = headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto') ?? 'http'
  const origin = `${protocol}://${host}`
  const redirectTo = `${origin}/auth/callback`

  if (provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo,
      },
    })

    if (error) {
      return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
    }

    return NextResponse.redirect(data.url)
  }

  return NextResponse.redirect(`${origin}/login?error=No provider selected`)
}