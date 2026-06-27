"use client";

import { motion } from "framer-motion";

export interface ChapterProps {
  number: number;
  title: string;
  id: string;
  children: React.ReactNode;
}

export function Chapter({ number, title, id, children }: ChapterProps) {
  const padded = String(number).padStart(2, "0");

  return (
    <motion.section
      id={id}
      className="py-14 md:py-28 border-t border-border scroll-mt-24"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <p
        className="text-[10px] tracking-[0.3em] uppercase text-accent mb-5"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Chapter {padded}
      </p>
      <h2
        className="text-2xl sm:text-3xl md:text-4xl tracking-[-0.02em] mb-8 leading-[1.15] text-text"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <div className="text-[16px] sm:text-[18px] leading-[1.7] text-text-dim space-y-5 sm:space-y-6 [&_strong]:text-text [&_strong]:font-semibold">
        {children}
      </div>
    </motion.section>
  );
}
