export function DashboardPreview() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">

        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center max-w-xl">
          <span className="text-[#2B4FD4] text-sm font-semibold uppercase tracking-widest">
            The app
          </span>
          <h2 className="text-4xl font-bold text-[#0A0F1E] leading-tight">
            Everything you need, in your pocket.
          </h2>
          <p className="text-[#0A0F1E]/50 text-base leading-relaxed">
            Sessions, assessments, and progress — all in one place for patients, caregivers, and doctors.
          </p>
        </div>

        {/* Phone frame — centered */}
        <div className="relative">
          {/* Soft blue glow */}
          <div
            className="absolute inset-0 rounded-[44px] pointer-events-none"
            style={{ boxShadow: "0 20px 80px 10px rgba(43, 79, 212, 0.12)" }}
          />

          {/* Phone */}
          <div
            className="relative w-[290px] rounded-[44px] border border-[#e2e8f0] bg-[#f8faff] overflow-hidden"
            style={{ boxShadow: "0 4px 32px rgba(10,15,30,0.10), 0 1px 3px rgba(10,15,30,0.08)" }}
          >
            {/* Notch */}
            <div className="flex justify-center pt-3.5 pb-2 bg-[#f8faff]">
              <div className="w-24 h-6 rounded-full bg-[#0A0F1E] flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="w-4 h-1.5 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Screen */}
            <div className="px-4 pb-2">
              {/* Greeting */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[#0A0F1E]/35 text-[10px] uppercase tracking-widest">Good morning</p>
                  <p className="text-[#0A0F1E] font-semibold text-base">Mohamed</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-[#e2e8f0] shadow-sm flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
              </div>

              {/* MMSE score card */}
              <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 mb-3 shadow-sm">
                <p className="text-[#0A0F1E]/35 text-[10px] uppercase tracking-wider mb-3">Assessment score</p>
                <div className="flex items-center gap-4">
                  {/* SVG ring */}
                  <div className="relative flex-shrink-0">
                    <svg width="64" height="64" viewBox="0 0 64 64" aria-label="MMSE score 24 out of 30">
                      <circle cx="32" cy="32" r="26" fill="none" stroke="#e8edf5" strokeWidth="5" />
                      <circle
                        cx="32" cy="32" r="26"
                        fill="none"
                        stroke="#2B4FD4"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray="108.9 163.4"
                        transform="rotate(-90 32 32)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[#0A0F1E] font-bold text-base leading-none">24</span>
                      <span className="text-[#0A0F1E]/30 text-[9px] leading-none">/30</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100 text-[11px] font-semibold self-start">
                      Good
                    </span>
                    <p className="text-[#0A0F1E]/40 text-[11px] leading-tight">MMSE — every 6 months</p>
                    <p className="text-[#2B4FD4] text-[11px] font-medium">Next: in 4 months</p>
                  </div>
                </div>
              </div>

              {/* Next session */}
              <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 mb-3 shadow-sm">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-[#0A0F1E]/35 text-[10px] uppercase tracking-wider">Next session</p>
                  <span className="px-1.5 py-0.5 rounded bg-[#2B4FD4]/10 text-[#2B4FD4] text-[10px] font-medium">Scheduled</span>
                </div>
                <p className="text-[#0A0F1E] font-semibold text-sm mt-2">Dr. Amer</p>
                <p className="text-[#0A0F1E]/40 text-[11px] mt-0.5">Tomorrow · 10:00 AM</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2B4FD4]" />
                  <span className="text-[#0A0F1E]/40 text-[11px]">Garden scene</span>
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {["Check-in", "My Worlds", "History"].map((label) => (
                  <button
                    key={label}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-[#e2e8f0] bg-white shadow-sm hover:border-[#2B4FD4]/40 transition-colors"
                  >
                    <span className="text-[#2B4FD4] text-sm font-semibold">·</span>
                    <span className="text-[#0A0F1E]/50 text-[10px] font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Home bar */}
            <div className="flex justify-center pb-4 bg-[#f8faff]">
              <div className="w-28 h-1 rounded-full bg-[#0A0F1E]/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
