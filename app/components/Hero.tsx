"use client";

import { useEffect, useRef, useState } from "react";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Hide scroll hint on scroll
  useEffect(() => {
    const hint = hintRef.current;
    if (!hint) return;
    const onScroll = () => {
      hint.style.opacity = window.scrollY > 40 ? "0" : "0.9";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Canvas DNA animation
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const c = canvas;
    const cx = ctx;
    let animId: number;
    let t = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 2;
      c.width = c.offsetWidth * dpr;
      c.height = c.offsetHeight * dpr;
      c.style.width = c.offsetWidth + "px";
      c.style.height = c.offsetHeight + "px";
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#0c78b4", "#0077cc", "#0aa", "#00aa55"];
    const nodeCount = 40;

    function draw() {
      const w = c.width / (window.devicePixelRatio || 2);
      const h = c.height / (window.devicePixelRatio || 2);
      cx.clearRect(0, 0, w, h);
      t += 0.006;

      const cw = w / 2;
      const spacing = Math.min(w / 5, 200);

      for (let s = 0; s < 4; s++) {
        const x = cw - spacing * 1.5 + s * spacing;
        const amp = 35 + s * 12;
        const freq = 0.006 + s * 0.002;
        const phase = s * 1.3;
        const color = colors[s];

        // Draw backbone
        cx.beginPath();
        cx.strokeStyle = color;
        cx.lineWidth = 1.5;
        cx.globalAlpha = 0.18;

        for (let i = 0; i < nodeCount; i++) {
          const y = -20 + (i / nodeCount) * (h + 40);
          const ox = Math.sin(y * freq + t + phase) * amp;
          if (i === 0) cx.moveTo(x + ox, y);
          else cx.lineTo(x + ox, y);
        }
        cx.stroke();

        // Nucleotide dots
        for (let i = 0; i < nodeCount; i++) {
          const y = -20 + (i / nodeCount) * (h + 40);
          const ox = Math.sin(y * freq + t + phase) * amp;

          cx.beginPath();
          cx.arc(x + ox, y, 2.2, 0, Math.PI * 2);
          cx.fillStyle = color;
          cx.globalAlpha = 0.4;
          cx.fill();

          // Connecting lines between pairs
          if (i % 3 === 0 && s < 3) {
            const nextX = cw - spacing * 1.5 + (s + 1) * spacing;
            const nextAmp = 35 + (s + 1) * 12;
            const nextFreq = 0.006 + (s + 1) * 0.002;
            const nextPhase = (s + 1) * 1.3;
            const nox = Math.sin(y * nextFreq + t + nextPhase) * nextAmp;
            cx.beginPath();
            cx.moveTo(x + ox, y);
            cx.lineTo(nextX + nox, y);
            cx.strokeStyle = color;
            cx.globalAlpha = 0.07;
            cx.lineWidth = 0.5;
            cx.stroke();
          }
        }
      }
      cx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [mounted]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#031d2e] overflow-hidden">
      {/* DNA canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Radial glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(12,120,180,0.2) 0%, transparent 60%), " +
            "radial-gradient(ellipse at 70% 40%, rgba(0,170,170,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Content — centered like BLOON hero */}
      <div className="relative z-10 text-center px-6 max-w-[640px]">
        {/* Title SVG — large */}
        <svg
          className="w-[min(58vw,440px)] h-auto mx-auto mb-5"
          viewBox="0 0 440 120"
          fill="none"
        >
          <text
            x="220"
            y="48"
            textAnchor="middle"
            fontFamily="var(--font-serif)"
            fontWeight="800"
            fontSize="48"
            fill="#ffffff"
            letterSpacing="-0.03em"
          >
            Living Archive
          </text>
          <text
            x="220"
            y="82"
            textAnchor="middle"
            fontFamily="var(--font-serif)"
            fontWeight="300"
            fontSize="20"
            fill="rgba(191,224,247,0.8)"
            letterSpacing="0.05em"
          >
            DNA Libraries
          </text>
          <line
            x1="120"
            y1="98"
            x2="320"
            y2="98"
            stroke="rgba(12,120,180,0.4)"
            strokeWidth="1"
          />
          <text
            x="220"
            y="114"
            textAnchor="middle"
            fontFamily="var(--font-sans)"
            fontWeight="300"
            fontSize="11"
            fill="rgba(127,160,189,0.7)"
            letterSpacing="0.25em"
          >
            DREAMSCAPES &amp; ORGANOIDS
          </text>
        </svg>

        <p className="text-[#7fa0bd] text-[clamp(15px,2.4vw,18px)] max-w-[520px] mx-auto mt-5 leading-relaxed">
          Storing cultural archives in zebrafish DNA. Building a temple where the archive swims,
          reproduces, and outlives us all.
        </p>

        <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#4a7088] mt-5">
          Henry Tan &amp; Carmen Koessler · NYUAD CGSB
        </p>
      </div>

      {/* Scroll hint */}
      <div
        ref={hintRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 scroll-hint text-muted z-10"
        style={{ opacity: 0.9 }}
      >
        Scroll
      </div>
    </section>
  );
}
