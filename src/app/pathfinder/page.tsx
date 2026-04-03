import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSeniors } from './actions'
import { Navbar } from '@/components/layout/Navbar'
import PathfinderClient from './PathfinderClient'

export default async function PathfinderPage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const seniors = await getSeniors()

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
            Nexus · Pathfinder
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Senior <span className="text-blue-600">Contacts</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Connect with seniors who've been placed across domains.
          </p>
        </div>

        <PathfinderClient seniors={seniors} />

      </div>
    </main>
  )
}