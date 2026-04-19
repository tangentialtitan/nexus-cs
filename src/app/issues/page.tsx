import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { getCourses } from './actions'
import { IssueForm } from '@/components/issues/IssueForm'

export default async function IssuesPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const courses = await getCourses()

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
              Nexus · Issue Tracker
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Anonymous <span className="text-blue-600">Issue Tracker</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Submit feedback, get an issue ID, and track replies.</p>
          </div>
          <Link
            href="/issues/track"
            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            Track Existing Issue
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <IssueForm courses={courses} />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">How this works</h2>
              <ol className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-mono flex items-center justify-center mt-0.5">
                    1
                  </span>
                  Submit your issue anonymously.
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-mono flex items-center justify-center mt-0.5">
                    2
                  </span>
                  Save the generated issue ID by screenshot or note.
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-mono flex items-center justify-center mt-0.5">
                    3
                  </span>
                  Track status and continue conversation via issue ID.
                </li>
              </ol>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Status lifecycle</h2>
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-mono text-slate-700">open</span> - issue submitted and waiting for review.
                </p>
                <p>
                  <span className="font-mono text-slate-700">seen</span> - convenor has reviewed the issue.
                </p>
                <p>
                  <span className="font-mono text-slate-700">resolved</span> - issue addressed and closed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
