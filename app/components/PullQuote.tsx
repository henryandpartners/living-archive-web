"use client";

import { motion } from "framer-motion";

export interface PullQuoteProps {
  children: React.ReactNode;
  citation?: string;
}

export function PullQuote({ children, citation }: PullQuoteProps) {
  return (
    <motion.blockquote
      className="text-center my-12 md:my-20 px-4"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      style={{ fontFamily: "var(--font-display)" }}
    >
      <p className="text-xl sm:text-2xl md:text-3xl text-text leading-[1.45] italic font-light tracking-[-0.01em]">
        {children}
      </p>
      {citation && (
        <cite
          className="block not-italic mt-4 text-text-faint text-[11px] tracking-[0.18em] uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          — {citation}
        </cite>
      )}
    </motion.blockquote>
  );
}
