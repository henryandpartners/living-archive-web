"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { label: "Story", href: "/" },
  { label: "Pipeline", href: "/pipeline" },
  { label: "Publications", href: "/publications" },
];

export interface SiteNavProps {
  pathname: string;
}

export function SiteNav({ pathname }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isHome = pathname === "/";
  const light = isHome && !scrolled;

  return (
    <>
      {/* Top bar — BLOON-style */}
      <div className="fixed top-0 left-0 right-0 z-[31] bg-white border-b border-border h-[38px] flex items-center font-serif text-[12.5px]">
        <div className="w-full flex items-center justify-between px-[clamp(20px,5vw,56px)]">
          <div className="flex items-center gap-[9px] text-ink">
            <span className="hidden sm:inline">NYUAD CGSB · Artist-in-Residence</span>
            <span className="sm:hidden">NYUAD CGSB</span>
          </div>
          <div className="flex items-center gap-[14px] text-ink">
            <Link href="/pipeline" className="hover:text-azure transition-colors">
              Pipeline
            </Link>
            <Link href="/publications" className="hover:text-azure transition-colors">
              Publications
            </Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={
          "fixed top-[38px] left-0 right-0 z-30 flex items-center justify-between transition-all duration-400 " +
          "px-[clamp(20px,5vw,56px)] py-[18px] " +
          (light ? "text-white" : "text-ink") +
          (scrolled
            ? " bg-white/96 backdrop-blur-[8px] text-ink shadow-[0_1px_0_var(--color-border)]"
            : "")
        }
      >
        <Link href="/" className="block" aria-label="Living Archive home">
          <svg
            className="h-[30px] w-auto"
            viewBox="0 0 180 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="0"
              y="22"
              fontFamily="var(--font-serif)"
              fontWeight="800"
              fontSize="22"
              fill="currentColor"
              letterSpacing="-0.02em"
            >
              Living Archive
            </text>
          </svg>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 font-serif text-[13px] tracking-[0.02em] font-medium">
          {LINKS.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  "transition-colors " +
                  (active
                    ? "text-azure"
                    : light
                      ? "text-white/80 hover:text-white"
                      : "text-muted hover:text-ink")
                }
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Burger — mobile */}
        <button
          className="md:hidden appearance-none bg-none border-0 cursor-pointer w-[34px] h-[22px] relative"
          style={{ color: "inherit" }}
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className="absolute left-0 top-0 right-0 h-[2px] rounded bg-current" />
          <span className="absolute left-0 top-[9px] right-0 h-[2px] rounded bg-current" />
          <span className="absolute left-0 bottom-0 right-0 h-[2px] rounded bg-current" />
        </button>
      </nav>

      {/* Full-screen menu overlay */}
      <div
        className={
          "fixed inset-0 z-40 bg-white/98 backdrop-blur-[8px] flex flex-col items-center justify-center gap-6 transition-opacity duration-300 " +
          (menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
      >
        <button
          className="absolute top-5 right-7 bg-none border-0 text-[42px] leading-none text-ink cursor-pointer font-serif"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          ×
        </button>
        <Link href="/" className="mb-3" onClick={() => setMenuOpen(false)}>
          <svg className="h-[34px] w-auto" viewBox="0 0 180 34" fill="none">
            <text
              x="0"
              y="26"
              fontFamily="var(--font-serif)"
              fontWeight="800"
              fontSize="26"
              fill="#003054"
              letterSpacing="-0.02em"
            >
              Living Archive
            </text>
          </svg>
        </Link>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="font-serif font-semibold text-[clamp(30px,6vw,48px)] text-ink no-underline tracking-[0.01em] hover:text-azure transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
