import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { getPendingIssues, updateIssueStatus } from '../actions'

const STATUS_STYLES = {
  open: 'bg-red-50 text-red-700 border-red-200',
  seen: 'bg-amber-50 text-amber-700 border-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
} as const

export default async function PendingIssuesPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  const role = ((profile as { role?: string } | null)?.role ?? '').toLowerCase()
  if (role !== 'convener' && role !== 'convenor') {
    redirect('/issues')
  }

  const issues = await getPendingIssues()

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Nexus · Convenor Queue</p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Pending <span className="text-blue-600">Issues</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Only convenor can access this queue.</p>
        </div>

        <div className="space-y-3">
          {issues.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
              No open or seen issues right now.
            </div>
          ) : (
            issues.map((issue) => {
              const course = (issue as { course?: { code?: string; name?: string } }).course
              const status = (issue as { status?: 'open' | 'seen' | 'resolved' }).status ?? 'open'
              const statusClass = STATUS_STYLES[status]

              return (
                <div key={(issue as { id: string }).id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-mono text-slate-900">{(issue as { issue_code: string }).issue_code}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {course ? `${course.code} · ${course.name}` : 'Unknown course'}
                      </p>
                    </div>
                    <span className={`text-xs font-mono border rounded-full px-3 py-1 ${statusClass}`}>
                      {status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/issues/${(issue as { issue_code: string }).issue_code}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Open thread
                    </Link>

                    <form action={updateIssueStatus} className="flex items-center gap-2">
                      <input type="hidden" name="issue_id" value={(issue as { id: string }).id} />
                      <select
                        name="status"
                        defaultValue={status}
                        className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm"
                      >
                        <option value="open">open</option>
                        <option value="seen">seen</option>
                        <option value="resolved">resolved</option>
                      </select>
                      <button
                        type="submit"
                        className="h-9 rounded-md bg-blue-600 px-3 text-sm text-white hover:bg-blue-700"
                      >
                        Update
                      </button>
                    </form>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}
