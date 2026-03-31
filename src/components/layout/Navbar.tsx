'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV_LINKS = [
  { href: '/dashboard',  label: 'Dashboard' },
  { href: '/pulse',      label: 'Pulse' },
  { href: '/pathfinder', label: 'Pathfinder' },
  { href: '/vault',      label: 'Vault' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/dashboard" className="font-mono font-semibold text-slate-900 text-sm">
          Nexus <span className="text-blue-600">·</span> AM
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith(l.href)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="text-xs font-mono text-slate-400 hover:text-red-500 transition-colors"
        >
          Sign out
        </button>

      </div>
    </nav>
  )
}