"use client";

import { useState } from "react";
import OrganicBackground from "@/components/OrganicBackground";

const specialties = ["Neurology", "Geriatrics", "Psychiatry", "General Practice"];

const features = [
  {
    num: "01",
    title: "Paid per session",
    desc: "Set your own rates. ReVerie handles billing and collection.",
  },
  {
    num: "02",
    title: "Own your patients",
    desc: "Full clinical control. Your relationship, your outcomes.",
  },
  {
    num: "03",
    title: "Patient referrals",
    desc: "We connect you with patients in your area looking for VR therapy.",
  },
  {
    num: "04",
    title: "Real-time dashboard",
    desc: "Monitor cognitive scores and session data across all your patients.",
  },
];

const joinSteps = [
  { time: "5 minutes", title: "Apply online", desc: "Fill out your specialty, license, and patient types." },
  { time: "24–48 hours", title: "We verify you", desc: "Our team reviews your credentials and confirms your license." },
  { time: "30 min call", title: "Onboarding call", desc: "A ReVerie specialist walks you through the platform." },
  { time: "You're live", title: "First session", desc: "Start running supervised VR sessions. Referrals begin flowing." },
];

export function ForDoctors() {
  return (
    <section
      id="doctors"
      style={{ background: "#FAFAFA", position: "relative", overflow: "hidden" }}
    >
      <style>{`
        @media (max-width: 767px) {
          .doctors-header { padding: 60px 24px 0 !important; }
          .doctors-features-grid { gap: 0 !important; }
          .doctors-feature-row { padding: 20px 16px !important; gap: 16px !important; }
          .doctors-feature-num { font-size: 36px !important; min-width: 48px !important; }
          .doctors-clinics { padding: 40px 24px !important; }
          .doctors-clinics-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .doctors-join-layout { flex-direction: column !important; }
          .doctors-join-right { display: none !important; }
          .doctors-join-left { padding: 60px 24px !important; }
        }
      `}</style>

      <OrganicBackground />

      {/* Header + features */}
      <div className="doctors-header" style={{ position: "relative", zIndex: 1, padding: "100px 80px 0" }}>
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
          For clinicians
        </p>
        <h2
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 700,
            fontSize: "clamp(28px, 5vw, 40px)",
            color: "#080B14",
            margin: "0 0 16px 0",
          }}
        >
          Join the doctors already using ReVerie.
        </h2>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: "16px",
            color: "rgba(0,0,0,0.5)",
            margin: 0,
            maxWidth: "560px",
          }}
        >
          Built for neurologists, geriatric specialists, psychiatrists, and GPs. Run sessions,
          own your patients, get paid.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "32px" }}>
          {specialties.map((s) => (
            <span
              key={s}
              style={{
                background: "rgba(0,0,0,0.04)",
                border: "0.5px solid rgba(0,0,0,0.08)",
                borderRadius: "100px",
                padding: "6px 16px",
                fontSize: "12px",
                color: "rgba(0,0,0,0.5)",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        <div style={{ marginTop: "48px" }}>
          {features.map((f) => (
            <FeatureRow key={f.num} num={f.num} title={f.title} desc={f.desc} />
          ))}
        </div>
      </div>

      {/* Clinics & Hospitals */}
      <div className="doctors-clinics" style={{ background: "#FAFAFA", padding: "80px 80px" }}>
        <div className="doctors-clinics-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center", maxWidth: "1100px" }}>
          <div>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "2px", color: "rgba(0,0,0,0.3)", margin: "0 0 16px 0" }}>
              For institutions
            </p>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "clamp(28px, 3vw, 38px)", color: "#080B14", margin: "0 0 20px 0", lineHeight: 1.15 }}>
              Bring ReVerie to your clinic or hospital.
            </h2>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300, fontSize: "15px", color: "rgba(0,0,0,0.5)", margin: "0 0 32px 0", maxWidth: "420px", lineHeight: 1.75 }}>
              Deploy VR memory therapy across your department. We handle setup, training, and ongoing support.
            </p>
            <a
              href="mailto:hello@reverie.health?subject=Clinic Partnership Inquiry&body=Hello ReVerie team, I am interested in bringing ReVerie to our clinic/hospital. Please get in touch."
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                fontWeight: 500,
                color: "#fff",
                textDecoration: "none",
                background: "#2B4FD4",
                padding: "12px 24px",
                borderRadius: "8px",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Get in touch →
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { label: "Outpatient Clinics", desc: "Add VR therapy sessions to existing neurology or geriatrics appointments." },
              { label: "Hospitals & Wards", desc: "Deploy across inpatient units for daily cognitive engagement sessions." },
              { label: "Research Programs", desc: "Use session data and analytics for clinical research on memory and VR." },
            ].map(({ label, desc }) => (
              <div key={label} style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.07)", borderRadius: "8px", padding: "20px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                <p style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: "14px", color: "#080B14", margin: "0 0 6px 0" }}>{label}</p>
                <p style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 300, fontSize: "13px", color: "rgba(0,0,0,0.45)", margin: 0, lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curve break: FAFAFA above → #080B14 below */}
      <div style={{
        position: "relative",
        height: "80px",
        overflow: "hidden",
        marginTop: "-2px",
        marginBottom: "-2px",
        background: "#080B14",
      }}>
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        >
          <path d="M0,0 C480,80 960,80 1440,0 L1440,0 L0,0 Z" fill="#FAFAFA" />
        </svg>
      </div>

      {/* How to join — dark two-column layout */}
      <div
        className="doctors-join-layout"
        style={{ display: "flex", position: "relative", zIndex: 1, background: "#080B14" }}
      >
        {/* Left column: steps */}
        <div
          className="doctors-join-left"
          style={{ flex: 1, padding: "80px 60px", background: "#080B14" }}
        >
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "11px",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "rgba(255,255,255,0.2)",
              margin: "0 0 32px 0",
            }}
          >
            How to join
          </p>

          <div style={{ position: "relative", paddingLeft: "40px" }}>
            <div
              style={{
                position: "absolute",
                left: "4px",
                top: "12px",
                bottom: "12px",
                width: "0.5px",
                background: "rgba(255,255,255,0.08)",
              }}
            />

            {joinSteps.map((step, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  marginBottom: i < joinSteps.length - 1 ? "40px" : 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "-40px",
                    top: "3px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: i === 0 ? "#fff" : "transparent",
                    border: i === 0 ? "none" : "0.5px solid rgba(255,255,255,0.2)",
                  }}
                />
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.25)",
                    fontFamily: "var(--font-dm-sans)",
                    margin: "0 0 8px 0",
                    fontWeight: 400,
                  }}
                >
                  {step.time}
                </p>
                <h4
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: "17px",
                    fontWeight: 500,
                    color: "#ffffff",
                    margin: "0 0 6px 0",
                  }}
                >
                  {step.title}
                </h4>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "13px",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.4)",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "64px" }}>
            <a
              href="#apply"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: "#2B4FD4",
                color: "#fff",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                fontWeight: 500,
                padding: "14px 32px",
                borderRadius: "6px",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(43,79,212,0.85)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2B4FD4")}
            >
              Apply as a Doctor →
            </a>
          </div>
        </div>

        {/* Right column: full-bleed image with dark gradient */}
        <div
          className="doctors-join-right"
          style={{ flex: 1, position: "relative", minHeight: "600px", overflow: "hidden" }}
        >
          <img
            className="doctors-join-img"
            src="/doctor-patient.png"
            alt="Doctor with patient"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(8,11,20,0.95) 0%, rgba(8,11,20,0.1) 30%, transparent 55%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "120px",
              background: "linear-gradient(to top, rgba(8,11,20,0.5), transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ num, title, desc }: { num: string; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="doctors-feature-row"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "40px",
        padding: "32px 40px",
        background: hovered ? "#0d1530" : "#080B14",
        borderRadius: "8px",
        borderTop: hovered ? "0.5px solid rgba(255,255,255,0.12)" : "0.5px solid rgba(255,255,255,0.06)",
        borderRight: hovered ? "0.5px solid rgba(255,255,255,0.12)" : "0.5px solid rgba(255,255,255,0.06)",
        borderBottom: hovered ? "0.5px solid rgba(255,255,255,0.12)" : "0.5px solid rgba(255,255,255,0.06)",
        borderLeft: hovered ? "3px solid rgba(107,138,255,0.5)" : "0.5px solid rgba(255,255,255,0.06)",
        marginBottom: "12px",
        transition: "background 0.2s, border-color 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="doctors-feature-num"
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "56px",
          fontWeight: 700,
          fontStyle: "italic",
          color: "rgba(255,255,255,0.14)",
          minWidth: "80px",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {num}
      </div>
      <div>
        <h3
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "18px",
            fontWeight: 500,
            color: "#fff",
            margin: "0 0 8px 0",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "14px",
            fontWeight: 300,
            color: "rgba(255,255,255,0.4)",
            margin: 0,
            maxWidth: "500px",
            lineHeight: 1.6,
          }}
        >
          {desc}
        </p>
      </div>
    </div>
  );
}
