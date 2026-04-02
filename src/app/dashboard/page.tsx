  import { redirect } from 'next/navigation'
  import { createClient } from '@/lib/supabase/server'
  import { Navbar } from '@/components/layout/Navbar'
  import Link from 'next/link'

  export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) redirect('/login')

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', session.user.id)
      .single()

    const [
      // { count: feedbackCount },
      // { count: seniorCount },
      { data: announcements },
    ] = await Promise.all([
      // supabase.from('feedback').select('*', { count: 'exact', head: true }),
      // supabase.from('opportunities').select('*', { count: 'exact', head: true }),
      supabase
    .from('announcements')
    .select('*, courses(code, name)')
    .order('created_at', { ascending: false })
    .limit(10),
    ])

    const firstName = (profile as any)?.full_name?.split(' ')[0] ?? 'Engineer'
    const isConvener = ['convener' ].includes((profile as any)?.role ?? '')
    const isAdmin = ['Admin' ].includes((profile as any)?.role ?? '')

    const QUICK_LINKS = [
      { label: 'MoodleNew',      href: 'https://moodlenew.iitd.ac.in',    icon: '🎓' },
      { label: 'Moodle',         href: 'https://moodle.iitd.ac.in',    icon: '🎓' },
      { label: 'ERP',            href: 'https://eacademics.iitd.ac.in/sportal/logincheck',       icon: '🔧' },
      { label: 'Library',        href: 'https://library.iitd.ac.in',   icon: '📚' },
      { label: 'OCS',            href: 'https://ocs.iitd.ac.in/portal/student',       icon: '💼' },
      { label: 'Webmail',        href: 'https://webmail.iitd.ac.in',   icon: '✉️' },
    ]

    const NAV_FEATURES = [
      {
        icon: '📊',
        title: 'The Pulse',
        desc: 'Submit anonymous course feedback',
        href: '/pulse',
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        hover: 'hover:bg-blue-100',
        text: 'text-blue-600',
      },
      {
        icon: '📚',
        title: 'Vault',
        desc: 'PYQs, notes, lab manuals',
        href: '/vault',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        hover: 'hover:bg-emerald-100',
        text: 'text-emerald-600',
      },
      {
        icon: '🧭',
        title: 'Pathfinder',
        desc: 'Senior contacts across domains',
        href: '/pathfinder',
        bg: 'bg-violet-50',
        border: 'border-violet-100',
        hover: 'hover:bg-violet-100',
        text: 'text-violet-600',
      },
    ]

    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          {/* Welcome */}
          <div className="bg-blue-600 rounded-2xl px-7 py-6 flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-xs font-mono uppercase tracking-widest mb-1">
                Nexus · AM Portal
              </p>
              <h1 className="text-2xl font-bold text-white">
                Hey, {firstName} 👋
              </h1>
              <p className="text-blue-200 text-sm mt-0.5">
                B.Tech · Applied Mechanics · IIT Delhi
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 text-right">
              <span className="text-blue-200 text-xs font-mono">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              {isConvener && (
                <span className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-mono">
                  Class Convener
                </span>
              )}
              {isAdmin && (
                <span className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full font-mono">
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Feature Nav */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {NAV_FEATURES.map((f) => (
              <Link key={f.title} href={f.href}>
                <div className={`${f.bg} ${f.border} ${f.hover} border rounded-2xl p-5 transition-all cursor-pointer flex items-start gap-4`}>
                  <div className="text-3xl">{f.icon}</div>
                  <div>
                    <h3 className={`font-semibold text-sm ${f.text}`}>{f.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — Announcements */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📢</span>
                    <h2 className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      Announcements
                    </h2>
                  </div>
                  {isConvener && (
                    <Link
                      href="/announcements/add"
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      + New
                    </Link>
                  )}
                </div>

                <div className="divide-y divide-slate-50">
                  {announcements && announcements.length > 0 ? (
    announcements.map((a: any) => (
      <div key={a.id} className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {a.courses ? (
                <span className="text-[10px] font-mono bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
                  {a.courses.code}
                </span>
              ) : (
                <span className="text-[10px] font-mono bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded-full">
                  General
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">{a.title}</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{a.body}</p>
          </div>
          <span className="text-[10px] text-slate-300 font-mono flex-shrink-0 mt-0.5">
            {new Date(a.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>
      </div>
    ))) : (
                    <div className="px-5 py-14 text-center">
                      <p className="text-2xl mb-2">📭</p>
                      <p className="text-sm text-slate-400">No announcements yet.</p>
                      {isConvener && (
                        <Link
                          href="/announcements/add"
                          className="text-xs text-blue-600 underline mt-1 inline-block"
                        >
                          Post the first one
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">

              {/* Stats
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: 'Feedback',
                    value: feedbackCount ?? 0,
                    href: '/pulse',
                    color: 'text-blue-600',
                  },
                  {
                    label: 'Seniors',
                    value: seniorCount ?? 0,
                    href: '/pathfinder',
                    color: 'text-violet-600',
                  },
                ].map((s) => (
                  <Link key={s.label} href={s.href}>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-all cursor-pointer text-center">
                      <p className={`text-2xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{s.label}</p>
                    </div>
                  </Link>
                ))}
              </div> */}

              {/* Quick Links */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h2 className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Quick Links
                  </h2>
                </div>
                <div className="p-2">
                  {QUICK_LINKS.map((l) => (
                    <a
                    
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <span className="text-base">{l.icon}</span>
                      <span className="flex-1 font-medium">{l.label}</span>
                      <span className="text-slate-200 text-xs">↗</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Vault Semester Picker */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h2 className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                    Vault — Semester
                  </h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1,2,3,4,5,6,7,8].map((sem) => (
                      <Link key={sem} href={`/vault?sem=${sem}`}>
                        <div className="aspect-square flex items-center justify-center rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-400 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer">
                          {sem}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }