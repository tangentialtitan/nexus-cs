'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AddAnnouncementPage() {
  const supabase = createClient()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('announcements')
      .insert({ title, body })

    if (error) {
      setError('Failed to post. Make sure you are the Class Convener.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-xl font-bold text-slate-900 mb-1">New Announcement</h1>
        <p className="text-sm text-slate-400 mb-6">Only visible to Class Convener to post.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
              Title *
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Quiz 2 on Friday"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1.5">
              Message *
            </label>
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your announcement here…"
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
              {loading ? 'Posting…' : 'Post Announcement'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}