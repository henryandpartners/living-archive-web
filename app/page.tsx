'use client';

export default function Home() {
  return (
    <>
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden" style={{background: 'radial-gradient(ellipse at 50% 80%, rgba(0,212,170,0.08) 0%, transparent 60%)'}}>
        <div className="text-6xl mb-6 animate-float">🐟🧬</div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-2xl leading-tight mb-4">
          We Put Art Into <span className="bg-gradient-to-r from-[#00d4aa] to-[#ffd93d] bg-clip-text text-transparent">Fish DNA</span>
        </h1>
        <p className="text-lg text-[#888] max-w-md mb-8">The story of how a Bangkok artist, a zebrafish, and quantum physics became the world's most unusual archive</p>
        <div className="text-sm text-[#888] animate-bounce">scroll to read ↓</div>
      </section>

      <article className="max-w-[680px] mx-auto px-6 pb-24">

        {/* Chapter 1 */}
        <div className="py-12 border-t border-[#2a2a2a]">
          <div className="text-xs uppercase tracking-widest text-[#00d4aa] mb-2">Chapter 1</div>
          <h2 className="text-2xl font-bold tracking-tight mb-5">The Problem Nobody Saw Coming</h2>
          <p className="mb-4 text-[#ccc]">Here's a scary thought: the photo you took yesterday? The one on your phone? <strong>It's already dying.</strong></p>
          <p className="mb-4 text-[#ccc]">Not the memory — the actual file. Every hard drive fails eventually. Every USB stick degrades. Every cloud server needs electricity to keep breathing. The average lifespan of a digital file you're not actively maintaining is about <strong>three to five years</strong>.</p>
          <p className="mb-4 text-[#ccc]">Your great-grandchildren won't be scrolling through your Instagram. They'll be looking at... nothing.</p>
          <div className="bg-[#141414] border border-[#2a2a2a] border-l-[3px] border-l-[#ff6b6b] rounded-lg p-5 my-6">
            <p className="mb-0 text-[#ccc]">The Library of Alexandria burned down. Hard drives from the 1990s are already unreadable. We produce <strong>2.5 quintillion bytes of data every day</strong>, and we have no idea how to keep any of it for longer than a human lifetime.</p>
          </div>
          <p className="mb-4 text-[#ccc]">Henry Tan — an artist from Bangkok who works at the intersection of art and biology — was looking at a fragile art archive from Abu Dhabi and realized: <strong>these documents are one fire away from being gone forever.</strong></p>
          <p className="mb-4 text-[#ccc]">He needed a storage medium that could last not decades, not centuries, but <strong>thousands of years</strong>.</p>
          <p className="mb-4 text-[#ccc]">So he looked at nature's own storage system. The one that's been working for 3.5 billion years without a single software update.</p>
          <p className="mb-4 text-[#ccc]"><strong>DNA.</strong></p>
        </div>

        {/* Chapter 2 */}
        <div className="py-12 border-t border-[#2a2a2a]">
          <div className="text-xs uppercase tracking-widest text-[#00d4aa] mb-2">Chapter 2</div>
          <h2 className="text-2xl font-bold tracking-tight mb-5">The Medium That Outlived the Dinosaurs</h2>
          <p className="mb-4 text-[#ccc]">DNA is the OG hard drive. It stores the blueprint for every living thing on Earth in a language made of just four letters: <strong>A, C, G, and T</strong>.</p>
          <ul className="list-none my-4">
            {[
              { label: 'Density:', text: "One gram of DNA can store 117 exabytes. That's every movie, every song, every Wikipedia article \u2014 in a teaspoon." },
              { label: 'Longevity:', text: "We've read DNA from specimens 50,000 years old. Mammoth DNA. Still readable. After 50 millennia." },
              { label: 'Self-repair:', text: 'Living organisms actively maintain and repair their DNA. Try getting your MacBook to do that.' },
            ].map((f, i) => (
              <li key={i} className="py-2 pl-6 relative text-[#ccc] before:content-['\u2192'] before:absolute before:left-0 before:text-[#00d4aa] before:font-bold"><strong>{f.label}</strong> {f.text}</li>
            ))}
          </ul>
          <p className="mb-4 text-[#ccc]">The math was irresistible. If you could translate digital data into DNA code, you'd have a storage medium that literally <strong>maintains itself, reproduces itself, and can survive ice ages</strong>.</p>
          <div className="bg-[#141414] border border-[#2a2a2a] border-l-[3px] border-l-[#00d4aa] rounded-lg p-5 my-6">
            <p className="mb-0 text-[#ccc]"><strong>But there was a catch.</strong> DNA wasn't designed for storing art catalogs. It was designed for storing instructions like "make a liver" and "grow two eyes." If you randomly jam art data into DNA, you might accidentally tell the organism to produce a toxic protein.</p>
          </div>
          <p className="mb-4 text-[#ccc]">So Henry needed a plan. A careful one.</p>
        </div>

        {/* Chapter 3 */}
        <div className="py-12 border-t border-[#2a2a2a]">
          <div className="text-xs uppercase tracking-widest text-[#00d4aa] mb-2">Chapter 3</div>
          <h2 className="text-2xl font-bold tracking-tight mb-5">The Translation Problem</h2>
          <p className="mb-4 text-[#ccc]">Here's how you turn a piece of text into DNA:</p>
          <p className="mb-4 text-[#ccc]">First, convert the text to binary — the ones and zeros computers already use. The letter "A" becomes <code className="text-[#00d4aa]">01000001</code>. The word "art" becomes <code className="text-[#00d4aa]">01100001 01110010 01110100</code>.</p>
          <p className="mb-4 text-[#ccc]">Then map those ones and zeros to DNA letters: 00 → A, 01 → C, 10 → G, 11 → T.</p>
          <p className="mb-4 text-[#ccc]">Now you have genetic code that encodes the word "art."</p>
          <div className="bg-[#141414] border border-[#2a2a2a] border-l-[3px] border-l-[#ffd93d] rounded-lg p-5 my-6">
            <p className="mb-0 text-[#ccc]"><strong>But wait</strong> — what if that stretch of DNA, by coincidence, spells out "please destroy this cell" in biological language?</p>
          </div>
          <p className="mb-4 text-[#ccc]">That's why the team built a <strong>screening pipeline</strong>. Before any encoded DNA touches a living organism, it gets checked:</p>
          <ul className="list-none my-4">
            {['Stop codons? These would interrupt protein production and potentially harm the fish.', 'Toxic proteins? No accidentally creating poison.', "Pathogen-like? Don't want the fish triggering immune responses.", "GC balanced? Too many G's and C's and the DNA folds weirdly."].map((item, i) => (
              <li key={i} className="py-1 pl-7 relative text-[#ccc] before:content-['\u2713'] before:absolute before:left-0 before:text-[#00d4aa] before:font-bold">{item}</li>
            ))}
          </ul>
          <p className="mb-4 text-[#ccc]">Think of it as a spell-checker, but instead of checking for typos, it checks for <strong>"will this accidentally kill the fish."</strong></p>
        </div>

        {/* Chapter 4 */}
        <div className="py-12 border-t border-[#2a2a2a]">
          <div className="text-xs uppercase tracking-widest text-[#00d4aa] mb-2">Chapter 4</div>
          <h2 className="text-2xl font-bold tracking-tight mb-5">The Quantum Part (Don't Worry, It's Cool)</h2>
          <p className="mb-4 text-[#ccc]">DNA isn't perfect. When fish reproduce, the copying machinery makes mistakes. About <strong>1% of the bases</strong> might get swapped, deleted, or inserted. Over generations, your encoded art catalog slowly turns into gibberish.</p>
          <p className="mb-4 text-[#ccc]">Henry needed <strong>error correction</strong>.</p>
          <p className="mb-4 text-[#ccc]">The simple approach: make multiple copies. Store the same data three times. If one gets damaged, you have two backups. This gives about <strong>97% accuracy with 3× overhead</strong>.</p>
          <p className="mb-4 text-[#ccc]">But Henry went bigger. <strong>He borrowed from quantum computing.</strong></p>
          <div className="text-center py-8">
            <div className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-[#00d4aa] to-[#ffd93d] bg-clip-text text-transparent leading-tight">99.999%</div>
            <div className="text-sm text-[#888] mt-1">accuracy at 1% error rates, with only 1.8× overhead</div>
          </div>
          <p className="mb-4 text-[#ccc]">Quantum computers use <strong>surface code error correction</strong> — a 2D grid arrangement with clever math to detect and fix errors. Henry adapted this for DNA, mapping quantum "X errors" (bit flips) and "Z errors" (phase flips) to actual chemical mutation types.</p>
          <p className="mb-4 text-[#ccc]">Then he ran <strong>Monte Carlo simulations</strong> — millions of virtual fish reproducing over millions of virtual generations — to test whether the system worked.</p>
          <p className="mb-4 text-[#ccc]">A quantum error correction code, running in a fish, protecting art from Abu Dhabi. <strong>The universe is strange.</strong></p>
        </div>

        {/* Chapter 5 */}
        <div className="py-12 border-t border-[#2a2a2a]">
          <div className="text-xs uppercase tracking-widest text-[#00d4aa] mb-2">Chapter 5</div>
          <h2 className="text-2xl font-bold tracking-tight mb-5">Putting It In The Fish</h2>
          <p className="mb-4 text-[#ccc]">You inject encoded DNA into a <strong>zebrafish embryo at the one-cell stage</strong> — basically a fertilized egg that hasn't decided what it's going to be yet.</p>
          <p className="mb-4 text-[#ccc]">The tool: <strong>Tol2 transposon</strong> — a piece of genetic machinery that works like molecular cut-and-paste. It takes your DNA sequence and inserts it into the fish's genome.</p>
          <div className="bg-[#141414] border border-[#2a2a2a] border-l-[3px] border-l-[#6c5ce7] rounded-lg p-5 my-6">
            <p className="mb-0 text-[#ccc]"><strong>The fun part:</strong> the DNA package includes a fluorescent reporter gene. The fish that carry the data <strong>literally glow green</strong> under UV light. 🟢</p>
          </div>
          <p className="mb-4 text-[#ccc]">Two designs were tested — a fusion construct and a P2A construct — and both worked. After injection, you wait. The embryo develops. Some fish glow, some don't. The glowing ones? <strong>Those are your data carriers.</strong></p>
          <p className="mb-4 text-[#ccc]">Breed them. Check if the offspring also glow. Breed those offspring. Two generations later, sequence the DNA and see: <strong>did the data survive?</strong></p>
          <p className="mb-4 text-[#ccc]"><strong>The answer was yes.</strong></p>
        </div>

        {/* Chapter 6 */}
        <div className="py-12 border-t border-[#2a2a2a]">
          <div className="text-xs uppercase tracking-widest text-[#00d4aa] mb-2">Chapter 6</div>
          <h2 className="text-2xl font-bold tracking-tight mb-5">The Al Mawrid Archive</h2>
          <p className="mb-4 text-[#ccc]">So what exactly got encoded into these fish?</p>
          <p className="mb-4 text-[#ccc]">The <strong>Al Mawrid Arab Center for the Study of Art</strong> at NYU Abu Dhabi has been collecting foundational documents of modern Arab art history. Catalogs. Exhibition records. Artist statements.</p>
          <p className="mb-4 text-[#ccc]">One particularly precious item: the catalog from the <strong>First Exhibition of the Emirates Fine Arts Society, Abu Dhabi, 1980</strong>. A moment when artists in the UAE started asserting their creative identity. The physical copies are rare. The digital copies live on servers.</p>
          <p className="mb-4 text-[#ccc]"><strong>Now they also live in fish.</strong></p>
          <blockquote className="border-l-[3px] border-l-[#6c5ce7] py-4 px-5 my-6 bg-[rgba(108,92,231,0.05)] rounded-r-lg italic text-[#bbb]">
            "Archives are not neutral. They are shaped by who holds power, who gets to remember, and who gets forgotten."
            <cite className="block mt-2 not-italic text-sm text-[#888]">— Iman Mersal, Egyptian poet</cite>
          </blockquote>
          <p className="mb-4 text-[#ccc]">By encoding these materials into living organisms, the project asks: <strong>what if the archive wasn't something you store in a building, but something you keep alive?</strong></p>
        </div>

        {/* Chapter 7 */}
        <div className="py-12 border-t border-[#2a2a2a]">
          <div className="text-xs uppercase tracking-widest text-[#00d4aa] mb-2">Chapter 7</div>
          <h2 className="text-2xl font-bold tracking-tight mb-5">The Temple of Singularity</h2>
          <p className="mb-4 text-[#ccc]">The fish don't live in a lab somewhere, forgotten. They're part of something bigger.</p>
          <p className="mb-4 text-[#ccc]">Henry is building the <strong>Temple of Singularity</strong> — an installation that combines living organisms, archival display, and interactive technology.</p>
          <p className="mb-4 text-[#ccc]">Picture this: you walk into a dimly lit room. In the center, a tank of zebrafish — each one carrying encoded cultural memory. Around the tank, the original documents are displayed. On screens, a real-time DNA sequencer reads the fish's genetic code and <strong>decodes the data back into text</strong>, displaying it for visitors to see.</p>
          <p className="mb-4 text-[#ccc]"><strong>The archive is alive. It swims. It reproduces. It will outlast everyone who built it.</strong></p>
          <p className="mb-4 text-[#ccc]">An artist from Bangkok, working with scientists in Abu Dhabi, using quantum physics to protect Arab art in fish that might outlive civilization as we know it.</p>
        </div>

        {/* Chapter 8 */}
        <div className="py-12 border-t border-[#2a2a2a]">
          <div className="text-xs uppercase tracking-widest text-[#00d4aa] mb-2">Chapter 8</div>
          <h2 className="text-2xl font-bold tracking-tight mb-5">The Ethics</h2>
          <p className="mb-4 text-[#ccc]">Let's be real: encoding data into living animals raises questions.</p>
          <div className="bg-[#141414] border border-[#2a2a2a] border-l-[3px] border-l-[#ff6b6b] rounded-lg p-5 my-6">
            <p className="mb-2 text-[#ccc]"><strong>Is it okay to modify fish genomes for art?</strong></p>
            <p className="mb-0 text-[#ccc]">The zebrafish are a standard laboratory model. The modifications don't cause harm — the fluorescent reporter is the same protein that makes jellyfish glow, widely used in research. The encoded data is carefully screened to avoid any biological disruption.</p>
          </div>
          <div className="bg-[#141414] border border-[#2a2a2a] border-l-[3px] border-l-[#ffd93d] rounded-lg p-5 my-6">
            <p className="mb-2 text-[#ccc]"><strong>What about cultural sovereignty?</strong></p>
            <p className="mb-0 text-[#ccc]">The project includes protocols for <strong>Free, Prior, and Informed Consent (FPIC)</strong> — ensuring communities have agency over how their heritage is encoded, stored, and displayed. This isn't extraction; it's collaboration.</p>
          </div>
          <div className="bg-[#141414] border border-[#2a2a2a] border-l-[3px] border-l-[#6c5ce7] rounded-lg p-5 my-6">
            <p className="mb-2 text-[#ccc]"><strong>What happens when the fish die?</strong></p>
            <p className="mb-0 text-[#ccc]">Eventually, every fish dies. The transgene might be lost. But that's partly the point. Henry calls this the <strong>"living archive paradigm"</strong> — unlike a hard drive that fails suddenly, a living archive degrades gradually, and its degradation is itself meaningful. <strong>The imperfection is the feature.</strong></p>
          </div>
        </div>

        {/* Chapter 9 */}
        <div className="py-12 border-t border-[#2a2a2a]">
          <div className="text-xs uppercase tracking-widest text-[#00d4aa] mb-2">Chapter 9</div>
          <h2 className="text-2xl font-bold tracking-tight mb-5">Why This Matters</h2>
          <p className="mb-4 text-[#ccc]">Because everything we create is temporary. Our books, our photos, our videos, our music — all of it is one power outage away from oblivion.</p>
          <p className="mb-4 text-[#ccc]">DNA has lasted <strong>3.5 billion years</strong>. It doesn't need electricity. It doesn't need a software company to stay in business. It just needs water, food, and time.</p>
          <p className="mb-4 text-[#ccc]">By encoding cultural heritage into living organisms, we're not just building a better backup system. We're reimagining what an archive can be: <strong>not a warehouse of dead objects, but a garden of living memory.</strong></p>
          <p className="mb-4 text-[#ccc]">The fish swim. The data persists. The story continues.</p>
          <p className="mb-4 text-[#ccc]">And somewhere in Abu Dhabi, a document from 1980 is being carried by a creature that will exist long after all of us are gone. 🐟</p>
        </div>

        {/* CTA */}
        <div className="text-center py-12 border-t border-[#2a2a2a] mt-8">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/publications" className="inline-flex items-center gap-2 px-6 py-3 bg-[#00d4aa] text-[#0a0a0a] rounded-lg font-semibold text-sm hover:opacity-85 transition-opacity">📄 Read the full technical papers</a>
            <a href="/pipeline" className="inline-flex items-center gap-2 px-6 py-3 bg-[#2a2a2a] text-[#e0e0e0] rounded-lg font-semibold text-sm hover:bg-[#333] transition-colors">🧬 Try the DNA Pipeline</a>
          </div>
          <p className="text-[#888] text-sm mt-3">Nature Biotech · Science Advances · Leonardo (MIT Press)</p>
        </div>

      </article>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(8px); opacity: 1; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-bounce { animation: bounce 2s ease-in-out infinite; }
      `}</style>
    </>
  );
}
