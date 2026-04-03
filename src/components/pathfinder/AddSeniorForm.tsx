'use client'

import { useActionState } from 'react'
import { addSenior } from '@/app/pathfinder/actions'
import type { SeniorFormState } from '@/app/pathfinder/actions'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

const initialState: SeniorFormState = { status: 'idle' }

const OPPORTUNITY_TYPES = [
  'Research Internship',
  'Corporate Internship',
  'Full-Time Placement',
  'Exchange Program',
]

export function AddSeniorForm() {
  const [state, formAction, isPending] = useActionState(addSenior, initialState)

  if (state.status === 'success') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
        <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
        <h3 className="font-semibold text-slate-900">Added!</h3>
        <p className="text-sm text-slate-500">{state.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-blue-600 underline underline-offset-2"
        >
          Add another
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">Add a Senior</h2>
        <p className="text-xs text-slate-400 mt-0.5">Help your juniors connect</p>
      </div>

      <form action={formAction} className="p-5 space-y-3">

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Opportunity Type *
          </label>
          <select
            name="type"
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="">Select type...</option>
            {OPPORTUNITY_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Company / University *
          </label>
          <input
            name="company_or_uni"
            required
            placeholder="e.g. Google, IITD, ETH Zurich"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Role / Program Title *
          </label>
          <input
            name="role_title"
            required
            placeholder="e.g. SDE Intern, Quant Intern"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Skills Required *
          </label>
          <input
            name="skills_required"
            required
            placeholder="e.g. DSA, ML, SQL"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Location
          </label>
          <input
            name="location"
            placeholder="e.g. Bangalore / Remote"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Duration
          </label>
          <input
            name="duration"
            placeholder="e.g. 8 weeks"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Stipend
          </label>
          <input
            name="stipend"
            placeholder="e.g. 80,000 INR/month"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Share key details for juniors"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Application Link
          </label>
          <input
            name="application_link"
            placeholder="https://..."
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Contact Name</label>
            <input
              name="contact_name"
              placeholder="e.g. Priya"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Contact Roll</label>
            <input
              name="contact_roll"
              placeholder="2022CS..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">Contact Email</label>
            <input
              name="contact_email"
              type="email"
              placeholder="name@domain.com"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
        </div>

        {state.status === 'error' && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-xs text-red-600">{state.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 rounded-lg transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</>
          ) : (
            '+ Add Senior'
          )}
        </button>

      </form>
    </div>
  )
}