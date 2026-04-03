'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const supabase = createClient()

  async function signInWithGoogle() {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center px-4">

      {/* Glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold font-mono text-xl">N</span>
          </div>
          <h1 className="text-xl font-bold text-white">Nexus</h1>
          <p className="text-sm text-slate-400 mt-1">AM Department · IIT Delhi</p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-6" />

        <p className="text-xs text-slate-400 text-center mb-4">
          Sign in to access your batch portal
        </p>

        {/* Google button */}
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-all shadow-sm hover:shadow-md"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"/>
            <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"/>
            <path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z" fill="#FBBC05"/>
            <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-[11px] text-slate-500 text-center mt-5 leading-relaxed">
          Access is open to all. 
        </p>

      </div>

      {/* Back */}
      <Link
        href="/"
        className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors"
      >
        ← Back to home
      </Link>

    </main>
  )
}