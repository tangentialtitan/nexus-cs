'use client'

import { Navbar } from '@/components/layout/Navbar'

const ACADEMICS = [
  {
    sem: 4,
    courses: [
      { code: 'APL103', name: 'Mechanics of Solids', link: '' },
      { code: 'APL109', name: 'Dynamics', link: '' },
      { code: 'APL206', name: 'Fluid Mechanics', link: '' },
      { code: 'COL106', name: 'Data Structures', link: '' },
      { code: 'CVL100', name: 'Civil Engineering', link: '' },
      { code: 'ELL201', name: 'Electrical Engineering', link: '' },
    ]
  }
]

const INTERN_RESOURCES = [
  {
    code: 'PrepCatalyst',
    name: 'OCS Internship Resources',
    link: '',
    icon: '💼',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
]

const COURSE_COLORS: Record<string, string> = {
  'APL103': 'bg-blue-50 text-blue-700 border-blue-200',
  'APL109': 'bg-violet-50 text-violet-700 border-violet-200',
  'APL206': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'COL106': 'bg-orange-50 text-orange-700 border-orange-200',
  'CVL100': 'bg-pink-50 text-pink-700 border-pink-200',
  'ELL201': 'bg-yellow-50 text-yellow-700 border-yellow-200',
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
                            <div className="text-2xl mb-3">📁</div>
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