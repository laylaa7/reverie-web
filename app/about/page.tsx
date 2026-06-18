"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useIsMobile } from "@/hooks/useIsMobile";

type TeamMember = {
  name: string;
  role: string;
  description: string;
  image: string;
  linkedin: string;
  email: string;
  phone: string;
  cv: string;
};

const team: TeamMember[] = [
  {
    name: 'Fady Nabil',
    role: 'AI Engineer',
    description: 'Leading the team and driving the technical vision behind ReVerie\'s AI reconstruction pipeline.',
    image: '/team/fady.jpg',
    linkedin: 'https://www.linkedin.com/in/fady-n-fouad-412a56292/',
    email: 'fadynf05@gmail.com',
    phone: '+201226773371',
    cv: '/cvs/Fady-Nabil-CV.pdf',
  },
  {
    name: 'Layla Mohamed',
    role: 'AI Engineer',
    description: 'Building the intelligence that turns a single photograph into a fully immersive world.',
    image: '/team/layla.JPG',
    linkedin: 'https://www.linkedin.com/in/layla-mohamed-a216912b6/',
    email: 'laylamuhamed15@gmail.com',
    phone: '+201128300501',
    cv: '/cvs/Layla-Mohamed-CV.pdf',
  },
  {
    name: 'Nour Amgad',
    role: 'AI Engineer',
    description: 'Developing the models that understand space, depth, and memory from visual input.',
    image: '/team/nourA.jpg',
    linkedin: 'https://www.linkedin.com/in/nour-amgad-79424a275/',
    email: 'nouramgad05@gmail.com',
    phone: '+201115071166',
    cv: '/cvs/Nour-Amgad-CV.pdf',
  },
  {
    name: 'Nour Bassem',
    role: 'AI Engineer',
    description: 'Researching and implementing the cognitive systems that make ReVerie medically meaningful.',
    image: '/team/nourB.jpg',
    linkedin: 'https://www.linkedin.com/in/nour-bassem-9403b328a/',
    email: 'nourbassem2004@gmail.com',
    phone: '+201115565612',
    cv: '/cvs/Nour-Bassem-CV.pdf',
  },
  {
    name: 'Omneya Osama',
    role: 'AI Engineer',
    description: 'Crafting the systems that connect AI output to real therapeutic outcomes for patients and doctors.',
    image: '/team/omneya.jpg',
    linkedin: 'https://www.linkedin.com/in/omneya-osama-7448762b6/',
    email: 'omnia.osamahassan@gmail.com',
    phone: '+201152778815',
    cv: '/cvs/Omneya-Osama-CV.pdf',
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
        .about-action-link:hover {
          color: #F7F6F3 !important;
        }
        .about-action-row {
          position: relative;
          z-index: 2;
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
  member: TeamMember;
  index: number;
  isEven: boolean;
}) {
  const isMobile = useIsMobile();
  const actionLinkStyle = {
    display: "inline-flex",
    alignItems: "center",
    color: "rgba(247,246,243,0.62)",
    textDecoration: "none",
    fontFamily: "var(--font-dm-mono)",
    fontSize: 12,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    transition: "color 0.25s ease, opacity 0.25s ease",
    border: "none",
    outline: "none",
    background: "transparent",
    padding: 0,
  } as const;
  const separatorStyle = {
    color: "rgba(247,246,243,0.22)",
    fontSize: 11,
  } as const;

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

        <div
          className="about-action-row"
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            marginTop: 34,
          }}
        >
          <a className="about-action-link" href={member.linkedin} target="_blank" rel="noopener noreferrer" style={actionLinkStyle}>
            LinkedIn
          </a>
          <span style={separatorStyle}>•</span>
          <a className="about-action-link" href={`mailto:${member.email}`} style={actionLinkStyle}>
            Email
          </a>
          <span style={separatorStyle}>•</span>
          <a className="about-action-link" href={`tel:${member.phone}`} style={actionLinkStyle}>
            Phone
          </a>
          <span style={separatorStyle}>•</span>
          <a className="about-action-link" href={member.cv} target="_blank" rel="noopener noreferrer" style={actionLinkStyle}>
            CV
          </a>
        </div>
      </div>
    </div>
  );
}
