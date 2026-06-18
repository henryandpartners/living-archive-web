import Image from "next/image";

export function StoryHero() {
  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex items-end">
      <div className="absolute inset-0">
        <Image
          src="/story-images/hero.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20 md:pb-28 w-full">
        <p
          className="text-[10px] tracking-[0.35em] uppercase text-accent mb-6"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          NYUAD CGSB · Artist-in-Residence 2024–2025
        </p>
        <h1
          className="text-[2.5rem] md:text-6xl lg:text-7xl tracking-[-0.025em] leading-[0.98] mb-6 text-text"
          style={{ fontFamily: "var(--font-display)" }}
        >
          DNA Libraries,
          <br />
          Dreamscapes{" "}
          <em className="italic font-light text-text-dim">&amp; Organoids</em>
        </h1>
        <p className="text-lg md:text-xl text-text-dim max-w-xl leading-[1.6]">
          Storing cultural archives in zebrafish DNA. Building a temple where
          the archive swims, reproduces, and outlives us all.
        </p>
        <p
          className="mt-5 text-text-faint text-[10px] tracking-[0.18em] uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Henry Tan &amp; Carmen Koessler · 12 min read
        </p>
      </div>
    </section>
  );
}
