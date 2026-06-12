import { StoryHero } from './components/StoryHero';
import { Chapter } from './components/Chapter';
import { ChapterRail } from './components/ChapterRail';
import { ChapterFooterCTA } from './components/ChapterFooterCTA';
import { CHAPTERS } from './content/chapters';

export default function StoryPage() {
  const rail = CHAPTERS.map((c) => ({ id: c.id, number: c.number, title: c.short }));
  return (
    <>
      <StoryHero />
      <div className="max-w-6xl mx-auto px-6 pt-12 lg:grid lg:grid-cols-[120px_minmax(0,1fr)_120px] lg:gap-12">
        <ChapterRail chapters={rail} />
        <article className="max-w-[620px] mx-auto w-full">
          {CHAPTERS.map((c) => (
            <Chapter key={c.id} number={c.number} title={c.title} id={c.id}>
              {c.render()}
            </Chapter>
          ))}
          <ChapterFooterCTA />
        </article>
        <aside className="hidden lg:block sticky top-24 self-start font-mono text-[10px] tracking-[0.15em] uppercase text-text-faint">
          <span>9 chapters · 12 min</span>
        </aside>
      </div>
    </>
  );
}
