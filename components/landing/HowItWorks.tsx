import OrganicBackground from "@/components/OrganicBackground";

const steps = [
  {
    number: "01",
    title: "Upload a memory",
    desc: "A photo of somewhere that mattered. A kitchen, a garden, a childhood home.",
  },
  {
    number: "02",
    title: "AI builds the world",
    desc: "Our model reconstructs it as a fully immersive VR environment.",
  },
  {
    number: "03",
    title: "Schedule with your doctor",
    desc: "Book a supervised session with a neurologist or psychiatrist on the platform.",
  },
  {
    number: "04",
    title: "Enter the world",
    desc: "Using a Meta Quest headset, guided in real time by your doctor.",
  },
  {
    number: "05",
    title: "Track progress",
    desc: "Cognitive response and engagement logged after every session.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: "var(--rv-offwhite)",
        padding: "100px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <OrganicBackground />

      <div style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "11px",
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "rgba(0,0,0,0.3)",
            margin: "0 0 16px 0",
          }}
        >
          The process
        </p>
        <h2
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 700,
            fontSize: "40px",
            color: "#080B14",
            margin: 0,
          }}
        >
          From a photo to a world.
        </h2>

        <div style={{ marginTop: "48px" }}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "40px",
                padding: "32px 0",
                borderBottom: i < steps.length - 1 ? "0.5px solid rgba(0,0,0,0.08)" : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                  fontSize: "48px",
                  color: "rgba(0,0,0,0.08)",
                  fontWeight: 400,
                  lineHeight: 1,
                  flexShrink: 0,
                  width: "72px",
                }}
              >
                {step.number}
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 500,
                    fontSize: "18px",
                    color: "#080B14",
                    margin: "0 0 8px 0",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontWeight: 300,
                    fontSize: "14px",
                    color: "rgba(0,0,0,0.5)",
                    maxWidth: "480px",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
