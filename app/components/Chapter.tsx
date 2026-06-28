"use client";

import { useReveal } from "../hooks/useReveal";

export interface ChapterProps {
  number: number;
  title: string;
  id: string;
  children: React.ReactNode;
}

/*
 * Decorative nucleotide bar — shows A/C/G/T colored dots for a chapter
 */
function NucBar({ nucs }: { nucs: string[] }) {
  return (
    <div className="flex gap-1 mt-1" aria-hidden="true">
      {nucs.map((n, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: `var(--color-dna-${n.toLowerCase()})` }}
        />
      ))}
    </div>
  );
}

const BARS: Record<number, string[]> = {
  1: "ACGTACGTACGTACGTACGTAC".split(""),
  2: "GATCCTGAGATTCGACATGGC".split(""),
  3: "TTAGCCGATACGTAAGCCGTA".split(""),
  4: "CGTACGTACGTAACGTACGTC".split(""),
  5: "GATTACAGATTACAGATTACA".split(""),
  6: "ACGTACGTACGAACGTACGTG".split(""),
  7: "TAGCTAGCTAGCTAGCTAGCC".split(""),
  8: "GCTAGCTAGCTAGCTAGCTAG".split(""),
  9: "CAGTCAGTCAGTCAGTCAGTT".split(""),
};

export function Chapter({ number, title, id, children }: ChapterProps) {
  const { ref, visible } = useReveal();
  const padded = String(number).padStart(2, "0");
  const nucs = BARS[number] ?? BARS[1];

  return (
    <section
      id={id}
      ref={ref}
      className={`py-24 md:py-32 border-t border-border-soft scroll-mt-20 reveal ${visible ? "visible" : ""}`}
    >
      <div className="flex items-start gap-4 mb-6">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-1">
            Chapter {padded}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] leading-[1.1] text-text font-serif">
            {title}
          </h2>
        </div>
        <NucBar nucs={nucs} />
      </div>
      <div className="text-[17px] leading-[1.85] text-text-dim space-y-5 [&_strong]:text-text [&_strong]:font-semibold font-sans">
        {children}
      </div>
    </section>
  );
}
