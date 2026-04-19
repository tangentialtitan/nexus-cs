import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCourses, getFeedbackSummary } from './actions'
import { FeedbackForm } from '@/components/pulse/FeedbackForm'
import { Navbar } from '@/components/layout/Navbar'
import { TrackFeedbackForm } from '@/components/pulse/TrackFeedbackForm'
import type { Tables, UserRole } from '@/types/database'

export default async function PulsePage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', session.user.id)
    .single()

  const role = ((profile as { role?: UserRole } | null)?.role ?? 'student')
  const isAdmin = ['convener', 'admin'].includes(role)

  const [courses, summary] = await Promise.all([
    getCourses(),
    isAdmin ? getFeedbackSummary() : Promise.resolve(null),
  ])

  return (
    <main className="min-h-screen bg-slate-50">
    <Navbar /> 
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">
            Nexus · The Pulse
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Submit <span className="text-blue-600">Feedback</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Anonymous. Aggregated. Actionable.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <FeedbackForm courses={courses} />
          </div>

          <div className="space-y-4">
            {isAdmin && summary && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Avg Rating by Course
                  </h2>
                  <span className="text-[10px] font-mono bg-violet-100 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full">
                    Convener View
                  </span>
                </div>
                <div className="px-5 py-4 space-y-3">
                 {(summary as Tables<'feedback_summary'>[]).map((s) => (
                    <div key={s.course_code} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-blue-600 font-medium">{s.course_code}</span>
                        <span className="text-slate-500">{s.total_responses} resp · {Number(s.avg_rating).toFixed(1)}/5</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-700"
                          style={{ width: `${(s.avg_rating / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
                Track Feedback Issue
              </h2>
              <TrackFeedbackForm />
              <p className="text-xs text-slate-500 mt-3">
                Lost your issue ID? It cannot be recovered because submissions stay anonymous.
              </p>
              {isAdmin && (
                <Link href="/pulse/pending" className="inline-block text-sm text-blue-600 hover:underline mt-2">
                  Open pending queue
                </Link>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
                How it works
              </h2>
              <ol className="space-y-2 text-sm text-slate-600">
                {[
                  'You submit feedback — no name stored',
                  'Class Convener reviews aggregated data weekly',
                  'Convener presents trends to the professor',
                  'Changes happen based on your input',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-mono flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}