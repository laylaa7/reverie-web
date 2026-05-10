"use client";

import { useRef, useEffect } from "react";

const memories = [
  { title: "Her grandmother's kitchen", location: "Alexandria · 1974", width: 380, height: 420, rotate: -2.5, image: "/MemoryScroll/memory1.JPG" },
  { title: "The old garden", location: "Maadi · summer", width: 220, height: 260, rotate: 1.8, image: "/MemoryScroll/memory2.jpg" },
  { title: "His workshop", location: "Every Saturday", width: 300, height: 360, rotate: -1.2, image: "/MemoryScroll/memory3.jpg" },
  { title: "The street we grew up on", location: "Heliopolis · 1980s", width: 340, height: 400, rotate: 2.1,image: "/MemoryScroll/memory4.jpg" },
  { title: "The first home", location: "Cairo · 1992", width: 260, height: 300, rotate: -1.8, image: "/MemoryScroll/memory5.jpg" },
  { title: "The sea at dusk", location: "Alexandria", width: 200, height: 240, rotate: 1.4, image: "/MemoryScroll/memory6.jpg" },
];

export function MemoryScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!sectionRef.current || !stripRef.current) return;

        const section = sectionRef.current;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const windowHeight = window.innerHeight;

        const scrollableDistance = sectionHeight - windowHeight;
        const scrolled = window.scrollY - sectionTop;
        const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

        const stripWidth = stripRef.current.scrollWidth;
        const maxTranslate = Math.max(0, stripWidth - window.innerWidth + 120);

        stripRef.current.style.transform = `translateX(-${progress * maxTranslate}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        height: "300vh",
        background: "#0A0F1E",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ padding: "0 80px", marginBottom: "48px" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 400,
              marginBottom: "12px",
              margin: "0 0 12px 0",
            }}
          >
            Every memory has a place. We build it back.
          </p>
          <h2
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              lineHeight: 1.2,
              margin: 0,
              color: "rgba(255,255,255,0.6)",
              fontStyle: "italic",
              fontWeight: 400,
            }}
          >
            <strong style={{ fontStyle: "normal", color: "#fff", fontWeight: 700 }}>Her kitchen.</strong>
            {" "}The street you grew up on.
            <br />
            <strong style={{ fontStyle: "normal", color: "#fff", fontWeight: 700 }}>His workshop.</strong>
            {" "}Every Saturday morning.
          </h2>
        </div>

        <div
          ref={stripRef}
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "24px",
            paddingLeft: "80px",
            paddingRight: "200px",
            willChange: "transform",
            transition: "transform 0.05s linear",
          }}
        >
          {memories.map((mem, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: `${mem.width}px`,
                height: `${mem.height}px`,
                background: mem.image ? "transparent" : "#1a1a2e",
                border: "0.5px solid rgba(255,255,255,0.06)",
                borderRadius: "4px",
                transform: `rotate(${mem.rotate}deg)`,
                transformOrigin: "bottom center",
                position: "relative",
                marginBottom: i % 2 === 0 ? "0" : "40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "20px 24px",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              {mem.image && (
                <>
                  <img
                    src={mem.image}
                    alt={mem.title}
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
                      background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
                    }}
                  />
                </>
              )}

              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                }}
              />
              {!mem.image && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
                  }}
                />
              )}
              <div style={{ position: "relative", zIndex: 1 }}>
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: "var(--font-dm-sans)",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {mem.title}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "10px",
                    fontWeight: 400,
                    fontFamily: "var(--font-dm-sans)",
                    color: "rgba(255,255,255,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {mem.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            fontSize: "10px",
            color: "rgba(255,255,255,0.15)",
            fontFamily: "var(--font-dm-sans)",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          scroll to explore →
        </p>
      </div>
    </section>
  );
}
