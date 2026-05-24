"use client";

import { useState, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const rightPanelBenefits = [
  "Paid per session you run",
  "Full clinical control",
  "Patient referrals from day one",
  "Real-time cognitive dashboard",
];

export function ApplicationForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const isMobile = useIsMobile();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const data = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/apply", { method: "POST", body: data });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Submission failed");
      }

      setStatus("success");
      formRef.current?.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section
      id="apply"
      style={{
        background: "#FFFFFF",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      }}
    >
      {/* Left — form */}
      <div style={{ padding: isMobile ? "40px 20px" : "100px 80px" }}>
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
          For medical professionals
        </p>
        <h2
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 700,
            fontSize: "clamp(28px, 8vw, 40px)",
            color: "#080B14",
            margin: "0 0 12px 0",
          }}
        >
          Apply to join ReVerie
        </h2>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 300,
            fontSize: "15px",
            color: "rgba(0,0,0,0.45)",
            margin: "0 0 48px 0",
            lineHeight: 1.6,
          }}
        >
          We review every application personally. You&apos;ll hear back within 2 business days.
        </p>

        {status === "success" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              padding: "48px 32px",
              border: "0.5px solid rgba(52,211,153,0.3)",
              borderRadius: "8px",
              background: "rgba(52,211,153,0.04)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(52,211,153,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 700,
                fontSize: "22px",
                color: "#080B14",
                margin: 0,
              }}
            >
              Application received.
            </h3>
            <p
              style={{
                fontFamily: "var(--font-dm-sans)",
                fontWeight: 300,
                fontSize: "14px",
                color: "rgba(0,0,0,0.45)",
                margin: 0,
              }}
            >
              We&apos;ll be in touch within 48 hours.
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "20px" }}>
              <FormField label="Full Name" id="fullName" name="fullName" type="text" placeholder="Dr. Sarah Ahmed" required />
              <FormField label="Email" id="email" name="email" type="email" placeholder="doctor@hospital.com" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "20px" }}>
              <FormField label="Specialization" id="specialization" name="specialization" type="text" placeholder="Neurology" required />
              <FormField label="Years of Experience" id="experience" name="experience" type="number" placeholder="8" required />
            </div>

            <FormField label="Languages Spoken" id="languages" name="languages" type="text" placeholder="Arabic, English, French" required />

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="bio" style={labelStyle}>Brief Bio</label>
              <textarea
                id="bio"
                name="bio"
                required
                rows={4}
                placeholder="Tell us about your clinical background and why you want to join ReVerie..."
                style={{ ...inputStyle, resize: "none", fontFamily: "var(--font-dm-sans)" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label htmlFor="cv" style={labelStyle}>Upload CV</label>
              <input
                id="cv"
                name="cv"
                type="file"
                accept=".pdf"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "13px",
                  color: "rgba(0,0,0,0.5)",
                  border: "0.5px solid rgba(0,0,0,0.15)",
                  borderRadius: "6px",
                  padding: "10px 14px",
                  background: "transparent",
                  cursor: "pointer",
                  width: "100%",
                }}
              />
              <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", color: "rgba(0,0,0,0.3)" }}>
                PDF only, max 10MB
              </span>
            </div>

            {status === "error" && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "6px",
                  background: "rgba(239,68,68,0.05)",
                  border: "0.5px solid rgba(239,68,68,0.2)",
                  color: "#DC2626",
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "13px",
                }}
              >
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              style={{
                background: "var(--rv-blue)",
                color: "white",
                padding: "14px 26px",
                borderRadius: "6px",
                fontFamily: "var(--font-dm-sans)",
                fontSize: "14px",
                fontWeight: 500,
                border: "none",
                cursor: status === "submitting" ? "not-allowed" : "pointer",
                opacity: status === "submitting" ? 0.6 : 1,
                transition: "opacity 0.2s",
                width: "100%",
              }}
            >
              {status === "submitting" ? "Submitting…" : "Submit application"}
            </button>
          </form>
        )}
      </div>

      {/* Right — dark panel */}
      <div
        style={{
          background: "#080B14",
          padding: "80px 60px",
          display: isMobile ? "none" : "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100%",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            fontFamily: "var(--font-dm-sans)",
            fontWeight: 400,
            margin: "0 0 40px 0",
          }}
        >
          Why doctors join ReVerie
        </p>

        <blockquote
          style={{
            margin: 0,
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(22px, 2.5vw, 30px)",
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.65)",
          }}
        >
          &ldquo;We looked for something like this.
          <br />
          <span style={{ color: "#fff", fontWeight: 700, fontStyle: "normal" }}>We found nothing.</span>
          <br />
          So we built it.&rdquo;
        </blockquote>

        <div
          style={{
            marginTop: "48px",
            borderTop: "0.5px solid rgba(255,255,255,0.06)",
            paddingTop: "32px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "12px",
              fontWeight: 300,
              color: "rgba(255,255,255,0.25)",
              margin: "0 0 16px 0",
            }}
          >
            Every application reviewed personally within 48 hours.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {rightPanelBenefits.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "rgba(107,138,255,0.5)",
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: "13px",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.4)",
                    margin: 0,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-dm-sans)",
  fontWeight: 400,
  fontSize: "13px",
  color: "rgba(0,0,0,0.6)",
};

const inputStyle: React.CSSProperties = {
  border: "0.5px solid rgba(0,0,0,0.15)",
  borderRadius: "6px",
  padding: "12px 16px",
  fontFamily: "var(--font-dm-sans)",
  fontSize: "14px",
  fontWeight: 300,
  color: "#080B14",
  background: "white",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

function FormField({
  label,
  id,
  name,
  type,
  placeholder,
  required,
}: {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
      />
    </div>
  );
}
