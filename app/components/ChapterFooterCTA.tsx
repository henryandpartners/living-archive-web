"use client";

import { useReveal } from "../hooks/useReveal";
import Link from "next/link";

export function ChapterFooterCTA() {
  const { ref, visible } = useReveal();
  return (
    <section
      ref={ref}
      className={`py-16 reveal ${visible ? "visible" : ""}`}
    >
      <div className="bg-bg-dark rounded-2xl p-10 md:p-14 text-center text-[#e8e8e8]">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-coral mb-4">
          Continue
        </p>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-serif text-white">
          See the technical pipeline
        </h2>
        <p className="text-[#8899a8] max-w-md mx-auto mb-8 text-[16px] leading-relaxed">
          Explore how we encode cultural data into DNA, screen for safety, and apply quantum error correction.
        </p>
        <Link
          href="/pipeline"
          className="inline-flex items-center gap-2 bg-white text-bg-dark px-6 py-3 rounded-full font-semibold text-sm hover:bg-coral-soft transition-colors"
        >
          View Pipeline <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
