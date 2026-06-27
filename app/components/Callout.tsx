"use client";

import { motion } from "framer-motion";

export interface CalloutProps {
  children: React.ReactNode;
}

export function Callout({ children }: CalloutProps) {
  return (
    <motion.aside
      role="note"
      className="my-8 sm:my-10 pl-6 border-l-2 border-accent text-[16px] leading-[1.7] text-text-dim"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.aside>
  );
}
