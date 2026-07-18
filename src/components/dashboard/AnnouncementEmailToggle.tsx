'use client'

import { useState, useTransition } from 'react'
import { Mail } from 'lucide-react'
import { updateDigestOptOut } from '@/app/dashboard/actions'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface AnnouncementEmailToggleProps {
  digestOptOut: boolean
}

export function AnnouncementEmailToggle({ digestOptOut }: AnnouncementEmailToggleProps) {
  const [receiveEmail, setReceiveEmail] = useState(!digestOptOut)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleChange(checked: boolean) {
    setReceiveEmail(checked)
    setError(null)

    startTransition(async () => {
      const result = await updateDigestOptOut(!checked)
      if (!result.ok) {
        setReceiveEmail(!checked)
        setError(result.message ?? 'Could not save preference.')
      }
    })
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2.5">
        <input
          id="announcement-email-toggle"
          type="checkbox"
          checked={receiveEmail}
          disabled={isPending}
          onChange={(e) => handleChange(e.target.checked)}
          className={cn(
            'h-4 w-4 rounded border-slate-300 text-blue-600',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        />
        <Label
          htmlFor="announcement-email-toggle"
          className="flex items-center gap-1.5 text-xs font-normal text-slate-600 cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5 text-slate-400" />
          Email me daily announcements
        </Label>
      </div>
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  )
}
