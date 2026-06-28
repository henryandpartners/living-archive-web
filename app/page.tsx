import { Hero } from './components/Hero';
import { ChapterPanel } from './components/ChapterPanel';
import { SiteFooter } from './components/SiteFooter';
import { CHAPTERS } from './content/chapters';

export default function StoryPage() {
  return (
    <>
      <Hero />

      {/* Chapters as full-vh panels */}
      {CHAPTERS.map((ch, i) => (
        <ChapterPanel
          key={ch.id}
          number={ch.number}
          title={ch.title}
          align={i % 2 === 0 ? "left" : "right"}
          // dark bg for Translation + Fish chapters
          dark={ch.number === 3 || ch.number === 5}
        >
          {ch.render()}
        </ChapterPanel>
      ))}

      {/* Contact / CTA section — BLOON-style */}
      <section className="relative z-[3]">
        <div className="sticky top-0 h-screen flex items-center justify-center text-center px-6">
          <div className="max-w-[540px]">
            <p className="font-serif text-[12px] tracking-[0.3em] uppercase text-azure mb-4">
              Get involved
            </p>
            <h2 className="font-serif font-light text-[clamp(30px,6vw,60px)] leading-[1.06] tracking-[-0.01em] text-ink">
              The archive is alive.<br />Help it grow.
            </h2>
            <p className="text-muted text-[clamp(15px,2.4vw,18px)] mt-4 mb-8">
              We're looking for collaborators, funders, and institutions who want to explore DNA as a medium for cultural preservation.
            </p>
            <div className="flex flex-col items-stretch gap-3 w-full max-w-[460px] mx-auto">
              <a href="mailto:livingarchive@proton.me" className="pill-btn accent">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                Email us
              </a>
              <div className="grid grid-cols-2 gap-3">
                <a href="https://github.com/henryandpartners/living-archive-web" target="_blank" rel="noopener noreferrer" className="pill-btn">
                  GitHub
                </a>
                <a href="/publications" className="pill-btn">
                  Publications
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
