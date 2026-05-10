export function OrbBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Top-left — deep blue */}
      <div
        className="absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          top: -200,
          left: -200,
          background: "radial-gradient(circle, #1a3a8f 0%, transparent 70%)",
          opacity: 0.18,
          filter: "blur(120px)",
        }}
      />
      {/* Bottom-right — lavender */}
      <div
        className="absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          bottom: -250,
          right: -200,
          background: "radial-gradient(circle, #6B5FD4 0%, transparent 70%)",
          opacity: 0.15,
          filter: "blur(120px)",
        }}
      />
      {/* Center-right — electric blue */}
      <div
        className="absolute rounded-full"
        style={{
          width: 400,
          height: 400,
          top: "30%",
          right: "8%",
          background: "radial-gradient(circle, #2B4FD4 0%, transparent 70%)",
          opacity: 0.1,
          filter: "blur(120px)",
        }}
      />
    </div>
  );
}
