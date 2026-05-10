const steps = [
  {
    number: "01",
    title: "Apply online",
    duration: "5 minutes",
    body: "Fill out your specialty, license number, and the patient types you work with. No lengthy forms.",
  },
  {
    number: "02",
    title: "We verify you",
    duration: "24–48 hours",
    body: "Our team reviews your credentials and confirms your license. You'll hear back within two business days.",
  },
  {
    number: "03",
    title: "Onboarding call",
    duration: "30 min call",
    body: "A ReVerie specialist walks you through the platform, dashboard, and your first patient setup.",
  },
  {
    number: "04",
    title: "First session",
    duration: "You're live",
    body: "Start running supervised VR sessions. Your dashboard activates. Referrals begin flowing your way.",
  },
];

export function HowToJoin() {
  return (
    <section id="how-to-join" className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="text-center flex flex-col gap-3">
          <span className="text-[#2B4FD4] text-sm font-semibold uppercase tracking-widest">
            How it works
          </span>
          <h2 className="text-4xl font-bold text-[#0A0F1E]">
            From application to first session
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="grid md:grid-cols-4 gap-0">
            {steps.map((step, i) => (
              <div key={step.number} className="relative flex flex-col items-center md:items-start">
                {/* Horizontal divider line between steps */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+2rem)] right-0 h-px bg-[#2B4FD4]/20 z-0" />
                )}

                <div className="relative z-10 flex flex-col items-center md:items-start gap-4 p-6 text-center md:text-left">
                  {/* Numbered circle */}
                  <div className="w-12 h-12 rounded-full bg-[#2B4FD4] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{step.number}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[#2B4FD4] text-xs font-semibold uppercase tracking-wider">
                      {step.duration}
                    </span>
                    <h3 className="text-[#0A0F1E] font-semibold text-lg">{step.title}</h3>
                    <p className="text-[#0A0F1E]/60 text-sm leading-relaxed">{step.body}</p>
                  </div>
                </div>

                {/* Mobile vertical divider */}
                {i < steps.length - 1 && (
                  <div className="md:hidden w-px h-8 bg-[#2B4FD4]/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
