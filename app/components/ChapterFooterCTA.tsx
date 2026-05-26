import Link from 'next/link';

export function ChapterFooterCTA() {
  return (
    <section className="py-20 border-t border-border-soft text-center">
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-text-faint mb-3">
        After the story
      </p>
      <h3 className="text-3xl font-bold tracking-[-0.02em] mb-2 text-text">
        Try it. <em className="italic font-normal text-text-dim">Or read the science.</em>
      </h3>
      <p className="text-[15px] text-text-dim mb-7 max-w-md mx-auto leading-[1.6]">
        Encode a sentence into DNA in your browser, or open the full technical papers.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/pipeline"
          className="font-mono text-[11px] tracking-[0.18em] uppercase px-6 py-3.5 rounded-sm bg-accent text-bg font-medium hover:opacity-90 transition-opacity"
        >
          Try the Pipeline →
        </Link>
        <Link
          href="/publications"
          className="font-mono text-[11px] tracking-[0.18em] uppercase px-6 py-3.5 rounded-sm bg-bg-elev border border-border text-text-dim hover:border-text-dim transition-colors"
        >
          Read the Publications
        </Link>
      </div>
      <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-faint mt-7">
        Nature Biotech · Science Advances · Leonardo (MIT Press)
      </p>
    </section>
  );
}
