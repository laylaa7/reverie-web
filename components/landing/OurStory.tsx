"use client";

const paragraphs = [
  "We saw a scene from a sci-fi show where someone could step back into their memories, not as stories but as places they could actually walk through again.",

  "And it did not feel like science fiction to us. It felt like grief.",

  "We could not let it go after that. Not because of how it worked, but because of what it meant for people who start losing pieces of their lives while they are still here. Names slipping. Faces fading. Entire moments becoming harder to reach.",

  "We kept thinking about it long after.",

  "We looked for something real that could bring that feeling back in a way that still felt human.",

  "We did not find it.",

  "So we built ReVerie."
];

export function OurStory() {
  return (
    <section id="story" className="our-story-section" style={{ background: "var(--rv-black)", padding: "120px 80px" }}>
      <style>{`
        @media (max-width: 767px) {
          .our-story-section { padding: 80px 24px !important; }
        }
      `}</style>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "rgba(255,255,255,0.2)",
            margin: "0 0 48px 0",
          }}
        >
          How ReVerie began
        </p>

        {paragraphs.map((para, i) => (
          <p
            key={i}
            style={{
              fontFamily: "var(--font-playfair)",
              fontWeight: 400,
              fontSize: "20px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.7)",
              margin: i < paragraphs.length - 1 ? "0 0 24px 0" : 0,
            }}
          >
            {para}
          </p>
        ))}

        <hr
          style={{
            border: "none",
            borderTop: "0.5px solid rgba(255,255,255,0.08)",
            margin: "48px 0",
          }}
        />

        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "rgba(255,255,255,0.2)",
            margin: "0 0 12px 0",
          }}
        >
          Built by
        </p>

        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: "15px",
            color: "rgba(255,255,255,0.4)",
            margin: "0 0 16px 0",
          }}
        >
          Fady Nabil · Layla Mohamed · Nour Amgad · Nour Bassem · Omneya Osama
        </p>

        <MeetTeamLink />
      </div>
    </section>
  );
}

function MeetTeamLink() {
  return (
    <a
      href="/about"
      style={{
        fontFamily: "var(--font-dm-sans)",
        fontWeight: 400,
        fontSize: "13px",
        color: "rgba(255,255,255,0.3)",
        textDecoration: "none",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
    >
      Meet the team →
    </a>
  );
}
