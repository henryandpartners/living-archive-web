'use client';
import { useActiveChapter } from '../hooks/useActiveChapter';

export interface ChapterRailItem {
  id: string;
  number: number;
  title: string;
}

export interface ChapterRailProps {
  chapters: ChapterRailItem[];
  /** Optional override; when omitted the rail tracks scroll itself. */
  activeId?: string;
}

export function ChapterRail({ chapters, activeId }: ChapterRailProps) {
  const ids = chapters.map((c) => c.id);
  const tracked = useActiveChapter(ids);
  const current = activeId ?? tracked;

  return (
    <nav
      aria-label="Chapters"
      className="hidden lg:flex flex-col gap-3.5 sticky top-24 self-start font-mono text-[11px] leading-[1.4]"
    >
      <span className="text-[9px] tracking-[0.22em] uppercase text-text-faint mb-2">
        Chapters
      </span>
      {chapters.map((c) => {
        const isActive = c.id === current;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            aria-current={isActive ? 'true' : undefined}
            className={
              'flex gap-2.5 items-baseline transition-colors ' +
              (isActive ? 'text-text' : 'text-text-faint hover:text-text-dim')
            }
          >
            <span className={'w-6 ' + (isActive ? 'text-accent' : '')}>
              {String(c.number).padStart(2, '0')}
            </span>
            <span className="text-[10px] tracking-[0.12em] uppercase">{c.title}</span>
          </a>
        );
      })}
    </nav>
  );
}
