import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    // 1. Use normal client to establish the user's session cookies
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const metadata = data.user.user_metadata ?? {}
      const email = data.user.email ?? ''
      const fallbackName = email ? email.split('@')[0] : 'New User'
      const fullName = metadata.full_name || metadata.name || metadata.display_name || fallbackName

      // Use admin client only when service role key is configured.
      // Otherwise, fall back to regular client and log the write error.
      const profileClient = process.env.SUPABASE_SERVICE_ROLE_KEY
        ? await createAdminClient()
        : supabase

      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to anon client for profile upsert.')
      }

      const { error: profileError } = await profileClient.from('profiles')
        .upsert(
          {
            id: data.user.id,
            full_name: fullName,
            role: 'student',
            avatar_url: metadata.avatar_url || metadata.picture || null,
          },
          { onConflict: 'id' }
        )

      if (profileError) {
        console.error("Critical: Failed to create profile via Admin Client:", profileError)
        return NextResponse.redirect(`${origin}/login?error=ProfileCreationError`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}