"use client";

import { Chapter } from "./components/Chapter";
import { StoryHero } from "./components/StoryHero";
import { PullQuote } from "./components/PullQuote";
import { Callout } from "./components/Callout";
import { ImagePlate } from "./components/ImagePlate";
import { ChapterFooterCTA } from "./components/ChapterFooterCTA";
import { ChapterRail } from "./components/ChapterRail";

const CHAPTERS = [
  { id: "ch1", number: 1, title: "The Problem" },
  { id: "ch2", number: 2, title: "The Medium" },
  { id: "ch3", number: 3, title: "Translation" },
  { id: "ch4", number: 4, title: "Quantum" },
  { id: "ch5", number: 5, title: "The Fish" },
  { id: "ch6", number: 6, title: "Al Mawrid" },
  { id: "ch7", number: 7, title: "The Temple" },
  { id: "ch8", number: 8, title: "Ethics" },
  { id: "ch9", number: 9, title: "Why It Matters" },
];

export default function Home() {
  return (
    <div className="bg-black text-text antialiased">
      <StoryHero />

      <div className="max-w-6xl mx-auto px-6 flex gap-16">
        {/* Chapter rail sidebar */}
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <div className="pt-16">
            <ChapterRail chapters={CHAPTERS} />
          </div>
        </aside>

        {/* Main article */}
        <article className="flex-1 min-w-0">

          {/* Ch 1 */}
          <Chapter number={1} title="The Problem Nobody Saw Coming" id="ch1">
            <p>
              Here&apos;s a scary thought: the photo you took yesterday? The
              one on your phone?{" "}
              <strong>It&apos;s already dying.</strong>
            </p>
            <p>
              Not the memory — the actual file. Every hard drive fails. Every
              USB stick degrades. Every cloud server needs electricity to keep
              breathing. The average lifespan of a digital file you&apos;re not
              actively maintaining is about{" "}
              <strong>three to five years</strong>.
            </p>
            <p>
              Your great-grandchildren won&apos;t be scrolling through your
              Instagram. They&apos;ll be looking at&hellip; nothing.
            </p>
            <Callout>
              <p>
                The Library of Alexandria burned down. Hard drives from the
                1990s are already unreadable. We produce{" "}
                <strong>2.5 quintillion bytes of data every day</strong>, and we
                have no idea how to keep any of it for longer than a human
                lifetime.
              </p>
            </Callout>
            <p>
              Henry Tan — an artist from Bangkok working at the intersection of
              art and biology — was looking at a fragile art archive from Abu
              Dhabi and realized:{" "}
              <strong>
                these documents are one fire away from being gone forever.
              </strong>
            </p>
            <p>
              He needed a storage medium that could last not decades, not
              centuries, but <strong>thousands of years</strong>.
            </p>
            <p>
              So he looked at nature&apos;s own storage system. The one
              that&apos;s been working for 3.5 billion years without a single
              software update.
            </p>
            <p
              className="text-3xl text-text pt-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              DNA.
            </p>
          </Chapter>

          {/* Ch 2 */}
          <Chapter number={2} title="The Medium That Outlived the Dinosaurs" id="ch2">
            <p>
              DNA is the OG hard drive. It stores the blueprint for every
              living thing on Earth in a language made of just four letters:{" "}
              <strong>A, C, G, and T</strong>.
            </p>
            <ImagePlate
              src="/story-images/lab.jpg"
              alt="Laboratory workspace"
              plateId="01"
              caption="Research laboratory at NYU Abu Dhabi CGSB where the DNA encoding experiments were conducted."
            />
            {[
              {
                label: "Density:",
                text: "One gram of DNA can store 117 exabytes. That's every movie, every song, every Wikipedia article — in a teaspoon.",
              },
              {
                label: "Longevity:",
                text: "We've read DNA from specimens 50,000 years old. Mammoth DNA. Still readable. After 50 millennia.",
              },
              {
                label: "Self-repair:",
                text: "Living organisms actively maintain and repair their DNA. Try getting your MacBook to do that.",
              },
            ].map((f, i) => (
              <div key={i} className="flex gap-3 leading-[1.7]">
                <span className="text-accent font-bold mt-0.5 shrink-0">
                  →
                </span>
                <span>
                  <strong>{f.label}</strong> {f.text}
                </span>
              </div>
            ))}
            <p>
              The math was irresistible. If you could translate digital data
              into DNA code, you&apos;d have a storage medium that literally{" "}
              <strong>
                maintains itself, reproduces itself, and can survive ice ages
              </strong>
              .
            </p>
            <PullQuote citation="Henry Tan, research notes, 2024">
              DNA wasn&apos;t designed for storing art catalogs. It was designed
              for storing instructions like &ldquo;make a liver&rdquo; and
              &ldquo;grow two eyes.&rdquo;
            </PullQuote>
            <p>
              So Henry needed a plan. A careful one.
            </p>
          </Chapter>

          {/* Ch 3 */}
          <Chapter number={3} title="The Translation Problem" id="ch3">
            <p>Here&apos;s how you turn a piece of text into DNA:</p>
            <p>
              First, convert the text to binary. The letter &ldquo;A&rdquo;
              becomes{" "}
              <code className="text-accent px-1.5 py-0.5 text-sm bg-bg-elev">
                01000001
              </code>
              .
            </p>
            <p>
              Then map to DNA letters: 00 → A, 01 → C, 10 → G, 11 → T. Now you
              have genetic code encoding the word &ldquo;art.&rdquo;
            </p>
            <Callout>
              <p>
                But wait — what if that stretch of DNA, by coincidence, spells
                out &ldquo;please destroy this cell&rdquo; in biological
                language?
              </p>
            </Callout>
            <p>
              That&apos;s why the team built a{" "}
              <strong>screening pipeline</strong>. Before any encoded DNA touches
              a living organism:
            </p>
            {[
              "Stop codons? These would interrupt protein production and potentially harm the fish.",
              "Toxic proteins? No accidentally creating poison.",
              "Pathogen-like? Don't want the fish triggering immune responses.",
              "GC balanced? Too many G's and C's and the DNA folds weirdly.",
            ].map((item, i) => (
              <div key={i} className="flex gap-3 leading-[1.7]">
                <span className="text-accent font-bold mt-0.5 shrink-0">
                  ✓
                </span>
                <span>{item}</span>
              </div>
            ))}
            <p>
              Think of it as a spell-checker, but instead of typos, it checks
              for{" "}
              <strong>&ldquo;will this accidentally kill the fish.&rdquo;</strong>
            </p>
          </Chapter>

          {/* Ch 4 */}
          <Chapter number={4} title="The Quantum Part" id="ch4">
            <p>
              DNA isn&apos;t perfect. When fish reproduce, about{" "}
              <strong>1% of the bases</strong> get swapped, deleted, or
              inserted. Over generations, your encoded catalog turns into
              gibberish.
            </p>
            <p>
              The simple approach: make 3 copies. If one gets damaged, you have
              two backups. <strong>97% accuracy with 3× overhead</strong>.
            </p>
            <p>
              But Henry went bigger.{" "}
              <strong>He borrowed from quantum computing.</strong>
            </p>

            <div className="text-center py-16 my-8">
              <div
                className="text-6xl md:text-8xl font-bold leading-none"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-accent)",
                }}
              >
                99.999%
              </div>
              <p
                className="mt-3 tracking-wide text-text-faint text-[11px]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                accuracy at 1% error rates, with only 1.8× overhead
              </p>
            </div>

            <p>
              Quantum computers use{" "}
              <strong>surface code error correction</strong> — a 2D grid with
              clever math to detect and fix errors. Henry adapted this for DNA,
              mapping &ldquo;X errors&rdquo; (bit flips) and &ldquo;Z
              errors&rdquo; (phase flips) to actual chemical mutations.
            </p>
            <p>
              Then he ran <strong>Monte Carlo simulations</strong> — millions of
              virtual fish over millions of generations.
            </p>
            <PullQuote>
              A quantum error correction code, running in a fish, protecting art
              from Abu Dhabi. The universe is strange.
            </PullQuote>
          </Chapter>

          {/* Full-bleed fish image */}
          <ImagePlate
            src="/story-images/fish.jpg"
            alt="Zebrafish under fluorescence microscopy"
            plateId="02"
            caption="Transgenic zebrafish carrying encoded archival data, visualized under UV fluorescence."
            aspect="16/9"
            fullBleed
          />

          {/* Ch 5 */}
          <Chapter number={5} title="Putting It In The Fish" id="ch5">
            <p>
              You inject encoded DNA into a{" "}
              <strong>zebrafish embryo at the one-cell stage</strong> — a
              fertilized egg that hasn&apos;t decided what it&apos;s going to be
              yet.
            </p>
            <p>
              The tool: <strong>Tol2 transposon</strong> — molecular
              cut-and-paste. It inserts your sequence into the fish&apos;s
              genome.
            </p>
            <PullQuote citation="Lab notebook, CGSB 2025">
              The DNA package includes a fluorescent reporter gene. The fish
              that carry the data literally glow green under UV light.
            </PullQuote>
            <p>
              Two designs — fusion and P2A — both worked. Some fish glow, some
              don&apos;t. The glowing ones?{" "}
              <strong>Those are your data carriers.</strong>
            </p>
            <p>
              Breed them. Two generations later, sequence the DNA.{" "}
              <strong>Did the data survive?</strong>
            </p>
            <p>
              <strong>The answer was yes.</strong>
            </p>
          </Chapter>

          {/* Ch 6 */}
          <Chapter number={6} title="The Al Mawrid Archive" id="ch6">
            <p>So what exactly got encoded?</p>
            <p>
              The{" "}
              <strong>
                Al Mawrid Arab Center for the Study of Art
              </strong>{" "}
              at NYU Abu Dhabi collects foundational documents of modern Arab
              art history. Catalogs. Exhibition records. Artist statements.
            </p>
            <p>
              One particularly precious item: the catalog from the{" "}
              <strong>
                First Exhibition of the Emirates Fine Arts Society, Abu Dhabi,
                1980
              </strong>
              . Physical copies are rare. Digital copies live on servers.
            </p>
            <p>
              <strong>Now they also live in fish.</strong>
            </p>
            <ImagePlate
              src="/story-images/dna-abstract.jpg"
              alt="Abstract DNA visualization"
              plateId="03"
              caption="DNA-encoded archive data visualized as genetic sequences integrating cultural memory with biological storage."
            />
            <PullQuote citation="Iman Mersal, Egyptian poet">
              Archives are not neutral. They are shaped by who holds power, who
              gets to remember, and who gets forgotten.
            </PullQuote>
            <p>
              By encoding these materials into living organisms, the project
              asks:{" "}
              <strong>
                what if the archive wasn&apos;t something you store in a
                building, but something you keep alive?
              </strong>
            </p>
          </Chapter>

          {/* Ch 7 */}
          <Chapter number={7} title="The Temple of Singularity" id="ch7">
            <p>
              The fish don&apos;t live in a lab somewhere, forgotten.
              They&apos;re part of something bigger.
            </p>
            <p>
              Henry is building the{" "}
              <strong>Temple of Singularity</strong> — an installation combining
              living organisms, archival display, and interactive technology.
            </p>
            <p>
              You walk into a dimly lit room. In the center, a tank of zebrafish
              — each carrying encoded cultural memory. Around the tank, the
              original documents. On screens, a real-time DNA sequencer reads
              the fish&apos;s genetic code and{" "}
              <strong>decodes the data back into text</strong>.
            </p>
            <PullQuote>
              The archive is alive. It swims. It reproduces. It will outlast
              everyone who built it.
            </PullQuote>
            <p>
              An artist from Bangkok, working with scientists in Abu Dhabi,
              using quantum physics to protect Arab art in fish that might
              outlive civilization as we know it.
            </p>
          </Chapter>

          {/* Ch 8 */}
          <Chapter number={8} title="The Ethics" id="ch8">
            <p>
              Let&apos;s be real: encoding data into living animals raises
              questions.
            </p>
            <Callout>
              <p className="mb-3">
                <strong>Is it okay to modify fish genomes for art?</strong>
              </p>
              <p>
                The zebrafish are a standard lab model. The modifications
                don&apos;t cause harm — the fluorescent reporter is the same
                protein that makes jellyfish glow, widely used in research. The
                encoded data is carefully screened to avoid biological
                disruption.
              </p>
            </Callout>
            <Callout>
              <p className="mb-3">
                <strong>What about cultural sovereignty?</strong>
              </p>
              <p>
                The project includes protocols for{" "}
                <strong>
                  Free, Prior, and Informed Consent (FPIC)
                </strong>{" "}
                — ensuring communities have agency over how their heritage is
                encoded, stored, and displayed.
              </p>
            </Callout>
            <Callout>
              <p className="mb-3">
                <strong>What happens when the fish die?</strong>
              </p>
              <p>
                Eventually, every fish dies. The transgene might be lost. But
                that&apos;s partly the point. Henry calls this the{" "}
                <strong>&ldquo;living archive paradigm&rdquo;</strong> — unlike a
                hard drive that fails suddenly, a living archive degrades
                gradually, and its degradation is itself meaningful.{" "}
                <strong>The imperfection is the feature.</strong>
              </p>
            </Callout>
          </Chapter>

          {/* Ch 9 */}
          <Chapter number={9} title="Why This Matters" id="ch9">
            <p>
              Because everything we create is temporary. Our books, photos,
              videos, music — all of it is one power outage away from oblivion.
            </p>
            <p>
              DNA has lasted <strong>3.5 billion years</strong>. It doesn&apos;t
              need electricity. It doesn&apos;t need a software company to stay
              in business. It just needs water, food, and time.
            </p>
            <PullQuote>
              We&apos;re not just building a better backup system. We&apos;re
              reimagining what an archive can be: not a warehouse of dead
              objects, but a garden of living memory.
            </PullQuote>
            <p>The fish swim. The data persists. The story continues.</p>
            <p>
              And somewhere in Abu Dhabi, a document from 1980 is being carried
              by a creature that will exist long after all of us are gone.
            </p>
          </Chapter>

          <ChapterFooterCTA />
        </article>
      </div>
    </div>
  );
}
