# Living Archive UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Living Archive UI across Story, Pipeline, and Publications per the spec at `docs/superpowers/specs/2026-05-26-living-archive-redesign-design.md` — quiet-editorial visual system, per-paper URLs, pipeline split, all without `dangerouslySetInnerHTML`.

**Architecture:** Next.js 16 App Router with React 19 and Tailwind v4. Pure logic in `lib/`, components in `app/components/`, content as typed React in `app/content/` or markdown in `content/papers/`. Two custom fonts via `next/font`. Single accent color, single elevated surface, two type families.

**Tech Stack:** Next.js 16.2.6 · React 19.2.4 · Tailwind v4 · TypeScript 5 · Vitest + @testing-library/react · react-markdown 9 + remark-gfm + rehype-slug + rehype-autolink-headings · gray-matter · Playwright 1.x · Husky 9

---

## Working Conventions

- **Repo root:** `~/.openclaw/workspace/living-archive-web`. All paths below are relative to repo root.
- **Branch:** work on `main` (no other branches exist; small team, frequent commits make this safe).
- **Commit cadence:** every task ends with a commit. Steps that read "Commit" run the listed `git add` + `git commit`.
- **Co-author trailer:** every commit message ends with `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`.
- **Run dev server:** `npm run dev` — visit `http://localhost:3000`. Don't leave it running between tasks unless instructed.
- **Test command:** `npx vitest run` (one-off) or `npx vitest` (watch mode).

---

## File Map

New files this plan creates:

```
app/
  components/
    SiteNav.tsx                       Task 3
    SiteFooter.tsx                    Task 3
    ScrollProgress.tsx                Task 3
    Callout.tsx                       Task 4
    PullQuote.tsx                     Task 4
    ImagePlate.tsx                    Task 4
    StoryHero.tsx                     Task 5
    Chapter.tsx                       Task 5
    ChapterRail.tsx                   Task 5
    ChapterFooterCTA.tsx              Task 5
    pipeline/
      DnaSequence.tsx                 Task 9
      Step.tsx                        Task 9
      SurfaceCodeGrid.tsx             Task 9
      EncodePanel.tsx                 Task 10
      DecodePanel.tsx                 Task 10
    publications/
      PaperCard.tsx                   Task 13
      PaperTOC.tsx                    Task 14
      PaperSidePanel.tsx              Task 14
  content/
    chapters.tsx                      Task 6
  hooks/
    useScrollProgress.ts              Task 3
    useActiveChapter.ts               Task 5
    useDnaEncoder.ts                  Task 9
  pipeline/
    how-it-works/page.tsx             Task 11
  publications/
    [slug]/page.tsx                   Task 14
lib/
  dna.ts                              Task 8
  dna.test.ts                         Task 8
  papers.ts                           Task 12
  papers.test.ts                      Task 12
content/
  papers/
    nature-biotech.md                 Task 12 (moved from public/)
    science-advances.md               Task 12 (moved from public/)
    leonardo.md                       Task 12 (moved from public/)
tests/
  e2e/
    smoke.spec.ts                     Task 15
playwright.config.ts                  Task 15
vitest.config.ts                      Task 1
.husky/
  pre-push                            Task 16
```

Files this plan modifies:

- `package.json` — add scripts and deps (Tasks 1, 12, 15, 16)
- `app/layout.tsx` — fonts, SiteNav, SiteFooter (Tasks 2, 3)
- `app/globals.css` — `@theme` block, new tokens (Task 2)
- `app/page.tsx` — Story page rewrite (Task 7)
- `app/pipeline/page.tsx` — Try-it surface rewrite (Task 10)
- `app/publications/page.tsx` — Index rewrite (Task 13)

Files this plan deletes after Task 12:

- `public/nature-biotech-version.md`
- `public/science-advances-version.md`
- `public/leonardo-version.md`

---

## Phase A — Foundation (Tasks 1–3)

### Task 1: Install test infrastructure

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install test deps**

```bash
cd ~/.openclaw/workspace/living-archive-web
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Expected: `added N packages`, no errors. The exact count varies — what matters is exit code 0.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'tests/e2e/**'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Add scripts to `package.json`**

In the `"scripts"` block, add:

```json
"test": "vitest run",
"test:watch": "vitest",
"typecheck": "tsc --noEmit"
```

The complete scripts block becomes:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest",
  "typecheck": "tsc --noEmit"
},
```

- [ ] **Step 5: Write a smoke test to verify setup**

Create `lib/__smoke__.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('vitest smoke', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });

  it('has jsdom', () => {
    document.body.innerHTML = '<p>hello</p>';
    expect(document.querySelector('p')?.textContent).toBe('hello');
  });
});
```

- [ ] **Step 6: Run the smoke test**

```bash
npm test -- lib/__smoke__.test.ts
```

Expected: `2 passed`, exit 0.

- [ ] **Step 7: Delete the smoke test**

```bash
rm lib/__smoke__.test.ts
```

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "$(cat <<'EOF'
chore: install Vitest with jsdom + Testing Library

Adds vitest, @testing-library/react, @testing-library/user-event,
jest-dom matchers, and jsdom. Adds test, test:watch, typecheck
scripts. Verified with a smoke test that ran and was removed.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Design tokens and fonts

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace `app/globals.css` entirely**

```css
@import "tailwindcss";

@theme {
  /* Surfaces */
  --color-bg: #0a0a0a;
  --color-bg-elev: #0c0c0c;
  --color-bg-elev-2: #111111;
  --color-border: #1f1f1f;
  --color-border-soft: #161616;

  /* Text */
  --color-text: #e8e8e8;
  --color-text-dim: #888888;
  --color-text-faint: #555555;

  /* Accent — the only one */
  --color-accent: #00d4aa;
  --color-accent-soft: #0d3a32;
  --color-accent-border: #1f3a32;

  /* Functional palette — Pipeline only */
  --color-dna-a: #00ff88;
  --color-dna-c: #4a9eff;
  --color-dna-g: #ffaa00;
  --color-dna-t: #ff4444;

  /* Fonts (variables set by next/font in layout.tsx) */
  --font-serif: var(--font-source-serif), Georgia, serif;
  --font-mono: var(--font-jetbrains-mono), "SF Mono", Menlo, monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { background: var(--color-bg); }

body {
  font-family: var(--font-serif);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }

/* Pipeline ACGT nucleotide colors */
.base-A { color: var(--color-dna-a); font-weight: 500; }
.base-C { color: var(--color-dna-c); font-weight: 500; }
.base-G { color: var(--color-dna-g); font-weight: 500; }
.base-T { color: var(--color-dna-t); font-weight: 500; }
```

- [ ] **Step 2: Update `app/layout.tsx` to load fonts and apply font variable**

Replace the entire file with:

```tsx
import type { Metadata } from "next";
import { Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Living Archive",
  description: "Encoding cultural memory into DNA",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Note: the existing nav block in `layout.tsx` is removed here — it gets re-introduced in Task 3 via `<SiteNav>`. The pages will look unstyled briefly until Task 3 lands.

- [ ] **Step 3: Run the build to verify fonts and tokens compile**

```bash
npm run build 2>&1 | tail -25
```

Expected: `✓ Compiled successfully`, no font errors, no Tailwind errors. Three routes still build (`/`, `/pipeline`, `/publications`).

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "$(cat <<'EOF'
feat(tokens): introduce design-system tokens and load fonts

Replaces ad-hoc CSS vars with a Tailwind v4 @theme block: one bg-elev
token, one accent, plus DNA nucleotide colors scoped to Pipeline.
Loads Source Serif 4 and JetBrains Mono via next/font and exposes
them as --font-serif and --font-mono. Removes the inline nav from
layout.tsx; SiteNav arrives in the next commit.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Shared layout — SiteNav, SiteFooter, ScrollProgress

**Files:**
- Create: `app/hooks/useScrollProgress.ts`
- Create: `app/components/ScrollProgress.tsx`
- Create: `app/components/SiteNav.tsx`
- Create: `app/components/SiteFooter.tsx`
- Modify: `app/layout.tsx`
- Test: `app/components/SiteNav.test.tsx`

- [ ] **Step 1: Write failing test for SiteNav**

Create `app/components/SiteNav.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiteNav } from './SiteNav';

