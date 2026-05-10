"use client";

import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [errored, setErrored] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const el = heroRef.current;
        if (!el) return;

        if (window.innerWidth < 768) {
          el.style.transform = "";
          el.style.borderRadius = "";
          return;
        }

        const progress = Math.min(1, window.scrollY / el.offsetHeight);
        el.style.transform = `scale(${1 - progress * 0.03})`;
        el.style.borderRadius = `0 0 ${progress * 24}px ${progress * 24}px`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Mobile layout — single vertical stack, image last
  if (isMobile) {
    return (
      <section
        ref={heroRef}
        id="patients"
        style={{
          background: "var(--rv-black)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ padding: "60px 20px 0", display: "flex", flexDirection: "column" }}>
          {/* Eyebrow */}
          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "8px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            fontWeight: 400,
            margin: "0 0 20px 0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            First in the region · VR Memory Therapy
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(32px, 8vw, 48px)",
            fontWeight: 700,
            lineHeight: 1.05,
            color: "white",
            margin: "0 0 16px 0",
            wordBreak: "break-word",
          }}>
            Give them back
            <br />
            the world they
            <br />
            <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
              remember.
            </em>
          </h1>

          {/* Subline */}
          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "10px",
            letterSpacing: "1.2px",
            color: "rgba(255,255,255,0.2)",
            margin: "0 0 20px 0",
            fontWeight: 300,
          }}>
            Upload a photo · AI builds the world · Enter through VR
          </p>

          {/* Body */}
          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: "14px",
            color: "rgba(255,255,255,0.4)",
            maxWidth: "100%",
            margin: "0 0 32px 0",
            lineHeight: 1.7,
          }}>
            ReVerie uses AI-generated VR to reconstruct real memories. The kitchen, the
            garden, the neighborhood. For people who struggle to remember, and for the
            families who struggle alongside them.
          </p>

          {/* Download buttons */}
          <p style={{
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            margin: "0 0 14px 0",
          }}>
            Available now
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              {
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>,
                label1: "Download on the",
                label2: "App Store",
              },
              {
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.37.21.8.22 1.19.04L16.72 12 4.37.2C3.98.02 3.55.03 3.18.24 2.46.67 2 1.44 2 2.28v19.44c0 .84.46 1.61 1.18 2.04zm7.64-11.76-7.4 7.4 9.8-5.65-2.4-1.75zm0-2.24 2.4-1.75-9.8-5.65 7.4 7.4zm3.58 2.24-2.97 1.71 2.97 1.71 3.39-1.96c.6-.35.6-.91 0-1.25l-3.39-1.96z" /></svg>,
                label1: "Get it on",
                label2: "Google Play",
              },
            ].map(({ icon, label1, label2 }) => (
              <a
                key={label2}
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  background: "#fff",
                  color: "#080B14",
                  textDecoration: "none",
                  borderRadius: "10px",
                  padding: "10px 18px",
                  transition: "opacity 0.2s",
                  width: "100%",
                  boxSizing: "border-box",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {icon}
                <div>
                  <div style={{ fontSize: "9px", fontFamily: "var(--font-dm-sans)", fontWeight: 400, letterSpacing: "0.5px", opacity: 0.55 }}>{label1}</div>
                  <div style={{ fontSize: "14px", fontFamily: "var(--font-dm-sans)", fontWeight: 600, lineHeight: 1.1 }}>{label2}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Hero image — last, full width */}
        <div style={{ width: "100%", height: "320px", overflow: "hidden", marginTop: "32px" }}>
          {!errored ? (
            <img
              src="/hero.jpg"
              alt="Elderly patient experiencing VR therapy with caregiver"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 20%",
                display: "block",
              }}
              onError={() => setErrored(true)}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#0d1530" }} />
          )}
        </div>
      </section>
    );
  }

  // Desktop layout — 2-column grid
  return (
    <section
      ref={heroRef}
      id="patients"
      style={{
        background: "var(--rv-black)",
        height: "100vh",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        transformOrigin: "top center",
        willChange: "transform, border-radius",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 48px",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <p style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "11px",
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
          fontWeight: 400,
          margin: "0 0 24px 0",
        }}>
          First in the region · VR Memory Therapy
        </p>

        <h1 style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(40px, 5vw, 64px)",
          fontWeight: 700,
          lineHeight: 1.05,
          color: "white",
          margin: 0,
        }}>
          Give them back
          <br />
          the world they
          <br />
          <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
            remember.
          </em>
        </h1>

        <p style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "11px",
          letterSpacing: "1.5px",
          color: "rgba(255,255,255,0.2)",
          margin: "16px 0 0 0",
          fontWeight: 300,
        }}>
          Upload a photo · AI builds the world · Enter through VR
        </p>

        <p style={{
          fontFamily: "var(--font-dm-sans)",
          fontWeight: 300,
          fontSize: "15px",
          color: "rgba(255,255,255,0.4)",
          maxWidth: "380px",
          marginTop: "24px",
          lineHeight: 1.7,
        }}>
          ReVerie uses AI-generated VR to reconstruct real memories. The kitchen, the
          garden, the neighborhood. For people who struggle to remember, and for the
          families who struggle alongside them.
        </p>

        <div style={{ marginTop: "40px" }}>
          <p style={{
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            margin: "0 0 16px 0",
          }}>
            Available now
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a href="#" style={storeBtn} onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div>
                <div style={{ fontSize: "9px", fontFamily: "var(--font-dm-sans)", fontWeight: 400, letterSpacing: "0.5px", opacity: 0.55 }}>Download on the</div>
                <div style={{ fontSize: "14px", fontFamily: "var(--font-dm-sans)", fontWeight: 600, lineHeight: 1.1 }}>App Store</div>
              </div>
            </a>
            <a href="#" style={storeBtn} onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
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
      </div>

      {/* Right — image */}
      <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
        {errored ? (
          <div style={{ width: "100%", height: "100%", background: "#0d1530", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px", fontFamily: "var(--font-dm-sans)", fontStyle: "italic" }}>
              Place hero.jpg in /public
            </span>
          </div>
        ) : (
          <img
            src="/hero.jpg"
            alt="Elderly patient experiencing VR therapy with caregiver"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }}
            onError={() => setErrored(true)}
          />
        )}

        {/* VR badge */}
        <div style={{
          position: "absolute",
          bottom: "24px",
          left: "24px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(8,11,20,0.72)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRadius: "100px",
          padding: "8px 16px",
          border: "0.5px solid rgba(255,255,255,0.12)",
        }}>
          <span style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#6B8AFF",
            display: "inline-block",
            animation: "pulse 2s ease-in-out infinite",
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "12px",
            color: "rgba(255,255,255,0.7)",
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}>
            Experienced through Meta Quest VR
          </span>
        </div>
      </div>
    </section>
  );
}

const storeBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  background: "#fff",
  color: "#080B14",
  textDecoration: "none",
  borderRadius: "10px",
  padding: "10px 18px",
  transition: "opacity 0.2s",
};
