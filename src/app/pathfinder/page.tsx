import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSeniors } from './actions'
import { AddSeniorForm } from '@/components/pathfinder/AddSeniorForm'

const CATEGORY_COLORS: Record<string, string> = {
  'Consult':    'bg-blue-50 text-blue-700 border-blue-200',
  'Finance':    'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Tech':       'bg-violet-50 text-violet-700 border-violet-200',
  'Core':       'bg-orange-50 text-orange-700 border-orange-200',
  'Management': 'bg-pink-50 text-pink-700 border-pink-200',
  'Other':      'bg-slate-50 text-slate-600 border-slate-200',
}

export default async function PathfinderPage() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const seniors = await getSeniors()

  return (
    <main className="min-h-screen bg-slate-50">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Cards */}
          <div className="lg:col-span-2">

            {/* Category chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {['All', 'Consult', 'Finance', 'Tech', 'Core', 'Management', 'Other'].map((cat) => (
                <span
                  key={cat}
                  className="text-xs font-mono px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-500 cursor-pointer hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  {cat}
                </span>
              ))}
            </div>

            {seniors.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                <p className="text-slate-400 text-sm">No seniors added yet.</p>
                <p className="text-slate-400 text-sm mt-1">
                  Be the first to add a contact!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {seniors.map((s: any) => (
                  <div
                    key={s.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{s.senior_name}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">{s.company_name}</p>
                      </div>
                      <span className={`text-xs font-mono px-2.5 py-1 rounded-full border flex-shrink-0 ${CATEGORY_COLORS[s.category] ?? CATEGORY_COLORS['Other']}`}>
                        {s.category}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-2">
                        <span>🎓</span>
                        <span>{s.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>Batch of {s.year_joined}</span>
                      </div>
                      {s.contact_info && (
                        <div className="flex items-center gap-2 pt-2 mt-2 border-t border-slate-100">
                          <span>✉</span>
                          <span className="text-blue-600 break-all">{s.contact_info}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Form */}
          <div>
            <AddSeniorForm />
          </div>

        </div>
      </div>
    </main>
  )
}