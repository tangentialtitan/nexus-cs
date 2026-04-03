import {createClient} from '@/lib/supabase/server'
import {NextResponse} from 'next/server'

export async function GET(request: Request) {
  const {searchParams, origin} = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const {data, error} = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth code exchange failed:', error)
    }

    if (!error && data.user) {
      const metadata = data.user.user_metadata ?? {}
      const email = data.user.email ?? ''
      const fallbackName = email ? email.split('@')[0] : 'New User'
      const fullName = metadata.full_name || metadata.name ||
          metadata.display_name ||
          fallbackName
      const {error: profileError} = await supabase.from('profiles')
          .upsert(
              {
                id: data.user.id,
                full_name: fullName,
                role: 'student',
                avatar_url: metadata.avatar_url || metadata.picture || null,
              },
              {onConflict: 'id'})

      if (profileError) {
        console.error('Profile upsert failed:', profileError)
      }
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}