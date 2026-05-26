# Living Archive — UI Redesign

**Date:** 2026-05-26
**Status:** Draft for review
**Project root:** `~/.openclaw/workspace/living-archive-web`
**Live site:** <https://living-archive-web.vercel.app>

## Goal

Redesign the UI of the Living Archive site across all three surfaces — Story, Pipeline, Publications — so the site reads like a published archive rather than a startup landing page. The current site has the right content but its visual system, route shape, and component structure undercut the writing.

## Audience & success criteria

- **Primary audience:** curious public — readers who arrive without a science or art background and stay for the story.
- **Success looks like:**
  - A reader can finish all nine chapters of Story without losing their place. The chapter rail proves where they are.
  - Each publication is shareable as its own URL.
  - The Pipeline's "magic" moment (text → DNA) is the first thing a visitor sees, not buried under controls.
  - Lighthouse a11y ≥ 95 on every page; Lighthouse perf ≥ 90 on every page.

## Direction — Quiet Editorial

Serif body, single accent, generous whitespace, lab-mono labels. The visual system gets out of the writing's way. Inspired by long-form scientific publications (Quanta, Nautilus) and small-press art journals; explicitly *not* inspired by SaaS marketing dark themes.

## Out of scope

- About / Contact / Credits pages
- CMS / MDX authoring tooling
- Internationalization (English only)
- Light theme (dark only — matches the archive metaphor)
- New imagery (uses existing `public/story-images/*`)
- Comments, accounts, or any dynamic backend
- Refactoring git history

---

## 1. Design tokens

### Typography

Two families, one role each. No third. No system-font fallback for headings.

| Family | Use | Loaded via |
|---|---|---|
| **Source Serif 4** (variable, 8–60 opsz) | Body, hero, chapter titles, blockquotes, all reading copy. Includes italics. | `next/font/google` |
| **JetBrains Mono** (variable, 400/500/600) | Chapter numbers, captions, code, pipeline output, nav links, UI labels. | `next/font/google` |

#### Type scale

| Token | Size / Line / Tracking | Role |
|---|---|---|
| `display` | 56–80 / 1.0 / -0.025em | Hero |
| `h1` | 38–48 / 1.05 / -0.02em | Page title |
| `h2` | 36 / 1.1 / -0.015em | Chapter / section |
| `h3` (mono) | 11 / 1.2 / 0.18em uppercase | Mono subhead in publications |
| `body` | 17 / 1.78 / 0 | Body copy |
| `pull-quote` | 22 / 1.5 / -0.005em italic | Block quote |
| `label` (mono) | 11 / 1.2 / 0.22em uppercase | Eyebrow, button label |
| `caption` (mono) | 12 / 1.5 / 0.04em | Figure captions |
| `meta` (mono) | 10 / 1.5 / 0.15em uppercase | Read time, plate IDs, byline |

### Palette

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#0a0a0a` | Page background |
| `--bg-elev` | `#0c0c0c` | Cards, callouts, blockquotes, input chrome — single elevated surface |
| `--bg-elev-2` | `#111111` | Nav bar background (with `/90` alpha + backdrop-blur) |
| `--border` | `#1f1f1f` | Default border |
| `--border-soft` | `#161616` | Section dividers, between-chapter rules |
| `--text` | `#e8e8e8` | Body text |
| `--text-dim` | `#888888` | Secondary text, deck, byline |
| `--text-faint` | `#555555` | Disabled / tertiary |
| `--accent` | `#00d4aa` | The only accent. Used for: eyebrows, link underlines, primary button bg, callout left border, active chapter, progress bar |
| `--accent-soft` | `#0d3a32` | Tinted backgrounds for accent badges |
| `--accent-border` | `#1f3a32` | Quiet outlined buttons in the accent family |

The current `globals.css` defines nine colors (`--accent`, `--accent2`, `--accent3`, `--accent4`, `--accent-nature`, `--accent-science`, `--accent-leonardo`, plus `--accent-teal`). The redesign drops all but one. The four ACGT colors below survive *only* inside Pipeline.

### Functional palette (Pipeline only)

| Token | Hex | Role |
|---|---|---|
| `--dna-A` | `#00ff88` | Nucleotide A |
| `--dna-C` | `#4a9eff` | Nucleotide C |
| `--dna-G` | `#ffaa00` | Nucleotide G |
| `--dna-T` | `#ff4444` | Nucleotide T |

These never appear on Story or Publications.

### Tailwind v4 wiring

Tokens land in `app/globals.css` via a `@theme` block so they become Tailwind utilities automatically:

