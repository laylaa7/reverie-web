const pillars = [
  {
    number: "01",
    audience: "For patients and caregivers",
    headline: "A second chance at memory.",
    body: "Alzheimer's and dementia steal moments. ReVerie reconstructs them using real photos to generate the places your loved one misses most. Familiar environments reduce agitation and spark genuine recall.",
  },
  {
    number: "02",
    audience: "For everyone",
    headline: "Relive what made you.",
    body: "Not just therapy. ReVerie lets anyone revisit their most cherished memories in full immersive VR. Your grandmother's kitchen. Your childhood street. The places that made you who you are.",
  },
  {
    number: "03",
    audience: "We're first",
    headline: "Nothing like this exists. Yet.",
    body: "We searched. There is no VR memory therapy platform in the region, or anywhere built the way we built it. ReVerie is a clinical tool, a memory machine, and a new kind of care.",
  },
];

export function WhyReVerie() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-14">

        {/* Header */}
        <div className="flex flex-col gap-3 max-w-xl">
          <span className="text-[#2B4FD4] text-sm font-semibold uppercase tracking-widest">
            Why ReVerie
          </span>
          <h2 className="text-4xl font-bold text-[#0A0F1E] leading-tight">
            Built for patients. For families. For anyone.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div
              key={p.number}
              className="relative flex flex-col gap-5 p-7 rounded-2xl border border-[#e8edf5] bg-[#fafbff] hover:border-[#2B4FD4]/30 hover:shadow-sm transition-all duration-300"
            >
              {/* Top accent line */}
              <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[#2B4FD4]/40 to-transparent" />

              <div className="flex flex-col gap-1">
                <span className="text-[#2B4FD4]/40 text-xs font-bold tracking-widest">{p.number}</span>
                <span className="text-[#0A0F1E]/40 text-xs font-medium uppercase tracking-wider">
                  {p.audience}
                </span>
              </div>

              <h3 className="text-[#0A0F1E] font-bold text-xl leading-snug">{p.headline}</h3>

              <p className="text-[#0A0F1E]/55 text-base leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
