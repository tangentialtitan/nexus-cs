import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import type { User } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/server'

type ProfileDigestPreference = {
  id: string
  full_name: string | null
  digest_opt_out: boolean | null
}

type AnnouncementDigestItem = {
  id: string
  title: string
  description: string
  author_name: string
  created_at: string
  event_date: string | null
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000
const UPCOMING_DAYS = Number(process.env.DIGEST_UPCOMING_DAYS ?? '3')

function getIstDate(date = new Date()) {
  return new Date(date.getTime() + IST_OFFSET_MS)
}

function formatIstDate(date = new Date()) {
  const istDate = getIstDate(date)
  const year = istDate.getUTCFullYear()
  const month = String(istDate.getUTCMonth() + 1).padStart(2, '0')
  const day = String(istDate.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getIstDayRange(referenceDate = new Date()) {
  const shifted = getIstDate(referenceDate)
  const startShiftedUtc = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
    0,
    0,
    0,
    0
  )

  const startUtcMs = startShiftedUtc - IST_OFFSET_MS
  const endUtcMs = startUtcMs + 24 * 60 * 60 * 1000

  return {
    startIso: new Date(startUtcMs).toISOString(),
    endIso: new Date(endUtcMs).toISOString(),
  }
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

function hasGoogleProvider(user: User) {
  if ((user.app_metadata as { provider?: string } | undefined)?.provider === 'google') {
    return true
  }
  return (user.identities ?? []).some((identity) => identity.provider === 'google')
}

function buildDigestHtml(
  recipientName: string,
  todayAnnouncements: AnnouncementDigestItem[],
  upcomingAnnouncements: AnnouncementDigestItem[],
  upcomingEndDate: string
) {
  const todayItems = todayAnnouncements.length
    ? todayAnnouncements
        .map(
          (item) => `
            <li>
              <strong>${item.title}</strong><br />
              <span>${item.description}</span><br />
              <em>By ${item.author_name}</em>
            </li>
          `
        )
        .join('')
    : '<li>No announcements posted today.</li>'

  const upcomingItems = upcomingAnnouncements.length
    ? upcomingAnnouncements
        .map(
          (item) => `
            <li>
              <strong>${item.title}</strong> — ${item.event_date}<br />
              <span>${item.description}</span>
            </li>
          `
        )
        .join('')
    : '<li>No upcoming dates in this window.</li>'

  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.5;">
      <h2>Nexus Daily Digest</h2>
      <p>Hi ${recipientName},</p>
      <p>Here is your summary for today.</p>

      <h3>Today\'s announcements</h3>
      <ul>
        ${todayItems}
      </ul>

      <h3>Upcoming dates (through ${upcomingEndDate})</h3>
      <ul>
        ${upcomingItems}
      </ul>

      <p>Have a great evening.</p>
    </div>
  `.trim()
}

function buildDigestText(
  recipientName: string,
  todayAnnouncements: AnnouncementDigestItem[],
  upcomingAnnouncements: AnnouncementDigestItem[],
  upcomingEndDate: string
) {
  const todayItems = todayAnnouncements.length
    ? todayAnnouncements
        .map(
          (item, index) => `${index + 1}. ${item.title} — ${item.description} (By ${item.author_name})`
        )
        .join('\n')
    : 'No announcements posted today.'

  const upcomingItems = upcomingAnnouncements.length
    ? upcomingAnnouncements
        .map(
          (item, index) => `${index + 1}. ${item.title} — ${item.event_date} — ${item.description}`
        )
        .join('\n')
    : 'No upcoming dates in this window.'

  return [
    'Nexus Daily Digest',
    `Hi ${recipientName},`,
    '',
    "Today's announcements:",
    todayItems,
    '',
    `Upcoming dates (through ${upcomingEndDate}):`,
    upcomingItems,
    '',
    'Have a great evening.',
  ].join('\n')
}

async function listAllUsers(adminClient: Awaited<ReturnType<typeof createAdminClient>>) {
  const users: User[] = []
  let page = 1
  const perPage = 1000

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage })
    if (error) {
      throw error
    }
    users.push(...data.users)
    if (data.users.length < perPage) {
      break
    }
    page += 1
  }

  return users
}

async function fetchDigestPreferences(
  adminClient: Awaited<ReturnType<typeof createAdminClient>>,
  userIds: string[]
) {
  if (!userIds.length) {
    return new Map<string, ProfileDigestPreference>()
  }

  const preferenceMap = new Map<string, ProfileDigestPreference>()
  const chunkSize = 500

  for (let i = 0; i < userIds.length; i += chunkSize) {
    const chunk = userIds.slice(i, i + chunkSize)
    const { data, error } = await adminClient
      .from('profiles')
      .select('id, full_name, digest_opt_out')
      .in('id', chunk)

    if (error) {
      throw error
    }

    for (const profile of data as ProfileDigestPreference[]) {
      preferenceMap.set(profile.id, profile)
    }
  }

  return preferenceMap
}

export async function GET(request: Request) {
  const smtpUser = process.env.GMAIL_SMTP_USER
  const smtpPass = process.env.GMAIL_SMTP_PASS
  const fromAddress = process.env.GMAIL_FROM

  if (!smtpUser || !smtpPass || !fromAddress) {
    return NextResponse.json(
      { error: 'Missing GMAIL_SMTP_USER, GMAIL_SMTP_PASS, or GMAIL_FROM.' },
      { status: 500 }
    )
  }

  const url = new URL(request.url)
  const testEmail = url.searchParams.get('testEmail')
  const secret = url.searchParams.get('secret')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && cronSecret !== secret) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const adminClient = await createAdminClient()
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })

  const { startIso, endIso } = getIstDayRange()
  const istNow = getIstDate()
  const upcomingStartDate = formatIstDate(addDays(istNow, 1))
  const upcomingEndDate = formatIstDate(addDays(istNow, UPCOMING_DAYS))

  const [{ data: todayAnnouncements, error: todayError }, { data: upcomingAnnouncements, error: upcomingError }] =
    await Promise.all([
      adminClient
        .from('announcements')
        .select('id, title, description, author_name, created_at, event_date')
        .gte('created_at', startIso)
        .lt('created_at', endIso)
        .order('created_at', { ascending: true }),
      adminClient
        .from('announcements')
        .select('id, title, description, author_name, created_at, event_date')
        .not('event_date', 'is', null)
        .gte('event_date', upcomingStartDate)
        .lte('event_date', upcomingEndDate)
        .order('event_date', { ascending: true }),
    ])

  if (todayError || upcomingError) {
    return NextResponse.json(
      { error: todayError?.message ?? upcomingError?.message },
      { status: 500 }
    )
  }

  const digestToday = (todayAnnouncements ?? []) as AnnouncementDigestItem[]
  const digestUpcoming = (upcomingAnnouncements ?? []) as AnnouncementDigestItem[]

  if (testEmail) {
    const html = buildDigestHtml('there', digestToday, digestUpcoming, upcomingEndDate)
    const text = buildDigestText('there', digestToday, digestUpcoming, upcomingEndDate)

    try {
      await transporter.sendMail({
        from: fromAddress,
        to: testEmail,
        subject: 'Nexus Daily Digest (Test)',
        html,
        text,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send test email.'
      return NextResponse.json({ error: message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, mode: 'test', sentTo: testEmail })
  }

  const users = await listAllUsers(adminClient)
  const googleUsers = users.filter((user) => user.email && hasGoogleProvider(user))
  const preferenceMap = await fetchDigestPreferences(
    adminClient,
    googleUsers.map((user) => user.id)
  )

  let sent = 0
  let skipped = 0

  for (const user of googleUsers) {
    const profile = preferenceMap.get(user.id)
    if (profile?.digest_opt_out) {
      skipped += 1
      continue
    }

    const recipientName = profile?.full_name?.split(' ')[0] ?? 'there'
    const html = buildDigestHtml(recipientName, digestToday, digestUpcoming, upcomingEndDate)
    const text = buildDigestText(recipientName, digestToday, digestUpcoming, upcomingEndDate)

    try {
      await transporter.sendMail({
        from: fromAddress,
        to: user.email as string,
        subject: 'Nexus Daily Digest',
        html,
        text,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send email.'
      return NextResponse.json({ error: message, user: user.email }, { status: 500 })
    }

    sent += 1
  }

  return NextResponse.json({
    ok: true,
    sent,
    skipped,
    todayCount: digestToday.length,
    upcomingCount: digestUpcoming.length,
  })
}

export const runtime = 'nodejs'