```css
@import "tailwindcss";
@theme {
  --color-bg: #0a0a0a;
  --color-bg-elev: #111111;
  --color-border: #1f1f1f;
  --color-text: #e8e8e8;
  --color-text-dim: #888888;
  --color-accent: #00d4aa;
  /* …rest of the palette */
  --font-serif: var(--font-source-serif);
  --font-mono: var(--font-jetbrains-mono);
}
```

Fonts loaded in `app/layout.tsx` via `next/font/google` and exposed as CSS variables (`--font-source-serif`, `--font-jetbrains-mono`).

---

## 2. Information architecture

### Routes

```
/                              Story (home)
/pipeline                      Try it
/pipeline/how-it-works         Technical step-by-step (new)
/publications                  Index of three papers
/publications/nature-biotech   Reader (new)
/publications/science-advances Reader (new)
/publications/leonardo         Reader (new)
```

Three top-level routes preserved. Depth added via nesting; no breadth growth.

### Global navigation

`app/layout.tsx` ships a shared `<SiteNav>` and `<SiteFooter>`.

- **Nav** (fixed top): serif logo "Living Archive" · three mono-uppercase links (`STORY`, `PIPELINE`, `PUBLICATIONS`) · active link gets a 1px teal underline.
- **Progress bar**: 1px-tall track at the bottom edge of the nav, fills left-to-right in accent. Renders only on `/` (Story). Driven by a `useScrollProgress()` hook reading `document.documentElement`.
- **Footer** (new): minimal block. Project tagline, three journal credits, `© Henry Tan & Carmen Koessler 2026`. Mono only. No nav links.

---

## 3. Story page (`app/page.tsx`)

### Layout

Three-column grid at `≥ 1100px`:

```
┌─────────────────────────────────────────────────┐
│  fixed nav · progress bar                       │
├─────────────────────────────────────────────────┤
│                                                 │
│           [ full-bleed hero ]                   │
│                                                 │
├──────┬──────────────────────────────────┬───────┤
│      │                                  │       │
│ ch   │   620px body column              │ meta  │
│ rail │   (centered in grid)             │       │
│ 120  │                                  │ 120   │
│      │                                  │       │
└──────┴──────────────────────────────────┴───────┘
```

- Rail (`120px`): sticky, mono. Numbered chapter list. Current chapter teal; read chapters dim; unread chapters faint.
- Body (`max-width: 620px`): stays at 620px even on huge displays — measure controls pace.
- Meta column (`120px`): sticky read time + chapter X/9 indicator.

Below `1100px`: meta column drops. Below `900px`: rail collapses to a top sticky bar showing the current chapter; tap opens a TOC sheet.

### Components (under `app/components/`)

| Component | Responsibility |
|---|---|
| `<StoryHero>` | Full-bleed image, mono eyebrow, serif headline with italicized accent word, serif deck, mono byline, scroll indicator. |
| `<ChapterRail>` | Numbered list with active state. Uses IntersectionObserver to track which `<section id="ch-N">` is in view. Collapses to a top bar at `<900px`. |
| `<Chapter>` | Wraps a single chapter. Props: `number`, `title`, `id`, `children`. Renders the eyebrow, h2, and body. |
| `<Callout>` | One variant only. Teal left border, soft-surface background. Replaces today's four colored variants. |
| `<PullQuote>` | Italicized serif quote with optional citation. No background; just the accent left border. |
| `<ImagePlate>` | `next/image` with `Plate NN` mono caption. Captions are part of the figure semantically. |
| `<ChapterFooterCTA>` | Final block: heading + deck + 3 buttons (`Pipeline →`, `Publications`, `Share`). |

### Chapter data

The nine chapters move from inline JSX to a typed `chapters` array in `app/content/chapters.tsx`. Each entry is `{ id, number, title, render: () => JSX }` — `render` returns JSX so embedded `<Callout>`, `<ImagePlate>`, etc. work without a markdown layer. This keeps editorial control while making rail wiring trivial.

### Reading progress

`useScrollProgress()` hook exposes `0–1`. Mounted in `<SiteNav>` to drive the underbar; mounted in `<MetaColumn>` to drive "ch 3/9". Stable `#ch-1`…`#ch-9` anchors enable deep-linking and TOC navigation.

---

## 4. Pipeline (`app/pipeline/`)

The current `app/pipeline/page.tsx` is one 314-line client component that builds output via `dangerouslySetInnerHTML` string concatenation. Split into two pages backed by a real component library.

