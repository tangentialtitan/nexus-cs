'use client'

import { useState } from 'react'

const CATEGORY_COLORS: Record<string, string> = {
  'Consult':    'bg-blue-50 text-blue-700 border-blue-200',
  'Finance':    'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Tech':       'bg-violet-50 text-violet-700 border-violet-200',
  'Core':       'bg-orange-50 text-orange-700 border-orange-200',
  'Management': 'bg-pink-50 text-pink-700 border-pink-200',
  'Other':      'bg-slate-50 text-slate-600 border-slate-200',
}

export default function PathfinderClient({ seniors }: { seniors: any[] }) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? seniors
    : seniors.filter((s) => s.category === active)

  return (
    <div>
      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['All', 'Consult', 'Finance', 'Tech', 'Core', 'Management', 'Other'].map((cat) => (
          <span
            key={cat}
            onClick={() => setActive(cat)}
            className={`text-xs font-mono px-3 py-1 rounded-full border cursor-pointer transition-colors
              ${active === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
              }`}
          >
            {cat}
          </span>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-sm">No seniors in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((s: any) => (
            <div
              key={s.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{s.senior_name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{s.company_name}</p>
                </div>
                <span className={`text-xs font-mono px-2.5 py-1 rounded-full border flex-shrink-0 ${CATEGORY_COLORS[s.category] ?? CATEGORY_COLORS['Other']}`}>
                  {s.category}
                </span>
              </div>

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
  )
}