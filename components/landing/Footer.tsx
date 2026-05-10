"use client";

const teamMembers = ["Fady Nabil", "Layla Mohamed", "Nour Amgad", "Nour Bassem", "Omneya Osama"];

const platformLinks = [
  { label: "For Patients", href: "#patients" },
  { label: "For Doctors", href: "#doctors" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Our Story", href: "#story" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "hello@reverie.health", href: "mailto:hello@reverie.health" },
];

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--rv-black)",
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
        padding: "64px 80px",
      }}
    >
      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{ gap: "48px", maxWidth: "1280px", margin: "0 auto" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <img src="/logo-large.jpg" alt="ReVerie" style={{ height: "56px", width: "auto", maxWidth: "180px", objectFit: "contain", display: "block", marginBottom: "20px" }} />
          {/* <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: "14px",
              color: "rgba(255,255,255,0.4)",
              margin: 0,
            }}
          >
            Where Memories Live
          </p> */}
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 300,
              fontSize: "12px",
              color: "rgba(255,255,255,0.2)",
              margin: 0,
            }}
          >
            Cairo, Egypt · 2026
          </p>
          <a
            href="https://linkedin.com/company/reverie-health"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", color: "rgba(255,255,255,0.3)", transition: "color 0.2s", width: "fit-content" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>

        <div>
          <p style={columnLabelStyle}>Built by</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {teamMembers.map((name) => (
              <span
                key={name}
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 300,
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p style={columnLabelStyle}>Platform</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {platformLinks.map((l) => (
              <FooterLink key={l.label} label={l.label} href={l.href} />
            ))}
          </div>
        </div>

        <div>
          <p style={columnLabelStyle}>Legal</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {legalLinks.map((l) => (
              <FooterLink key={l.label} label={l.label} href={l.href} />
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: "0.5px solid rgba(255,255,255,0.05)",
          marginTop: "48px",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
          maxWidth: "1280px",
          margin: "48px auto 0",
        }}
      >
        <p style={bottomBarStyle}>
          © 2026{" "}
          <a href="/admin" style={{ color: "inherit", textDecoration: "none" }} tabIndex={-1}>
            ReVerie
          </a>
          . All rights reserved.
        </p>
        <p style={bottomBarStyle}>First VR memory therapy platform in the region.</p>
      </div>
    </footer>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      style={{
        fontFamily: "var(--font-dm-sans)",
        fontWeight: 400,
        fontSize: "13px",
        color: "rgba(255,255,255,0.35)",
        textDecoration: "none",
        transition: "color 0.2s",
        display: "block",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
    >
      {label}
    </a>
  );
}

const columnLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans)",
  fontWeight: 400,
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  color: "rgba(255,255,255,0.2)",
  margin: "0 0 16px 0",
};

const bottomBarStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans)",
  fontWeight: 300,
  fontSize: "12px",
  color: "rgba(255,255,255,0.2)",
  margin: 0,
};
