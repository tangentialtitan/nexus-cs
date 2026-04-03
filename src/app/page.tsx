import Link from 'next/link'


export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="inline-block bg-blue-50 border border-blue-100 text-blue-600 text-xs font-mono px-3 py-1 rounded-full mb-6">
          IIT Delhi · Computer Science Department
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
          Your batch's<br />
          <span className="text-blue-600">single source of truth</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mb-10">
          Resources, feedback, and senior contacts — all in one place, built by Jay Shah, maintained by Abhinav P J.
        </p>
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-xl text-sm transition-colors"
        >
          Get started →
        </Link>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
        {[
          {
            icon: '📚',
            title: 'Resource Vault',
            desc: 'PYQs, lecture notes, lab manuals — organised by semester and course.',
          },
          {
            icon: '📊',
            title: 'The Pulse',
            desc: 'Submit anonymous feedback for your courses every week.',
          },
          {
            icon: '🧭',
            title: 'Pathfinder',
            desc: 'Connect with seniors placed in Consult, Finance, Tech, Core and more.',
          },
        ].map((f) => (
          <div key={f.title} className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="text-2xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
            <p className="text-sm text-slate-500">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 font-mono">
        Nexus · IIT Delhi CS Department · Built by the batch, for the batch
      </div>

    </main>
  )
}