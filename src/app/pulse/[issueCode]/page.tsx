import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { getFeedbackThreadByCode } from '../actions'
import { FeedbackThread } from '@/components/pulse/FeedbackThread'

const STATUS_STYLES = {
  open: 'bg-red-50 text-red-700 border-red-200',
  seen: 'bg-amber-50 text-amber-700 border-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
} as const

export default async function PulseIssueDetailPage({
  params,
}: {
  params: Promise<{ issueCode: string }>
}) {
  const { issueCode } = await params

  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const thread = await getFeedbackThreadByCode(issueCode)

  if (!thread) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h1 className="text-xl font-semibold text-slate-900">Issue not found</h1>
            <p className="text-sm text-slate-500 mt-2">The feedback Issue ID was not found.</p>
          </div>
        </div>
      </main>
    )
  }

  const statusClass = STATUS_STYLES[thread.feedback.status as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.open
  const course = thread.feedback.course

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Issue ID</p>
              <h1 className="text-xl font-mono font-semibold text-slate-900 mt-1">{thread.feedback.issue_code}</h1>
            </div>
            <span className={`text-xs font-mono border rounded-full px-3 py-1 ${statusClass}`}>
              {thread.feedback.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 text-sm">
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Course</p>
              <p className="text-slate-700 mt-1">{course ? `${course.code} · ${course.name}` : 'Unknown course'}</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Rating</p>
              <p className="text-slate-700 mt-1">{thread.feedback.rating}/5</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Updated</p>
              <p className="text-slate-700 mt-1">
                {new Date(thread.feedback.updated_at).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {thread.feedback.stop_feedback && (
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Stop:</span> {thread.feedback.stop_feedback}
              </p>
            )}
            {thread.feedback.start_feedback && (
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Start:</span> {thread.feedback.start_feedback}
              </p>
            )}
            {thread.feedback.continue_feedback && (
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Continue:</span> {thread.feedback.continue_feedback}
              </p>
            )}
          </div>
        </div>

        <FeedbackThread issueCode={thread.feedback.issue_code} messages={thread.messages} />
      </div>
    </main>
  )
}
