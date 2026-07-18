'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateDigestOptOut(
  optOut: boolean
): Promise<{ ok: boolean; message?: string }> {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return { ok: false, message: 'You must be signed in.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      digest_opt_out: optOut,
      updated_at: new Date().toISOString(),
    })
    .eq('id', session.user.id)

  if (error) {
    console.error('[Dashboard] updateDigestOptOut error:', error)
    return { ok: false, message: 'Failed to save email preference.' }
  }

  revalidatePath('/dashboard')
  return { ok: true }
}