### `lib/dna.ts` (new — pure logic, fully testable)

Extracts every transformation in the current page into pure functions with no DOM coupling:

```ts
export type Nucleotide = 'A' | 'C' | 'G' | 'T';
export interface StopCodon { p: number; codon: string; frame: number }
export interface SurfaceBlock { data: string; parity: string; full: string }
export interface EncodeResult {
  ascii: string;
  binary: string;
  rawDna: string;
  stopCodons: StopCodon[];
  fixedDna: string;
  fixedStopCodons: StopCodon[];
  blocks: SurfaceBlock[];      // d=0 produces one block with empty parity
  storedDna: string;            // blocks.map(b => b.full).join('') — what gets "saved"
  totalLength: number;
}
export interface DecodeResult { text: string; warnings: string[] }

export function asciiToBinary(t: string): string;
export function binaryToDna(b: string): string;
export function dnaToBinary(d: string): string;
export function binaryToAscii(b: string): string;
export function findStopCodons(dna: string): StopCodon[];
export function fixStopCodons(dna: string): string;
export function encodeSurfaceCode(dna: string, d: number): SurfaceBlock[];
export function encode(text: string, d: number): EncodeResult;
export function decode(dna: string, d: number): DecodeResult;
```

Unit-tested in `lib/dna.test.ts` with Vitest. Core invariant: for any printable-ASCII `text` and any `d ∈ {0, 3, 5, 7}`, `decode(encode(text, d).storedDna, d).text === text`. Additional property tests cover stop-codon screening idempotency and surface-code parity correctness.

### `/pipeline` — Try it (`app/pipeline/page.tsx`)

The public-facing surface. One textarea, one button, animated output, three pills. **No QEC selector. No step breakdown. No `dangerouslySetInnerHTML`.**

| Element | Detail |
|---|---|
| Hero | Mono eyebrow "PIPELINE · TRY IT" · serif h1 "Encode *anything* into DNA." · serif deck. |
| Tab toggle | `Encode` / `Decode` (mono uppercase, teal underline on active). |
| Input | Large serif textarea, 18px / 1.55, placeholder samples Iman Mersal's quote. Char count + ASCII validation in mono helper text. |
| Action | Single primary button "▶ Encode" — full-width on mobile, inline on desktop. |
| Output | Card. Mono header showing length in `nt`. ACGT in mono with the four functional colors. Reveal-on-completion (no streaming animation needed). |
| Output actions | Three pills: `COPY SEQUENCE`, `SHARE`, `DECODE BACK →`. |
| Footer link | `Want the science? How this works →` to `/pipeline/how-it-works`. |

**Default QEC** = `d=3`. Hidden from the public surface. Users who want to change it open `/pipeline/how-it-works`.

### `/pipeline/how-it-works` — Technical (`app/pipeline/how-it-works/page.tsx`)

The rebuilt step-by-step view. **Same encoder, full detail.**

| Element | Detail |
|---|---|
| Back link | `← back to /pipeline` (mono, teal). |
| Header | Mono eyebrow "/pipeline/how-it-works" · serif h1 "Four steps from *letter* to *life*." |
| Controls bar | QEC code selector (None / d=3 / d=5 / d=7), detail level (Expanded / Compact), sample input dropdown. Mono. |
| Step 01 | ASCII → Binary → DNA. Two side-by-side detail cells (ASCII input, binary) + full-width raw DNA cell with stop-codon count. |
| Step 02 | Stop-codon screening. Shows scanned frames, found codons with substitutions if any, final clean DNA. |
| Step 03 | QEC. Surface-code grid visualization (d×d data + 4d parity, color-coded). Block stats panel. |
| Step 04 | Final DNA sequence, click-to-copy. |

Step components are parameterized: `<Step number title meta>{children}</Step>`. Surface-code grid is its own `<SurfaceCodeGrid d={3} />` component (~80 lines, plain divs with CSS grid).

Both pages share `useDnaEncoder(input, d)` — one hook, two views.

### Error handling

- **Encode**: non-ASCII input surfaces a soft inline warning ("Living Archive's prototype encodes ASCII only. Emoji and accented characters will be skipped."). Encoding still proceeds for the ASCII portion.
- **Decode**: non-ACGT characters in the input get highlighted in the textarea via a visible badge above the input ("3 invalid characters at positions 12, 47, 82 — these will be ignored."). Decoding still attempts.
- **Empty input**: button disabled, helper text reads "Type to encode."

---

## 5. Publications (`app/publications/`)

