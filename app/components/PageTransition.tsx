"use client";

import { AnimatePresence, motion } from "framer-motion";

export interface PageTransitionProps {
  pathname: string;
  children: React.ReactNode;
}

export function PageTransition({ pathname, children }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
