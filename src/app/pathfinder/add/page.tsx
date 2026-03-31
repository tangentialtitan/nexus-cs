import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AddSeniorForm } from '@/components/pathfinder/AddSeniorForm'
import { Navbar } from '@/components/layout/Navbar'

export default async function AddSeniorPage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  return (
    <main className="min-h-screen bg-slate-50">
    <Navbar />  
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
            Nexus · Pathfinder
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Add a <span className="text-blue-600">Senior</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Help your juniors find the right person to talk to.
          </p>
        </div>
        <AddSeniorForm />
      </div>
    </main>
  )
}