The current implementation fetches markdown client-side from `/public/*-version.md` and parses it with a 25-line regex into `dangerouslySetInnerHTML`. Rebuilt as a proper markdown reader with one URL per paper.

### Content move

```
public/nature-biotech-version.md    →  content/papers/nature-biotech.md
public/science-advances-version.md  →  content/papers/science-advances.md
public/leonardo-version.md          →  content/papers/leonardo.md
```

Each file gets a frontmatter block:

```yaml
---
slug: nature-biotech
journal: Nature Biotech
kind: Technical
length: 5000
citation: numbered
summary: |
  The biotech paper. Synthetic biologists and bioengineers: the wet-lab
  pipeline, the Tol2 transposon protocol, the QEC math, and the data
  showing data survived to F2 generation.
---
```

Parsed with `gray-matter`. Bodies rendered with `react-markdown` + `remark-gfm` + `rehype-slug` + `rehype-autolink-headings`.

### `/publications` — Index (`app/publications/page.tsx`)

Server component. Reads all `content/papers/*.md` files at build time with `fs`. Renders one `<PaperCard>` per paper.

| Card layout (3-column grid inside the card) | |
|---|---|
| Left (160px) | Mono journal name in teal · kind / length / citation tags below |
| Center | Serif title (h3, 22px, weight 600) · plain-English summary from frontmatter |
| Right (140px) | `READ →` button (outlined accent) · `.md` download link |

Stacks to one column at `<800px`.

### `/publications/[slug]` — Reader (`app/publications/[slug]/page.tsx`)

Server component. `generateStaticParams()` returns one entry per markdown file. `generateMetadata()` produces per-paper OG / Twitter cards.

Three-column layout at `≥ 1100px`:

```
┌──── 200px ────┬──── 680px ────┬──── 220px ────┐
│  Auto TOC     │  Article body  │  Side panel  │
│  (sticky)     │                │  (sticky)    │
└───────────────┴────────────────┴──────────────┘
```

| Region | Detail |
|---|---|
| TOC sidebar | Auto-generated from h2/h3 headings. Active heading tracked via IntersectionObserver. Mono. |
| Article body | Serif body. H2 with hover `¶` anchor for deep links. Blockquotes with teal left border. Code blocks with mono and `--bg-elev` background. |
| Side panel | Mono. Three stat blocks (journal · length · citation) + three action buttons (`Download .md`, `Download .pdf`, `View on GitHub`). |

Below `1100px`: TOC moves to a collapsible drawer at the top of the article; side panel becomes a horizontal block above the article body.

### Plain-English summaries

Three short paragraphs need to be written (one per paper) for the frontmatter `summary` field. These appear on the index cards and as the deck on each reader page. Drafts written during implementation, reviewed before merge.

### Drops

- The 25-line regex parser in the current `publications/page.tsx`
- The client-side `fetch` for `/*-version.md` (replaced with build-time `fs` read)
- The colored tab indicator (replaced with card layout — no tabs)
- The per-paper accent color (`#4caf50`, `#2196f3`, `#ff9800`) — single accent across the system

---

## 6. Implementation guardrails

### Error handling

- Pipeline encode/decode warnings handled inline (see §4).
- Publications: missing markdown file fails the build, not the runtime.
- Story chapter rail uses IntersectionObserver with feature detection; falls back to a static rail on browsers that lack it.
- All `<Image>` calls get meaningful `alt` text; missing files fail the build.

### Testing

| Test | Tool | Trigger |
|---|---|---|
| Unit tests for `lib/dna.ts` | Vitest | Pre-push hook + CI |
| Type check | `tsc --noEmit` | Pre-push hook + CI |
| Lint | `next lint` | Pre-push hook + CI |
| Lighthouse a11y ≥ 95 / perf ≥ 90 | Lighthouse CI | Vercel deployment check on every preview |
| Visual smoke (1440×900 + 375×812) | Playwright screenshots | CI; diff posted as comment |
| Markdown rendering snapshots | Vitest | Pre-push hook + CI |

CI runs via GitHub Actions if/when the repo is pushed to GitHub. If the project continues to deploy via Vercel CLI without a Git integration, the unit / type / lint checks run via a `pre-push` git hook (`husky`) and Lighthouse runs via Vercel's built-in checks. The redesign does not block on choosing one or the other.

### Browser support

Modern evergreen browsers — Chrome, Firefox, Safari, Edge latest 2 versions. IntersectionObserver, `position: sticky`, CSS grid, `backdrop-filter` all required (no polyfills shipped). Mobile Safari and Chrome on Android tested manually before merge.

