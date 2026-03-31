'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type SeniorFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function getSeniors() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}

export async function addSenior(
  _prevState: SeniorFormState,
  formData: FormData
): Promise<SeniorFormState> {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { status: 'error', message: 'You must be signed in.' }

  const { error } = await supabase.from('opportunities').insert({
    senior_name:  formData.get('senior_name') as string,
    category:     formData.get('category') as string,
    company_name: formData.get('company_name') as string,
    year_joined:  parseInt(formData.get('year_joined') as string),
    department:   formData.get('department') as string,
    contact_info: (formData.get('contact_info') as string) || null,
  } as any)

  if (error) {
    console.error('[Pathfinder] insert error:', error)
    return { status: 'error', message: 'Failed to add. Please try again.' }
  }

  revalidatePath('/pathfinder')
  return { status: 'success', message: 'Senior added successfully!' }
}