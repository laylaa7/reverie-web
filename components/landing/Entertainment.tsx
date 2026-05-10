"use client";

const scenes = [
  {
    title: "Under northern skies",
    caption: "Where silence felt alive.",
    image: "/Foreveryone/IMG_7345.JPG",
  },
  {
    title: "The places that changed me",
    caption: "Some moments stay forever.",
    image: "/Foreveryone/IMG_7346.JPG",
  },
  {
    title: "Above the clouds",
    caption: "Cold air, clear minds",
    image: "/Foreveryone/IMG_7347.JPG",
  },
];

export function Entertainment() {
  return (
    <section id="entertainment" className="entertainment-section" style={{ background: "var(--rv-navy)", padding: "100px 80px" }}>
      <style>{`
        @media (max-width: 767px) {
          .entertainment-section { padding: 60px 24px !important; }
          .entertainment-cta { margin-top: 48px !important; }
        }
      `}</style>
      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "11px",
          fontWeight: 400,
          textTransform: "uppercase",
          letterSpacing: "2px",
          color: "rgba(255,255,255,0.2)",
          margin: "0 0 16px 0",
        }}
      >
        For everyone
      </p>
      <h2
        style={{
          fontFamily: "var(--font-playfair)",
          fontWeight: 700,
          fontSize: "40px",
          color: "white",
          margin: "0 0 16px 0",
        }}
      >
        Not just therapy.
      </h2>
      <p
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontWeight: 300,
          fontSize: "16px",
          color: "rgba(255,255,255,0.4)",
          maxWidth: "480px",
          margin: "0 0 56px 0",
          lineHeight: 1.6,
        }}
      >
        Anyone can relive the places that made them. Upload a photo. Enter the world.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "16px" }}>
        {scenes.map((scene) => (
          <div
            key={scene.title}
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              aspectRatio: "3/4",
              position: "relative",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img
              src={scene.image}
              alt={scene.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "20px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "white",
                  margin: "0 0 6px 0",
                }}
              >
                {scene.title}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 300,
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                  margin: 0,
                }}
              >
                {scene.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="entertainment-cta" style={{ marginTop: "80px", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontSize: "clamp(20px, 2.5vw, 28px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.5)",
            margin: "0 0 40px",
            lineHeight: 1.5,
          }}
        >
          "Your memories, your world. Enter whenever you&apos;re ready."
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#fff",
              color: "#080B14",
              textDecoration: "none",
              borderRadius: "10px",
              padding: "10px 18px",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div>
              <div style={{ fontSize: "9px", fontFamily: "var(--font-dm-sans)", fontWeight: 400, letterSpacing: "0.5px", opacity: 0.55 }}>Download on the</div>
              <div style={{ fontSize: "14px", fontFamily: "var(--font-dm-sans)", fontWeight: 600, lineHeight: 1.1 }}>App Store</div>
            </div>
          </a>
          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#fff",
              color: "#080B14",
              textDecoration: "none",
              borderRadius: "10px",
              padding: "10px 18px",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.18 23.76c.37.21.8.22 1.19.04L16.72 12 4.37.2C3.98.02 3.55.03 3.18.24 2.46.67 2 1.44 2 2.28v19.44c0 .84.46 1.61 1.18 2.04zm7.64-11.76-7.4 7.4 9.8-5.65-2.4-1.75zm0-2.24 2.4-1.75-9.8-5.65 7.4 7.4zm3.58 2.24-2.97 1.71 2.97 1.71 3.39-1.96c.6-.35.6-.91 0-1.25l-3.39-1.96z" />
            </svg>
            <div>
              <div style={{ fontSize: "9px", fontFamily: "var(--font-dm-sans)", fontWeight: 400, letterSpacing: "0.5px", opacity: 0.55 }}>Get it on</div>
              <div style={{ fontSize: "14px", fontFamily: "var(--font-dm-sans)", fontWeight: 600, lineHeight: 1.1 }}>Google Play</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
