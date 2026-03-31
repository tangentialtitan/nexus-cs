'use client'

import { useActionState } from 'react'
import { addSenior } from '@/app/pathfinder/actions'
import type { SeniorFormState } from '@/app/pathfinder/actions'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

const initialState: SeniorFormState = { status: 'idle' }

const CATEGORIES = ['Consult', 'Finance', 'Tech', 'Core', 'Management', 'Other']

const DEPARTMENTS = [
  'Applied Mechanics',
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Physics',
  'Mathematics',
  'Other',
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
            Senior Name *
          </label>
          <input
            name="senior_name"
            required
            placeholder="e.g. Rohit Sharma"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Category *
          </label>
          <select
            name="category"
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="">Select category…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Company Name *
          </label>
          <input
            name="company_name"
            required
            placeholder="e.g. McKinsey, Google, L&T"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Year of Joining Campus *
          </label>
          <input
            name="year_joined"
            required
            type="number"
            min="2000"
            max="2030"
            placeholder="e.g. 2020"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Department *
          </label>
          <select
            name="department"
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="">Select department…</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Contact Info
          </label>
          <input
            name="contact_info"
            placeholder="email / phone / LinkedIn"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
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