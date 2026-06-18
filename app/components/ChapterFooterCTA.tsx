import Link from "next/link";

export function ChapterFooterCTA() {
  return (
    <section className="py-20 border-t border-border text-center">
      <p
        className="text-[10px] tracking-[0.3em] uppercase text-text-faint mb-4"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        After the story
      </p>
      <h3
        className="text-3xl tracking-[-0.02em] mb-3 text-text"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Try it.{" "}
        <em className="italic font-light text-text-dim">Or read the science.</em>
      </h3>
      <p className="text-[16px] text-text-dim mb-8 max-w-md mx-auto leading-[1.6]">
        Encode a sentence into DNA in your browser, or open the full technical
        papers.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/pipeline"
          className="inline-flex items-center gap-2 px-8 py-3.5 text-black text-[11px] tracking-[0.18em] uppercase bg-accent border border-accent hover:bg-accent-hover hover:border-accent-hover transition-all"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Try the Pipeline →
        </Link>
        <Link
          href="/publications"
          className="inline-flex items-center gap-2 px-8 py-3.5 text-text-dim text-[11px] tracking-[0.18em] uppercase border border-border hover:border-text-faint hover:text-text transition-all"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Read the Publications
        </Link>
      </div>
      <p
        className="mt-8 text-text-faint text-[10px] tracking-[0.15em] uppercase"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Nature Biotech · Science Advances · Leonardo (MIT Press)
      </p>
    </section>
  );
}
