"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useIsMobile } from "@/hooks/useIsMobile";

const team = [
  {
    name: 'Fady Nabil',
    role: 'AI Engineer',
    description: 'Leading the team and driving the technical vision behind ReVerie\'s AI reconstruction pipeline.',
    image: '/team/fady.jpg',
    linkedin: 'https://www.linkedin.com/in/fady-n-fouad-412a56292/',
  },
  {
    name: 'Layla Mohamed',
    role: 'AI Engineer',
    description: 'Building the intelligence that turns a single photograph into a fully immersive world.',
    image: '/team/layla.JPG',
    linkedin: 'https://www.linkedin.com/in/layla-mohamed-a216912b6/',
  },
  {
    name: 'Nour Amgad',
    role: 'AI Engineer',
    description: 'Developing the models that understand space, depth, and memory from visual input.',
    image: '/team/nourA.jpg',
    linkedin: 'https://www.linkedin.com/in/nour-amgad-79424a275/',
  },
  {
    name: 'Nour Bassem',
    role: 'AI Engineer',
    description: 'Researching and implementing the cognitive systems that make ReVerie medically meaningful.',
    image: '/team/nourB.jpg',
    linkedin: 'https://www.linkedin.com/in/nour-bassem-9403b328a/',
  },
  {
    name: 'Omneya Osama',
    role: 'AI Engineer',
    description: 'Crafting the systems that connect AI output to real therapeutic outcomes for patients and doctors.',
    image: '/team/omneya.jpg',
    linkedin: 'https://www.linkedin.com/in/omneya-osama-7448762b6/',
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#080B14" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gentleBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        @media (max-width: 768px) {
          .about-hero {
            padding: 80px 24px 60px !important;
          }
          .about-closing {
            padding: 80px 24px !important;
          }
        }
      ` }} />

      <Navbar />

      {/* Hero */}
      <section
        className="about-hero"
        style={{
          background: "#080B14",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "140px 24px 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path d="M-100 200 Q 400 100, 800 300 T 1600 200" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" fill="none" />
          <path d="M-100 400 Q 300 300, 700 450 T 1600 350" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" fill="none" />
          <path d="M-100 600 Q 500 500, 900 650 T 1600 550" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" fill="none" />
          <path d="M200 -50 Q 350 300, 200 600 T 300 950" stroke="rgba(255,255,255,0.02)" strokeWidth="1.5" fill="none" />
          <path d="M700 -50 Q 850 200, 700 500 T 800 950" stroke="rgba(255,255,255,0.02)" strokeWidth="1.5" fill="none" />
          <path d="M1200 -50 Q 1350 300, 1200 600 T 1300 950" stroke="rgba(255,255,255,0.02)" strokeWidth="1.5" fill="none" />
        </svg>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "32px" }}>
            <span style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "9px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(107,138,255,0.7)",
              background: "rgba(107,138,255,0.06)",
              border: "0.5px solid rgba(107,138,255,0.15)",
              padding: "4px 14px",
              borderRadius: "100px",
            }}>
              Graduation Project · MIU Egypt · 2026
            </span>
          </div>

          <h1 style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.05,
            margin: 0,
          }}>
            Five AI engineers.
            <br />
            <em style={{
              fontStyle: "italic",
              fontWeight: 400,
              color: "rgba(255,255,255,0.35)",
            }}>
              One question worth answering.
            </em>
          </h1>

          <p style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: "18px",
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.75,
            maxWidth: "520px",
            margin: "24px auto 0",
          }}>
            A graduation project from MIU Egypt, built with the conviction that technology
            should serve people losing their memories — and the families who love them.
          </p>
        </div>
      </section>

      {/* Team */}
      <section style={{ background: "#080B14", padding: "0" }}>
        <div style={{ textAlign: "center", marginBottom: "80px", padding: "0 24px", boxSizing: "border-box" }}>
          <p style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "9px",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "16px",
          }}>
            The team
          </p>
          <h2 style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(32px, 7vw, 48px)",
            fontWeight: 700,
            color: "white",
            margin: 0,
          }}>
            Five people. One question.
          </h2>
        </div>

        {team.map((member, i) => (
          <TeamRow key={member.name} member={member} index={i} isEven={i % 2 === 0} />
        ))}
      </section>

      {/* Closing */}
      <section
        className="about-closing"
        style={{
          background: "#F7F6F3",
          padding: "120px 24px",
          textAlign: "center",
        }}
      >
        <h2 style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "40px",
          fontWeight: 700,
          color: "#080B14",
          margin: 0,
        }}>
          Built with conviction.
          <br />
          <em style={{
            fontStyle: "italic",
            fontWeight: 400,
            color: "rgba(0,0,0,0.3)",
          }}>
            Presented with pride.
          </em>
        </h2>
        <p style={{
          fontFamily: "var(--font-dm-sans)",
          fontWeight: 300,
          fontSize: "16px",
          color: "rgba(0,0,0,0.4)",
          marginTop: "20px",
        }}>
          MIU Egypt · AI Engineering · Class of 2026
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: "40px",
            fontFamily: "var(--font-dm-mono)",
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.3)",
            textDecoration: "none",
          }}
        >
          ← Back to ReVerie
        </a>
      </section>

      <Footer />
    </div>
  );
}

function TeamRow({
  member,
  index,
  isEven,
}: {
  member: typeof team[0];
  index: number;
  isEven: boolean;
}) {
  const [linkHovered, setLinkHovered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        minHeight: isMobile ? "auto" : "500px",
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Image */}
      <div
        style={{
          order: isMobile ? 0 : (isEven ? 0 : 1),
          position: "relative",
          height: isMobile ? "300px" : "auto",
          minHeight: isMobile ? "auto" : "500px",
          overflow: "hidden",
        }}
      >
        <img
          src={member.image}
          alt={member.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            position: "absolute",
            inset: 0,
            filter: "grayscale(20%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isMobile
              ? "linear-gradient(to top, #080B14 0%, transparent 60%)"
              : isEven
              ? "linear-gradient(to right, transparent 60%, #080B14)"
              : "linear-gradient(to left, transparent 60%, #080B14)",
          }}
        />
      </div>

      {/* Text */}
      <div
        style={{
          order: isMobile ? 1 : (isEven ? 1 : 0),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? "32px 24px 48px" : "80px",
        }}
      >
        {!isMobile && (
          <p
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "80px",
              fontWeight: 700,
              fontStyle: "italic",
              color: "rgba(255,255,255,0.04)",
              margin: "0 0 -20px",
              lineHeight: 1,
            }}
          >
            0{index + 1}
          </p>
        )}

        <p style={{
          fontFamily: "var(--font-dm-mono)",
          fontSize: "9px",
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: "rgba(107,138,255,0.7)",
          margin: "0 0 12px",
        }}>
          {member.role}
        </p>

        <h2 style={{
          fontFamily: "Playfair Display, serif",
          fontSize: "clamp(28px, 3.5vw, 44px)",
          fontWeight: 700,
          color: "#fff",
          margin: "0 0 20px",
          lineHeight: 1.1,
        }}>
          {member.name}
        </h2>

        <p style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "15px",
          fontWeight: 300,
          color: "rgba(255,255,255,0.4)",
          lineHeight: 1.8,
          margin: "0 0 32px",
          maxWidth: isMobile ? "100%" : "380px",
        }}>
          {member.description}
        </p>

        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: linkHovered ? "#fff" : "rgba(255,255,255,0.25)",
            textDecoration: "none",
            fontFamily: "var(--font-dm-mono)",
            fontSize: "10px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            transition: "color 0.2s",
            width: "fit-content",
          }}
          onMouseEnter={() => setLinkHovered(true)}
          onMouseLeave={() => setLinkHovered(false)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          LinkedIn
        </a>
      </div>
    </div>
  );
}
