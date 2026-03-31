import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AddSeniorForm } from '@/components/pathfinder/AddSeniorForm'

export default async function PathfinderAdminPage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!profile || !['convener', 'admin'].includes((profile as any).role)) {
    redirect('/pathfinder')
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
            Nexus · Pathfinder Admin
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Add <span className="text-blue-600">Senior</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Only visible to Class Convener.</p>
        </div>
        <AddSeniorForm />
      </div>
    </main>
  )
}