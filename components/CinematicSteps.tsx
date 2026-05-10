"use client";

import { useRef, useState, useEffect } from "react";

const scenes = [
  {
    tag: "01 — UPLOAD",
    headline: <>Every memory begins<br />with a photograph.</>,
    sub: "One image. A kitchen, a garden, a street corner. The place that made them who they are.",
  },
  {
    tag: "02 — RECONSTRUCTION",
    headline: <>AI rebuilds the world<br /><em style={{ fontStyle: "italic", color: "rgba(0,0,0,0.3)", fontWeight: 400 }}>they thought was gone.</em></>,
    sub: "Every surface. Every shadow. Every corner — reconstructed from a single photograph.",
  },
  {
    tag: "03 — THE SESSION",
    headline: <>A doctor guides them<br />every step of the way.</>,
    sub: "Supervised. Safe. Scheduled when your family is ready.",
  },
  {
    tag: "04 — ENTER VR",
    headline: <>They put on the headset.<br /><em style={{ fontStyle: "italic", color: "rgba(0,0,0,0.3)", fontWeight: 400 }}>And step inside.</em></>,
    sub: "The kitchen is exactly as she described it. The light through the window. The smell she still remembers.",
  },
  {
    tag: "05 — PROGRESS",
    headline: <>Something shifts.<br /><em style={{ fontStyle: "italic", color: "rgba(0,0,0,0.3)", fontWeight: 400 }}>Every time.</em></>,
    sub: "Cognitive engagement tracked after every session. Doctors see the data. Families see the difference.",
  },
];

type SceneProps = { active: boolean; sceneProgress: number };

// ─── Scene 1 — Upload ──────────────────────────────────────────────────────────
function Scene1Upload({ active }: SceneProps) {
  const [key, setKey] = useState(0);
  useEffect(() => { if (active) setKey(k => k + 1); }, [active]);

  return (
    <div style={{ background: "#1a1208", padding: "36px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "260px", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%) rotate(2deg)", width: "50px", height: "14px", background: "rgba(255,240,180,0.35)", borderRadius: "2px", zIndex: 10 }} />
      <div style={{ background: "#f0e8d5", padding: "12px 12px 44px", transform: "rotate(-3deg)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", borderRadius: "2px", position: "relative" }}>
        <div style={{ width: "260px", height: "190px", position: "relative", overflow: "hidden" }}>
          <img src="/kitchen.png" alt="Kitchen" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "sepia(0.22) contrast(1.04)" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(180,120,60,0.1)", pointerEvents: "none" }} />
          <div key={key} style={{ position: "absolute", inset: 0, background: "#f0e8d5", animation: "develop 2.5s ease-out forwards", pointerEvents: "none" }} />
        </div>
        <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9px", color: "rgba(80,55,25,0.5)", letterSpacing: "1.5px", textTransform: "uppercase", margin: "10px 0 0", textAlign: "center" }}>
          Alexandria · 1974
        </p>
      </div>
    </div>
  );
}

// ─── Scene 2 — Reconstruction ─────────────────────────────────────────────────
const PHASES = [
  { at: 0,   label: "READING IMAGE" },
  { at: 18,  label: "DEPTH MAPPING" },
  { at: 40,  label: "BUILDING STRUCTURE" },
  { at: 65,  label: "ADDING LIGHT" },
  { at: 85,  label: "FINALISING" },
  { at: 100, label: "COMPLETE" },
];

