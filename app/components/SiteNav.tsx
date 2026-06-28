"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { label: "Story", href: "/", match: (p: string) => p === "/" },
  { label: "Pipeline", href: "/pipeline", match: (p: string) => p.startsWith("/pipeline") },
  { label: "Publications", href: "/publications", match: (p: string) => p.startsWith("/publications") },
];

export interface SiteNavProps {
  pathname: string;
}

export function SiteNav({ pathname }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = pathname === "/";

  return (
    <nav
      className={
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 " +
        (scrolled
          ? "bg-bg/95 backdrop-blur-sm border-b border-border-soft shadow-sm"
          : isDark
            ? "bg-transparent border-b border-transparent"
            : "bg-bg/95 border-b border-border-soft")
      }
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className={
            "text-[16px] font-bold tracking-tight font-serif " +
            (scrolled || !isDark ? "text-text" : "text-[#e8e8e8]")
          }
        >
          Living Archive
        </Link>
        <div className="flex gap-8 font-mono text-[10px] tracking-[0.18em] uppercase">
          {LINKS.map((l) => {
            const active = l.match(pathname);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={
                  "pb-0.5 transition-colors " +
                  (active
                    ? scrolled || !isDark
                      ? "text-text border-b border-accent"
                      : "text-[#e8e8e8] border-b border-coral"
                    : scrolled || !isDark
                      ? "text-text-dim hover:text-text"
                      : "text-[#aab8c0] hover:text-[#e8e8e8]")
                }
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
