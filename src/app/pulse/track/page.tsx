import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { TrackFeedbackForm } from '@/components/pulse/TrackFeedbackForm'

export default async function PulseTrackPage() {
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
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Nexus · Pulse Tracker</p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Track <span className="text-blue-600">Feedback Issue</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter your Issue ID from Pulse submission to check status and continue chat.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <TrackFeedbackForm />
          <p className="text-xs text-slate-500">
            Issue IDs cannot be recovered if lost because feedback stays anonymous.
          </p>
          <Link href="/pulse" className="inline-block text-sm text-blue-600 hover:underline">
            Submit new feedback
          </Link>
        </div>
      </div>
    </main>
  )
}