function Scene2Recon({ active }: SceneProps) {
  const [progress, setProgress] = useState(0);
  const [scanY, setScanY] = useState(20);
  const rafRef = useRef<number>();
  const startRef = useRef<number>();

  useEffect(() => {
    if (!active) { setProgress(0); setScanY(20); return; }
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = (now - (startRef.current ?? now)) / 6000;
      const p = Math.min(100, elapsed * 100);
      setProgress(p);
      setScanY(20 + (p / 100) * 200);
      if (p < 100) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active]);

  const phase = PHASES.filter(ph => progress >= ph.at).at(-1)?.label ?? "READING IMAGE";
  const cloudOp = progress < 10 ? progress / 10 : progress < 30 ? 1 : Math.max(0, 1 - (progress - 30) / 10);
  const frameOp = progress < 20 ? 0 : Math.min(1, (progress - 20) / 20);
  const warmOp  = progress < 60 ? 0 : Math.min(1, (progress - 60) / 20);

  return (
    <div style={{ background: "#05080f", position: "relative", minHeight: "260px", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(107,138,255,0.007) 0px, rgba(107,138,255,0.007) 1px, transparent 1px, transparent 3px)", pointerEvents: "none", zIndex: 10 }} />

      {([["top:8px","left:8px","borderTop","borderLeft"],["top:8px","right:8px","borderTop","borderRight"],["bottom:8px","left:8px","borderBottom","borderLeft"],["bottom:8px","right:8px","borderBottom","borderRight"]] as string[][]).map((cfg, i) => {
        const st: React.CSSProperties = { position: "absolute", width: "14px", height: "14px", borderColor: "rgba(107,138,255,0.3)", borderStyle: "solid", borderWidth: 0 };
        cfg.forEach(c => { if (c.startsWith("top:")) st.top = c.slice(4); else if (c.startsWith("bottom:")) st.bottom = c.slice(7); else if (c.startsWith("left:")) st.left = c.slice(5); else if (c.startsWith("right:")) st.right = c.slice(6); else if (c === "borderTop") st.borderTopWidth = "1px"; else if (c === "borderBottom") st.borderBottomWidth = "1px"; else if (c === "borderLeft") st.borderLeftWidth = "1px"; else if (c === "borderRight") st.borderRightWidth = "1px"; });
        return <div key={i} style={st} />;
      })}

      <div style={{ position: "absolute", top: "14px", left: 0, right: 0, textAlign: "center", fontFamily: "var(--font-dm-mono)", fontSize: "26px", fontWeight: 300, color: "rgba(107,138,255,0.6)", letterSpacing: "4px", zIndex: 20 }}>
        {Math.round(progress)}%
      </div>
      <div style={{ position: "absolute", bottom: "44px", left: 0, right: 0, textAlign: "center", fontFamily: "var(--font-dm-mono)", fontSize: "7.5px", color: "rgba(255,255,255,0.15)", letterSpacing: "3px", zIndex: 20 }}>
        {phase}
      </div>

      <svg viewBox="0 0 500 220" width="100%" height="220" style={{ display: "block" }}>
        <defs>
          <filter id="s2sglow"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="s2hglow"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>

        <g opacity={cloudOp}>
          {[[120,180],[140,160],[160,175],[130,165],[115,170],[145,155],[155,168],[100,190],[170,185],[180,170],[110,160],[135,178],[125,168],[240,80],[260,70],[250,90],[270,85],[230,75],[255,65],[265,80],[200,100],[220,88],[210,78],[280,95],[290,75],[275,88],[350,180],[370,170],[360,185],[380,175],[340,165],[390,180],[310,190],[395,170],[355,160],[375,185]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r={0.5+(i%3)*0.4} fill={`rgba(107,138,255,${0.15+(i%4)*0.08})`} />
          ))}
        </g>

        <g opacity={frameOp}>
          <polygon points="120,30 380,30 380,170 120,170" fill="rgba(107,138,255,0.025)" stroke="rgba(107,138,255,0.45)" strokeWidth="0.8" />
          <polygon points="20,210 120,30 120,170 20,210" fill="rgba(107,138,255,0.015)" stroke="rgba(107,138,255,0.3)" strokeWidth="0.5" />
          <polygon points="480,210 380,30 380,170 480,210" fill="rgba(107,138,255,0.015)" stroke="rgba(107,138,255,0.3)" strokeWidth="0.5" />
          <polygon points="20,210 120,170 380,170 480,210" fill="rgba(107,138,255,0.01)" stroke="rgba(107,138,255,0.22)" strokeWidth="0.5" />
          <polygon points="20,10 120,30 380,30 480,10" fill="rgba(107,138,255,0.01)" stroke="rgba(107,138,255,0.22)" strokeWidth="0.5" />
          <line x1="120" y1="170" x2="480" y2="210" stroke="rgba(107,138,255,0.07)" strokeWidth="0.5" />
          <line x1="180" y1="170" x2="480" y2="210" stroke="rgba(107,138,255,0.07)" strokeWidth="0.5" />
          <line x1="250" y1="170" x2="480" y2="210" stroke="rgba(107,138,255,0.07)" strokeWidth="0.5" />
          <line x1="320" y1="170" x2="480" y2="210" stroke="rgba(107,138,255,0.07)" strokeWidth="0.5" />
          <line x1="20" y1="210" x2="480" y2="210" stroke="rgba(107,138,255,0.07)" strokeWidth="0.5" />
          <rect x="205" y="55" width="90" height="80" fill="rgba(107,138,255,0.015)" stroke="rgba(107,138,255,0.55)" strokeWidth="0.9" />
          <line x1="250" y1="55" x2="250" y2="135" stroke="rgba(107,138,255,0.35)" strokeWidth="0.6" />
          <line x1="205" y1="95" x2="295" y2="95" stroke="rgba(107,138,255,0.35)" strokeWidth="0.6" />
          <line x1="200" y1="135" x2="300" y2="135" stroke="rgba(107,138,255,0.55)" strokeWidth="1.2" filter="url(#s2sglow)" />
          <polygon points="120,170 200,170 200,210 20,210" fill="rgba(107,138,255,0.02)" stroke="rgba(107,138,255,0.22)" strokeWidth="0.5" />
          <line x1="120" y1="150" x2="200" y2="150" stroke="rgba(107,138,255,0.3)" strokeWidth="0.6" />
          <polygon points="300,170 380,170 480,210 300,210" fill="rgba(107,138,255,0.02)" stroke="rgba(107,138,255,0.22)" strokeWidth="0.5" />
          <polygon points="220,168 280,168 280,210 220,210" fill="rgba(107,138,255,0.015)" stroke="rgba(107,138,255,0.2)" strokeWidth="0.5" />
          <rect x="215" y="163" width="70" height="6" fill="rgba(107,138,255,0.04)" stroke="rgba(107,138,255,0.25)" strokeWidth="0.5" />
          <line x1="225" y1="168" x2="225" y2="210" stroke="rgba(107,138,255,0.2)" strokeWidth="0.6" />
          <line x1="275" y1="168" x2="275" y2="210" stroke="rgba(107,138,255,0.2)" strokeWidth="0.6" />
          <ellipse cx="250" cy="30" rx="18" ry="4" fill="rgba(107,138,255,0.04)" stroke="rgba(107,138,255,0.2)" strokeWidth="0.5" />
          <line x1="250" y1="34" x2="250" y2="52" stroke="rgba(107,138,255,0.2)" strokeWidth="0.5" />
          <ellipse cx="250" cy="52" rx="6" ry="3" fill="rgba(107,138,255,0.08)" stroke="rgba(107,138,255,0.3)" strokeWidth="0.5" />
          <circle cx="120" cy="30" r="2.5" fill="#6B8AFF" filter="url(#s2sglow)" />
          <circle cx="380" cy="30" r="2.5" fill="#6B8AFF" filter="url(#s2sglow)" />
          <circle cx="120" cy="170" r="2.5" fill="#6B8AFF" filter="url(#s2sglow)" />
          <circle cx="380" cy="170" r="2.5" fill="#6B8AFF" filter="url(#s2sglow)" />
          <circle cx="20" cy="10" r="1.8" fill="rgba(107,138,255,0.5)" />
          <circle cx="480" cy="10" r="1.8" fill="rgba(107,138,255,0.5)" />
          <circle cx="20" cy="210" r="1.8" fill="rgba(107,138,255,0.5)" />
          <circle cx="480" cy="210" r="1.8" fill="rgba(107,138,255,0.5)" />
          <text x="250" y="218" textAnchor="middle" fontFamily="var(--font-dm-mono)" fontSize="7" fill="rgba(107,138,255,0.2)" letterSpacing="1">6.2m × 2.8m · LOCKED</text>
        </g>

        <g opacity={warmOp}>
          <rect x="120" y="30" width="260" height="140" fill="rgba(160,100,50,0.05)" />
          <rect x="205" y="55" width="90" height="80" fill="rgba(255,210,80,0.1)" />
          <polygon points="220,135 280,135 310,170 190,170" fill="rgba(255,210,80,0.06)" />
          <ellipse cx="250" cy="160" rx="50" ry="18" fill="rgba(255,180,60,0.07)" filter="url(#s2hglow)" />
        </g>

        {progress > 8 && progress < 95 && (
          <line x1="20" y1={scanY} x2="480" y2={scanY} stroke="rgba(107,138,255,0.45)" strokeWidth="1" filter="url(#s2sglow)" />
        )}
      </svg>

      <div style={{ background: "#04070e", padding: "10px 16px", borderTop: "0.5px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: "11px", fontWeight: 300, color: "rgba(255,255,255,0.25)" }}>{phase.toLowerCase()}</span>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {[{ c: "#6B8AFF", l: "geometry", f: "rgba(107,138,255,0.5)" }, { c: "#34D399", l: "surfaces", f: "rgba(52,211,153,0.5)" }, { c: "#FCD34D", l: "light", f: "rgba(252,211,77,0.5)" }].map(({ c, l, f }) => (
            <span key={l} style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-dm-mono)", fontSize: "8px", color: f }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: c, display: "inline-block" }} />{l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Scene 3 — The Session (split screen) ─────────────────────────────────────
const DOCTOR_NOTES = "Patient responded immediately to familiar kitchen environment. Identified window placement correctly. Named items on counter without prompting. Emotional response: calm, then joyful. Memory recall stronger than last session.";

function Scene3Session({ active }: SceneProps) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!active) { setTyped(""); return; }
    let cancelled = false;
    let idx = 0;
    const step = () => {
      if (cancelled) return;
      if (idx < DOCTOR_NOTES.length) {
        idx++;
        setTyped(DOCTOR_NOTES.slice(0, idx));
        setTimeout(step, 28);
      }
    };
    const t = setTimeout(step, 600);
    return () => { cancelled = true; clearTimeout(t); };
  }, [active]);

  return (
    <div style={{ display: "flex", minHeight: "280px", overflow: "hidden" }}>
      {/* Left: kitchen photo */}
      <div style={{ flex: "0 0 42%", position: "relative", overflow: "hidden" }}>
        <img src="/kitchen.png" alt="Patient session" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.85)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "14px", left: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34D399", flexShrink: 0, animation: "liveDot 1.5s ease-in-out infinite" }} />
          <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "7px", color: "rgba(255,255,255,0.7)", letterSpacing: "2px", textTransform: "uppercase" }}>Patient · In session</span>
        </div>
      </div>

      {/* Right: doctor monitor */}
      <div style={{ flex: 1, background: "#03050a", position: "relative", padding: "14px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(107,138,255,0.006) 0px, rgba(107,138,255,0.006) 1px, transparent 1px, transparent 3px)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "7px", height: "100%" }}>
          {/* header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "0.5px solid rgba(255,255,255,0.05)", paddingBottom: "6px" }}>
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "6.5px", color: "rgba(107,138,255,0.6)", letterSpacing: "2px" }}>NEUROLOGIST CONSOLE</span>
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "6.5px", color: "rgba(255,255,255,0.2)" }}>14:23:07</span>
          </div>

          {/* metadata */}
          {[["SESSION", "#7 — Memory Recall"], ["PATIENT", "F. Hussein, 78"], ["DURATION", "14 min active"], ["RESPONSE", "↑ Elevated"]].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "7px", color: "rgba(255,255,255,0.18)", letterSpacing: "1.5px", flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "7px", color: "rgba(107,138,255,0.7)", textAlign: "right" }}>{value}</span>
            </div>
          ))}

          {/* waveform */}
          <svg viewBox="0 0 200 24" width="100%" height="24" style={{ display: "block", flexShrink: 0 }}>
            <polyline points="0,12 8,8 16,15 24,6 32,17 40,10 48,14 56,5 64,18 72,8 80,12 88,7 96,16 104,10 112,14 120,4 128,16 136,9 144,13 152,6 160,15 168,10 176,12 184,7 192,14 200,12" fill="none" stroke="rgba(52,211,153,0.5)" strokeWidth="1" style={{ animation: "waveformPulse 1.8s ease-in-out infinite" }} />
          </svg>

          {/* clinical notes */}
          <div style={{ flex: 1, borderTop: "0.5px solid rgba(255,255,255,0.05)", paddingTop: "6px" }}>
            <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "6.5px", color: "rgba(255,255,255,0.18)", letterSpacing: "1.5px", margin: "0 0 5px" }}>CLINICAL NOTES</p>
            <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "9.5px", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>
              {typed}
              <span style={{ borderRight: "1px solid rgba(107,138,255,0.9)", marginLeft: "1px", animation: "cursorBlink 0.8s step-end infinite" }}>&nbsp;</span>
            </p>
          </div>

          {/* attribution */}
          <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)", paddingTop: "6px", marginTop: "auto" }}>
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "6.5px", color: "rgba(255,255,255,0.2)", display: "block", textAlign: "right" }}>— Dr. Layla R., Neurologist</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Scene 4 — Enter VR (headset zoom) ────────────────────────────────────────
function Scene4VR({ sceneProgress }: SceneProps) {
  const zoomProgress = sceneProgress < 0.25 ? 0 : (sceneProgress - 0.25) / 0.75;
  const scale = 1 + zoomProgress * 2.2;
  const shadowY = 20 + zoomProgress * 40;
  const shadowBlur = 60 + zoomProgress * 80;
  const shadowAlpha = 0.12 + zoomProgress * 0.15;
  const brightness = 1 - zoomProgress * 0.25;
  const warmOp = Math.max(0, (zoomProgress - 0.4) / 0.6) * 0.4;

  return (
    <>
      <img
        src="/vr-headset.png"
        alt="VR Headset"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
          zIndex: 1,
          transform: `scale(${scale})`,
          transformOrigin: "50% 42%",
          transition: "transform 0.05s linear",
          willChange: "transform",
          filter: `drop-shadow(0 ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowAlpha})) brightness(${brightness})`,
        }}
      />

      {warmOp > 0 && (
        <div style={{ position: "absolute", inset: 0, background: `rgba(160,80,20,${warmOp})`, pointerEvents: "none", zIndex: 2 }} />
      )}

      {zoomProgress > 0.6 && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: `rgba(8,5,2,${Math.max(0, (zoomProgress - 0.6) / 0.4) * 0.85})`,
          pointerEvents: "none",
          zIndex: 3,
        }} />
      )}
    </>
  );
}

