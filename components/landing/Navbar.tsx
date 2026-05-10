"use client";

import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "For families", href: "#caregivers" },
    { label: "For doctors", href: "#doctors" },
    { label: "Our story", href: "/about" },
  ];

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          transition: "background 0.3s, border-color 0.3s",
          ...(scrolled
            ? {
                backdropFilter: "blur(20px)",
                background: "rgba(8,11,20,0.8)",
                borderBottom: "0.5px solid rgba(255,255,255,0.06)",
              }
            : { background: "transparent" }),
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/logo-small.png" alt="ReVerie" style={{ height: "28px", width: "auto", filter: "brightness(0) invert(1)" }} />
          </a>

          <div className="hidden md:flex" style={{ gap: "36px", alignItems: "center" }}>
            {navLinks.map(({ label, href }) => (
              <NavLink key={label} label={label} href={href} />
            ))}
            <ForEveryoneLink />
          </div>

          <a
            href="#apply"
            className="hidden md:block"
            style={{
              border: "0.5px solid rgba(107,138,255,0.4)",
              color: "white",
              padding: "8px 20px",
              borderRadius: "6px",
              fontSize: "13px",
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 400,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(107,138,255,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Apply as a Doctor
          </a>

          <button
            className="md:hidden"
            style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: "8px" }}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(8,11,20,0.97)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
          }}
        >
          <button
            style={{
              position: "absolute",
              top: "20px",
              right: "32px",
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontSize: "22px",
              fontFamily: "var(--font-dm-sans)",
            }}
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
          {[...navLinks, { label: "For everyone", href: "#entertainment" }, { label: "Apply as a Doctor", href: "#apply" }].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontSize: "22px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      style={{
        fontFamily: "var(--font-dm-sans)",
        fontSize: "14px",
        fontWeight: 400,
        color: hovered ? "white" : "rgba(255,255,255,0.5)",
        textDecoration: "none",
        transition: "color 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </a>
  );
}

function ForEveryoneLink() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="#entertainment"
      style={{
        fontFamily: "var(--font-dm-sans)",
        fontSize: "13px",
        fontWeight: 400,
        color: hovered ? "#fff" : "rgba(255,255,255,0.6)",
        textDecoration: "none",
        border: "0.5px solid rgba(255,255,255,0.15)",
        borderRadius: "6px",
        padding: "5px 14px",
        transition: "color 0.2s, border-color 0.2s",
        borderColor: hovered ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      For everyone
    </a>
  );
}

