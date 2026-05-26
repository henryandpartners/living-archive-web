import Image from 'next/image';

export function StoryHero() {
  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex items-end">
      <div className="absolute inset-0">
        <Image src="/story-images/hero.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-bg/30" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20 md:pb-28 w-full">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-5">
          NYUAD CGSB · Artist-in-Residence 2024–2025
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-0.025em] leading-[0.98] mb-6 text-text">
          DNA Libraries,<br />Dreamscapes &amp;{' '}
          <em className="italic font-normal text-text-dim">Organoids</em>
        </h1>
        <p className="text-[17px] md:text-lg text-text-dim max-w-xl leading-[1.6]">
          Storing cultural archives in zebrafish DNA. Building a temple where the archive swims, reproduces, and outlives us all.
        </p>
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-faint mt-5">
          Henry Tan &amp; Carmen Koessler · 12 min read
        </p>
      </div>
    </section>
  );
}
