import { Callout } from '../components/Callout';
import { PullQuote } from '../components/PullQuote';
import { ImagePlate } from '../components/ImagePlate';

export interface ChapterRecord {
  id: string;
  number: number;
  title: string;
  short: string;
  render: () => React.ReactNode;
}

export const CHAPTERS: ChapterRecord[] = [
  {
    id: 'ch-1',
    number: 1,
    title: 'The Problem Nobody Saw Coming',
    short: 'Problem',
    render: () => (
      <>
        <p>Here's a scary thought: the photo you took yesterday? The one on your phone? <strong>It's already dying.</strong></p>
        <p>Not the memory — the actual file. Every hard drive fails. Every USB stick degrades. Every cloud server needs electricity to keep breathing. The average lifespan of a digital file you're not actively maintaining is about <strong>three to five years</strong>.</p>
        <p>Your great-grandchildren won't be scrolling through your Instagram. They'll be looking at... nothing.</p>
        <Callout>
          The Library of Alexandria burned down. Hard drives from the 1990s are already unreadable. We produce <strong>2.5 quintillion bytes of data every day</strong>, and we have no idea how to keep any of it for longer than a human lifetime.
        </Callout>
        <p>Henry Tan — an artist from Bangkok working at the intersection of art and biology — was looking at a fragile art archive from Abu Dhabi and realized: <strong>these documents are one fire away from being gone forever.</strong></p>
        <p>He needed a storage medium that could last not decades, not centuries, but <strong>thousands of years</strong>.</p>
        <p>So he looked at nature's own storage system. The one that's been working for 3.5 billion years without a single software update.</p>
        <p className="text-3xl font-bold text-text mt-8">DNA.</p>
      </>
    ),
  },
  {
    id: 'ch-2',
    number: 2,
    title: 'The Medium That Outlived the Dinosaurs',
    short: 'Medium',
    render: () => (
      <>
        <p>DNA is the OG hard drive. It stores the blueprint for every living thing on Earth in a language made of just four letters: <strong>A, C, G, and T</strong>.</p>
        <ImagePlate src="/story-images/lab.jpg" alt="" plateId="02" caption="DNA at scale · NYUAD CGSB laboratory" />
        <p><strong>Density:</strong> one gram of DNA can store 117 exabytes. That's every movie, every song, every Wikipedia article — in a teaspoon.</p>
        <p><strong>Longevity:</strong> we've read DNA from specimens 50,000 years old. Mammoth DNA. Still readable. After 50 millennia.</p>
        <p><strong>Self-repair:</strong> living organisms actively maintain and repair their DNA. Try getting your MacBook to do that.</p>
        <p>The math was irresistible. If you could translate digital data into DNA code, you'd have a storage medium that literally <strong>maintains itself, reproduces itself, and can survive ice ages</strong>.</p>
        <Callout>
          <strong>But there was a catch.</strong> DNA wasn't designed for storing art catalogs. It was designed for storing instructions like "make a liver" and "grow two eyes." If you randomly jam art data into DNA, you might accidentally tell the organism to produce a toxic protein.
        </Callout>
        <p>So Henry needed a plan. A careful one.</p>
      </>
    ),
  },
  {
    id: 'ch-3',
    number: 3,
    title: 'The Translation Problem',
    short: 'Translation',
    render: () => (
      <>
        <p>Here's how you turn a piece of text into DNA. First, convert the text to binary. The letter "A" becomes <code className="font-mono text-accent bg-bg-elev px-1.5 py-0.5 rounded text-sm">01000001</code>. The word "art" becomes <code className="font-mono text-accent bg-bg-elev px-1.5 py-0.5 rounded text-sm">01100001 01110010 01110100</code>.</p>
        <p>Then map to DNA letters: 00 → A, 01 → C, 10 → G, 11 → T. Now you have genetic code encoding the word "art."</p>
        <Callout>
          <strong>But wait</strong> — what if that stretch of DNA, by coincidence, spells out "please destroy this cell" in biological language?
        </Callout>
        <p>That's why the team built a <strong>screening pipeline</strong>. Before any encoded DNA touches a living organism, it checks: <strong>stop codons</strong> that would interrupt protein production, <strong>toxic protein motifs</strong>, <strong>pathogen-like sequences</strong>, and <strong>GC balance</strong> so the DNA doesn't fold weirdly.</p>
        <p>Think of it as a spell-checker, but instead of typos, it checks for <strong>"will this accidentally kill the fish."</strong></p>
      </>
    ),
  },
  {
    id: 'ch-4',
    number: 4,
    title: 'The Quantum Part',
    short: 'Quantum',
    render: () => (
      <>
        <p>DNA isn't perfect. When fish reproduce, about <strong>1% of the bases</strong> get swapped, deleted, or inserted. Over generations, your encoded catalog turns into gibberish.</p>
        <p>The simple approach: make 3 copies. If one gets damaged, you have two backups. <strong>97% accuracy with 3× overhead</strong>.</p>
        <p>But Henry went bigger. <strong>He borrowed from quantum computing.</strong></p>
        <div className="text-center py-12 my-10">
          <div className="text-6xl md:text-8xl font-bold text-accent leading-none">99.999%</div>
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-text-faint mt-3">
            accuracy at 1% error rates · 1.8× overhead
          </p>
        </div>
        <p>Quantum computers use <strong>surface code error correction</strong> — a 2D grid with clever math to detect and fix errors. Henry adapted this for DNA, mapping "X errors" (bit flips) and "Z errors" (phase flips) to actual chemical mutations.</p>
        <p>Then he ran <strong>Monte Carlo simulations</strong> — millions of virtual fish over millions of generations.</p>
        <p>A quantum error correction code, running in a fish, protecting art from Abu Dhabi. <strong>The universe is strange.</strong></p>
      </>
    ),
  },
  {
    id: 'ch-5',
    number: 5,
    title: 'Putting It In The Fish',
    short: 'Fish',
    render: () => (
      <>
        <ImagePlate src="/story-images/fish.jpg" alt="" plateId="05" caption="Zebrafish embryos at single-cell stage · Tan & Koessler 2024" fullBleed aspect="16/9" />
        <p>You inject encoded DNA into a <strong>zebrafish embryo at the one-cell stage</strong> — a fertilized egg that hasn't decided what it's going to be yet.</p>
        <p>The tool: <strong>Tol2 transposon</strong> — molecular cut-and-paste. It inserts your sequence into the fish's genome.</p>
        <Callout>
          <strong>The fun part:</strong> the DNA package includes a fluorescent reporter gene. The fish that carry the data <strong>literally glow green</strong> under UV light.
        </Callout>
        <p>Two designs — fusion and P2A — both worked. Some fish glow, some don't. The glowing ones? <strong>Those are your data carriers.</strong></p>
        <p>Breed them. Two generations later, sequence the DNA. <strong>Did the data survive?</strong></p>
        <p><strong>The answer was yes.</strong></p>
      </>
    ),
  },
  {
    id: 'ch-6',
    number: 6,
    title: 'The Al Mawrid Archive',
    short: 'Al Mawrid',
    render: () => (
      <>
        <p>So what exactly got encoded?</p>
        <p>The <strong>Al Mawrid Arab Center for the Study of Art</strong> at NYU Abu Dhabi collects foundational documents of modern Arab art history. Catalogs. Exhibition records. Artist statements.</p>
        <p>One particularly precious item: the catalog from the <strong>First Exhibition of the Emirates Fine Arts Society, Abu Dhabi, 1980</strong>. Physical copies are rare. Digital copies live on servers.</p>
        <p><strong>Now they also live in fish.</strong></p>
        <ImagePlate src="/story-images/dna-abstract.jpg" alt="" plateId="06" caption="DNA sequence visualization · encoded catalog" />
        <PullQuote citation="Iman Mersal, Egyptian poet">
          Archives are not neutral. They are shaped by who holds power, who gets to remember, and who gets forgotten.
        </PullQuote>
        <p>By encoding these materials into living organisms, the project asks: <strong>what if the archive wasn't something you store in a building, but something you keep alive?</strong></p>
      </>
    ),
  },
  {
    id: 'ch-7',
    number: 7,
    title: 'The Temple of Singularity',
    short: 'Temple',
    render: () => (
      <>
        <p>The fish don't live in a lab somewhere, forgotten. They're part of something bigger.</p>
        <p>Henry is building the <strong>Temple of Singularity</strong> — an installation combining living organisms, archival display, and interactive technology.</p>
        <p>You walk into a dimly lit room. In the center, a tank of zebrafish — each carrying encoded cultural memory. Around the tank, the original documents. On screens, a real-time DNA sequencer reads the fish's genetic code and <strong>decodes the data back into text</strong>.</p>
        <p><strong>The archive is alive. It swims. It reproduces. It will outlast everyone who built it.</strong></p>
        <p>An artist from Bangkok, working with scientists in Abu Dhabi, using quantum physics to protect Arab art in fish that might outlive civilization as we know it.</p>
      </>
    ),
  },
  {
    id: 'ch-8',
    number: 8,
    title: 'The Ethics',
    short: 'Ethics',
    render: () => (
      <>
        <p>Let's be real: encoding data into living animals raises questions.</p>
        <Callout>
          <strong>Is it okay to modify fish genomes for art?</strong>
          <br /><br />
          The zebrafish are a standard lab model. The modifications don't cause harm — the fluorescent reporter is the same protein that makes jellyfish glow, widely used in research. The encoded data is carefully screened to avoid biological disruption.
        </Callout>
        <Callout>
          <strong>What about cultural sovereignty?</strong>
          <br /><br />
          The project includes protocols for <strong>Free, Prior, and Informed Consent (FPIC)</strong> — ensuring communities have agency over how their heritage is encoded, stored, and displayed.
        </Callout>
        <Callout>
          <strong>What happens when the fish die?</strong>
          <br /><br />
          Eventually, every fish dies. The transgene might be lost. But that's partly the point. Henry calls this the <strong>"living archive paradigm"</strong> — unlike a hard drive that fails suddenly, a living archive degrades gradually, and its degradation is itself meaningful. <strong>The imperfection is the feature.</strong>
        </Callout>
      </>
    ),
  },
  {
    id: 'ch-9',
    number: 9,
    title: 'Why This Matters',
    short: 'Why',
    render: () => (
      <>
        <p>Because everything we create is temporary. Our books, photos, videos, music — all of it is one power outage away from oblivion.</p>
        <p>DNA has lasted <strong>3.5 billion years</strong>. It doesn't need electricity. It doesn't need a software company to stay in business. It just needs water, food, and time.</p>
        <p>We're not just building a better backup system. We're reimagining what an archive can be: <strong>not a warehouse of dead objects, but a garden of living memory.</strong></p>
        <p>The fish swim. The data persists. The story continues.</p>
        <p>And somewhere in Abu Dhabi, a document from 1980 is being carried by a creature that will exist long after all of us are gone.</p>
      </>
    ),
  },
];
