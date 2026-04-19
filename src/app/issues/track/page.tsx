import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { TrackIssueForm } from '@/components/issues/TrackIssueForm'

export default async function TrackIssuePage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Nexus · Track Issue</p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Enter <span className="text-blue-600">Issue ID</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Use the ID shown at submission time to check status and continue chat.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <TrackIssueForm />
          <p className="text-xs text-slate-500">
            If you lost your issue ID, it cannot be recovered because submissions are not linked to user accounts.
          </p>
          <Link href="/issues" className="inline-block text-sm text-blue-600 hover:underline">
            Submit a new issue
          </Link>
        </div>
      </div>
    </main>
  )
}
