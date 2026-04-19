'use server'

import{createClient} from '@/lib/supabase/server'
import{revalidatePath} from 'next/cache'
import type{FeedbackInsert, FeedbackMessageInsert, IssueStatus, Tables, UserRole} from '@/types/database'

export type FeedbackFormState = {
  status: 'idle'|'success'|'error'
  message?: string
  issueCode?: string
}

export type MessageFormState = {
  status: 'idle'|'success'|'error'
  message?: string
}

const STATUS_OPTIONS: IssueStatus[] = ['open', 'seen', 'resolved']

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

function normalizeIssueCode(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, '')
}

function randomCodeChunk(size: number): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let output = ''
  for (let i = 0; i < size; i += 1) {
    const index = Math.floor(Math.random() * alphabet.length)
    output += alphabet[index]
  }
  return output
}

async function generateUniqueIssueCode(): Promise<string> {
  const supabase = await createClient()

  for (let i = 0; i < 12; i += 1) {
    const candidate = `NX-${randomCodeChunk(6)}`
    const {data} = await supabase.from('feedback')
                       .select('id')
                       .eq('issue_code', candidate)
                       .maybeSingle()
    if (!data) return candidate
  }

  return `NX-${Date.now().toString(36).slice(-6).toUpperCase()}`
}

function validateFeedback(data: Partial<FeedbackInsert>): string | null {
  if (!data.course_id) return 'Please select a course.'
    if (!data.rating || data.rating < 1 ||
        data.rating > 5) return 'Rating must be between 1 and 5.'
    for (const field
             of ['stop_feedback', 'start_feedback', 'continue_feedback'] as
         const) {
      const val = data[field];
      if (val && val.length > 1000) return `${
          field} is too long (max 1000 characters).`
    }
  return null
}

export async function submitFeedback(
  _prevState: FeedbackFormState,
  formData: FormData
): Promise<FeedbackFormState> {
  const supabase = await createClient()

  const {data: {session}} = await supabase.auth.getSession()
  if (!session) {
    return {
      status: 'error', message: 'You must be signed in to submit feedback.'
    }
  }

  const issueCode = await generateUniqueIssueCode()

  const payload: FeedbackInsert = {
    issue_code: issueCode,
    course_id: formData.get('course_id') as string,
    rating: parseInt(formData.get('rating') as string, 10),
    stop_feedback: (formData.get('stop_feedback') as string)?.trim() || null,
    start_feedback: (formData.get('start_feedback') as string)?.trim() || null,
    continue_feedback:
        (formData.get('continue_feedback') as string)?.trim() || null,
    week_number: getCurrentWeekNumber(),
    academic_year: getCurrentAcademicYear(),
    status: 'open',
  }

  const validationError = validateFeedback(payload)
  if (validationError) {
    return {
      status: 'error', message: validationError
    }
  }

  const {error} = await supabase.from('feedback').insert(payload)

  if (error) {
    console.error('[Pulse] feedback insert error:', error)
    return {
      status: 'error', message: 'Something went wrong. Please try again.'
    }
  }

  revalidatePath('/pulse')
  revalidatePath('/pulse/pending')

  return {
    status: 'success', message: 'Feedback submitted anonymously. Thank you!', issueCode
  }
}

export async function getCourses() {
  const supabase = await createClient()

  const {data, error} = await supabase.from('courses')
                            .select('id, code, name, semester')
                            .eq('is_active', true)
                            .order('semester', {ascending: true})
                            .order('code', {ascending: true})

  if (error) {
    console.error('[Pulse] getCourses error:', error)
    return []
  }

  return data
}

export async function getFeedbackSummary() {
  const supabase = await createClient()

  const {data: {session}} = await supabase.auth.getSession()
  if (!session) return null

  const {data: profile} = await supabase.from('profiles')
                              .select('role')
                              .eq('id', session.user.id)
                              .single()

  const role = ((profile as {role?: UserRole} | null)?.role ?? 'student')

  if (!profile || !['convener', 'admin'].includes(role)) return null

  const {data, error} =
      await supabase.from('feedback_summary').select('*').order('semester', {
        ascending: true
      })

  if (error) {
    console.error('[Pulse] getFeedbackSummary error:', error)
    return null
  }

  return data
}

type FeedbackLookup = {
  id: string
  issue_code: string
  status: IssueStatus
  created_at: string
  updated_at: string
  rating: number
  stop_feedback: string | null
  start_feedback: string | null
  continue_feedback: string | null
  course: Pick<Tables<'courses'>, 'code'|'name'|'semester'> | null
}

export async function lookupFeedbackByCode(rawCode: string): Promise<FeedbackLookup | null> {
  const supabase = await createClient()
  const issueCode = normalizeIssueCode(rawCode)

  if (!issueCode) return null

  const {data, error} = await supabase.from('feedback')
                            .select(`
        id,
        issue_code,
        status,
        created_at,
        updated_at,
        rating,
        stop_feedback,
        start_feedback,
        continue_feedback,
        course:courses(code, name, semester)
      `)
                            .eq('issue_code', issueCode)
                            .maybeSingle()

  if (error) {
    console.error('[Pulse] lookupFeedbackByCode error:', error)
    return null
  }

  return (data as FeedbackLookup | null) ?? null
}

