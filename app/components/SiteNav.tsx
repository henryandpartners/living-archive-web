"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { label: "Story", href: "/", match: (p: string) => p === "/" },
  {
    label: "Pipeline",
    href: "/pipeline",
    match: (p: string) => p.startsWith("/pipeline"),
  },
  {
    label: "Publications",
    href: "/publications",
    match: (p: string) => p.startsWith("/publications"),
  },
];

export interface SiteNavProps {
  pathname: string;
  children?: React.ReactNode;
}

export function SiteNav({ pathname, children }: SiteNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="text-[15px] tracking-[-0.02em] text-text"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Living Archive
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center">
          {LINKS.map((l) => {
            const active = l.match(pathname);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={
                  "text-[11px] tracking-[0.2em] uppercase transition-colors border-b-2 pb-0.5 " +
                  (active
                    ? "text-accent border-accent"
                    : "text-text-dim border-transparent hover:text-text hover:border-text-faint")
                }
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1 p-1"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span
            className={
              "block w-5 h-px bg-text transition-transform " +
              (open ? "rotate-45 translate-y-[3px]" : "")
            }
          />
          <span
            className={
              "block w-5 h-px bg-text transition-opacity " +
              (open ? "opacity-0" : "")
            }
          />
          <span
            className={
              "block w-5 h-px bg-text transition-transform " +
              (open ? "-rotate-45 -translate-y-[3px]" : "")
            }
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-black/98 border-b border-border px-6 py-4 flex flex-col gap-4">
          {LINKS.map((l) => {
            const active = l.match(pathname);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={
                  "text-[13px] tracking-[0.15em] uppercase transition-colors " +
                  (active ? "text-accent" : "text-text-dim hover:text-text")
                }
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}

      {children}
    </nav>
  );
}
