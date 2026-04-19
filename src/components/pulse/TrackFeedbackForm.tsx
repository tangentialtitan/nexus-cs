'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'

function normalizeIssueCode(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, '')
}

export function TrackFeedbackForm() {
  const router = useRouter()
  const [issueCode, setIssueCode] = useState('')

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const normalized = normalizeIssueCode(issueCode)
        if (!normalized) return
        router.push(`/pulse/${normalized}`)
      }}
      className="space-y-3"
    >
      <div className="space-y-2">
        <Label htmlFor="pulse-issue-code" className="text-xs font-mono uppercase tracking-widest text-slate-400">
          Issue ID
        </Label>
        <Input
          id="pulse-issue-code"
          value={issueCode}
          onChange={(event) => setIssueCode(event.target.value)}
          placeholder="e.g. NX-7K3P9M"
          autoComplete="off"
          className="font-mono"
        />
      </div>

      <Button type="submit" className="w-full" disabled={!issueCode.trim()}>
        <Search className="w-4 h-4 mr-2" />
        Track Feedback Issue
      </Button>
    </form>
  )
}
