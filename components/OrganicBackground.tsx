"use client";

import { useEffect, useRef } from "react";

export default function OrganicBackground() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!ref.current) return;
        ref.current.style.transform = `translateY(${window.scrollY * 0.12}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <svg
      ref={ref}
      style={{
        position: "absolute",
        top: "-20%",
        left: 0,
        width: "100%",
        height: "140%",
        pointerEvents: "none",
        zIndex: 0,
        willChange: "transform",
      }}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1">
        <path d="M-100,200 C200,150 400,300 700,180 C1000,60 1200,250 1600,200" />
        <path d="M-100,320 C150,280 350,420 650,300 C950,180 1150,370 1600,320" />
        <path d="M-100,440 C300,380 500,520 800,400 C1100,280 1300,460 1600,420" />
        <path d="M-100,560 C250,510 450,640 750,520 C1050,400 1250,580 1600,540" />
        <path d="M-100,680 C200,630 400,760 700,640 C1000,520 1200,700 1600,660" />
        <path d="M-100,140 C350,100 550,240 850,130 C1150,20 1350,200 1600,150" />
        <path d="M-100,800 C300,750 500,870 800,760 C1100,650 1300,810 1600,780" />
        <path d="M-200,350 C400,200 800,500 1200,300 C1400,200 1500,400 1700,350" strokeWidth="0.5" />
        <path d="M-200,600 C300,480 700,700 1100,550 C1350,460 1500,620 1700,580" strokeWidth="0.5" />
      </g>
    </svg>
  );
}