export async function getFeedbackThreadByCode(rawCode: string) {
  const supabase = await createClient()
  const issueCode = normalizeIssueCode(rawCode)

  if (!issueCode) return null

  const feedback = await lookupFeedbackByCode(issueCode)
  if (!feedback) return null

  const {data: messages, error} = await supabase.from('feedback_messages')
                                    .select('id, feedback_id, sender_type, message, created_at')
                                    .eq('feedback_id', feedback.id)
                                    .order('created_at', {ascending: true})

  if (error) {
    console.error('[Pulse] getFeedbackThreadByCode messages error:', error)
    return {
      feedback, messages: []
    }
  }

  return {
    feedback, messages: messages ?? []
  }
}

function validateMessageBody(body: string): string | null {
  if (!body) return 'Message cannot be empty.'
  if (body.length > 1000) return 'Message is too long (max 1000 characters).'
  return null
}

export async function postFeedbackMessage(
  _prevState: MessageFormState,
  formData: FormData
): Promise<MessageFormState> {
  const supabase = await createClient()

  const {data: {session}} = await supabase.auth.getSession()

  if (!session) {
    return {
      status: 'error', message: 'You must be signed in to post a message.'
    }
  }

  const rawCode = (formData.get('issue_code') as string) ?? ''
  const issueCode = normalizeIssueCode(rawCode)
  const body = ((formData.get('message') as string) ?? '').trim()

  const validationError = validateMessageBody(body)
  if (validationError) {
    return {
      status: 'error', message: validationError
    }
  }

  const feedback = await lookupFeedbackByCode(issueCode)
  if (!feedback) {
    return {
      status: 'error', message: 'Feedback issue not found.'
    }
  }

  const {data: profile} = await supabase.from('profiles')
                              .select('role')
                              .eq('id', session.user.id)
                              .single()

  const role = ((profile as {role?: string} | null)?.role ?? 'student').toLowerCase()
  const senderType: FeedbackMessageInsert['sender_type'] =
      role === 'convener' || role === 'convenor' ? 'convener' : 'student'

  const payload: FeedbackMessageInsert = {
    feedback_id: feedback.id,
    message: body,
    sender_type: senderType,
  }

  const {error: insertError} = await supabase.from('feedback_messages').insert(payload)

  if (insertError) {
    console.error('[Pulse] postFeedbackMessage insert error:', insertError)
    return {
      status: 'error', message: 'Failed to post message. Please try again.'
    }
  }

  const {error: updateError} = await supabase.from('feedback')
                                   .update({updated_at: new Date().toISOString()})
                                   .eq('id', feedback.id)

  if (updateError) {
    console.error('[Pulse] postFeedbackMessage update error:', updateError)
  }

  revalidatePath(`/pulse/${feedback.issue_code}`)
  revalidatePath('/pulse/pending')

  return {
    status: 'success', message: 'Message posted.'
  }
}

export async function getPendingFeedbacks() {
  const supabase = await createClient()

  const {data: {session}} = await supabase.auth.getSession()
  if (!session) return []

  const {data: profile} = await supabase.from('profiles')
                              .select('role')
                              .eq('id', session.user.id)
                              .single()

  const role = ((profile as {role?: string} | null)?.role ?? '').toLowerCase()
  if (role !== 'convener' && role !== 'convenor') return []

  const {data, error} = await supabase.from('feedback')
                            .select(`
        id,
        issue_code,
        status,
        created_at,
        updated_at,
        rating,
        course:courses(code, name, semester)
      `)
                            .in('status', ['open', 'seen'])
                            .order('updated_at', {ascending: false})

  if (error) {
    console.error('[Pulse] getPendingFeedbacks error:', error)
    return []
  }

  return data ?? []
}

export async function updateFeedbackStatus(formData: FormData) {
  const supabase = await createClient()

  const {data: {session}} = await supabase.auth.getSession()
  if (!session) return

  const {data: profile} = await supabase.from('profiles')
                              .select('role')
                              .eq('id', session.user.id)
                              .single()

  const role = ((profile as {role?: string} | null)?.role ?? '').toLowerCase()
  if (role !== 'convener' && role !== 'convenor') return

  const feedbackId = (formData.get('feedback_id') as string) ?? ''
  const nextStatus = (formData.get('status') as IssueStatus) ?? 'open'

  if (!feedbackId || !STATUS_OPTIONS.includes(nextStatus)) return

  const {error} = await supabase.from('feedback')
                            .update({status: nextStatus, updated_at: new Date().toISOString()})
                            .eq('id', feedbackId)

  if (error) {
    console.error('[Pulse] updateFeedbackStatus error:', error)
    return
  }

  revalidatePath('/pulse/pending')
}