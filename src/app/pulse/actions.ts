'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { FeedbackInsert } from '@/types/database'

export type FeedbackFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

function getCurrentWeekNumber(): number {
  const semesterStart = new Date('2025-01-06')
  const now = new Date()
  const diffMs = now.getTime() - semesterStart.getTime()
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.max(1, Math.min(diffWeeks, 16))
}

function getCurrentAcademicYear(): string {
  const now = new Date()
  const year = now.getFullYear()
  return now.getMonth() >= 7 ? `${year}-${year + 1}` : `${year - 1}-${year}`
}

function validateFeedback(data: Partial<FeedbackInsert>): string | null {
  if (!data.course_id) return 'Please select a course.'
  if (!data.rating || data.rating < 1 || data.rating > 5) return 'Rating must be between 1 and 5.'
  for (const field of ['stop_feedback', 'start_feedback', 'continue_feedback'] as const) {
    const val = data[field]
    if (val && val.length > 1000) return `${field} is too long (max 1000 characters).`
  }
  return null
}

export async function submitFeedback(
  _prevState: FeedbackFormState,
  formData: FormData
): Promise<FeedbackFormState> {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return { status: 'error', message: 'You must be signed in to submit feedback.' }
  }

  const payload: FeedbackInsert = {
    course_id:         formData.get('course_id') as string,
    rating:            parseInt(formData.get('rating') as string, 10),
    stop_feedback:     (formData.get('stop_feedback') as string)?.trim() || null,
    start_feedback:    (formData.get('start_feedback') as string)?.trim() || null,
    continue_feedback: (formData.get('continue_feedback') as string)?.trim() || null,
    week_number:       getCurrentWeekNumber(),
    academic_year:     getCurrentAcademicYear(),
  }

  const validationError = validateFeedback(payload)
  if (validationError) {
    return { status: 'error', message: validationError }
  }

  const { error } = await supabase.from('feedback').insert(payload as any)

  if (error) {
    console.error('[Pulse] feedback insert error:', error)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }

  revalidatePath('/pulse/admin')

  return { status: 'success', message: 'Feedback submitted anonymously. Thank you!' }
}

export async function getCourses() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('courses')
    .select('id, code, name, semester')
    .eq('is_active', true)
    .order('semester', { ascending: true })
    .order('code', { ascending: true })

  if (error) {
    console.error('[Pulse] getCourses error:', error)
    return []
  }

  return data
}

export async function getFeedbackSummary() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', session.user.id)
  .single()

if (!profile || !['convener', 'admin'].includes((profile as any).role)) return null

  const { data, error } = await supabase
    .from('feedback_summary')
    .select('*')
    .order('semester', { ascending: true })

  if (error) {
    console.error('[Pulse] getFeedbackSummary error:', error)
    return null
  }

  return data
}