"use client";

import { useState } from "react";
import OrganicBackground from "@/components/OrganicBackground";

interface Row {
  tag: string;
  title: string;
  href: string;
}

const rows: Row[] = [
  {
    tag: "Families & patients",
    title: "Give them back what they're losing",
    href: "#memory-scroll",
  },
  {
    tag: "Doctors",
    title: "A new clinical tool. A new revenue stream.",
    href: "#doctors",
  },
  {
    tag: "Everyone",
    title: "Some places deserve to be revisited.",
    href: "#entertainment",
  },
];

export function AudienceEntry() {
  return (
    <section
      className="audience-section"
      style={{
        background: "#FFFFFF",
        padding: "80px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .audience-section { padding: 60px 24px !important; }
          .audience-row { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; padding-top: 16px !important; padding-bottom: 16px !important; }
          .audience-row-inner { flex-direction: column !important; align-items: flex-start !important; gap: 4px !important; }
          .audience-tag { min-width: unset !important; }
          .audience-title { margin-left: 0 !important; font-size: clamp(18px, 5vw, 24px) !important; }
          .audience-nostalgia { flex-direction: column !important; gap: 12px !important; }
        }
      `}</style>
      <OrganicBackground />

      {/* Polaroid silhouettes */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "8%",
          top: "8%",
          width: "120px",
          height: "148px",
          background: "rgba(0,0,0,0.04)",
          border: "0.5px solid rgba(0,0,0,0.07)",
          borderRadius: "2px",
          transform: "rotate(-4deg)",
          pointerEvents: "none",
        }}
      >
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "28px", borderTop: "0.5px solid rgba(0,0,0,0.05)" }} />
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "15%",
          top: "38%",
          width: "100px",
          height: "124px",
          background: "rgba(0,0,0,0.028)",
          border: "0.5px solid rgba(0,0,0,0.055)",
          borderRadius: "2px",
          transform: "rotate(5deg)",
          pointerEvents: "none",
        }}
      >
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "24px", borderTop: "0.5px solid rgba(0,0,0,0.04)" }} />
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: "5%",
          top: "60%",
          width: "88px",
          height: "108px",
          background: "rgba(0,0,0,0.022)",
          border: "0.5px solid rgba(0,0,0,0.045)",
          borderRadius: "2px",
          transform: "rotate(-2deg)",
          pointerEvents: "none",
        }}
      >
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "20px", borderTop: "0.5px solid rgba(0,0,0,0.035)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.3)",
            margin: "0 0 40px 0",
          }}
        >
          ReVerie is built for three kinds of people.
        </p>

        {rows.map((row, i) => (
          <AudienceRow key={row.tag} row={row} isLast={i === rows.length - 1} />
        ))}

        <div
          className="audience-nostalgia"
          style={{
            marginTop: "48px",
            padding: "20px 24px",
            borderRadius: "8px",
            background: "rgba(43,79,212,0.04)",
            border: "0.5px solid rgba(43,79,212,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "560px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: "rgba(0,0,0,0.28)",
                margin: "0 0 6px 0",
                fontWeight: 400,
              }}
            >
              For nostalgics 
            </p>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 400,
                fontSize: "14px",
                color: "rgba(0,0,0,0.55)",
                margin: 0,
              }}
            >
              Explore iconic places from history and culture — no medical need required.
            </p>
          </div>
          <a
            href="#entertainment"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "13px",
              color: "#2B4FD4",
              textDecoration: "none",
              flexShrink: 0,
              marginLeft: "24px",
            }}
          >
            Explore →
          </a>
        </div>
      </div>
    </section>
  );
}

function AudienceRow({ row, isLast }: { row: Row; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={row.href}
      className="audience-row"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: hovered ? "20px 0 20px 16px" : "20px 0 20px 0",
        borderBottom: isLast ? "none" : "0.5px solid rgba(0,0,0,0.07)",
        borderLeft: hovered ? "2px solid rgba(43,79,212,0.3)" : "2px solid transparent",
        cursor: "pointer",
        textDecoration: "none",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="audience-row-inner" style={{ display: "flex", alignItems: "center" }}>
        <span
          className="audience-tag"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            color: "rgba(0,0,0,0.35)",
            minWidth: "180px",
            flexShrink: 0,
          }}
        >
          {row.tag}
        </span>
        <span
          className="audience-title"
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 400,
            fontSize: "clamp(22px, 2.5vw, 32px)",
            color: hovered ? "#2B4FD4" : "#080B14",
            marginLeft: "24px",
            transition: "all 0.3s ease",
            display: "inline-block",
            transform: hovered ? "translateX(4px)" : "translateX(0)",
          }}
        >
          {row.title}
        </span>
      </div>
      <span
        style={{
          color: hovered ? "#2B4FD4" : "rgba(0,0,0,0.2)",
          fontSize: "18px",
          fontFamily: "var(--font-dm-sans)",
          transition: "color 0.2s",
          flexShrink: 0,
        }}
      >
        →
      </span>
    </a>
  );
}
