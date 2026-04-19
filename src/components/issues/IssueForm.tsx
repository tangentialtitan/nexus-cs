'use client'

import Link from 'next/link'
import { useActionState, useMemo, useState } from 'react'
import { submitIssue } from '@/app/issues/actions'
import type { IssueFormState } from '@/app/issues/actions'
import type { Tables } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, Copy, Loader2, MessageSquare, ShieldCheck, Star } from 'lucide-react'

type CourseOption = Pick<Tables<'courses'>, 'id' | 'code' | 'name' | 'semester'>

type IssueFormProps = {
  courses: CourseOption[]
}

const initialState: IssueFormState = { status: 'idle' }

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
      </div>
    </div>
  )
}

function SSCField({
  type,
  value,
  onChange,
}: {
  type: 'stop' | 'start' | 'continue'
  value: string
  onChange: (value: string) => void
}) {
  const config = {
    stop: {
      label: 'Stop',
      border: 'border-l-red-300',
      bg: 'bg-red-50',
      badge: 'bg-red-100 text-red-700 border-red-200',
      placeholder: "What's not working?",
      name: 'stop_feedback',
    },
    start: {
      label: 'Start',
      border: 'border-l-emerald-300',
      bg: 'bg-emerald-50',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      placeholder: "What should start happening?",
      name: 'start_feedback',
    },
    continue: {
      label: 'Continue',
      border: 'border-l-blue-300',
      bg: 'bg-blue-50',
      badge: 'bg-blue-100 text-blue-700 border-blue-200',
      placeholder: "What should continue?",
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
        onChange={(event) => onChange(event.target.value)}
        placeholder={c.placeholder}
        rows={2}
        className="resize-none bg-white text-sm border-slate-200 focus-visible:ring-blue-500/30"
      />
    </div>
  )
}

export function IssueForm({ courses }: IssueFormProps) {
  const [state, formAction, isPending] = useActionState(submitIssue, initialState)

  const [courseId, setCourseId] = useState('')
  const [rating, setRating] = useState(0)
  const [stop, setStop] = useState('')
  const [start, setStart] = useState('')
  const [cont, setCont] = useState('')

  const groupedCourses = useMemo(() => {
    return courses.reduce<Record<number, CourseOption[]>>((acc, item) => {
      ;(acc[item.semester] ??= []).push(item)
      return acc
    }, {})
  }, [courses])

  const isValid = Boolean(courseId) && rating > 0

  if (state.status === 'success' && state.issueCode) {
    return (
      <Card className="border-slate-200">
        <CardContent className="py-12 flex flex-col items-center gap-5 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-900">Issue Submitted</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md">
              Save this issue code now. You need it later to check status and continue the anonymous chat.
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 w-full max-w-md">
            <p className="text-[10px] font-mono uppercase tracking-widest text-blue-600">Issue ID</p>
            <p className="text-2xl font-mono font-semibold text-blue-700 mt-1">{state.issueCode}</p>
            <p className="text-xs text-blue-700 mt-2">
              Screenshot this code or note it down. We do not link issue IDs to user accounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(state.issueCode as string)
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy ID
            </Button>
            <Button asChild>
              <Link href={`/issues/${state.issueCode}`}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Open Issue Chat
              </Link>
            </Button>
          </div>

          <Badge variant="outline" className="font-mono text-xs border-emerald-200 text-emerald-600">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Anonymous by design
          </Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Submit Issue</CardTitle>
          <Badge variant="outline" className="font-mono text-[10px] border-blue-200 text-blue-600">
            <ShieldCheck className="w-3 h-3 mr-1" />Anonymous
          </Badge>
        </div>
        <CardDescription>
          Submit course feedback as a trackable issue. You will get a unique issue code after submission.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="course_id" value={courseId} />

          <div className="space-y-2">
            <Label className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Course <span className="text-red-400">*</span>
            </Label>
            <Select value={courseId} onValueChange={setCourseId} name="course_id">
              <SelectTrigger className="border-slate-200 focus:ring-blue-500/30">
                <SelectValue placeholder="Select a course..." />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {Object.entries(groupedCourses)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([semester, list]) => (
                    <div key={semester}>
                      <p className="px-2 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        Semester {semester}
                      </p>
                      {list.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          <span className="font-mono text-blue-600 mr-2">{course.code}</span>
                          <span className="text-sm">{course.name}</span>
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
              <SSCField type="stop" value={stop} onChange={setStop} />
              <SSCField type="start" value={start} onChange={setStart} />
              <SSCField type="continue" value={cont} onChange={setCont} />
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-sky-50 border border-sky-100">
            <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <p className="text-xs text-sky-700 leading-relaxed">
              <strong className="text-sky-900">Privacy guarantee:</strong> issue entries are anonymous and are not linked
              to your profile.
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
                Submitting issue...
              </>
            ) : (
              'Submit Issue'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
