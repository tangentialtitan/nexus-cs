'use client'

import { useActionState, useRef, useState } from 'react'
import { submitFeedback } from '@/app/pulse/actions'
import type { FeedbackFormState } from '@/app/pulse/actions'
import type { Tables } from '@/types/database'

type CourseOption = Pick<Tables<'courses'>, 'id' | 'code' | 'name' | 'semester'>

import { Button }   from '@/components/ui/button'
import { Label }    from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge }    from '@/components/ui/badge'
import { cn }       from '@/lib/utils'
import { ShieldCheck, Send, Star, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

interface FeedbackFormProps {
  courses: CourseOption[]
}

function StarRating({
  value,
  onChange,
  name,
}: {
  value: number
  onChange: (n: number) => void
  name: string
}) {
  const [hovered, setHovered] = useState(0)
  const labels: Record<number, string> = {
    1: 'Very Poor', 2: 'Poor', 3: 'Average', 4: 'Good', 5: 'Excellent',
  }

  return (
    <div className="space-y-1.5">
      <input type="hidden" name={name} value={value} />
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
            aria-label={`Rate ${n} out of 5`}
            className="p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Star
              className={cn(
                'w-7 h-7 transition-all duration-100',
                n <= (hovered || value)
                  ? 'fill-amber-400 text-amber-400 scale-110'
                  : 'text-slate-200 fill-slate-200'
              )}
            />
          </button>
        ))}
        {(hovered || value) > 0 && (
          <span className="ml-2 text-sm font-medium text-blue-600 animate-in fade-in duration-100">
            {labels[hovered || value]}
          </span>
        )}
      </div>
    </div>
  )
}

function SSCField({
  type, value, onChange,
}: {
  type: 'stop' | 'start' | 'continue'
  value: string
  onChange: (v: string) => void
}) {
  const config = {
    stop: {
      label: 'Stop',
      border: 'border-l-red-300',
      bg: 'bg-red-50',
      badge: 'bg-red-100 text-red-700 border-red-200',
      placeholder: "What's not working? e.g. 'Reading slides verbatim'",
      name: 'stop_feedback',
    },
    start: {
      label: 'Start',
      border: 'border-l-emerald-300',
      bg: 'bg-emerald-50',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      placeholder: "What's missing? e.g. 'More numerical problems'",
      name: 'start_feedback',
    },
    continue: {
      label: 'Continue',
      border: 'border-l-blue-300',
      bg: 'bg-blue-50',
      badge: 'bg-blue-100 text-blue-700 border-blue-200',
      placeholder: "What's working? e.g. 'Weekly quizzes, clear notes'",
      name: 'continue_feedback',
    },
  }
  const c = config[type]

  return (
    <div className={cn('pl-4 border-l-2 rounded-r-lg p-3 space-y-2', c.border, c.bg)}>
      <span className={cn('inline-flex px-2 py-0.5 rounded-full text-xs font-mono font-semibold border', c.badge)}>
        {c.label.toUpperCase()}
      </span>
      <Textarea
        name={c.name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={c.placeholder}
        rows={2}
        className="resize-none bg-white text-sm border-slate-200 focus-visible:ring-blue-500/30"
      />
    </div>
  )
}

const initialState: FeedbackFormState = { status: 'idle' }

export function FeedbackForm({ courses }: FeedbackFormProps) {
  const [state, formAction, isPending] = useActionState(submitFeedback, initialState)

  const [courseId, setCourseId] = useState('')
  const [rating, setRating]     = useState(0)
  const [stop, setStop]         = useState('')
  const [start, setStart]       = useState('')
  const [cont, setCont]         = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const isValid = !!courseId && rating > 0

  const bySemester = courses.reduce<Record<number, CourseOption[]>>((acc, c) => {
    ;(acc[c.semester] ??= []).push(c)
    return acc
  }, {})

  if (state.status === 'success') {
    return (
      <Card className="border-slate-200">
        <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Submitted!</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">
              Your anonymous response has been recorded and will be reviewed by the Class Convener.
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs border-emerald-200 text-emerald-600">
            <ShieldCheck className="w-3 h-3 mr-1" />
            No identity stored
          </Badge>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-blue-600 underline underline-offset-2 mt-2"
          >
            Submit another
          </button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Submit Feedback</CardTitle>
          <Badge variant="outline" className="font-mono text-[10px] border-blue-200 text-blue-600">
            <ShieldCheck className="w-3 h-3 mr-1" />Anonymous
          </Badge>
        </div>
        <CardDescription>
          Your identity is never stored. Help make every course better.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} ref={formRef} className="space-y-6">

          <input type="hidden" name="course_id" value={courseId} />

          <div className="space-y-2">
            <Label className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Course <span className="text-red-400">*</span>
            </Label>
            <Select value={courseId} onValueChange={setCourseId} name="course_id">
              <SelectTrigger className="border-slate-200 focus:ring-blue-500/30">
                <SelectValue placeholder="Select a course…" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {Object.entries(bySemester)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([sem, list]) => (
                    <div key={sem}>
                      <p className="px-2 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        Semester {sem}
                      </p>
                      {list.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <span className="font-mono text-blue-600 mr-2">{c.code}</span>
                          <span className="text-sm">{c.name}</span>
                        </SelectItem>
                      ))}
                    </div>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Overall Rating <span className="text-red-400">*</span>
            </Label>
            <StarRating value={rating} onChange={setRating} name="rating" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Structured Feedback
              </Label>
              <span className="text-[10px] text-slate-400">Optional</span>
            </div>
            <div className="space-y-3">
              <SSCField type="stop"     value={stop}  onChange={setStop}  />
              <SSCField type="start"    value={start} onChange={setStart} />
              <SSCField type="continue" value={cont}  onChange={setCont}  />
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-sky-50 border border-sky-100">
            <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <p className="text-xs text-sky-700 leading-relaxed">
              <strong className="text-sky-900">Privacy guarantee:</strong> No user ID, roll number,
              or IP address is linked to this submission.
            </p>
          </div>

          {state.status === 'error' && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-xs text-red-600">{state.message}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={!isValid || isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-40"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Anonymously
              </>
            )}
          </Button>

          {!isValid && (
            <p className="text-center text-xs text-slate-400">
              {!courseId ? 'Select a course to continue' : 'A rating is required'}
            </p>
          )}

        </form>
      </CardContent>
    </Card>
  )
}