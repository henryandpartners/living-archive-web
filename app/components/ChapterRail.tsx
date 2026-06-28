"use client";
import { useActiveChapter } from "../hooks/useActiveChapter";

export interface ChapterRailItem {
  id: string;
  number: number;
  title: string;
}

export interface ChapterRailProps {
  chapters: ChapterRailItem[];
  activeId?: string;
}

export function ChapterRail({ chapters, activeId }: ChapterRailProps) {
  const ids = chapters.map((c) => c.id);
  const tracked = useActiveChapter(ids);
  const current = activeId ?? tracked;

  return (
    <nav
      aria-label="Chapters"
      className="hidden lg:flex flex-col gap-3 sticky top-24 self-start font-mono text-[11px] leading-[1.4]"
    >
      <span className="text-[9px] tracking-[0.22em] uppercase text-text-faint mb-1 font-semibold">
        Chapters
      </span>
      {chapters.map((c) => {
        const isActive = c.id === current;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            aria-current={isActive ? "true" : undefined}
            className={
              "flex gap-2.5 items-baseline transition-all duration-200 " +
              (isActive
                ? "text-accent font-semibold"
                : "text-text-faint hover:text-text-dim")
            }
          >
            <span
              className={
                "w-6 transition-colors " +
                (isActive ? "text-coral scale-110 inline-block" : "")
              }
            >
              {String(c.number).padStart(2, "0")}
            </span>
            <span className="text-[10px] tracking-[0.12em] uppercase">
              {c.title}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