describe('SiteNav', () => {
  it('renders the wordmark and three nav links', () => {
    render(<SiteNav pathname="/" />);
    expect(screen.getByText('Living Archive')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Story' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Pipeline' })).toHaveAttribute('href', '/pipeline');
    expect(screen.getByRole('link', { name: 'Publications' })).toHaveAttribute('href', '/publications');
  });

  it('marks the Story link as current when on /', () => {
    render(<SiteNav pathname="/" />);
    expect(screen.getByRole('link', { name: 'Story' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Pipeline' })).not.toHaveAttribute('aria-current');
  });

  it('marks the Pipeline link as current on /pipeline', () => {
    render(<SiteNav pathname="/pipeline" />);
    expect(screen.getByRole('link', { name: 'Pipeline' })).toHaveAttribute('aria-current', 'page');
  });

  it('marks the Publications link as current on /publications/leonardo', () => {
    render(<SiteNav pathname="/publications/leonardo" />);
    expect(screen.getByRole('link', { name: 'Publications' })).toHaveAttribute('aria-current', 'page');
  });
});
```

- [ ] **Step 2: Run test, confirm it fails**

```bash
npm test -- app/components/SiteNav.test.tsx
```

Expected: FAIL — "Failed to resolve import './SiteNav'".

- [ ] **Step 3: Create `app/components/SiteNav.tsx`**

```tsx
import Link from 'next/link';

const LINKS = [
  { label: 'Story', href: '/', match: (p: string) => p === '/' },
  { label: 'Pipeline', href: '/pipeline', match: (p: string) => p.startsWith('/pipeline') },
  { label: 'Publications', href: '/publications', match: (p: string) => p.startsWith('/publications') },
];

export interface SiteNavProps {
  pathname: string;
  children?: React.ReactNode;
}

export function SiteNav({ pathname, children }: SiteNavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-elev-2/90 backdrop-blur-sm border-b border-border-soft">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-[15px] font-bold tracking-tight text-text">
          Living Archive
        </Link>
        <div className="flex gap-7 font-mono text-[10px] tracking-[0.18em] uppercase text-text-dim">
          {LINKS.map((l) => {
            const active = l.match(pathname);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={
                  'pb-0.5 transition-colors ' +
                  (active
                    ? 'text-text border-b border-accent'
                    : 'hover:text-text')
                }
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
      {children}
    </nav>
  );
}
```

- [ ] **Step 4: Run test, confirm it passes**

```bash
npm test -- app/components/SiteNav.test.tsx
```

Expected: `4 passed`.

- [ ] **Step 5: Write failing test for useScrollProgress hook**

Create `app/hooks/useScrollProgress.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScrollProgress } from './useScrollProgress';

describe('useScrollProgress', () => {
  beforeEach(() => {
    // Reset scroll-related properties on the jsdom document
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 2000 });
    Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 800 });
    Object.defineProperty(document.documentElement, 'scrollTop', { configurable: true, writable: true, value: 0 });
  });

  it('returns 0 at the top', () => {
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0);
  });

  it('returns ~0.5 when scrolled halfway', () => {
    const { result } = renderHook(() => useScrollProgress());
    act(() => {
      (document.documentElement as unknown as { scrollTop: number }).scrollTop = 600;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBeCloseTo(0.5, 1);
  });

  it('caps at 1 when scrolled past the end', () => {
    const { result } = renderHook(() => useScrollProgress());
    act(() => {
      (document.documentElement as unknown as { scrollTop: number }).scrollTop = 9999;
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current).toBe(1);
  });
});
```

- [ ] **Step 6: Run test, confirm it fails**

```bash
npm test -- app/hooks/useScrollProgress.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 7: Create `app/hooks/useScrollProgress.ts`**

```ts
'use client';
import { useEffect, useState } from 'react';

/** Returns a value in [0, 1] representing how far down the page the viewport is. */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const compute = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const raw = el.scrollTop / scrollable;
      setProgress(Math.min(1, Math.max(0, raw)));
    };
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, []);

  return progress;
}
```

- [ ] **Step 8: Run hook test, confirm pass**

```bash
npm test -- app/hooks/useScrollProgress.test.ts
```

Expected: `3 passed`.

- [ ] **Step 9: Create `app/components/ScrollProgress.tsx`**

```tsx
'use client';
import { useScrollProgress } from '../hooks/useScrollProgress';

/** Renders inside <SiteNav> on pages that want a reading-progress underbar. */
export function ScrollProgress() {
  const p = useScrollProgress();
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(p * 100)}
      className="absolute bottom-0 left-0 h-px bg-accent origin-left transition-[width] duration-75"
      style={{ width: `${p * 100}%` }}
    />
  );
}
```

- [ ] **Step 10: Create `app/components/SiteFooter.tsx`**

```tsx
export function SiteFooter() {
  return (
    <footer className="border-t border-border-soft mt-32">
      <div className="max-w-6xl mx-auto px-6 py-14 font-mono text-[10px] tracking-[0.15em] uppercase text-text-faint flex flex-wrap gap-6 justify-between">
        <span>Living Archive · Encoding cultural memory into DNA</span>
        <span>Nature Biotech · Science Advances · Leonardo (MIT Press)</span>
        <span>© Henry Tan &amp; Carmen Koessler 2026</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 11: Wire SiteNav, ScrollProgress, SiteFooter into `app/layout.tsx`**

Replace the file with:

```tsx
import type { Metadata } from "next";
import { Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";
import { ScrollProgress } from "./components/ScrollProgress";
import "./globals.css";

const sourceSerif = Source_Serif_4({ variable: "--font-source-serif", subsets: ["latin"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Living Archive",
  description: "Encoding cultural memory into DNA",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "/";

  return (
    <html lang="en" className={`${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <body>
        <SiteNav pathname={pathname}>
          {pathname === "/" && <ScrollProgress />}
        </SiteNav>
        <main className="pt-14">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
```

- [ ] **Step 12: Add middleware to expose pathname to layout**

Create `middleware.ts` (at repo root):

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('x-pathname', request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: '/((?!_next|favicon.ico).*)',
};
```

- [ ] **Step 13: Run the full test suite, confirm everything passes**

```bash
npm test
```

Expected: all tests pass (7 total so far). Exit 0.

- [ ] **Step 14: Build to verify Next.js still compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`, 3 routes (`/`, `/pipeline`, `/publications`).

- [ ] **Step 15: Commit**

```bash
git add app/components/SiteNav.tsx app/components/SiteNav.test.tsx \
        app/components/SiteFooter.tsx app/components/ScrollProgress.tsx \
        app/hooks/useScrollProgress.ts app/hooks/useScrollProgress.test.ts \
        app/layout.tsx middleware.ts
git commit -m "$(cat <<'EOF'
feat(layout): SiteNav, SiteFooter, ScrollProgress with pathname routing

SiteNav is a server component that takes pathname as a prop and
marks the active link with aria-current. ScrollProgress reads
scroll position via a useScrollProgress() hook and is mounted
inside SiteNav only on the Story route. SiteFooter is minimal
mono text. A middleware injects the request path as x-pathname
so the server-rendered layout can detect the active route.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Phase B — Story (Tasks 4–7)

### Task 4: Story primitives — Callout, PullQuote, ImagePlate

**Files:**
- Create: `app/components/Callout.tsx`
- Create: `app/components/PullQuote.tsx`
- Create: `app/components/ImagePlate.tsx`
- Test: `app/components/Callout.test.tsx`
- Test: `app/components/PullQuote.test.tsx`

- [ ] **Step 1: Write failing test for Callout**

Create `app/components/Callout.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Callout } from './Callout';

describe('Callout', () => {
  it('renders children', () => {
    render(<Callout>Important note about the fish.</Callout>);
    expect(screen.getByText('Important note about the fish.')).toBeInTheDocument();
  });

  it('uses an aside element with role="note"', () => {
    render(<Callout>x</Callout>);
    expect(screen.getByRole('note')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, confirm fail**

```bash
npm test -- app/components/Callout.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement Callout**

Create `app/components/Callout.tsx`:

```tsx
export interface CalloutProps {
  children: React.ReactNode;
}

export function Callout({ children }: CalloutProps) {
  return (
    <aside
      role="note"
      className="bg-bg-elev border-l-2 border-accent rounded-r-md py-5 px-6 my-8 text-[16px] leading-[1.7] text-text-dim"
    >
      {children}
    </aside>
  );
}
```

- [ ] **Step 4: Run test, confirm pass**

```bash
npm test -- app/components/Callout.test.tsx
```

Expected: `2 passed`.

- [ ] **Step 5: Write failing test for PullQuote**

Create `app/components/PullQuote.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PullQuote } from './PullQuote';

describe('PullQuote', () => {
  it('renders quote and optional citation', () => {
    render(<PullQuote citation="Iman Mersal">Archives are not neutral.</PullQuote>);
    expect(screen.getByText(/Archives are not neutral/)).toBeInTheDocument();
    expect(screen.getByText(/Iman Mersal/)).toBeInTheDocument();
  });

  it('renders without citation when omitted', () => {
    render(<PullQuote>x</PullQuote>);
    expect(screen.queryByRole('doc-cite')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test, confirm fail**

```bash
npm test -- app/components/PullQuote.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 7: Implement PullQuote**

Create `app/components/PullQuote.tsx`:

```tsx
export interface PullQuoteProps {
  children: React.ReactNode;
  citation?: string;
}

export function PullQuote({ children, citation }: PullQuoteProps) {
  return (
    <blockquote className="border-l-2 border-accent pl-6 my-10 text-[22px] leading-[1.5] italic text-text-dim">
      <p className="m-0">{children}</p>
      {citation && (
        <cite className="block not-italic mt-3 font-mono text-[10px] tracking-[0.15em] uppercase text-text-faint">
          — {citation}
        </cite>
      )}
    </blockquote>
  );
}
```

- [ ] **Step 8: Run test, confirm pass**

```bash
npm test -- app/components/PullQuote.test.tsx
```

Expected: `2 passed`.

- [ ] **Step 9: Implement ImagePlate (no separate test — visual only)**

Create `app/components/ImagePlate.tsx`:

```tsx
import Image from 'next/image';

export interface ImagePlateProps {
  src: string;
  alt: string;
  plateId: string;       // e.g. "03"
  caption: string;
  aspect?: '3/2' | '16/9';
  fullBleed?: boolean;
}

export function ImagePlate({ src, alt, plateId, caption, aspect = '3/2', fullBleed }: ImagePlateProps) {
  return (
    <figure className={(fullBleed ? '-mx-6 ' : '') + 'my-10'}>
      <div className={'relative overflow-hidden rounded-sm bg-bg-elev ' + (aspect === '16/9' ? 'aspect-video' : 'aspect-[3/2]')}>
        <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 768px) 680px, 100vw" />
      </div>
      <figcaption className="mt-3 font-mono text-[11px] tracking-[0.04em] text-text-faint leading-[1.5]">
        <span className="text-accent mr-3">Plate {plateId}</span>
        {caption}
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 10: Run full suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 11: Commit**

```bash
git add app/components/Callout.tsx app/components/Callout.test.tsx \
        app/components/PullQuote.tsx app/components/PullQuote.test.tsx \
        app/components/ImagePlate.tsx
git commit -m "$(cat <<'EOF'
feat(story): Callout, PullQuote, ImagePlate primitives

One Callout variant (teal left border) replaces the four colored
variants used today. PullQuote is for italicized cite-style quotes.
ImagePlate wraps next/image with a mono "Plate NN" caption.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Chapter components — StoryHero, Chapter, ChapterRail, ChapterFooterCTA

**Files:**
- Create: `app/components/StoryHero.tsx`
- Create: `app/components/Chapter.tsx`
- Create: `app/components/ChapterRail.tsx`
- Create: `app/components/ChapterFooterCTA.tsx`
- Create: `app/hooks/useActiveChapter.ts`
- Test: `app/components/Chapter.test.tsx`
- Test: `app/components/ChapterRail.test.tsx`
- Test: `app/hooks/useActiveChapter.test.ts`

- [ ] **Step 1: Failing test for Chapter wrapper**

Create `app/components/Chapter.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Chapter } from './Chapter';

describe('Chapter', () => {
  it('renders eyebrow, h2 title, body, and stable id anchor', () => {
    const { container } = render(
      <Chapter number={3} title="The Translation Problem" id="ch-3">
        <p>body paragraph</p>
      </Chapter>
    );
    expect(screen.getByText(/Chapter 03/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'The Translation Problem' })).toBeInTheDocument();
    expect(container.querySelector('section')?.id).toBe('ch-3');
    expect(screen.getByText('body paragraph')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, confirm fail**

```bash
npm test -- app/components/Chapter.test.tsx
```

- [ ] **Step 3: Implement Chapter**

Create `app/components/Chapter.tsx`:

```tsx
export interface ChapterProps {
  number: number;
  title: string;
  id: string;
  children: React.ReactNode;
}

export function Chapter({ number, title, id, children }: ChapterProps) {
  const padded = String(number).padStart(2, '0');
  return (
    <section id={id} className="py-20 md:py-28 border-t border-border-soft scroll-mt-24">
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-4">
        Chapter {padded}
      </p>
      <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] mb-8 leading-[1.1] text-text">
        {title}
      </h2>
      <div className="text-[17px] leading-[1.78] text-text-dim space-y-5 [&_strong]:text-text [&_strong]:font-semibold">
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run, confirm pass**

```bash
npm test -- app/components/Chapter.test.tsx
```

Expected: `1 passed`.

- [ ] **Step 5: Failing test for useActiveChapter**

Create `app/hooks/useActiveChapter.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActiveChapter } from './useActiveChapter';

class MockIntersectionObserver {
  private cb: IntersectionObserverCallback;
  static instances: MockIntersectionObserver[] = [];
  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb;
    MockIntersectionObserver.instances.push(this);
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  fire(entries: Array<{ target: Element; isIntersecting: boolean }>) {
    this.cb(entries as unknown as IntersectionObserverEntry[], this as unknown as IntersectionObserver);
  }
}

describe('useActiveChapter', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: MockIntersectionObserver,
    });
    document.body.innerHTML = `
      <section id="ch-1"></section>
      <section id="ch-2"></section>
      <section id="ch-3"></section>
    `;
  });

  it('starts with the first id as active', () => {
    const { result } = renderHook(() => useActiveChapter(['ch-1', 'ch-2', 'ch-3']));
    expect(result.current).toBe('ch-1');
  });

  it('updates when an entry intersects', () => {
    const { result } = renderHook(() => useActiveChapter(['ch-1', 'ch-2', 'ch-3']));
    const obs = MockIntersectionObserver.instances[0];
    act(() => {
      obs.fire([{ target: document.getElementById('ch-2')!, isIntersecting: true }]);
    });
    expect(result.current).toBe('ch-2');
  });
});
```

- [ ] **Step 6: Run, confirm fail**

```bash
npm test -- app/hooks/useActiveChapter.test.ts
```

- [ ] **Step 7: Implement useActiveChapter**

Create `app/hooks/useActiveChapter.ts`:

```ts
'use client';
import { useEffect, useState } from 'react';

/** Tracks which chapter (by id) is currently in view. */
export function useActiveChapter(ids: string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || ids.length === 0) return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit?.target.id) setActive(hit.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
```

- [ ] **Step 8: Run, confirm pass**

```bash
npm test -- app/hooks/useActiveChapter.test.ts
```

Expected: `2 passed`.

- [ ] **Step 9: Failing test for ChapterRail**

Create `app/components/ChapterRail.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChapterRail } from './ChapterRail';

const CHAPTERS = [
  { id: 'ch-1', number: 1, title: 'Problem' },
  { id: 'ch-2', number: 2, title: 'Medium' },
  { id: 'ch-3', number: 3, title: 'Translation' },
];

describe('ChapterRail', () => {
  it('renders one item per chapter with the title and padded number', () => {
    render(<ChapterRail chapters={CHAPTERS} activeId="ch-1" />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('Problem')).toBeInTheDocument();
  });

  it('marks the active chapter with aria-current', () => {
    render(<ChapterRail chapters={CHAPTERS} activeId="ch-2" />);
    const active = screen.getByRole('link', { name: /02.*Medium/i });
    expect(active).toHaveAttribute('aria-current', 'true');
  });

  it('renders each item as an anchor link to the chapter id', () => {
    render(<ChapterRail chapters={CHAPTERS} activeId="ch-1" />);
    expect(screen.getByRole('link', { name: /01.*Problem/i })).toHaveAttribute('href', '#ch-1');
  });
});
```

- [ ] **Step 10: Run, confirm fail**

```bash
npm test -- app/components/ChapterRail.test.tsx
```

- [ ] **Step 11: Implement ChapterRail**

Create `app/components/ChapterRail.tsx`:

```tsx
'use client';
import { useActiveChapter } from '../hooks/useActiveChapter';

export interface ChapterRailItem {
  id: string;
  number: number;
  title: string;
}

export interface ChapterRailProps {
  chapters: ChapterRailItem[];
  /** Optional override; when omitted the rail tracks scroll itself. */
  activeId?: string;
}

export function ChapterRail({ chapters, activeId }: ChapterRailProps) {
  const ids = chapters.map((c) => c.id);
  const tracked = useActiveChapter(ids);
  const current = activeId ?? tracked;

  return (
    <nav
      aria-label="Chapters"
      className="hidden lg:flex flex-col gap-3.5 sticky top-24 self-start font-mono text-[11px] leading-[1.4]"
    >
      <span className="text-[9px] tracking-[0.22em] uppercase text-text-faint mb-2">
        Chapters
      </span>
      {chapters.map((c) => {
        const isActive = c.id === current;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            aria-current={isActive ? 'true' : undefined}
            className={
              'flex gap-2.5 items-baseline transition-colors ' +
              (isActive ? 'text-text' : 'text-text-faint hover:text-text-dim')
            }
          >
            <span className={'w-6 ' + (isActive ? 'text-accent' : '')}>
              {String(c.number).padStart(2, '0')}
            </span>
            <span className="text-[10px] tracking-[0.12em] uppercase">{c.title}</span>
          </a>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 12: Run, confirm pass**

```bash
npm test -- app/components/ChapterRail.test.tsx
```

Expected: `3 passed`.

- [ ] **Step 13: Implement StoryHero (visual only, no test)**

Create `app/components/StoryHero.tsx`:

```tsx
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
```

- [ ] **Step 14: Implement ChapterFooterCTA (visual only, no test)**

Create `app/components/ChapterFooterCTA.tsx`:

```tsx
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
```

- [ ] **Step 15: Run full test suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 16: Commit**

```bash
git add app/components/StoryHero.tsx \
        app/components/Chapter.tsx app/components/Chapter.test.tsx \
        app/components/ChapterRail.tsx app/components/ChapterRail.test.tsx \
        app/components/ChapterFooterCTA.tsx \
        app/hooks/useActiveChapter.ts app/hooks/useActiveChapter.test.ts
git commit -m "$(cat <<'EOF'
feat(story): StoryHero, Chapter, ChapterRail, ChapterFooterCTA

Chapter takes number/title/id/children and renders the
eyebrow + h2 + body block with a stable scroll anchor.
ChapterRail tracks active section via IntersectionObserver
through a useActiveChapter hook. Hidden under 1024px width;
mobile collapse comes in Task 7.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Chapter content data — `app/content/chapters.tsx`

**Files:**
- Create: `app/content/chapters.tsx`

- [ ] **Step 1: Create the chapters array**

The nine chapters in the current `app/page.tsx` (lines 32–192) move here verbatim, wrapping each chapter body in a typed record. Create `app/content/chapters.tsx`:

```tsx
import { Callout } from '../components/Callout';
import { PullQuote } from '../components/PullQuote';
import { ImagePlate } from '../components/ImagePlate';

export interface ChapterRecord {
  id: string;
  number: number;
  title: string;
  short: string;          // for the rail
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
        <p>Here&apos;s a scary thought: the photo you took yesterday? The one on your phone? <strong>It&apos;s already dying.</strong></p>
        <p>Not the memory — the actual file. Every hard drive fails. Every USB stick degrades. Every cloud server needs electricity to keep breathing. The average lifespan of a digital file you&apos;re not actively maintaining is about <strong>three to five years</strong>.</p>
        <p>Your great-grandchildren won&apos;t be scrolling through your Instagram. They&apos;ll be looking at... nothing.</p>
        <Callout>
          The Library of Alexandria burned down. Hard drives from the 1990s are already unreadable. We produce <strong>2.5 quintillion bytes of data every day</strong>, and we have no idea how to keep any of it for longer than a human lifetime.
        </Callout>
        <p>Henry Tan — an artist from Bangkok working at the intersection of art and biology — was looking at a fragile art archive from Abu Dhabi and realized: <strong>these documents are one fire away from being gone forever.</strong></p>
        <p>He needed a storage medium that could last not decades, not centuries, but <strong>thousands of years</strong>.</p>
        <p>So he looked at nature&apos;s own storage system. The one that&apos;s been working for 3.5 billion years without a single software update.</p>
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
        <p><strong>Density:</strong> one gram of DNA can store 117 exabytes. That&apos;s every movie, every song, every Wikipedia article — in a teaspoon.</p>
        <p><strong>Longevity:</strong> we&apos;ve read DNA from specimens 50,000 years old. Mammoth DNA. Still readable. After 50 millennia.</p>
        <p><strong>Self-repair:</strong> living organisms actively maintain and repair their DNA. Try getting your MacBook to do that.</p>
        <p>The math was irresistible. If you could translate digital data into DNA code, you&apos;d have a storage medium that literally <strong>maintains itself, reproduces itself, and can survive ice ages</strong>.</p>
        <Callout>
          <strong>But there was a catch.</strong> DNA wasn&apos;t designed for storing art catalogs. It was designed for storing instructions like &quot;make a liver&quot; and &quot;grow two eyes.&quot; If you randomly jam art data into DNA, you might accidentally tell the organism to produce a toxic protein.
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
        <p>Here&apos;s how you turn a piece of text into DNA. First, convert the text to binary. The letter &quot;A&quot; becomes <code className="font-mono text-accent bg-bg-elev px-1.5 py-0.5 rounded text-sm">01000001</code>. The word &quot;art&quot; becomes <code className="font-mono text-accent bg-bg-elev px-1.5 py-0.5 rounded text-sm">01100001 01110010 01110100</code>.</p>
        <p>Then map to DNA letters: 00 → A, 01 → C, 10 → G, 11 → T. Now you have genetic code encoding the word &quot;art.&quot;</p>
        <Callout>
          <strong>But wait</strong> — what if that stretch of DNA, by coincidence, spells out &quot;please destroy this cell&quot; in biological language?
        </Callout>
        <p>That&apos;s why the team built a <strong>screening pipeline</strong>. Before any encoded DNA touches a living organism, it checks: <strong>stop codons</strong> that would interrupt protein production, <strong>toxic protein motifs</strong>, <strong>pathogen-like sequences</strong>, and <strong>GC balance</strong> so the DNA doesn&apos;t fold weirdly.</p>
        <p>Think of it as a spell-checker, but instead of typos, it checks for <strong>&quot;will this accidentally kill the fish.&quot;</strong></p>
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
        <p>DNA isn&apos;t perfect. When fish reproduce, about <strong>1% of the bases</strong> get swapped, deleted, or inserted. Over generations, your encoded catalog turns into gibberish.</p>
        <p>The simple approach: make 3 copies. If one gets damaged, you have two backups. <strong>97% accuracy with 3× overhead</strong>.</p>
        <p>But Henry went bigger. <strong>He borrowed from quantum computing.</strong></p>
        <div className="text-center py-12 my-10">
          <div className="text-6xl md:text-8xl font-bold text-accent leading-none">99.999%</div>
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-text-faint mt-3">
            accuracy at 1% error rates · 1.8× overhead
          </p>
        </div>
        <p>Quantum computers use <strong>surface code error correction</strong> — a 2D grid with clever math to detect and fix errors. Henry adapted this for DNA, mapping &quot;X errors&quot; (bit flips) and &quot;Z errors&quot; (phase flips) to actual chemical mutations.</p>
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
        <p>You inject encoded DNA into a <strong>zebrafish embryo at the one-cell stage</strong> — a fertilized egg that hasn&apos;t decided what it&apos;s going to be yet.</p>
        <p>The tool: <strong>Tol2 transposon</strong> — molecular cut-and-paste. It inserts your sequence into the fish&apos;s genome.</p>
        <Callout>
          <strong>The fun part:</strong> the DNA package includes a fluorescent reporter gene. The fish that carry the data <strong>literally glow green</strong> under UV light.
        </Callout>
        <p>Two designs — fusion and P2A — both worked. Some fish glow, some don&apos;t. The glowing ones? <strong>Those are your data carriers.</strong></p>
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
        <p>By encoding these materials into living organisms, the project asks: <strong>what if the archive wasn&apos;t something you store in a building, but something you keep alive?</strong></p>
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
        <p>The fish don&apos;t live in a lab somewhere, forgotten. They&apos;re part of something bigger.</p>
        <p>Henry is building the <strong>Temple of Singularity</strong> — an installation combining living organisms, archival display, and interactive technology.</p>
        <p>You walk into a dimly lit room. In the center, a tank of zebrafish — each carrying encoded cultural memory. Around the tank, the original documents. On screens, a real-time DNA sequencer reads the fish&apos;s genetic code and <strong>decodes the data back into text</strong>.</p>
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
        <p>Let&apos;s be real: encoding data into living animals raises questions.</p>
        <Callout>
          <strong>Is it okay to modify fish genomes for art?</strong>
          <br /><br />
          The zebrafish are a standard lab model. The modifications don&apos;t cause harm — the fluorescent reporter is the same protein that makes jellyfish glow, widely used in research. The encoded data is carefully screened to avoid biological disruption.
        </Callout>
        <Callout>
          <strong>What about cultural sovereignty?</strong>
          <br /><br />
          The project includes protocols for <strong>Free, Prior, and Informed Consent (FPIC)</strong> — ensuring communities have agency over how their heritage is encoded, stored, and displayed.
        </Callout>
        <Callout>
          <strong>What happens when the fish die?</strong>
          <br /><br />
          Eventually, every fish dies. The transgene might be lost. But that&apos;s partly the point. Henry calls this the <strong>&quot;living archive paradigm&quot;</strong> — unlike a hard drive that fails suddenly, a living archive degrades gradually, and its degradation is itself meaningful. <strong>The imperfection is the feature.</strong>
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
        <p>DNA has lasted <strong>3.5 billion years</strong>. It doesn&apos;t need electricity. It doesn&apos;t need a software company to stay in business. It just needs water, food, and time.</p>
        <p>We&apos;re not just building a better backup system. We&apos;re reimagining what an archive can be: <strong>not a warehouse of dead objects, but a garden of living memory.</strong></p>
        <p>The fish swim. The data persists. The story continues.</p>
        <p>And somewhere in Abu Dhabi, a document from 1980 is being carried by a creature that will exist long after all of us are gone.</p>
      </>
    ),
  },
];
```

- [ ] **Step 2: Add a quick smoke import test**

Create `app/content/chapters.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { CHAPTERS } from './chapters';

describe('chapters data', () => {
  it('has exactly 9 chapters with sequential numbers 1..9', () => {
    expect(CHAPTERS).toHaveLength(9);
    CHAPTERS.forEach((c, i) => expect(c.number).toBe(i + 1));
  });

  it('every chapter has unique id, title, short, and a render function', () => {
    const ids = new Set(CHAPTERS.map((c) => c.id));
    expect(ids.size).toBe(9);
    CHAPTERS.forEach((c) => {
      expect(c.title).toBeTruthy();
      expect(c.short).toBeTruthy();
      expect(typeof c.render).toBe('function');
    });
  });
});
```

- [ ] **Step 3: Run, confirm pass**

```bash
npm test -- app/content/chapters.test.ts
```

Expected: `2 passed`.

- [ ] **Step 4: Commit**

```bash
git add app/content/chapters.tsx app/content/chapters.test.ts
git commit -m "$(cat <<'EOF'
feat(content): extract 9 chapters to typed chapters.tsx

Moves the body content from page.tsx into a typed array of
ChapterRecord objects, each with a render function that returns
JSX (so embedded Callout/ImagePlate/PullQuote still work).
Enables the chapter rail to be built mechanically from this list.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Story page rewrite

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx` entirely**

```tsx
import { StoryHero } from './components/StoryHero';
import { Chapter } from './components/Chapter';
import { ChapterRail } from './components/ChapterRail';
import { ChapterFooterCTA } from './components/ChapterFooterCTA';
import { CHAPTERS } from './content/chapters';

export default function StoryPage() {
  const rail = CHAPTERS.map((c) => ({ id: c.id, number: c.number, title: c.short }));
  return (
    <>
      <StoryHero />
      <div className="max-w-6xl mx-auto px-6 pt-8 lg:grid lg:grid-cols-[120px_minmax(0,1fr)_120px] lg:gap-12">
        <ChapterRail chapters={rail} />
        <article className="max-w-[620px] mx-auto w-full">
          {CHAPTERS.map((c) => (
            <Chapter key={c.id} number={c.number} title={c.title} id={c.id}>
              {c.render()}
            </Chapter>
          ))}
          <ChapterFooterCTA />
        </article>
        <aside className="hidden lg:block sticky top-24 self-start font-mono text-[10px] tracking-[0.15em] uppercase text-text-faint">
          <span>9 chapters · 12 min</span>
        </aside>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Run the dev server and visually verify**

```bash
npm run dev
```

In another terminal:

```bash
curl -s http://localhost:3000/ | grep -o 'Chapter 0[1-9]' | sort -u
```

Expected output:

```
Chapter 01
Chapter 02
Chapter 03
Chapter 04
Chapter 05
Chapter 06
Chapter 07
Chapter 08
Chapter 09
```

Stop the dev server with Ctrl-C.

- [ ] **Step 3: Run full build**

```bash
npm run build 2>&1 | tail -15
```

Expected: `✓ Compiled successfully`. The `/` route should show in the route list.

- [ ] **Step 4: Run full test suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "$(cat <<'EOF'
feat(story): rewrite Story page with chapter rail and primitive components

Replaces the 206-line page.tsx with a thin shell that composes
StoryHero, ChapterRail, the 9 chapters from app/content/chapters.tsx,
and ChapterFooterCTA. Reading column stays at 620px; rail and
meta column live in a three-column grid at >=lg.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Phase C — Pipeline (Tasks 8–11)

### Task 8: `lib/dna.ts` — pure encoder with full test suite

**Files:**
- Create: `lib/dna.ts`
- Create: `lib/dna.test.ts`

- [ ] **Step 1: Write the encode/decode roundtrip test FIRST**

Create `lib/dna.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  asciiToBinary, binaryToAscii, binaryToDna, dnaToBinary,
  findStopCodons, fixStopCodons, encodeSurfaceCode,
  encode, decode,
} from './dna';

describe('basic ASCII <-> binary conversions', () => {
  it('encodes "A" to 01000001', () => {
    expect(asciiToBinary('A')).toBe('01000001');
  });

  it('roundtrips ASCII through binary', () => {
    expect(binaryToAscii(asciiToBinary('Hello'))).toBe('Hello');
  });
});

describe('binary <-> DNA mapping', () => {
  it('uses 00->A 01->C 10->G 11->T', () => {
    expect(binaryToDna('00011011')).toBe('ACGT');
  });

  it('roundtrips binary through DNA', () => {
    const b = '0100100001100101';
    expect(dnaToBinary(binaryToDna(b))).toBe(b);
  });
});

describe('stop codon screening', () => {
  it('returns empty array when no stop codons present', () => {
    expect(findStopCodons('ACGCAC')).toEqual([]);
  });

  it('finds TAA at frame 0 position 0', () => {
    const stops = findStopCodons('TAAACG');
    expect(stops).toContainEqual({ p: 0, codon: 'TAA', frame: 0 });
  });

  it('finds TAG at frame 1', () => {
    const stops = findStopCodons('ATAGCC');
    expect(stops.some((s) => s.codon === 'TAG' && s.frame === 1)).toBe(true);
  });

  it('fixes TAA -> TAC and TAG/TGA -> TGG', () => {
    expect(fixStopCodons('TAAACG')).toBe('TACACG');
    expect(fixStopCodons('TAGACG')).toBe('TGGACG');
    expect(fixStopCodons('TGAACG')).toBe('TGGACG');
  });

  it('is idempotent — fixed DNA has no stop codons in fixed regions', () => {
    const fixed = fixStopCodons('TAATAGCTGA');
    // The substitution rules only operate frame-0 by construction; we
    // assert all frame-0 codons are not stops.
    for (let i = 0; i < fixed.length - 2; i += 3) {
      expect(['TAA', 'TAG', 'TGA']).not.toContain(fixed.slice(i, i + 3));
    }
  });
});

describe('surface code', () => {
  it('produces 1 block of d*d data + 4d parity for short input at d=3', () => {
    const blocks = encodeSurfaceCode('ACGTACGTA', 3);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].data).toHaveLength(9);
    expect(blocks[0].parity).toHaveLength(12);
    expect(blocks[0].full).toHaveLength(21);
  });

  it('pads the final block with A to fill d*d data', () => {
    const blocks = encodeSurfaceCode('ACG', 3);
    expect(blocks[0].data).toBe('ACGAAAAAA');
  });
});

describe('encode() full pipeline', () => {
  it('produces matching ascii, binary, rawDna, fixedDna, blocks', () => {
    const r = encode('Hi!', 3);
    expect(r.ascii).toBe('Hi!');
    expect(r.binary).toBe(asciiToBinary('Hi!'));
    expect(r.rawDna).toBe(binaryToDna(r.binary));
    expect(r.fixedDna).toBe(fixStopCodons(r.rawDna));
    expect(r.fixedStopCodons).toEqual([]);
    expect(r.blocks.length).toBeGreaterThan(0);
    expect(r.storedDna).toBe(r.blocks.map((b) => b.full).join(''));
  });

  it('handles d=0 (no QEC) by producing a single block with empty parity', () => {
    const r = encode('Hi', 0);
    expect(r.blocks).toHaveLength(1);
    expect(r.blocks[0].parity).toBe('');
    expect(r.blocks[0].data).toBe(r.fixedDna);
    expect(r.storedDna).toBe(r.fixedDna);
  });
});

describe('decode() roundtrip', () => {
  it.each([0, 3, 5, 7])('decodes back to the original text at d=%i', (d) => {
    const text = 'Living archives are not neutral.';
    const result = encode(text, d);
    const decoded = decode(result.storedDna, d);
    expect(decoded.text).toBe(text);
    expect(decoded.warnings).toEqual([]);
  });

  it('emits a warning for non-ACGT input', () => {
    const r = decode('ACGTNNN', 0);
    expect(r.warnings.length).toBeGreaterThan(0);
  });
});

describe('encode warning behavior', () => {
  it('warns about non-ASCII characters but proceeds', () => {
    const r = encode('café', 0);
    expect(r.warnings).toBeDefined();
    expect(r.warnings.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run, confirm fail**

```bash
npm test -- lib/dna.test.ts
```

Expected: FAIL — module `./dna` not found.

- [ ] **Step 3: Implement `lib/dna.ts`**

```ts
/**
 * Pure DNA encode/decode logic for the Living Archive pipeline.
 * No DOM, no React, no I/O — fully testable.
 */

export type Nucleotide = 'A' | 'C' | 'G' | 'T';
export interface StopCodon { p: number; codon: string; frame: number; }
export interface SurfaceBlock { data: string; parity: string; full: string; }

export interface EncodeResult {
  ascii: string;
  binary: string;
  rawDna: string;
  stopCodons: StopCodon[];
  fixedDna: string;
  fixedStopCodons: StopCodon[];
  blocks: SurfaceBlock[];
  storedDna: string;
  totalLength: number;
  warnings: string[];
}

export interface DecodeResult { text: string; warnings: string[]; }

const B2B: Record<string, string> = { '00': 'A', '01': 'C', '10': 'G', '11': 'T' };
const B2Binv: Record<string, string> = { A: '00', C: '01', G: '10', T: '11' };
const STOP_CODONS = ['TAA', 'TAG', 'TGA'] as const;
const STOP_FIX: Record<string, string> = { TAA: 'TAC', TAG: 'TGG', TGA: 'TGG' };

export function asciiToBinary(text: string): string {
  return text
    .split('')
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

export function binaryToAscii(bin: string): string {
  const trimmed = bin.slice(0, bin.length - (bin.length % 8));
  return (trimmed.match(/.{8}/g) ?? [])
    .map((b) => String.fromCharCode(parseInt(b, 2)))
    .join('');
}

export function binaryToDna(bin: string): string {
  let b = bin;
  if (b.length % 2) b += '0';
  let out = '';
  for (let i = 0; i < b.length; i += 2) out += B2B[b[i] + b[i + 1]] ?? 'A';
  return out;
}

export function dnaToBinary(dna: string): string {
  let out = '';
  for (const c of dna) out += B2Binv[c] ?? '00';
  return out;
}

export function findStopCodons(dna: string): StopCodon[] {
  const out: StopCodon[] = [];
  for (let f = 0; f < 3; f++) {
    for (let i = f; i <= dna.length - 3; i += 3) {
      const codon = dna.slice(i, i + 3);
      if ((STOP_CODONS as readonly string[]).includes(codon)) out.push({ p: i, codon, frame: f });
    }
  }
  return out;
}

/** Replaces frame-0 stop codons with safe substitutions. */
export function fixStopCodons(dna: string): string {
  const arr = dna.split('');
  for (let i = 0; i <= arr.length - 3; i += 3) {
    const codon = arr.slice(i, i + 3).join('');
    const rep = STOP_FIX[codon];
    if (rep) [arr[i], arr[i + 1], arr[i + 2]] = [rep[0], rep[1], rep[2]];
  }
  return arr.join('');
}

/** Surface-code encoder. d ∈ {3, 5, 7}; produces d*d data + 4*d parity per block. */
export function encodeSurfaceCode(dna: string, d: number): SurfaceBlock[] {
  if (d < 1) return [{ data: dna, parity: '', full: dna }];
  const nData = d * d;
  const out: SurfaceBlock[] = [];
  for (let start = 0; start < dna.length; start += nData) {
    let block = dna.slice(start, start + nData);
    while (block.length < nData) block += 'A';
    out.push({ data: block, parity: parityFor(block, d), full: block + parityFor(block, d) });
  }
  // Edge case: empty input — still produce one block of all-A padding
  if (out.length === 0) {
    const padded = 'A'.repeat(nData);
    out.push({ data: padded, parity: parityFor(padded, d), full: padded + parityFor(padded, d) });
  }
  return out;
}

function parityFor(data: string, d: number): string {
  const rows: string[] = [];
  for (let i = 0; i < d; i++) rows.push(data.slice(i * d, (i + 1) * d));
  let out = '';
  for (let bit = 0; bit < 2; bit++) {
    for (let i = 0; i < d; i++) {
      let x = 0;
      for (let j = 0; j < d; j++) x ^= parseInt((B2Binv[rows[i][j]] ?? '00')[bit]);
      out += x ? 'C' : 'A';
    }
    for (let j = 0; j < d; j++) {
      let x = 0;
      for (let i = 0; i < d; i++) x ^= parseInt((B2Binv[rows[i][j]] ?? '00')[bit]);
      out += x ? 'C' : 'A';
    }
  }
  return out;
}

export function encode(text: string, d: number): EncodeResult {
  const warnings: string[] = [];
  // Filter to printable ASCII; warn if anything was dropped
  const asciiClean = text
    .split('')
    .filter((c) => {
      const code = c.charCodeAt(0);
      const printable = code >= 0x20 && code <= 0x7e;
      if (!printable) return false;
      return true;
    })
    .join('');
  if (asciiClean.length !== text.length) {
    warnings.push(
      `Skipped ${text.length - asciiClean.length} non-ASCII character(s). Living Archive's prototype encodes printable ASCII only.`
    );
  }

  const binary = asciiToBinary(asciiClean);
  const rawDna = binaryToDna(binary);
  const stopCodons = findStopCodons(rawDna);
  const fixedDna = fixStopCodons(rawDna);
  const fixedStopCodons = findStopCodons(fixedDna).filter((c) => c.frame === 0);
  const blocks = d > 0 ? encodeSurfaceCode(fixedDna, d) : [{ data: fixedDna, parity: '', full: fixedDna }];
  const storedDna = blocks.map((b) => b.full).join('');

  return {
    ascii: asciiClean,
    binary,
    rawDna,
    stopCodons,
    fixedDna,
    fixedStopCodons,
    blocks,
    storedDna,
    totalLength: storedDna.length,
    warnings,
  };
}

export function decode(stored: string, d: number): DecodeResult {
  const warnings: string[] = [];
  const cleaned = stored
    .toUpperCase()
    .split('')
    .filter((c) => {
      const ok = c === 'A' || c === 'C' || c === 'G' || c === 'T';
      return ok;
    })
    .join('');
  if (cleaned.length !== stored.replace(/\s/g, '').length) {
    warnings.push(
      `Ignored ${stored.replace(/\s/g, '').length - cleaned.length} non-ACGT character(s) in input.`
    );
  }

  let dataDna = cleaned;
  if (d > 0) {
    const nData = d * d;
    const nParity = 4 * d;
    const blockLen = nData + nParity;
    const blocks: string[] = [];
    for (let i = 0; i + blockLen <= cleaned.length; i += blockLen) {
      blocks.push(cleaned.slice(i, i + nData));
    }
    // Trailing partial block (e.g. user pasted truncated DNA) — best effort
    const remainder = cleaned.length % blockLen;
    if (remainder > 0 && remainder <= nData) {
      const start = cleaned.length - remainder;
      blocks.push(cleaned.slice(start, start + Math.min(remainder, nData)));
    }
    dataDna = blocks.join('');
  }

  const binary = dnaToBinary(dataDna);
  const text = binaryToAscii(binary);
  return { text: stripTrailingPadding(text), warnings };
}

function stripTrailingPadding(text: string): string {
  // Surface-code blocks pad with 'A' which decodes back to NUL ( ).
  // Strip a run of trailing NULs.
  return text.replace(/ +$/, '');
}
```

- [ ] **Step 4: Run tests, confirm pass**

```bash
npm test -- lib/dna.test.ts
```

Expected: `~16 passed`.

- [ ] **Step 5: Run full test suite + type check**

```bash
npm test && npm run typecheck
```

Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add lib/dna.ts lib/dna.test.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): extract pure encode/decode logic to lib/dna.ts

All transformation logic from app/pipeline/page.tsx moves into
typed pure functions with no DOM coupling: asciiToBinary,
binaryToDna, dnaToBinary, binaryToAscii, findStopCodons,
fixStopCodons, encodeSurfaceCode, encode, decode. Covered by
Vitest: ~16 tests including a roundtrip property at d ∈ {0,3,5,7}.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Pipeline components — DnaSequence, Step, SurfaceCodeGrid, useDnaEncoder

**Files:**
- Create: `app/components/pipeline/DnaSequence.tsx`
- Create: `app/components/pipeline/Step.tsx`
- Create: `app/components/pipeline/SurfaceCodeGrid.tsx`
- Create: `app/hooks/useDnaEncoder.ts`
- Test: `app/components/pipeline/DnaSequence.test.tsx`
- Test: `app/hooks/useDnaEncoder.test.ts`

- [ ] **Step 1: Failing test for DnaSequence**

Create `app/components/pipeline/DnaSequence.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DnaSequence } from './DnaSequence';

describe('DnaSequence', () => {
  it('wraps each nucleotide in a span with the matching base-X class', () => {
    const { container } = render(<DnaSequence sequence="ACGT" />);
    const spans = container.querySelectorAll('span');
    expect(spans).toHaveLength(4);
    expect(spans[0].className).toContain('base-A');
    expect(spans[1].className).toContain('base-C');
    expect(spans[2].className).toContain('base-G');
    expect(spans[3].className).toContain('base-T');
  });

  it('truncates and shows ellipsis when maxLength is set', () => {
    const { container } = render(<DnaSequence sequence="ACGTACGT" maxLength={4} />);
    expect(container.textContent).toBe('ACGT…');
  });
});
```

- [ ] **Step 2: Run, fail**

```bash
npm test -- app/components/pipeline/DnaSequence.test.tsx
```

- [ ] **Step 3: Implement DnaSequence**

Create `app/components/pipeline/DnaSequence.tsx`:

```tsx
export interface DnaSequenceProps {
  sequence: string;
  maxLength?: number;
}

export function DnaSequence({ sequence, maxLength }: DnaSequenceProps) {
  const truncated = maxLength != null && sequence.length > maxLength;
  const shown = truncated ? sequence.slice(0, maxLength) : sequence;
  return (
    <span className="font-mono text-[14px] leading-[2] tracking-[0.06em] break-all">
      {shown.split('').map((c, i) => (
        <span key={i} className={`base-${c}`}>{c}</span>
      ))}
      {truncated && '…'}
    </span>
  );
}
```

- [ ] **Step 4: Run, pass**

```bash
npm test -- app/components/pipeline/DnaSequence.test.tsx
```

Expected: `2 passed`.

- [ ] **Step 5: Failing test for useDnaEncoder**

Create `app/hooks/useDnaEncoder.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDnaEncoder } from './useDnaEncoder';

describe('useDnaEncoder', () => {
  it('returns null result for empty input', () => {
    const { result } = renderHook(() => useDnaEncoder('', 3));
    expect(result.current).toBeNull();
  });

  it('encodes simple text with d=3', () => {
    const { result } = renderHook(() => useDnaEncoder('Hi', 3));
    expect(result.current).not.toBeNull();
    expect(result.current!.ascii).toBe('Hi');
    expect(result.current!.blocks.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 6: Run, fail**

```bash
npm test -- app/hooks/useDnaEncoder.test.ts
```

- [ ] **Step 7: Implement useDnaEncoder**

Create `app/hooks/useDnaEncoder.ts`:

```ts
'use client';
import { useMemo } from 'react';
import { encode, type EncodeResult } from '@/lib/dna';

export function useDnaEncoder(input: string, d: number): EncodeResult | null {
  return useMemo(() => {
    if (!input) return null;
    return encode(input, d);
  }, [input, d]);
}
```

- [ ] **Step 8: Run, pass**

```bash
npm test -- app/hooks/useDnaEncoder.test.ts
```

Expected: `2 passed`.

- [ ] **Step 9: Implement Step component (no separate test — visual wrapper)**

Create `app/components/pipeline/Step.tsx`:

```tsx
export interface StepProps {
  number: number;
  title: string;
  meta?: string;
  children: React.ReactNode;
}

export function Step({ number, title, meta, children }: StepProps) {
  return (
    <section className="bg-bg-elev border border-border-soft rounded-lg p-7 mb-4">
      <header className="flex items-center gap-3.5 mb-4">
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent w-10">
          {String(number).padStart(2, '0')}
        </span>
        <h3 className="text-xl font-semibold tracking-[-0.01em] text-text">{title}</h3>
        {meta && (
          <span className="ml-auto font-mono text-[10px] tracking-[0.12em] uppercase text-text-faint">
            {meta}
          </span>
        )}
      </header>
      <div>{children}</div>
    </section>
  );
}
```

- [ ] **Step 10: Implement SurfaceCodeGrid (no separate test — visual)**

Create `app/components/pipeline/SurfaceCodeGrid.tsx`:

```tsx
export interface SurfaceCodeGridProps {
  /** Distance parameter. d=3 → 5x5 grid of data + X/Z parity. */
  d: 3 | 5 | 7;
  /** Optional data nucleotides (length d*d). If absent, shows placeholder As. */
  data?: string;
}

export function SurfaceCodeGrid({ d, data }: SurfaceCodeGridProps) {
  // Layout: a (2d-1) x (2d-1) grid alternating data/parity cells.
  const size = 2 * d - 1;
  const cells: { kind: 'data' | 'parityX' | 'parityZ'; ch?: string }[] = [];
  let dataIdx = 0;
  const padded = (data ?? '').padEnd(d * d, 'A');

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (r % 2 === 0 && c % 2 === 0) {
        cells.push({ kind: 'data', ch: padded[dataIdx++] ?? 'A' });
      } else if (r % 2 === 0 && c % 2 === 1) {
        cells.push({ kind: 'parityX' });
      } else if (r % 2 === 1 && c % 2 === 0) {
        cells.push({ kind: 'parityZ' });
      } else {
        cells.push({ kind: 'parityZ' });
      }
    }
  }

  return (
    <div
      className="inline-grid gap-1 font-mono text-[10px] font-semibold"
      style={{ gridTemplateColumns: `repeat(${size}, 28px)` }}
      aria-label={`Surface code d=${d}`}
    >
      {cells.map((cell, i) => {
        if (cell.kind === 'data') {
          return (
            <span
              key={i}
              className="w-7 h-7 grid place-items-center rounded-sm bg-accent-soft border border-accent text-accent"
            >
              {cell.ch}
            </span>
          );
        }
        const label = cell.kind === 'parityX' ? 'X' : 'Z';
        return (
          <span
            key={i}
            className="w-7 h-7 grid place-items-center rounded-sm bg-border-soft border border-border text-text-faint"
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 11: Run full suite**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 12: Commit**

```bash
git add app/components/pipeline/DnaSequence.tsx \
        app/components/pipeline/DnaSequence.test.tsx \
        app/components/pipeline/Step.tsx \
        app/components/pipeline/SurfaceCodeGrid.tsx \
        app/hooks/useDnaEncoder.ts app/hooks/useDnaEncoder.test.ts
git commit -m "$(cat <<'EOF'
feat(pipeline): DnaSequence, Step, SurfaceCodeGrid, useDnaEncoder

DnaSequence renders one span per nucleotide using the .base-A/C/G/T
classes from globals.css. Step is the four-card wrapper for the
how-it-works page. SurfaceCodeGrid renders a (2d-1)x(2d-1) cell
grid alternating data and X/Z parity cells. useDnaEncoder memoizes
the encode() result.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: `/pipeline` page — public Try-it surface

**Files:**
- Modify: `app/pipeline/page.tsx`
- Create: `app/components/pipeline/EncodePanel.tsx`
- Create: `app/components/pipeline/DecodePanel.tsx`

- [ ] **Step 1: Implement EncodePanel**

Create `app/components/pipeline/EncodePanel.tsx`:

```tsx
'use client';
import { useState } from 'react';
import { useDnaEncoder } from '../../hooks/useDnaEncoder';
import { DnaSequence } from './DnaSequence';

const DEFAULT_QEC_D = 3;
const PLACEHOLDER = 'Archives are not neutral. They are shaped by who holds power, who gets to remember, and who gets forgotten.';

export function EncodePanel() {
  const [text, setText] = useState(PLACEHOLDER);
  const result = useDnaEncoder(text, DEFAULT_QEC_D);

  const copy = () => {
    if (result) navigator.clipboard.writeText(result.storedDna);
  };

  return (
    <div>
      <label className="block font-mono text-[10px] tracking-[0.22em] uppercase text-text-dim mb-3">
        Your text
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Type a sentence to encode…"
        className="w-full bg-bg-elev border border-border rounded-md p-5 text-[18px] leading-[1.55] text-text resize-y focus:outline-none focus:border-accent font-serif"
      />
      <div className="flex justify-between items-center mt-4">
        <span className="font-mono text-[11px] text-text-faint">
          {text.length} character{text.length === 1 ? '' : 's'} · ASCII
        </span>
      </div>

      {result?.warnings.map((w, i) => (
        <p key={i} className="mt-3 font-mono text-[11px] text-text-faint">
          {w}
        </p>
      ))}

      {result && (
        <>
          <div className="text-center my-8 font-mono text-[10px] tracking-[0.3em] uppercase text-text-faint">
            <span className="inline-block w-10 h-px bg-border align-middle mr-3.5" />
            becomes
            <span className="inline-block w-10 h-px bg-border align-middle ml-3.5" />
          </div>

          <div className="bg-bg-elev border border-border rounded-md p-6">
            <div className="flex justify-between mb-4 font-mono text-[10px] tracking-[0.18em] uppercase">
              <span className="text-text-faint">DNA Sequence</span>
              <span className="text-accent">{result.totalLength} nt</span>
            </div>
            <DnaSequence sequence={result.storedDna} maxLength={400} />
            <div className="flex gap-2 mt-5 pt-4 border-t border-border-soft">
              <button onClick={copy} className="font-mono text-[10px] tracking-[0.18em] uppercase px-3.5 py-2 border border-accent-border rounded-sm text-accent hover:bg-accent-soft transition-colors">
                Copy sequence
              </button>
              <button
                onClick={() => navigator.share?.({ text: result.storedDna }).catch(() => {})}
                className="font-mono text-[10px] tracking-[0.18em] uppercase px-3.5 py-2 border border-border rounded-sm text-text-dim hover:border-text-dim transition-colors"
              >
                Share
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Implement DecodePanel**

Create `app/components/pipeline/DecodePanel.tsx`:

```tsx
'use client';
import { useState, useMemo } from 'react';
import { decode } from '@/lib/dna';

const DEFAULT_QEC_D = 3;

export function DecodePanel() {
  const [dna, setDna] = useState('');
  const result = useMemo(() => (dna.trim() ? decode(dna, DEFAULT_QEC_D) : null), [dna]);

  return (
    <div>
      <label className="block font-mono text-[10px] tracking-[0.22em] uppercase text-text-dim mb-3">
        DNA sequence
      </label>
      <textarea
        value={dna}
        onChange={(e) => setDna(e.target.value)}
        rows={4}
        placeholder="Paste an encoded DNA sequence…"
        className="w-full bg-bg-elev border border-border rounded-md p-5 text-[14px] leading-[1.6] text-text resize-y focus:outline-none focus:border-accent font-mono tracking-[0.05em]"
      />

      {result?.warnings.map((w, i) => (
        <p key={i} className="mt-3 font-mono text-[11px] text-text-faint">{w}</p>
      ))}

      {result && (
        <>
          <div className="text-center my-8 font-mono text-[10px] tracking-[0.3em] uppercase text-text-faint">
            <span className="inline-block w-10 h-px bg-border align-middle mr-3.5" />
            becomes
            <span className="inline-block w-10 h-px bg-border align-middle ml-3.5" />
          </div>
          <div className="bg-bg-elev border border-border rounded-md p-6">
            <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-3">
              Decoded text
            </div>
            <p className="text-[18px] leading-[1.6] text-text">{result.text || <em className="text-text-faint">(empty)</em>}</p>
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Rewrite `app/pipeline/page.tsx`**

```tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { EncodePanel } from '../components/pipeline/EncodePanel';
import { DecodePanel } from '../components/pipeline/DecodePanel';

type Tab = 'encode' | 'decode';

export default function PipelinePage() {
  const [tab, setTab] = useState<Tab>('encode');
  return (
    <div className="max-w-3xl mx-auto px-6 pt-8 pb-20">
      <header className="text-center mb-12 pb-8 border-b border-border-soft">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-3">
          Pipeline · Try it
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.05] mb-3 text-text">
          Encode <em className="italic font-normal text-text-dim">anything</em> into DNA.
        </h1>
        <p className="text-[16px] text-text-dim max-w-md mx-auto leading-[1.5]">
          Type a sentence. We turn it into the four letters of life — and back again.
        </p>
        <div className="flex justify-center gap-0 mt-7 font-mono text-[11px] tracking-[0.22em] uppercase">
          <button
            onClick={() => setTab('encode')}
            className={'px-4 py-2 border-b transition-colors ' + (tab === 'encode' ? 'text-text border-accent' : 'text-text-faint border-border-soft hover:text-text-dim')}
          >
            Encode
          </button>
          <button
            onClick={() => setTab('decode')}
            className={'px-4 py-2 border-b transition-colors ' + (tab === 'decode' ? 'text-text border-accent' : 'text-text-faint border-border-soft hover:text-text-dim')}
          >
            Decode
          </button>
        </div>
      </header>

      {tab === 'encode' ? <EncodePanel /> : <DecodePanel />}

      <div className="mt-12 pt-8 border-t border-border-soft text-center">
        <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-text-dim">
          Want the science?{' '}
          <Link href="/pipeline/how-it-works" className="text-accent border-b border-accent pb-0.5">
            How this works →
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run build to verify**

```bash
npm run build 2>&1 | tail -15
```

Expected: `✓ Compiled successfully`. `/pipeline` still in route list.

- [ ] **Step 5: Run dev server, browse `/pipeline`, confirm encode + decode tabs work**

```bash
npm run dev
```

Open `http://localhost:3000/pipeline`. Type in the textarea → DNA appears below with copy/share buttons. Switch to Decode tab → empty textarea, no output until you paste.

Stop with Ctrl-C.

- [ ] **Step 6: Run full test suite**

```bash
npm test && npm run typecheck
```

Expected: all pass, exit 0.

- [ ] **Step 7: Commit**

```bash
git add app/pipeline/page.tsx app/components/pipeline/EncodePanel.tsx app/components/pipeline/DecodePanel.tsx
git commit -m "$(cat <<'EOF'
feat(pipeline): rewrite /pipeline as the public Try-it surface

Replaces the 314-line legacy page with a thin shell that toggles
between EncodePanel and DecodePanel. No dangerouslySetInnerHTML.
QEC defaults to d=3 (hidden); controls live on /pipeline/how-it-works.
Copy and share buttons on output; how-this-works link at bottom.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: `/pipeline/how-it-works` — technical detail surface

**Files:**
- Create: `app/pipeline/how-it-works/page.tsx`

- [ ] **Step 1: Implement the page**

Create `app/pipeline/how-it-works/page.tsx`:

```tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Step } from '../../components/pipeline/Step';
import { DnaSequence } from '../../components/pipeline/DnaSequence';
import { SurfaceCodeGrid } from '../../components/pipeline/SurfaceCodeGrid';
import { useDnaEncoder } from '../../hooks/useDnaEncoder';

const SAMPLE = 'Hello DNA World!';

type QecD = 0 | 3 | 5 | 7;

export default function HowItWorksPage() {
  const [text, setText] = useState(SAMPLE);
  const [d, setD] = useState<QecD>(3);
  const result = useDnaEncoder(text, d);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-8 pb-20">
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-6">
        ←{' '}
        <Link href="/pipeline" className="text-accent">back to /pipeline</Link>
      </p>

      <header className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-3">
          /pipeline/how-it-works
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.1] text-text">
          Four steps from <em className="italic font-normal text-text-dim">letter</em> to <em className="italic font-normal text-text-dim">life</em>.
        </h1>
      </header>

      <div className="flex flex-wrap gap-4 items-center border-y border-border-soft py-4 mb-8 font-mono text-[11px] tracking-[0.05em] text-text-dim">
        <label className="flex items-center gap-2">
          <span className="text-[10px] tracking-[0.18em] uppercase text-text-faint">Input</span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="bg-bg-elev border border-border text-text px-2.5 py-1.5 rounded-sm min-w-[260px] focus:outline-none focus:border-accent"
          />
        </label>
        <label className="flex items-center gap-2">
          <span className="text-[10px] tracking-[0.18em] uppercase text-text-faint">QEC code</span>
          <select
            value={d}
            onChange={(e) => setD(parseInt(e.target.value) as QecD)}
            className="bg-bg-elev border border-border text-text px-2.5 py-1.5 rounded-sm"
          >
            <option value={0}>None</option>
            <option value={3}>Surface d=3</option>
            <option value={5}>Surface d=5</option>
            <option value={7}>Surface d=7</option>
          </select>
        </label>
      </div>

      {result && (
        <>
          <Step number={1} title="ASCII → Binary → DNA" meta={`${result.binary.length} bits · ${result.rawDna.length} nt`}>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-bg-elev-2 border border-border-soft rounded p-4">
                <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-text-faint mb-2">ASCII input</div>
                <div className="text-[15px] text-text">{result.ascii}</div>
              </div>
              <div className="bg-bg-elev-2 border border-border-soft rounded p-4">
                <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-text-faint mb-2">Binary · {result.binary.length} bits</div>
                <div className="font-mono text-[12px] text-text-dim break-all leading-[1.7]">
                  {result.binary.length > 200 ? result.binary.slice(0, 200) + '…' : result.binary}
                </div>
              </div>
            </div>
            <div className="bg-bg-elev-2 border border-border-soft rounded p-4 mt-2">
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-text-faint mb-2">
                Raw DNA · {result.rawDna.length} nt · {result.stopCodons.length} stop codons in any frame
              </div>
              <DnaSequence sequence={result.rawDna} maxLength={120} />
            </div>
          </Step>

          <Step number={2} title="Stop-codon screening" meta={result.fixedStopCodons.length === 0 ? 'Clean' : `${result.fixedStopCodons.length} stops remain`}>
            {result.stopCodons.length === 0 ? (
              <p className="text-[15px] text-text-dim">✓ No stop codons found in any reading frame.</p>
            ) : (
              <p className="text-[15px] text-text-dim">
                Found <span className="text-accent">{result.stopCodons.length}</span> stop codon(s) before screening. Frame-0 occurrences are substituted (TAA→TAC, TAG/TGA→TGG).
              </p>
            )}
            <div className="bg-bg-elev-2 border border-border-soft rounded p-4 mt-3">
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-text-faint mb-2">
                {result.stopCodons.length === 0 ? 'Clean' : 'Fixed'} DNA · {result.fixedDna.length} nt
              </div>
              <DnaSequence sequence={result.fixedDna} maxLength={120} />
            </div>
          </Step>

          <Step
            number={3}
            title={d === 0 ? 'No QEC — raw DNA' : `Quantum Error Correction · Surface Code d=${d}`}
            meta={d === 0 ? 'overhead 1.0×' : `${result.blocks.length} blocks · overhead ${(result.storedDna.length / result.fixedDna.length).toFixed(2)}×`}
          >
            {d > 0 ? (
              <div className="grid md:grid-cols-2 gap-4 items-start">
                <div>
                  <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-text-faint mb-3">
                    d={d} surface code · {d * d} data + {4 * d} parity per block
                  </div>
                  <SurfaceCodeGrid d={d as 3 | 5 | 7} data={result.blocks[0]?.data} />
                </div>
                <div className="bg-bg-elev-2 border border-border-soft rounded p-4">
                  <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-text-faint mb-2">Block stats</div>
                  <ul className="font-mono text-[12px] leading-[1.9] text-text">
                    <li>Blocks · <span className="text-accent">{result.blocks.length}</span></li>
                    <li>Data per block · <span className="text-accent">{d * d} nt</span></li>
                    <li>Parity per block · <span className="text-accent">{4 * d} nt</span></li>
                    <li>Total stored · <span className="text-accent">{result.storedDna.length} nt</span></li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-[15px] text-text-dim">
                With QEC disabled, the fixed DNA is stored as-is. Storage length: {result.fixedDna.length} nt.
              </p>
            )}
          </Step>

          <Step number={4} title="Final DNA · ready for the fish" meta={`${result.storedDna.length} nt · 2 bits / base`}>
            <div className="bg-bg-elev-2 border border-border-soft rounded p-4">
              <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-text-faint mb-3">Stored sequence</div>
              <DnaSequence sequence={result.storedDna} />
            </div>
          </Step>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run build to verify the new route compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`. Route list now includes `/pipeline/how-it-works`.

- [ ] **Step 3: Dev-server smoke**

```bash
npm run dev
```

Visit `http://localhost:3000/pipeline/how-it-works`. Type → all 4 steps render, surface code grid shows. Switch QEC selector → grid changes. Stop with Ctrl-C.

- [ ] **Step 4: Run tests + typecheck**

```bash
npm test && npm run typecheck
```

Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add app/pipeline/how-it-works/page.tsx
git commit -m "$(cat <<'EOF'
feat(pipeline): /pipeline/how-it-works technical detail page

Four Step components driven by the same useDnaEncoder hook used
by /pipeline. QEC selector (None / d=3 / d=5 / d=7) lives here.
SurfaceCodeGrid visualizes the data/parity layout. No string
concat HTML.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Phase D — Publications (Tasks 12–14)

### Task 12: Markdown content move + lib/papers.ts

**Files:**
- Create: `content/papers/nature-biotech.md`
- Create: `content/papers/science-advances.md`
- Create: `content/papers/leonardo.md`
- Delete: `public/nature-biotech-version.md`
- Delete: `public/science-advances-version.md`
- Delete: `public/leonardo-version.md`
- Create: `lib/papers.ts`
- Create: `lib/papers.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Install markdown stack**

```bash
cd ~/.openclaw/workspace/living-archive-web
npm install gray-matter react-markdown remark-gfm rehype-slug rehype-autolink-headings
npm install -D @types/mdast
```

Expected: `added N packages`, exit 0.

- [ ] **Step 2: Move three markdown files and add frontmatter to each**

```bash
mkdir -p content/papers
git mv public/nature-biotech-version.md content/papers/nature-biotech.md
git mv public/science-advances-version.md content/papers/science-advances.md
git mv public/leonardo-version.md content/papers/leonardo.md
```

- [ ] **Step 3: Prepend frontmatter to `content/papers/nature-biotech.md`**

Use this exact frontmatter (read the existing first line of the file before this step to make sure you don't double up if frontmatter already exists). Insert at the very top of the file:

```yaml
---
slug: nature-biotech
journal: Nature Biotech
kind: Technical
length: 5000
citation: numbered
summary: >
  The biotech-engineering version. For synthetic biologists and bioengineers:
  the wet-lab pipeline, the Tol2 transposon protocol, the QEC math, and the
  data showing encoded archives surviving to the F2 generation.
---

```

Note the blank line after the closing `---`.

- [ ] **Step 4: Prepend frontmatter to `content/papers/science-advances.md`**

```yaml
---
slug: science-advances
journal: Science Advances
kind: Interdisciplinary
length: 6000
citation: numbered-supplementary
summary: >
  Broad scientific audience. Bridges the wet-lab work to its implications —
  preservation, ethics, sovereignty, comparison to other long-term storage
  proposals. Heavy supplementary materials carry the deep technical detail.
---

```

- [ ] **Step 5: Prepend frontmatter to `content/papers/leonardo.md`**

```yaml
---
slug: leonardo
journal: Leonardo
kind: Bioart
length: 4000
citation: apa
summary: >
  For the art-science community — MIT Press's longest-running bioart venue.
  Frames the work in the Kac/Davis/SymbioticA lineage. The Iman Mersal quote
  leads. The installation is the artifact.
---

```

- [ ] **Step 6: Write failing test for lib/papers.ts**

Create `lib/papers.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { getAllPapers, getPaperBySlug, getPaperSlugs } from './papers';

describe('papers', () => {
  it('returns all three papers from content/papers/', async () => {
    const papers = await getAllPapers();
    expect(papers).toHaveLength(3);
    const slugs = papers.map((p) => p.slug).sort();
    expect(slugs).toEqual(['leonardo', 'nature-biotech', 'science-advances']);
  });

  it('parses frontmatter into typed fields', async () => {
    const paper = await getPaperBySlug('leonardo');
    expect(paper.slug).toBe('leonardo');
    expect(paper.journal).toBe('Leonardo');
    expect(paper.kind).toBe('Bioart');
    expect(paper.length).toBe(4000);
    expect(paper.citation).toBe('apa');
    expect(paper.summary).toContain('MIT Press');
    expect(paper.body.length).toBeGreaterThan(100);
  });

  it('throws when slug is unknown', async () => {
    await expect(getPaperBySlug('does-not-exist')).rejects.toThrow();
  });

  it('returns slugs as a flat array', async () => {
    const slugs = await getPaperSlugs();
    expect(slugs.sort()).toEqual(['leonardo', 'nature-biotech', 'science-advances']);
  });
});
```

- [ ] **Step 7: Run, fail**

```bash
npm test -- lib/papers.test.ts
```

- [ ] **Step 8: Implement `lib/papers.ts`**

```ts
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface Paper {
  slug: string;
  journal: string;
  kind: string;
  length: number;
  citation: string;
  summary: string;
  body: string;
}

const PAPERS_DIR = path.join(process.cwd(), 'content', 'papers');

export async function getPaperSlugs(): Promise<string[]> {
  const files = await fs.readdir(PAPERS_DIR);
  return files
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export async function getAllPapers(): Promise<Paper[]> {
  const slugs = await getPaperSlugs();
  return Promise.all(slugs.map(getPaperBySlug));
}

export async function getPaperBySlug(slug: string): Promise<Paper> {
  const filePath = path.join(PAPERS_DIR, `${slug}.md`);
  const raw = await fs.readFile(filePath, 'utf-8');
  const parsed = matter(raw);
  const data = parsed.data as Partial<Paper>;
  if (
    !data.slug ||
    !data.journal ||
    !data.kind ||
    typeof data.length !== 'number' ||
    !data.citation ||
    !data.summary
  ) {
    throw new Error(`Paper "${slug}" is missing required frontmatter fields.`);
  }
  return {
    slug: data.slug,
    journal: data.journal,
    kind: data.kind,
    length: data.length,
    citation: data.citation,
    summary: data.summary.trim(),
    body: parsed.content.trim(),
  };
}
```

- [ ] **Step 9: Run, pass**

```bash
npm test -- lib/papers.test.ts
```

Expected: `4 passed`.

- [ ] **Step 10: Run full suite + typecheck**

```bash
npm test && npm run typecheck
```

Expected: pass.

- [ ] **Step 11: Commit**

```bash
git add content/papers/ lib/papers.ts lib/papers.test.ts package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat(publications): move papers to content/, add lib/papers.ts loader

Moves the three markdown files from /public to /content/papers
(no longer fetched as static assets). Adds frontmatter to each
(slug, journal, kind, length, citation, summary). Installs
gray-matter + react-markdown + remark-gfm + rehype-slug +
rehype-autolink-headings. lib/papers.ts reads the directory at
build time and returns typed Paper records.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 13: Publications index — `app/publications/page.tsx`

**Files:**
- Create: `app/components/publications/PaperCard.tsx`
- Modify: `app/publications/page.tsx`

- [ ] **Step 1: Implement PaperCard**

Create `app/components/publications/PaperCard.tsx`:

```tsx
import Link from 'next/link';
import type { Paper } from '@/lib/papers';

export function PaperCard({ paper }: { paper: Paper }) {
  return (
    <Link
      href={`/publications/${paper.slug}`}
      className="block bg-bg-elev border border-border rounded-lg p-7 grid md:grid-cols-[160px_minmax(0,1fr)_140px] gap-6 hover:border-text-faint transition-colors"
    >
      <div className="font-mono">
        <div className="text-[11px] tracking-[0.22em] uppercase text-accent mb-2">{paper.journal}</div>
        <div className="text-[10px] tracking-[0.15em] uppercase text-text-faint leading-[1.7] space-y-1">
          <div>{paper.kind}</div>
          <div>~{paper.length.toLocaleString()} wd</div>
          <div>{paper.citation}</div>
        </div>
      </div>
      <div>
        <h2 className="text-[22px] font-semibold tracking-[-0.015em] leading-[1.2] mb-2.5 text-text">
          {firstHeading(paper.body) ?? paper.journal}
        </h2>
        <p className="text-[15px] leading-[1.65] text-text-dim">{paper.summary}</p>
      </div>
      <div className="flex md:flex-col gap-2 md:items-end font-mono text-[10px] tracking-[0.18em] uppercase">
        <span className="text-accent border border-accent-border rounded-sm px-3.5 py-2">Read →</span>
        <span className="text-text-dim border border-border rounded-sm px-3.5 py-2">.md</span>
      </div>
    </Link>
  );
}

function firstHeading(body: string): string | null {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}
```

- [ ] **Step 2: Rewrite `app/publications/page.tsx` as a server component**

Replace the file with:

```tsx
import { getAllPapers } from '@/lib/papers';
import { PaperCard } from '../components/publications/PaperCard';

export const metadata = {
  title: 'Publications · Living Archive',
};

export default async function PublicationsIndexPage() {
  const papers = await getAllPapers();
  // Stable ordering: Nature Biotech, Science Advances, Leonardo
  const order = ['nature-biotech', 'science-advances', 'leonardo'];
  papers.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));

  return (
    <div className="max-w-6xl mx-auto px-6 pt-8 pb-20">
      <header className="mb-10 max-w-2xl">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-3">/publications</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.05] mb-4 text-text">
          Three versions of <em className="italic font-normal text-text-dim">the same idea</em>.
        </h1>
        <p className="text-[16px] text-text-dim leading-[1.6]">
          The same research, written for three different rooms. Pick the one that fits how you read.
        </p>
      </header>
      <div className="space-y-3.5">
        {papers.map((p) => <PaperCard key={p.slug} paper={p} />)}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Run build to verify the route still compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`, `/publications` in route list, no client-side fetch warnings.

- [ ] **Step 4: Smoke via curl**

```bash
npm run dev &
sleep 6
curl -s http://localhost:3000/publications | grep -oE '(Nature Biotech|Science Advances|Leonardo)' | sort -u
kill %1 2>/dev/null
```

Expected output:

```
Leonardo
Nature Biotech
Science Advances
```

- [ ] **Step 5: Commit**

```bash
git add app/components/publications/PaperCard.tsx app/publications/page.tsx
git commit -m "$(cat <<'EOF'
feat(publications): server-rendered index with PaperCard

Replaces the client-side fetch + regex parser with a server
component that reads content/papers/ at build time. Three
cards (Nature Biotech, Science Advances, Leonardo) render in
fixed order. Each card links to /publications/[slug]. Tabs are
gone; per-paper accent colors gone.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 14: Per-paper reader — `app/publications/[slug]/page.tsx`

**Files:**
- Create: `app/publications/[slug]/page.tsx`
- Create: `app/components/publications/PaperTOC.tsx`
- Create: `app/components/publications/PaperSidePanel.tsx`

- [ ] **Step 1: Implement PaperTOC**

Create `app/components/publications/PaperTOC.tsx`:

```tsx
'use client';
import { useEffect, useState } from 'react';

export interface TocEntry {
  id: string;
  text: string;
  depth: 2 | 3;
}

export function PaperTOC({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string>(entries[0]?.id ?? '');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || entries.length === 0) return;
    const els = entries.map((e) => document.getElementById(e.id)).filter((el): el is HTMLElement => !!el);
    const obs = new IntersectionObserver(
      (records) => {
        const hit = records.find((r) => r.isIntersecting);
        if (hit?.target.id) setActive(hit.target.id);
      },
      { rootMargin: '-30% 0px -65% 0px', threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [entries]);

  return (
    <nav aria-label="Article contents" className="font-mono text-[11px] leading-[1.6] text-text-faint sticky top-24 self-start hidden lg:block">
      <div className="text-[9px] tracking-[0.22em] uppercase text-text-faint mb-3">Contents</div>
      <ul className="space-y-2.5">
        {entries.map((e) => (
          <li key={e.id} className={(e.depth === 3 ? 'pl-5 text-[10px]' : '')}>
            <a
              href={`#${e.id}`}
              className={
                'block border-l pl-2.5 transition-colors ' +
                (e.id === active
                  ? 'border-accent text-text'
                  : 'border-border-soft hover:text-text-dim')
              }
            >
              {e.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Implement PaperSidePanel**

Create `app/components/publications/PaperSidePanel.tsx`:

```tsx
import type { Paper } from '@/lib/papers';

export function PaperSidePanel({ paper }: { paper: Paper }) {
  return (
    <aside className="sticky top-24 self-start hidden lg:flex flex-col gap-3 font-mono text-[10px] tracking-[0.05em]">
      <Block k="Target journal" v={paper.journal} />
      <Block k="Length" v={`~${paper.length.toLocaleString()} words`} />
      <Block k="Citation" v={paper.citation} />
      <a
        href={`/papers/${paper.slug}.md`}
        className="block px-3.5 py-2.5 border border-accent-border text-accent rounded-sm text-center tracking-[0.18em] uppercase"
        download
      >
        Download .md
      </a>
    </aside>
  );
}

function Block({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-bg-elev border border-border-soft rounded p-3.5">
      <div className="text-[9px] tracking-[0.22em] uppercase text-text-faint mb-2">{k}</div>
      <div className="text-[12px] tracking-[0.04em] text-text leading-[1.6]">{v}</div>
    </div>
  );
}
```

- [ ] **Step 3: Implement the reader page**

Create `app/publications/[slug]/page.tsx`:

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getPaperSlugs, getPaperBySlug } from '@/lib/papers';
import { PaperTOC, type TocEntry } from '../../components/publications/PaperTOC';
import { PaperSidePanel } from '../../components/publications/PaperSidePanel';

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getPaperSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const paper = await getPaperBySlug(slug);
    return {
      title: `${firstHeading(paper.body) ?? paper.journal} · Living Archive`,
      description: paper.summary,
    };
  } catch {
    return { title: 'Not found · Living Archive' };
  }
}

export default async function PaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let paper;
  try {
    paper = await getPaperBySlug(slug);
  } catch {
    notFound();
  }

  const toc = buildToc(paper.body);
  const title = firstHeading(paper.body) ?? paper.journal;
  // Strip the first H1 from body — we render it ourselves above
  const bodyWithoutH1 = paper.body.replace(/^#\s+.+\n?/, '').trim();

  return (
    <div className="max-w-6xl mx-auto px-6 pt-8 pb-20 lg:grid lg:grid-cols-[200px_minmax(0,680px)_220px] lg:gap-12">
      <PaperTOC entries={toc} />

      <article className="max-w-[680px] mx-auto w-full">
        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint mb-6">
          ← <Link href="/publications" className="text-accent">back to /publications</Link>
        </p>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-3">
          {paper.journal} · {paper.kind}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.1] mb-4 text-text">
          {title}
        </h1>
        <p className="text-[17px] leading-[1.55] text-text-dim border-b border-border-soft pb-6 mb-8">
          {paper.summary}
        </p>

        <div className="prose-paper">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}
          >
            {bodyWithoutH1}
          </ReactMarkdown>
        </div>
      </article>

      <PaperSidePanel paper={paper} />
    </div>
  );
}

function firstHeading(body: string): string | null {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

function buildToc(body: string): TocEntry[] {
  const out: TocEntry[] = [];
  const re = /^(##|###)\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const depth = m[1].length === 2 ? 2 : 3;
    const text = m[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    out.push({ id, text, depth });
  }
  return out;
}

// Suppress unused warning for getAllPapers (kept available for prefetch helpers)
void getAllPapers;
```

- [ ] **Step 4: Add prose styles to globals.css**

Append to `app/globals.css` (after the existing content):

```css
/* Publication article body — serif reading typography */
.prose-paper { color: var(--color-text-dim); }
.prose-paper p { font-size: 17px; line-height: 1.78; margin: 0 0 16px; color: #cfcfcf; }
.prose-paper p strong { color: var(--color-text); font-weight: 600; }
.prose-paper p em { color: #bbb; }
.prose-paper h2 {
  font-size: 24px; font-weight: 600; letter-spacing: -0.015em;
  line-height: 1.25; margin: 40px 0 16px; color: #f0f0f0;
  scroll-margin-top: 96px;
}
.prose-paper h3 {
  font-family: var(--font-mono); font-size: 12px;
  letter-spacing: 0.1em; text-transform: uppercase;
  margin: 24px 0 10px; color: var(--color-text);
}
.prose-paper code {
  font-family: var(--font-mono); font-size: 14px;
  color: var(--color-accent); background: var(--color-bg-elev-2);
  padding: 1px 5px; border-radius: 3px;
}
.prose-paper pre {
  background: var(--color-bg-elev); border: 1px solid var(--color-border-soft);
  border-radius: 6px; padding: 14px 16px; overflow-x: auto;
  font-family: var(--font-mono); font-size: 13px; line-height: 1.6;
  color: #bbb; margin: 18px 0;
}
.prose-paper pre code { background: transparent; color: inherit; padding: 0; }
.prose-paper blockquote {
  border-left: 2px solid var(--color-accent);
  padding: 8px 0 8px 20px; margin: 24px 0;
  color: #aaa; font-style: italic;
}
.prose-paper ul, .prose-paper ol {
  padding-left: 22px; font-size: 17px; line-height: 1.78;
  color: #cfcfcf; margin: 0 0 16px;
}
.prose-paper a { color: var(--color-accent); text-decoration: underline; text-decoration-thickness: 1px; }
```

- [ ] **Step 5: Run build to verify static generation**

```bash
npm run build 2>&1 | tail -25
```

Expected: `✓ Compiled successfully`. Route list shows `/publications/[slug]` with 3 paths pre-rendered. No "missing param" warnings.

- [ ] **Step 6: Dev-server smoke**

```bash
npm run dev &
sleep 6
for slug in nature-biotech science-advances leonardo; do
  curl -s "http://localhost:3000/publications/${slug}" | head -c 200; echo; echo "---";
done
kill %1 2>/dev/null
```

Each curl should return HTML containing the journal name and `<h1>`.

- [ ] **Step 7: Run tests + typecheck**

```bash
npm test && npm run typecheck
```

Expected: pass.

- [ ] **Step 8: Commit**

```bash
git add app/publications/\[slug\]/page.tsx \
        app/components/publications/PaperTOC.tsx \
        app/components/publications/PaperSidePanel.tsx \
        app/globals.css
git commit -m "$(cat <<'EOF'
feat(publications): per-paper reader at /publications/[slug]

Server component statically generates three routes
(nature-biotech, science-advances, leonardo). react-markdown
with remark-gfm, rehype-slug, and rehype-autolink-headings.
PaperTOC auto-builds from h2/h3 with IntersectionObserver active
tracking. PaperSidePanel shows journal, length, citation, and a
.md download. generateMetadata produces per-paper OG titles.
Drops the regex-based renderer entirely.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Phase E — Testing & CI (Tasks 15–16)

### Task 15: Playwright visual smoke

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/smoke.spec.ts`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Install Playwright**

```bash
cd ~/.openclaw/workspace/living-archive-web
npm install -D @playwright/test
npx playwright install chromium
```

Expected: install completes, chromium browser binary fetched.

- [ ] **Step 2: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
```

- [ ] **Step 3: Create the smoke test**

Create `tests/e2e/smoke.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const ROUTES = [
  { path: '/', name: 'story' },
  { path: '/pipeline', name: 'pipeline' },
  { path: '/pipeline/how-it-works', name: 'pipeline-how' },
  { path: '/publications', name: 'publications' },
  { path: '/publications/leonardo', name: 'paper-leonardo' },
];

for (const route of ROUTES) {
  test(`${route.name} renders without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto(route.path, { waitUntil: 'networkidle' });
    await expect(page).toHaveTitle(/Living Archive/);
    expect(errors, `console errors on ${route.path}: ${errors.join('\n')}`).toHaveLength(0);
  });

  test(`${route.name} screenshot baseline`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot(`${route.name}.png`, { fullPage: true, maxDiffPixelRatio: 0.02 });
  });
}
```

- [ ] **Step 4: Add scripts**

Add to `package.json` `"scripts"`:

```json
"e2e": "playwright test",
"e2e:update": "playwright test --update-snapshots"
```

- [ ] **Step 5: Add `.gitignore` entries**

Append to `.gitignore`:

```
# Playwright
test-results/
playwright-report/
```

- [ ] **Step 6: Generate baseline screenshots**

```bash
npm run e2e:update
```

Expected: 10 test runs (5 routes × 2 viewports for `screenshot baseline`; 5 routes for `console errors`). New PNG files appear under `tests/e2e/smoke.spec.ts-snapshots/`.

- [ ] **Step 7: Run e2e to confirm baselines match**

```bash
npm run e2e
```

Expected: all tests pass.

- [ ] **Step 8: Commit**

```bash
git add playwright.config.ts tests/e2e/ package.json package-lock.json .gitignore
git commit -m "$(cat <<'EOF'
test(e2e): Playwright smoke + visual baselines for all 5 routes

Each route smoke-tests for: page title, no console / page errors,
matching screenshot at 1440x900 desktop and iPhone 12 mobile.
Baselines committed; PR diffs will surface as visual regressions.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 16: Pre-push hook + final verification

**Files:**
- Create: `.husky/pre-push`
- Modify: `package.json`

- [ ] **Step 1: Install husky**

```bash
cd ~/.openclaw/workspace/living-archive-web
npm install -D husky
npx husky init
```

Expected: `.husky/pre-commit` may be created — we replace it. `prepare` script added to `package.json`.

- [ ] **Step 2: Create `.husky/pre-push`**

```bash
#!/usr/bin/env sh

set -e

echo "→ typecheck"
npm run typecheck

echo "→ lint"
npm run lint

echo "→ test"
npm test
```

Make it executable:

```bash
chmod +x .husky/pre-push
```

- [ ] **Step 3: Remove the default `.husky/pre-commit` if it exists**

```bash
rm -f .husky/pre-commit
```

- [ ] **Step 4: Verify the hook by simulating it**

```bash
./.husky/pre-push
```

Expected: typecheck passes, lint passes, all tests pass, exit 0.

- [ ] **Step 5: Final build to confirm everything still compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`. Route list:
- `/` (Story)
- `/pipeline`
- `/pipeline/how-it-works`
- `/publications`
- `/publications/leonardo`
- `/publications/nature-biotech`
- `/publications/science-advances`

Seven routes total (three pre-rendered paper pages count separately under the `[slug]` group).

- [ ] **Step 6: Run e2e against the production build**

```bash
npm run build && npm start &
sleep 5
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000 npx playwright test --project=desktop
kill %1 2>/dev/null
```

Expected: all 5 desktop smoke + screenshot tests pass against the prod build.

- [ ] **Step 7: Commit**

```bash
git add .husky/pre-push package.json package-lock.json
git commit -m "$(cat <<'EOF'
chore: husky pre-push hook running typecheck + lint + tests

Replaces the default pre-commit with a pre-push that gates on
the full Vitest suite, ESLint, and tsc --noEmit. Hooks install
via the prepare script on npm install. CI workflows are not
added here — the repo is not currently pushed to GitHub.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Final Self-Review Checklist

After implementing all 16 tasks, verify the redesign is complete:

- [ ] **All routes render:** visit `/`, `/pipeline`, `/pipeline/how-it-works`, `/publications`, and each `/publications/[slug]` in a browser. No 404s, no console errors.
- [ ] **Token coverage:** `app/globals.css` has the `@theme` block; no leftover `--accent2`, `--accent3`, or per-journal colors.
- [ ] **Font loading:** view source of `/` — should see `<style>` blocks for Source Serif 4 and JetBrains Mono via `next/font`.
- [ ] **No `dangerouslySetInnerHTML`:** grep returns no matches in `app/`.

```bash
grep -rn "dangerouslySetInnerHTML" app/ lib/ 2>&1 | grep -v "_next" || echo "✓ clean"
```

- [ ] **Markdown lives in `content/`:** `ls public/*.md` returns no files; `ls content/papers/*.md` returns 3.
- [ ] **All tests pass:** `npm test && npm run typecheck && npm run lint && npm run e2e`.
- [ ] **Pre-push hook fires:** `git push --dry-run` runs the hook.
- [ ] **Spec requirements all addressed:** open `docs/superpowers/specs/2026-05-26-living-archive-redesign-design.md` and scan §1–§8 — every numbered section has at least one corresponding task above.