### Performance budget

| Page | Target JS shipped | Target LCP |
|---|---|---|
| `/` (Story) | < 50 KB gzipped | < 2.0s |
| `/pipeline` | < 25 KB gzipped (lib/dna.ts is tiny) | < 1.5s |
| `/publications/*` | < 15 KB gzipped (all server-rendered) | < 1.5s |

---

## 7. File tree (post-implementation)

```
living-archive-web/
├── app/
│   ├── layout.tsx                              # SiteNav + SiteFooter + font loading
│   ├── globals.css                             # @theme tokens
│   ├── page.tsx                                # Story
│   ├── components/
│   │   ├── SiteNav.tsx
│   │   ├── SiteFooter.tsx
│   │   ├── ScrollProgress.tsx
│   │   ├── StoryHero.tsx
│   │   ├── ChapterRail.tsx
│   │   ├── Chapter.tsx
│   │   ├── Callout.tsx
│   │   ├── PullQuote.tsx
│   │   ├── ImagePlate.tsx
│   │   ├── ChapterFooterCTA.tsx
│   │   ├── pipeline/
│   │   │   ├── EncodePanel.tsx
│   │   │   ├── DecodePanel.tsx
│   │   │   ├── Step.tsx
│   │   │   ├── SurfaceCodeGrid.tsx
│   │   │   └── DnaSequence.tsx              # ACGT colored render
│   │   └── publications/
│   │       ├── PaperCard.tsx
│   │       ├── PaperTOC.tsx
│   │       └── PaperSidePanel.tsx
│   ├── content/
│   │   └── chapters.tsx                        # 9 typed chapter records
│   ├── hooks/
│   │   ├── useScrollProgress.ts
│   │   ├── useActiveChapter.ts                 # IntersectionObserver
│   │   └── useDnaEncoder.ts
│   ├── pipeline/
│   │   ├── page.tsx                            # Try it
│   │   └── how-it-works/page.tsx               # Technical
│   └── publications/
│       ├── page.tsx                            # Index
│       └── [slug]/page.tsx                     # Reader
├── content/
│   └── papers/
│       ├── nature-biotech.md                   # Moved from /public
│       ├── science-advances.md
│       └── leonardo.md
├── lib/
│   ├── dna.ts                                  # Pure encode/decode
│   ├── dna.test.ts
│   └── papers.ts                               # Frontmatter parser, paper index
├── public/                                     # Unchanged: story-images, favicon
└── tests/
    └── e2e/                                    # Playwright screenshot configs
```

**Why `app/content/` vs `content/`:** `app/content/chapters.tsx` is TSX — typed React content — and lives alongside `app/components/` because it imports from the app's component library. `content/papers/*.md` is raw markdown — data, not code — so it sits at the project root and is read at build time via `fs`.

---

## 8. Migration sequencing

Each step is independently shippable and reviewable.

| Step | Scope | Est. |
|---|---|---|
| 1 | Token layer: `globals.css` + `@theme` block + Google Fonts via `next/font`. Update `<SiteNav>` to use the new system. Delete old `--accent2`, `--accent3`, etc. | 1d |
| 2 | Shared layout: `<SiteFooter>`, `<ScrollProgress>`, `useScrollProgress()`. Wire progress bar (only renders on `/`). | 0.5d |
| 3 | Story rebuild: move chapter content to `app/content/chapters.tsx`; build `<StoryHero>`, `<ChapterRail>`, `<Chapter>`, `<Callout>` (one variant), `<PullQuote>`, `<ImagePlate>`, `<ChapterFooterCTA>`. Wire IntersectionObserver. | 2d |
| 4 | Pipeline refactor: extract `lib/dna.ts` with full Vitest suite; build `<Step>`, `<SurfaceCodeGrid>`, `<DnaSequence>`. Split into `/pipeline` and `/pipeline/how-it-works`. Remove `dangerouslySetInnerHTML`. | 1.5d |
| 5 | Publications: install `react-markdown` + plugins + `gray-matter`; move papers to `content/papers/`; build index + reader. Write the three plain-English summaries. | 1.5d |
| 6 | Tests + CI: Vitest config, Playwright screenshot config, Lighthouse CI config. Add GitHub Actions workflow. | 1d |

**Total:** ~7.5 working days.

---

## 9. Open questions

None blocking. The following deferred:
- Final draft of plain-English summaries for the three papers (written during step 5, reviewed before merge).
- Whether to push the repo public on GitHub or keep deploying via Vercel CLI (orthogonal to the redesign — decision left to project owner).
