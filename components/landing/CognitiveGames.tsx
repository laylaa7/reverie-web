"use client";

const pills = [
  "Daily check-in",
  "Cognitive mini-games",
  "Progress tracking",
  "Doctor-reviewed scores",
];

const activities = [
  {
    title: "Name Recognition",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    color: "#C084FC",
    bg: "rgba(192,132,252,0.12)",
  },
  {
    title: "Memory Recall",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </svg>
    ),
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.12)",
  },
  {
    title: "Visual Patterns",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    color: "#34D399",
    bg: "rgba(52,211,153,0.12)",
  },
];

export function CognitiveGames() {
  return (
    <section className="games-section" style={{ background: "var(--rv-offwhite)", padding: "100px 80px" }}>
      <style>{`
        @media (max-width: 767px) {
          .games-section { padding: 60px 24px !important; }
          .games-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .games-iphone { max-width: 280px !important; margin: 0 auto !important; }
        }
      `}</style>
      <div className="games-grid grid md:grid-cols-2" style={{ gap: "80px", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "11px",
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "2px",
                color: "rgba(0,0,0,0.3)",
              }}
            >
              Cognitive games & daily check-in
            </span>
            <h2
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 700,
                fontSize: "40px",
                color: "#080B14",
                margin: 0,
              }}
            >
              Games that strengthen the mind.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 300,
                fontSize: "15px",
                color: "rgba(0,0,0,0.55)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Between appointments, ReVerie keeps patients engaged with science-backed
              cognitive games designed to slow decline — name recognition, memory recall,
              visual pattern exercises.
            </p>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 300,
                fontSize: "15px",
                color: "rgba(0,0,0,0.55)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Every day, patients complete a quick check-in. Doctors see the
              trend. Families get peace of mind.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {pills.map((p) => (
              <span
                key={p}
                style={{
                  padding: "6px 14px",
                  borderRadius: "100px",
                  background: "rgba(0,0,0,0.05)",
                  border: "0.5px solid rgba(0,0,0,0.1)",
                  color: "rgba(0,0,0,0.5)",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "12px",
                  fontWeight: 400,
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* iPhone widget */}
        <div className="games-iphone" style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "260px",
              background: "#0a0a0a",
              borderRadius: "52px",
              padding: "10px",
              boxShadow: "0 40px 80px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.08)",
              position: "relative",
            }}
          >
            {/* Screen */}
            <div
              style={{
                background: "#080B14",
                borderRadius: "44px",
                overflow: "hidden",
              }}
            >
              {/* Dynamic island */}
              <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px" }}>
                <div
                  style={{
                    width: "96px",
                    height: "30px",
                    background: "#0a0a0a",
                    borderRadius: "20px",
                  }}
                />
              </div>

              <div style={{ padding: "12px 20px 28px" }}>
                {/* Status bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                  <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px", fontWeight: 600, color: "white" }}>9:41</span>
                  <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
                      <rect x="0" y="5.5" width="2.5" height="5.5" rx="0.5" opacity="0.4" />
                      <rect x="3.5" y="3.5" width="2.5" height="7.5" rx="0.5" opacity="0.6" />
                      <rect x="7" y="1.5" width="2.5" height="9.5" rx="0.5" opacity="0.8" />
                      <rect x="10.5" y="0" width="2.5" height="11" rx="0.5" />
                    </svg>
                  </div>
                </div>

                {/* App header */}
                <div style={{ marginBottom: "14px" }}>
                  <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 3px 0" }}>
                    Good morning
                  </p>
                  <h4 style={{ fontFamily: "var(--font-dm-sans)", fontSize: "17px", fontWeight: 600, color: "white", margin: 0 }}>
                    Daily Check-in
                  </h4>
                </div>

                {/* Streak */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "100px", background: "rgba(252,211,77,0.12)", border: "0.5px solid rgba(252,211,77,0.2)", marginBottom: "16px" }}>
                  <span style={{ fontSize: "11px" }}>✦</span>
                  <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "10px", color: "#FCD34D", fontWeight: 500 }}>7-day streak</span>
                </div>

                {/* Score comparison */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 12px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.06)", marginBottom: "14px" }}>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(255,255,255,0.3)", margin: "0 0 3px 0" }}>Last week</p>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "22px", fontWeight: 500, color: "rgba(255,255,255,0.35)", margin: 0 }}>6</p>
                  </div>
                  <span style={{ color: "#34D399", fontSize: "14px" }}>→</span>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.5px", color: "rgba(255,255,255,0.3)", margin: "0 0 3px 0" }}>This week</p>
                    <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "22px", fontWeight: 500, color: "#34D399", margin: 0 }}>8</p>
                  </div>
                  <span style={{ padding: "2px 7px", borderRadius: "100px", background: "rgba(52,211,153,0.15)", color: "#34D399", fontSize: "9px", fontFamily: "var(--font-dm-sans)" }}>+2</span>
                </div>

                <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.25)", margin: "0 0 10px 0" }}>
                  Today&apos;s activities
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                  {activities.map((a) => (
                    <div
                      key={a.title}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.02)",
                        border: "0.5px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "8px",
                          background: a.bg,
                          color: a.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {a.icon}
                      </div>
                      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.7)" }}>
                        {a.title}
                      </span>
                      <svg style={{ marginLeft: "auto", color: "rgba(255,255,255,0.2)" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Home bar */}
              <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 16px" }}>
                <div style={{ width: "100px", height: "4px", borderRadius: "100px", background: "rgba(255,255,255,0.2)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
