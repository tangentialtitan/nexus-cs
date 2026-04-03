'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { OpportunityInsert } from '@/types/database'

export default function AddAnnouncementPage() {
  const supabase = createClient()
  const router = useRouter()
  const [type, setType] = useState<OpportunityInsert['type']>('Corporate Internship')
  const [companyOrUni, setCompanyOrUni] = useState('')
  const [roleTitle, setRoleTitle] = useState('')
  const [description, setDescription] = useState('')
  const [skillsRequired, setSkillsRequired] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const parsedSkills = skillsRequired
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean)

    const payload: OpportunityInsert = {
      type,
      company_or_uni: companyOrUni,
      role_title: roleTitle,
      description: description.trim() || null,
      skills_required: parsedSkills.length > 0 ? parsedSkills : ['General'],
    }

    const { error } = await supabase
      .from('opportunities')
      .insert(payload)

    if (error) {
      setError('Failed to post. Make sure you have the required permissions.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-xl font-bold text-slate-900 mb-1">Add Opportunity</h1>
        <p className="text-sm text-slate-400 mb-6">Share internships, placements, and programs with the batch.</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
              Opportunity Type *
            </label>
            <select
              required
              value={type}
              onChange={(e) => setType(e.target.value as OpportunityInsert['type'])}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="Research Internship">Research Internship</option>
              <option value="Corporate Internship">Corporate Internship</option>
              <option value="Full-Time Placement">Full-Time Placement</option>
              <option value="Exchange Program">Exchange Program</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
              Company / University *
            </label>
            <input
              required
              value={companyOrUni}
              onChange={(e) => setCompanyOrUni(e.target.value)}
              placeholder="e.g. Google, IITD, EPFL"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
              Role Title *
            </label>
            <input
              required
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. SDE Intern"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
              Skills Required *
            </label>
            <input
              required
              value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
              placeholder="e.g. DSA, SQL, React"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details for students"
              rows={4}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex-1 border border-slate-200 text-slate-600 text-sm font-medium py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40"
            >
              {loading ? 'Saving…' : 'Save Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}