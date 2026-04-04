'use server'

import{createClient} from '@/lib/supabase/server'
import{revalidatePath} from 'next/cache'
import type{SeniorInsert} from '@/types/database'

export type SeniorFormState = {
  status: 'idle'|'success'|'error'
  message?: string
}

export async function getSeniors() {
  const supabase = await createClient()

  const {data, error} =
      await supabase.from('seniors').select('*').order('created_at', {
        ascending: false
      })

  if (error) return []
  return data ?? []
}

export async function addSenior(
  _prevState: SeniorFormState,
  formData: FormData
): Promise<SeniorFormState> {
  const supabase = await createClient()

  const {data: {session}} = await supabase.auth.getSession()
  if (!session) return {
    status: 'error', message: 'You must be signed in.'
  }

  const skillsRequired = (formData.get('skills_required') as string)
                             .split(',')
                             .map((skill) => skill.trim())
                             .filter(Boolean)

  const payload: SeniorInsert = {
    type: formData.get('type') as SeniorInsert['type'],
    company_or_uni: formData.get('company_or_uni') as string,
    role_title: formData.get('role_title') as string,
    location: (formData.get('location') as string)?.trim() || null,
    stipend: (formData.get('stipend') as string)?.trim() || null,
    duration: (formData.get('duration') as string)?.trim() || null,
    skills_required: skillsRequired,
    description: (formData.get('description') as string)?.trim() || null,
    application_link:
        (formData.get('application_link') as string)?.trim() || null,
    contact_name: (formData.get('contact_name') as string)?.trim() || null,
    contact_roll: (formData.get('contact_roll') as string)?.trim() || null,
    contact_email: (formData.get('contact_email') as string)?.trim() || null,
    added_by: session.user.id,
  }

  if (!payload.skills_required || payload.skills_required.length === 0) {
    payload.skills_required = ['General']
  }

  const {error} = await supabase.from('seniors').insert(payload)

  if (error) {
    console.error('[Pathfinder] insert error:', error)
    return {
      status: 'error', message: 'Failed to add. Please try again.'
    }
  }

  revalidatePath('/pathfinder')
  return {
    status: 'success', message: 'Senior added successfully!'
  }
}