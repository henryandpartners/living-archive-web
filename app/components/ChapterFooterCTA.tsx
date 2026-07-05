"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function ChapterFooterCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`section-spacing ${visible ? "reveal visible" : "reveal"}`}
    >
      <div
        style={{
          background: "var(--bg-alt)",
          borderRadius: 14,
          padding: "2.5rem 2rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "0.5rem",
          }}
        >
          Continue
        </p>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 700,
            fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
            marginBottom: "0.5rem",
          }}
        >
          See the technical pipeline
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            maxWidth: 440,
            margin: "0 auto 1.25rem",
          }}
        >
          Explore how we encode cultural data into DNA, screen for safety, and apply quantum
          error correction.
        </p>
        <Link href="/pipeline" className="btn btn-primary">
          View Pipeline <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
