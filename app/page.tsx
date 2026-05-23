'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <main className="bg-[#0a0a0a] text-white antialiased">

      <section className="relative min-h-screen flex items-end">
        <div className="absolute inset-0">
          <Image src="/story-images/hero.jpg" alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-black/30" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20 md:pb-28 w-full">
          <p className="text-[#00d4aa] text-[11px] uppercase tracking-[0.35em] mb-5">NYUAD CGSB · Artist-in-Residence 2024–2025</p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8">
            DNA Libraries,<br />Dreamscapes<br /><span className="text-[#444]">& Organoids</span>
          </h1>
          <p className="text-base md:text-lg text-[#999] max-w-xl leading-relaxed">
            Storing cultural archives in zebrafish DNA. Building a temple where the archive swims, reproduces, and outlives us all.
          </p>
          <p className="text-xs text-[#555] mt-4">By Henry Tan & Carmen Koessler</p>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#444]">
          <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#444] to-transparent animate-pulse" />
        </div>
      </section>

      <article className="max-w-[620px] mx-auto px-6">

        {/* Ch 1 */}
        <div className="py-20 md:py-28 border-t border-[#161616]">
          <p className="text-[#00d4aa] text-[10px] uppercase tracking-[0.3em] mb-4">Chapter 1</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight">The Problem Nobody Saw Coming</h2>
          <p className="text-[#bbb] leading-[1.75] mb-5">Here's a scary thought: the photo you took yesterday? The one on your phone? <strong className="text-white">It's already dying.</strong></p>
          <p className="text-[#bbb] leading-[1.75] mb-5">Not the memory — the actual file. Every hard drive fails. Every USB stick degrades. Every cloud server needs electricity to keep breathing. The average lifespan of a digital file you're not actively maintaining is about <strong className="text-white">three to five years</strong>.</p>
          <p className="text-[#bbb] leading-[1.75] mb-8">Your great-grandchildren won't be scrolling through your Instagram. They'll be looking at... nothing.</p>
          <blockquote className="bg-[#111] border-l-[3px] border-l-[#ff6b6b] py-5 px-6 my-10 rounded-r-lg">
            <p className="text-[#bbb] leading-[1.7] m-0">The Library of Alexandria burned down. Hard drives from the 1990s are already unreadable. We produce <strong className="text-white">2.5 quintillion bytes of data every day</strong>, and we have no idea how to keep any of it for longer than a human lifetime.</p>
          </blockquote>
          <p className="text-[#bbb] leading-[1.75] mb-5">Henry Tan — an artist from Bangkok working at the intersection of art and biology — was looking at a fragile art archive from Abu Dhabi and realized: <strong className="text-white">these documents are one fire away from being gone forever.</strong></p>
          <p className="text-[#bbb] leading-[1.75] mb-5">He needed a storage medium that could last not decades, not centuries, but <strong className="text-white">thousands of years</strong>.</p>
          <p className="text-[#bbb] leading-[1.75]">So he looked at nature's own storage system. The one that's been working for 3.5 billion years without a single software update.</p>
          <p className="text-3xl font-bold text-white mt-8">DNA.</p>
        </div>

        {/* Ch 2 */}
        <div className="py-20 md:py-28 border-t border-[#161616]">
          <p className="text-[#00d4aa] text-[10px] uppercase tracking-[0.3em] mb-4">Chapter 2</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight">The Medium That Outlived the Dinosaurs</h2>
          <p className="text-[#bbb] leading-[1.75] mb-8">DNA is the OG hard drive. It stores the blueprint for every living thing on Earth in a language made of just four letters: <strong className="text-white">A, C, G, and T</strong>.</p>
          <div className="relative aspect-[3/2] rounded-sm overflow-hidden mb-10 bg-[#111]">
            <Image src="/story-images/lab.jpg" alt="" fill className="object-cover" />
          </div>
          {[
            { label: 'Density:', text: "One gram of DNA can store 117 exabytes. That's every movie, every song, every Wikipedia article — in a teaspoon." },
            { label: 'Longevity:', text: "We've read DNA from specimens 50,000 years old. Mammoth DNA. Still readable. After 50 millennia." },
            { label: 'Self-repair:', text: 'Living organisms actively maintain and repair their DNA. Try getting your MacBook to do that.' },
          ].map((f, i) => (
            <div key={i} className="flex gap-3 text-[#bbb] leading-[1.7] mb-4">
              <span className="text-[#00d4aa] font-bold mt-0.5 shrink-0">→</span>
              <span><strong className="text-white">{f.label}</strong> {f.text}</span>
            </div>
          ))}
          <p className="text-[#bbb] leading-[1.75] mt-8 mb-8">The math was irresistible. If you could translate digital data into DNA code, you'd have a storage medium that literally <strong className="text-white">maintains itself, reproduces itself, and can survive ice ages</strong>.</p>
          <blockquote className="bg-[#111] border-l-[3px] border-l-[#00d4aa] py-5 px-6 my-10 rounded-r-lg">
            <p className="text-[#bbb] leading-[1.7] m-0"><strong className="text-white">But there was a catch.</strong> DNA wasn't designed for storing art catalogs. It was designed for storing instructions like "make a liver" and "grow two eyes." If you randomly jam art data into DNA, you might accidentally tell the organism to produce a toxic protein.</p>
          </blockquote>
          <p className="text-[#bbb] leading-[1.75]">So Henry needed a plan. A careful one.</p>
        </div>

        {/* Ch 3 */}
        <div className="py-20 md:py-28 border-t border-[#161616]">
          <p className="text-[#00d4aa] text-[10px] uppercase tracking-[0.3em] mb-4">Chapter 3</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight">The Translation Problem</h2>
          <p className="text-[#bbb] leading-[1.75] mb-5">Here's how you turn a piece of text into DNA:</p>
          <p className="text-[#bbb] leading-[1.75] mb-5">First, convert the text to binary. The letter "A" becomes <code className="text-[#00d4aa] bg-[#111] px-1.5 py-0.5 rounded text-sm">01000001</code>. The word "art" becomes <code className="text-[#00d4aa] bg-[#111] px-1.5 py-0.5 rounded text-sm">01100001 01110010 01110100</code>.</p>
          <p className="text-[#bbb] leading-[1.75] mb-8">Then map to DNA letters: 00 → A, 01 → C, 10 → G, 11 → T. Now you have genetic code encoding the word "art."</p>
          <blockquote className="bg-[#111] border-l-[3px] border-l-[#ffd93d] py-5 px-6 my-10 rounded-r-lg">
            <p className="text-[#bbb] leading-[1.7] m-0"><strong className="text-white">But wait</strong> — what if that stretch of DNA, by coincidence, spells out "please destroy this cell" in biological language?</p>
          </blockquote>
          <p className="text-[#bbb] leading-[1.75] mb-5">That's why the team built a <strong className="text-white">screening pipeline</strong>. Before any encoded DNA touches a living organism:</p>
          {[
            'Stop codons? These would interrupt protein production and potentially harm the fish.',
            'Toxic proteins? No accidentally creating poison.',
            "Pathogen-like? Don't want the fish triggering immune responses.",
            "GC balanced? Too many G's and C's and the DNA folds weirdly.",
          ].map((item, i) => (
            <div key={i} className="flex gap-3 text-[#bbb] leading-[1.7] mb-3">
              <span className="text-[#00d4aa] font-bold mt-0.5 shrink-0">✓</span><span>{item}</span>
            </div>
          ))}
          <p className="text-[#bbb] leading-[1.75] mt-8">Think of it as a spell-checker, but instead of typos, it checks for <strong className="text-white">"will this accidentally kill the fish."</strong></p>
        </div>

        {/* Ch 4 */}
        <div className="py-20 md:py-28 border-t border-[#161616]">
          <p className="text-[#00d4aa] text-[10px] uppercase tracking-[0.3em] mb-4">Chapter 4</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight">The Quantum Part</h2>
          <p className="text-[#bbb] leading-[1.75] mb-5">DNA isn't perfect. When fish reproduce, about <strong className="text-white">1% of the bases</strong> get swapped, deleted, or inserted. Over generations, your encoded catalog turns into gibberish.</p>
          <p className="text-[#bbb] leading-[1.75] mb-5">The simple approach: make 3 copies. If one gets damaged, you have two backups. <strong className="text-white">97% accuracy with 3× overhead</strong>.</p>
          <p className="text-[#bbb] leading-[1.75] mb-10">But Henry went bigger. <strong className="text-white">He borrowed from quantum computing.</strong></p>
          <div className="text-center py-16 mb-12">
            <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#00d4aa] to-[#ffd93d] bg-clip-text text-transparent leading-none">99.999%</div>
            <p className="text-xs text-[#555] mt-3 tracking-wide">accuracy at 1% error rates, with only 1.8× overhead</p>
          </div>
          <p className="text-[#bbb] leading-[1.75] mb-5">Quantum computers use <strong className="text-white">surface code error correction</strong> — a 2D grid with clever math to detect and fix errors. Henry adapted this for DNA, mapping "X errors" (bit flips) and "Z errors" (phase flips) to actual chemical mutations.</p>
          <p className="text-[#bbb] leading-[1.75] mb-5">Then he ran <strong className="text-white">Monte Carlo simulations</strong> — millions of virtual fish over millions of generations.</p>
          <p className="text-[#bbb] leading-[1.75]">A quantum error correction code, running in a fish, protecting art from Abu Dhabi. <strong className="text-white">The universe is strange.</strong></p>
        </div>

        {/* Full-bleed image */}
        <div className="-mx-6 my-20">
          <div className="relative aspect-[16/9] overflow-hidden bg-[#111]">
            <Image src="/story-images/fish.jpg" alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          </div>
        </div>

        {/* Ch 5 */}
        <div className="py-20 md:py-28 border-t border-[#161616]">
          <p className="text-[#00d4aa] text-[10px] uppercase tracking-[0.3em] mb-4">Chapter 5</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight">Putting It In The Fish</h2>
          <p className="text-[#bbb] leading-[1.75] mb-5">You inject encoded DNA into a <strong className="text-white">zebrafish embryo at the one-cell stage</strong> — a fertilized egg that hasn't decided what it's going to be yet.</p>
          <p className="text-[#bbb] leading-[1.75] mb-8">The tool: <strong className="text-white">Tol2 transposon</strong> — molecular cut-and-paste. It inserts your sequence into the fish's genome.</p>
          <blockquote className="bg-[#111] border-l-[3px] border-l-[#6c5ce7] py-5 px-6 my-10 rounded-r-lg">
            <p className="text-[#bbb] leading-[1.7] m-0"><strong className="text-white">The fun part:</strong> the DNA package includes a fluorescent reporter gene. The fish that carry the data <strong className="text-white">literally glow green</strong> under UV light.</p>
          </blockquote>
          <p className="text-[#bbb] leading-[1.75] mb-5">Two designs — fusion and P2A — both worked. Some fish glow, some don't. The glowing ones? <strong className="text-white">Those are your data carriers.</strong></p>
          <p className="text-[#bbb] leading-[1.75] mb-5">Breed them. Two generations later, sequence the DNA. <strong className="text-white">Did the data survive?</strong></p>
          <p className="text-[#bbb] leading-[1.75]"><strong className="text-white">The answer was yes.</strong></p>
        </div>

        {/* Ch 6 */}
        <div className="py-20 md:py-28 border-t border-[#161616]">
          <p className="text-[#00d4aa] text-[10px] uppercase tracking-[0.3em] mb-4">Chapter 6</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight">The Al Mawrid Archive</h2>
          <p className="text-[#bbb] leading-[1.75] mb-5">So what exactly got encoded?</p>
          <p className="text-[#bbb] leading-[1.75] mb-5">The <strong className="text-white">Al Mawrid Arab Center for the Study of Art</strong> at NYU Abu Dhabi collects foundational documents of modern Arab art history. Catalogs. Exhibition records. Artist statements.</p>
          <p className="text-[#bbb] leading-[1.75] mb-5">One particularly precious item: the catalog from the <strong className="text-white">First Exhibition of the Emirates Fine Arts Society, Abu Dhabi, 1980</strong>. Physical copies are rare. Digital copies live on servers.</p>
          <p className="text-[#bbb] leading-[1.75] mb-8"><strong className="text-white">Now they also live in fish.</strong></p>
          <div className="relative aspect-[3/2] rounded-sm overflow-hidden mb-10 bg-[#111]">
            <Image src="/story-images/dna-abstract.jpg" alt="" fill className="object-cover" />
          </div>
          <blockquote className="border-l-[3px] border-l-[#6c5ce7] py-5 px-6 my-10 rounded-r-lg italic text-[#aaa]">
            "Archives are not neutral. They are shaped by who holds power, who gets to remember, and who gets forgotten."
            <cite className="block mt-3 not-italic text-xs text-[#666]">— Iman Mersal, Egyptian poet</cite>
          </blockquote>
          <p className="text-[#bbb] leading-[1.75]">By encoding these materials into living organisms, the project asks: <strong className="text-white">what if the archive wasn't something you store in a building, but something you keep alive?</strong></p>
        </div>

        {/* Ch 7 */}
        <div className="py-20 md:py-28 border-t border-[#161616]">
          <p className="text-[#00d4aa] text-[10px] uppercase tracking-[0.3em] mb-4">Chapter 7</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight">The Temple of Singularity</h2>
          <p className="text-[#bbb] leading-[1.75] mb-5">The fish don't live in a lab somewhere, forgotten. They're part of something bigger.</p>
          <p className="text-[#bbb] leading-[1.75] mb-5">Henry is building the <strong className="text-white">Temple of Singularity</strong> — an installation combining living organisms, archival display, and interactive technology.</p>
          <p className="text-[#bbb] leading-[1.75] mb-5">You walk into a dimly lit room. In the center, a tank of zebrafish — each carrying encoded cultural memory. Around the tank, the original documents. On screens, a real-time DNA sequencer reads the fish's genetic code and <strong className="text-white">decodes the data back into text</strong>.</p>
          <p className="text-[#bbb] leading-[1.75] mb-5"><strong className="text-white">The archive is alive. It swims. It reproduces. It will outlast everyone who built it.</strong></p>
          <p className="text-[#bbb] leading-[1.75]">An artist from Bangkok, working with scientists in Abu Dhabi, using quantum physics to protect Arab art in fish that might outlive civilization as we know it.</p>
        </div>

        {/* Ch 8 */}
        <div className="py-20 md:py-28 border-t border-[#161616]">
          <p className="text-[#00d4aa] text-[10px] uppercase tracking-[0.3em] mb-4">Chapter 8</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight">The Ethics</h2>
          <p className="text-[#bbb] leading-[1.75] mb-8">Let's be real: encoding data into living animals raises questions.</p>
          <blockquote className="bg-[#111] border-l-[3px] border-l-[#ff6b6b] py-5 px-6 mb-8 rounded-r-lg">
            <p className="text-[#bbb] leading-[1.7] mb-3"><strong className="text-white">Is it okay to modify fish genomes for art?</strong></p>
            <p className="text-[#bbb] leading-[1.7] m-0">The zebrafish are a standard lab model. The modifications don't cause harm — the fluorescent reporter is the same protein that makes jellyfish glow, widely used in research. The encoded data is carefully screened to avoid biological disruption.</p>
          </blockquote>
          <blockquote className="bg-[#111] border-l-[3px] border-l-[#ffd93d] py-5 px-6 mb-8 rounded-r-lg">
            <p className="text-[#bbb] leading-[1.7] mb-3"><strong className="text-white">What about cultural sovereignty?</strong></p>
            <p className="text-[#bbb] leading-[1.7] m-0">The project includes protocols for <strong className="text-white">Free, Prior, and Informed Consent (FPIC)</strong> — ensuring communities have agency over how their heritage is encoded, stored, and displayed.</p>
          </blockquote>
          <blockquote className="bg-[#111] border-l-[3px] border-l-[#6c5ce7] py-5 px-6 rounded-r-lg">
            <p className="text-[#bbb] leading-[1.7] mb-3"><strong className="text-white">What happens when the fish die?</strong></p>
            <p className="text-[#bbb] leading-[1.7] m-0">Eventually, every fish dies. The transgene might be lost. But that's partly the point. Henry calls this the <strong className="text-white">"living archive paradigm"</strong> — unlike a hard drive that fails suddenly, a living archive degrades gradually, and its degradation is itself meaningful. <strong className="text-white">The imperfection is the feature.</strong></p>
          </blockquote>
        </div>

        {/* Ch 9 */}
        <div className="py-20 md:py-28 border-t border-[#161616]">
          <p className="text-[#00d4aa] text-[10px] uppercase tracking-[0.3em] mb-4">Chapter 9</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 leading-tight">Why This Matters</h2>
          <p className="text-[#bbb] leading-[1.75] mb-5">Because everything we create is temporary. Our books, photos, videos, music — all of it is one power outage away from oblivion.</p>
          <p className="text-[#bbb] leading-[1.75] mb-5">DNA has lasted <strong className="text-white">3.5 billion years</strong>. It doesn't need electricity. It doesn't need a software company to stay in business. It just needs water, food, and time.</p>
          <p className="text-[#bbb] leading-[1.75] mb-5">We're not just building a better backup system. We're reimagining what an archive can be: <strong className="text-white">not a warehouse of dead objects, but a garden of living memory.</strong></p>
          <p className="text-[#bbb] leading-[1.75] mb-5">The fish swim. The data persists. The story continues.</p>
          <p className="text-[#bbb] leading-[1.75] mb-16">And somewhere in Abu Dhabi, a document from 1980 is being carried by a creature that will exist long after all of us are gone.</p>
        </div>

        {/* CTA */}
        <div className="text-center py-20 border-t border-[#161616]">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/publications" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#00d4aa] text-[#0a0a0a] rounded-sm font-semibold text-sm hover:opacity-85 transition-opacity">Read the full technical papers</a>
            <a href="/pipeline" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#161616] text-[#ccc] rounded-sm font-semibold text-sm hover:bg-[#1e1e1e] transition-colors">Try the DNA Pipeline</a>
          </div>
          <p className="text-[#444] text-xs mt-5">Nature Biotech · Science Advances · Leonardo (MIT Press)</p>
        </div>

      </article>
    </main>
  );
}
