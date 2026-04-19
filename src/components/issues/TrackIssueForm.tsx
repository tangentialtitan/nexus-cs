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

export function TrackIssueForm() {
  const router = useRouter()
  const [issueCode, setIssueCode] = useState('')

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const normalizedCode = normalizeIssueCode(issueCode)
        if (!normalizedCode) return
        router.push(`/issues/${normalizedCode}`)
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="issue-code" className="text-xs font-mono uppercase tracking-widest text-slate-400">
          Issue ID
        </Label>
        <Input
          id="issue-code"
          value={issueCode}
          onChange={(event) => setIssueCode(event.target.value)}
          placeholder="e.g. NX-7K3P9M"
          autoComplete="off"
          className="font-mono"
        />
      </div>

      <Button type="submit" className="w-full" disabled={!issueCode.trim()}>
        <Search className="w-4 h-4 mr-2" />
        Track Issue
      </Button>
    </form>
  )
}