// ─── Scene 5 — Progress ────────────────────────────────────────────────────────
function Scene5Progress({ active }: SceneProps) {
  const [chartProgress, setChartProgress] = useState(0);

  useEffect(() => {
    if (!active) { setChartProgress(0); return; }
    setChartProgress(0);
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setChartProgress(current);
      if (current >= 100) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [active]);

  const cp = chartProgress / 100;
  const pathLength = 520;

  const pts = [[55, 170], [165, 145], [280, 118], [390, 82]];
  const curvePath = `M${pts[0][0]},${pts[0][1]} C${pts[0][0]+40},${pts[0][1]-5} ${pts[1][0]-40},${pts[1][1]+5} ${pts[1][0]},${pts[1][1]} C${pts[1][0]+40},${pts[1][1]-5} ${pts[2][0]-40},${pts[2][1]+5} ${pts[2][0]},${pts[2][1]} C${pts[2][0]+40},${pts[2][1]-5} ${pts[3][0]-40},${pts[3][1]+5} ${pts[3][0]},${pts[3][1]}`;
  const areaPath = `${curvePath} L${pts[3][0]},190 L${pts[0][0]},190 Z`;

  const pointThresholds = [0.05, 0.35, 0.65, 0.9];

  return (
    <div style={{ background: "#060810", padding: "24px", minHeight: "260px" }}>
      <svg viewBox="0 0 460 200" width="100%" style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id="s5curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(107,138,255,0.2)" />
            <stop offset="100%" stopColor="rgba(107,138,255,0.9)" />
          </linearGradient>
          <linearGradient id="s5areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(107,138,255,0.12)" />
            <stop offset="100%" stopColor="rgba(107,138,255,0)" />
          </linearGradient>
          <radialGradient id="s5endGlow">
            <stop offset="0%" stopColor="rgba(107,138,255,0.4)" />
            <stop offset="100%" stopColor="rgba(107,138,255,0)" />
          </radialGradient>
          <filter id="s5glow">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {[50, 90, 130, 170].map(y => <line key={y} x1="45" y1={y} x2="420" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />)}
        <line x1="45" y1="40" x2="45" y2="190" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

        {/* area fill fades in after line is 30% drawn */}
        <path d={areaPath} fill="url(#s5areaGrad)" opacity={Math.max(0, (cp - 0.3) / 0.7)} />

        {/* line draws itself left to right */}
        <path
          d={curvePath}
          fill="none"
          stroke="url(#s5curveGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength * (1 - cp)}
          style={{ transition: "none" }}
        />

        {/* data points appear sequentially as line reaches them */}
        {pts.map(([x, y], i) => {
          const visible = cp > pointThresholds[i];
          const isLast = i === 3;
          return (
            <g key={i} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}>
              {isLast ? (
                <>
                  <circle cx={x} cy={y} r="4" fill="#6B8AFF" stroke="white" strokeWidth="1.5" filter="url(#s5glow)" />
                  {visible && (
                    <circle cx={x} cy={y} r="16" fill="url(#s5endGlow)">
                      <animate attributeName="r" values="16;22;16" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0.5;1" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                </>
              ) : (
                <circle cx={x} cy={y} r="4" fill="#060810" stroke="rgba(107,138,255,0.4)" strokeWidth="1.2" />
              )}
            </g>
          );
        })}

        {/* tooltip appears last */}
        <g style={{ opacity: cp > 0.92 ? 1 : 0, transform: cp > 0.92 ? "translateY(0)" : "translateY(6px)", transition: "all 0.5s ease" }}>
          <rect x={pts[3][0]-54} y={pts[3][1]-42} width="72" height="32" rx="5" fill="rgba(13,19,40,0.95)" stroke="rgba(107,138,255,0.3)" strokeWidth="0.7" />
          <text x={pts[3][0]-18} y={pts[3][1]-26} textAnchor="middle" fontFamily="var(--font-dm-mono)" fontSize="9" fill="rgba(107,138,255,0.9)">↑ Improving</text>
          <text x={pts[3][0]-18} y={pts[3][1]-15} textAnchor="middle" fontFamily="var(--font-dm-mono)" fontSize="8" fill="rgba(255,255,255,0.3)">Memory Recall</text>
          <line x1={pts[3][0]-18} y1={pts[3][1]-10} x2={pts[3][0]} y2={pts[3][1]-4} stroke="rgba(107,138,255,0.3)" strokeWidth="0.7" strokeDasharray="3 2" />
        </g>

        {["Week 1","Week 2","Week 3","Week 4"].map((label, i) => (
          <text key={i} x={pts[i][0]} y="200" textAnchor="middle" fontFamily="var(--font-dm-mono)" fontSize="8" fill={i===3 ? "rgba(107,138,255,0.4)" : "rgba(255,255,255,0.12)"}>{label}</text>
        ))}
      </svg>

      {/* stat cards stagger in */}
      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        {[
          { label: "7 SESSIONS", value: "Completed", threshold: 0.7 },
          { label: "STREAK", value: "14 days", threshold: 0.8 },
          { label: "ENGAGEMENT", value: "↑ 34% this month", threshold: 0.9 },
        ].map((c, i) => {
          const visible = cp > c.threshold;
          return (
            <div key={i} style={{ flex: 1, background: "rgba(107,138,255,0.06)", border: "0.5px solid rgba(107,138,255,0.1)", borderRadius: "6px", padding: "10px 12px", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}>
              <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "7px", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "1.5px", margin: "0 0 4px" }}>{c.label}</p>
              <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "8px", color: "rgba(107,138,255,0.5)", fontWeight: 500, margin: 0 }}>{c.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
const SCENE_VISUALS = [Scene1Upload, Scene2Recon, Scene3Session, Scene4VR, Scene5Progress];

export function CinematicSteps() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    const handleScroll = () => {
      raf = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const sectionTop = -rect.top;
        const sectionHeight = section.offsetHeight - window.innerHeight;
        const rawProgress = sectionTop / sectionHeight;
        const progress = Math.max(0, Math.min(1, rawProgress));
        const idx = Math.min(4, Math.floor(progress * 5));
        const sp = Math.max(0, Math.min(1, (progress * 5) - idx));
        setActiveScene(idx);
        setSceneProgress(sp);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => { window.removeEventListener("scroll", handleScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <style>{`
        @keyframes develop { 0% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes waveformPulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 0.3; } }
        @keyframes liveDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
      `}</style>

      <section ref={sectionRef} id="how-it-works" style={{ height: "800vh", position: "relative" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F7F6F3", overflow: "hidden", width: "100%" }}>

          {scenes.map((scene, i) => {
            const isActive = activeScene === i;
            const Visual = SCENE_VISUALS[i];
            return (
              <div
                key={i}
                style={{
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                  display: i === 3 ? "block" : "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  textAlign: "center", padding: i === 3 ? 0 : "0 24px",
                  opacity: isActive ? 1 : 0,
                  transform: `translateY(${isActive ? 0 : activeScene > i ? -20 : 20}px)`,
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                  pointerEvents: isActive ? "auto" : "none",
                  boxSizing: "border-box",
                }}
              >
                {i === 3 ? (
                  <>
                    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#F7F6F3" }}>
                      <Visual active={isActive} sceneProgress={isActive ? sceneProgress : 0} />
                    </div>

                    {/* Left scroll indicator */}
                    <div style={{
                      position: "absolute",
                      left: "40px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      zIndex: 10,
                      opacity: Math.max(0, 1 - sceneProgress * 4),
                      pointerEvents: "none",
                    }}>
                      <div style={{ width: "1px", height: "56px", background: "rgba(0,0,0,0.12)", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: "1px", height: "28px", background: "rgba(0,0,0,0.45)", animation: "scrollDown 1.6s ease-in-out infinite" }} />
                      </div>
                      <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "7px", letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(0,0,0,0.25)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>scroll</span>
                    </div>

                    <div style={{
                      position: "absolute",
                      top: "48px",
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      padding: "0 24px",
                      zIndex: 10,
                      opacity: Math.max(0, 1 - sceneProgress * 2.5),
                      transition: "opacity 0.1s linear",
                      pointerEvents: "none",
                    }}>
                      <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(107,138,255,0.85)", fontWeight: 500, background: "rgba(107,138,255,0.06)", padding: "4px 12px", borderRadius: "100px", display: "inline-block", marginBottom: "18px" }}>
                        {scene.tag}
                      </p>
                      <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#080B14", lineHeight: 1.1, margin: "0 0 12px" }}>
                        {scene.headline}
                      </h2>
                      <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px", fontWeight: 300, color: "rgba(0,0,0,0.45)", lineHeight: 1.75, margin: 0 }}>
                        {scene.sub}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ maxWidth: "560px", width: "100%", marginBottom: "40px" }}>
                      <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(107,138,255,0.85)", fontWeight: 500, background: "rgba(107,138,255,0.06)", padding: "4px 12px", borderRadius: "100px", display: "inline-block", marginBottom: "18px" }}>
                        {scene.tag}
                      </p>
                      <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#080B14", lineHeight: 1.1, margin: "0 0 12px" }}>
                        {scene.headline}
                      </h2>
                      <p style={{ fontFamily: "var(--font-dm-sans)", fontSize: "15px", fontWeight: 300, color: "rgba(0,0,0,0.45)", lineHeight: 1.75, margin: 0 }}>
                        {scene.sub}
                      </p>
                    </div>
                    <div style={{ width: "100%", maxWidth: "560px", margin: "0 auto", borderRadius: "10px", overflow: "hidden", border: "0.5px solid rgba(0,0,0,0.08)" }}>
                      <Visual active={isActive} sceneProgress={isActive ? sceneProgress : 0} />
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <div className="cinematic-dots" style={{ position: "absolute", right: "32px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "12px", zIndex: 30 }}>
            {scenes.map((_, i) => (
              <div key={i} style={{ width: activeScene === i ? "6px" : "4px", height: activeScene === i ? "6px" : "4px", borderRadius: "50%", background: activeScene === i ? "#2B4FD4" : "rgba(0,0,0,0.15)", transition: "all 0.3s ease" }} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
