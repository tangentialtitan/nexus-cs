'use client'

import { Navbar } from '@/components/layout/Navbar'

const ACADEMICS = [
  {
    sem: 4,
    courses: [
      { code: 'AK', name: 'Asmit Karmakar', link: 'http://10.17.3.50:8080/' },
      { code: 'CM', name: 'Chinmay Mittal', link: 'https://github.com/ChinmayMittal' },
      { code: 'YA', name: 'Yash Aggarwal', link: 'https://wwwg1-my.sharepoint.com/:f:/g/personal/iitd_wwwg1_onmicrosoft_com/Etf4-KIvGTpOhn5NfhQOywwBeY1p0faOvUxLrLjHuYCFqw?e=fctZPD' },
      { code: 'HA', name: 'Har Ashish Arora', link: 'https://wwwg1-my.sharepoint.com/:f:/g/personal/iitd_wwwg1_onmicrosoft_com/Etf4-KIvGTpOhn5NfhQOywwBeY1p0faOvUxLrLjHuYCFqw?e=fctZPD' },
      { code: 'AR', name: 'Academic Resources', link: 'https://drive.google.com/drive/folders/1wPMQpfA0Iy-r4AW3Foq2mLarRoglPrRS' },
    ]
  }
]

const INTERN_RESOURCES = [
  {
    code: 'Intern Prep',
    name: 'Intern Prep Series',
    link: 'https://github.com/devclub-iitd/Intern-Prep-Series-25/tree/main',
    icon: '💼',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
]

const COURSE_COLORS: Record<string, string> = {
  'AK': 'bg-blue-50 text-blue-700 border-blue-200',
  'CM': 'bg-violet-50 text-violet-700 border-violet-200',
  'YA': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'HA': 'bg-orange-50 text-orange-700 border-orange-200',
  'AR': 'bg-pink-50 text-pink-700 border-pink-200',
}

export default function VaultPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Nexus · Vault</p>
          <h1 className="text-2xl font-semibold text-slate-900">Course <span className="text-blue-600">Resources</span></h1>
          <p className="text-sm text-slate-500 mt-1">PYQs, notes, lab manuals — all in one place.</p>
        </div>
        <div className="space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-base">🎓</span>
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-widest font-mono">Academics</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-8">
              {ACADEMICS.map(function(sem_data) {
                return (
                  <div key={sem_data.sem}>
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Semester {sem_data.sem}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {sem_data.courses.map(function(course) {
                        const color = COURSE_COLORS[course.code] || 'bg-slate-50 text-slate-700 border-slate-200'
                        return (
                          <a key={course.code} href={course.link || '#'} target="_blank" rel="noreferrer" className={'rounded-2xl border p-5 hover:shadow-sm transition-all cursor-pointer ' + color}>
                            <div className="mb-3">
                              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/30 bg-white/70 text-sm font-mono font-semibold">
                                {'</>'}
                              </span>
                            </div>
                            <h3 className="font-bold text-sm">{course.code}</h3>
                            <p className="text-xs mt-0.5 opacity-70">{course.name}</p>
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-base">💼</span>
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-widest font-mono">Intern Resources</h2>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {INTERN_RESOURCES.map(function(resource) {
                return (
                  <a key={resource.code} href={resource.link || '#'} target="_blank" rel="noreferrer" className={'rounded-2xl border p-5 hover:shadow-sm transition-all cursor-pointer ' + resource.color}>
                    <div className="text-2xl mb-3">{resource.icon}</div>
                    <h3 className="font-bold text-sm">{resource.code}</h3>
                    <p className="text-xs mt-0.5 opacity-70">{resource.name}</p>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}