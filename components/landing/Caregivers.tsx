"use client";

import { useState } from "react";

const cards = [
  {
    label: "Upload a photo",
    desc: "A single photograph of a meaningful place is all it takes. We handle the rest.",
  },
  {
    label: "We reconstruct the world",
    desc: "Our AI rebuilds it as an immersive VR environment — room by room, detail by detail.",
  },
  {
    label: "They step inside",
    desc: "Your loved one puts on a headset and walks back into the world they remember.",
  },
];

export function Caregivers() {
  return (
    <section
      id="caregivers"
      style={{
        background: "#F7F6F3",
        padding: "0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .caregivers-inner { flex-direction: column !important; padding: 60px 24px !important; gap: 40px !important; }
          .caregivers-right { width: 100% !important; }
        }
      `}</style>

      <div
        className="caregivers-inner"
        style={{
          display: "flex",
          gap: "80px",
          padding: "100px 80px",
          alignItems: "flex-start",
          maxWidth: "1280px",
          boxSizing: "border-box",
        }}
      >
        {/* Left */}
        <div style={{ flex: "0 0 400px", maxWidth: "400px" }}>
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
            For families
          </p>
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 700,
              fontSize: "clamp(28px, 3vw, 40px)",
              color: "#080B14",
              margin: "0 0 20px 0",
              lineHeight: 1.15,
            }}
          >
            Give them back
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 400, color: "rgba(0,0,0,0.35)" }}>
              a place they loved.
            </em>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: "15px",
              color: "rgba(0,0,0,0.5)",
              margin: "0 0 40px 0",
              lineHeight: 1.75,
              maxWidth: "340px",
            }}
          >
            For families caring for someone with dementia or memory loss, ReVerie turns a photograph
            into an immersive world they can walk through again.
          </p>
          <a
            href="#how-it-works"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              fontWeight: 500,
              color: "#080B14",
              textDecoration: "none",
              borderBottom: "1px solid rgba(0,0,0,0.2)",
              paddingBottom: "2px",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.6)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)")}
          >
            Learn how it works →
          </a>
        </div>

        {/* Right */}
        <div
          className="caregivers-right"
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {cards.map((card, i) => (
            <CaregiversCard key={i} index={i} label={card.label} desc={card.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaregiversCard({ index, label, desc }: { index: number; label: string; desc: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: hovered ? "#fff" : "rgba(255,255,255,0.6)",
        border: "0.5px solid rgba(0,0,0,0.08)",
        borderRadius: "10px",
        padding: "24px 28px",
        display: "flex",
        alignItems: "flex-start",
        gap: "20px",
        transition: "background 0.2s, box-shadow 0.2s",
        boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.06)" : "0 1px 4px rgba(0,0,0,0.03)",
        cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "28px",
          fontWeight: 700,
          fontStyle: "italic",
          color: "rgba(0,0,0,0.08)",
          lineHeight: 1,
          flexShrink: 0,
          minWidth: "32px",
        }}
      >
        0{index + 1}
      </span>
      <div>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 500,
            fontSize: "15px",
            color: "#080B14",
            margin: "0 0 6px 0",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: "13px",
            color: "rgba(0,0,0,0.45)",
            margin: 0,
            lineHeight: 1.65,
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}
