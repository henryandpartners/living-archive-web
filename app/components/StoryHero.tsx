"use client";

import { useEffect, useRef, useState } from "react";

function DnaParticle({ delay, left, size }: { delay: number; left: string; size: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left,
        width: size,
        height: size,
        background: "var(--color-accent)",
        opacity: 0,
        top: "-20px",
        animation: `float ${3 + Math.random() * 4}s ease-in-out ${delay}s infinite, fade-in-up 1s var(--ease-out-expo) ${delay}s forwards`,
      }}
    />
  );
}

export function StoryHero() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      canvas.style.width = canvas.offsetWidth + "px";
      canvas.style.height = canvas.offsetHeight + "px";
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const strands: {
      x: number;
      amp: number;
      freq: number;
      phase: number;
      color: string;
      nodes: { y: number; offset: number }[];
    }[] = [];

    const colors = ["#006994", "#0077cc", "#e8614d", "#c4983e"];
    const nodeCount = 30;
    const w = canvas.width / 2;
    const h = canvas.height / 2;

    for (let s = 0; s < 4; s++) {
      const strand = {
        x: 120 + s * 180,
        amp: 40 + s * 10,
        freq: 0.008 + s * 0.002,
        phase: s * 1.2,
        color: colors[s],
        nodes: Array.from({ length: nodeCount }, (_, i) => ({
          y: (i / nodeCount) * (h + 80) - 40,
          offset: 0,
        })),
      };
      strands.push(strand);
    }

    function draw() {
      if (!ctx || !canvas) return;
      const cw = canvas.width / 2;
      const ch = canvas.height / 2;
      ctx.clearRect(0, 0, cw, ch);
      t += 0.008;

      strands.forEach((s) => {
        // draw backbone
        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.25;

        s.nodes.forEach((node, i) => {
          const x = s.x + Math.sin(node.y * s.freq + t + s.phase) * s.amp;
          const y = node.y;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // draw nucleotide nodes
        s.nodes.forEach((node, i) => {
          const x = s.x + Math.sin(node.y * s.freq + t + s.phase) * s.amp;
          const y = node.y;

          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = 0.5;
          ctx.fill();

          // connect pairs
          if (i % 2 === 0 && strands[s === strands[0] ? 1 : s === strands[2] ? 3 : 0]) {
            const other = strands[s === strands[0] ? 1 : s === strands[2] ? 3 : 2];
            const ox = other.x + Math.sin(other.nodes[i].y * other.freq + t + other.phase) * other.amp;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(ox, y);
            ctx.strokeStyle = s.color;
            ctx.globalAlpha = 0.1;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <section className="relative min-h-[90vh] flex items-end bg-bg-dark overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          background: "radial-gradient(ellipse at 30% 50%, rgba(0,105,148,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(232,97,77,0.2) 0%, transparent 60%)",
        }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-24 w-full">
          <div className="h-96" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[90vh] flex items-end bg-bg-dark overflow-hidden">
      {/* Animated DNA canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Radial glow overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 30% 50%, rgba(0,105,148,0.25) 0%, transparent 60%), radial-gradient(ellipse at 70% 40%, rgba(232,97,77,0.15) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(196,152,62,0.1) 0%, transparent 50%)",
      }} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <DnaParticle
            key={i}
            delay={Math.random() * 5}
            left={`${Math.random() * 100}%`}
            size={2 + Math.random() * 4}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-24 w-full">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent-soft mb-5 animate-fade-in-up">
          NYUAD CGSB · Artist-in-Residence 2024–2025
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.025em] leading-[0.98] mb-6 text-[#e8e8e8] font-serif animate-fade-in-up anim-delay-1">
          DNA Libraries,<br />Dreamscapes &amp;{' '}
          <em className="italic font-normal text-coral">Organoids</em>
        </h1>
        <p className="text-[17px] md:text-lg text-[#aab8c0] max-w-xl leading-[1.6] font-sans animate-fade-in-up anim-delay-2">
          Storing cultural archives in zebrafish DNA. Building a temple where the archive swims, reproduces, and outlives us all.
        </p>
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#5a7080] mt-5 animate-fade-in-up anim-delay-3">
          Henry Tan &amp; Carmen Koessler · 12 min read
        </p>
      </div>

      {/* Bottom fade to content */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, var(--color-bg), transparent)",
        }}
      />
    </section>
  );
}
