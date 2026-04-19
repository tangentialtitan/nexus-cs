'use client'

import { useActionState } from 'react'
import { postIssueMessage } from '@/app/issues/actions'
import type { MessageFormState } from '@/app/issues/actions'
import type { Tables } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Loader2, Send } from 'lucide-react'

type MessageRow = Pick<Tables<'issue_messages'>, 'id' | 'sender_type' | 'message' | 'created_at'>

type IssueThreadProps = {
  issueCode: string
  messages: MessageRow[]
}

const initialState: MessageFormState = { status: 'idle' }

export function IssueThread({ issueCode, messages }: IssueThreadProps) {
  const [state, formAction, isPending] = useActionState(postIssueMessage, initialState)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            No messages yet. Start the conversation here.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-xl border px-4 py-3 ${
                message.sender_type === 'convener'
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
                  {message.sender_type === 'convener' ? 'Convenor Reply' : 'Anonymous Message'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {new Date(message.created_at).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
              <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{message.message}</p>
            </div>
          ))
        )}
      </div>

      <form action={formAction} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
        <input type="hidden" name="issue_code" value={issueCode} />
        <Textarea
          name="message"
          rows={4}
          maxLength={1000}
          placeholder="Write your anonymous message..."
          className="resize-none"
        />

        {state.status === 'error' && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-xs text-red-600">{state.message}</p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
