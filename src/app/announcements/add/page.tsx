'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Course {
  id: string
  code: string
  name: string
  semester: number
}

export default function AddAnnouncementPage() {
  const supabase = createClient()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [courseId, setCourseId] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCourses() {
      const { data } = await supabase
        .from('courses')
        .select('id, code, name, semester')
        .eq('is_active', true)
        .order('semester', { ascending: true })
      if (data) setCourses(data)
    }
    fetchCourses()
  }, [])

  const bySemester = courses.reduce<Record<number, Course[]>>((acc, c) => {
    ;(acc[c.semester] ??= []).push(c)
    return acc
  }, {})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('announcements')
      .insert({
        title,
        body,
        course_id: courseId || null,
      } as any)

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
        <h1 className="text-xl font-bold text-slate-900 mb-1">New Announcement</h1>
        <p className="text-sm text-slate-400 mb-6">Post to the whole batch or a specific course.</p>

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
              Course <span className="normal-case text-slate-300">(leave empty for general)</span>
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="">📢 General — visible to everyone</option>
              {Object.entries(bySemester)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([sem, list]) => (
                  <optgroup key={sem} label={`── Semester ${sem} ──`}>
                    {list.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
            </select>
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