'use client';

import { useState, useEffect } from 'react';

const TABS = [
  { key: 'nature', label: 'Nature Biotech', badge: 'Technical', accent: '#006994', file: 'nature-biotech-version.md' },
  { key: 'science', label: 'Science Advances', badge: 'Interdisciplinary', accent: '#0077cc', file: 'science-advances-version.md' },
  { key: 'leonardo', label: 'Leonardo', badge: 'Bioart', accent: '#c4983e', file: 'leonardo-version.md' },
];

const META: Record<string, { focus: string; citation: string; length: string; audience: string }> = {
  nature: { focus: 'Technical innovation, biotech application', citation: 'Nature numbered', length: '~5,000 words', audience: 'Synthetic biologists, bioengineers' },
  science: { focus: 'Broader significance, interdisciplinary', citation: 'Numbered + Supplementary Materials', length: '~6,000 words', audience: 'Broad scientific community' },
  leonardo: { focus: 'Bioart, archival theory, cultural', citation: 'APA', length: '~4,000 words', audience: 'Art-science community, MIT Press readers' },
};

function renderMarkdown(text: string) {
  let html = text;
  html = html.replace(/```[\s\S]*?```/g, '<pre><code>$&</code></pre>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/^---$/gm, '<hr>');
  html = html.replace(/^(•|\-) (.+)$/gm, '<li>$2</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p>\s*(<h[123]>)/g, '$1');
  html = html.replace(/(<\/h[123]>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<hr>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)\s*<\/p>/g, '$1');
  return html;
}

export default function PublicationsPage() {
  const [active, setActive] = useState('nature');
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    TABS.forEach(async (tab) => {
      try {
        const res = await fetch(tab.file);
        const text = await res.text();
        setContent(prev => ({ ...prev, [tab.key]: renderMarkdown(text) }));
      } catch (e) {
        setContent(prev => ({ ...prev, [tab.key]: '' }));
      }
    });
  }, []);

  const activeTab = TABS.find(t => t.key === active)!;
  const activeMeta = META[active];
  const activeContent = content[active];

  return (
    <div className="max-w-[960px] mx-auto px-6 pb-16 pt-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em] mb-2 font-serif text-text">
          Publication Versions
        </h1>
        <p className="text-text-dim text-[15px] mb-8">
          Three journal-targeted versions of the Living Archive research
        </p>

        <div className="flex border-b border-border overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-5 py-3 border-none text-sm cursor-pointer relative transition-colors whitespace-nowrap font-sans ${
                active === tab.key
                  ? 'text-text font-semibold'
                  : 'text-text-dim hover:text-text'
              }`}
            >
              {tab.label}
              <span
                style={{ background: tab.accent, color: '#fff' }}
                className="inline-block px-1.5 py-0.5 rounded text-[0.6rem] ml-2 align-middle font-semibold"
              >
                {tab.badge}
              </span>
              {active === tab.key && (
                <span
                  className="absolute bottom-[-1px] left-0 right-0 h-[3px] rounded-t"
                  style={{ background: tab.accent }}
                />
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-accent-soft/50 border border-accent-border rounded-xl p-6 mb-8">
        <h3 className="text-xs uppercase tracking-widest text-text-faint mb-3 font-semibold">
          Target Journal Profile
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ['Focus', activeMeta.focus],
            ['Citation', activeMeta.citation],
            ['Length', activeMeta.length],
            ['Audience', activeMeta.audience],
          ].map(([label, val]) => (
            <div key={label}>
              <label className="block text-[0.65rem] uppercase tracking-widest text-text-faint mb-1">
                {label}
              </label>
              <span className="text-sm text-text-dim">{val}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-5 border-t border-accent-border flex gap-3 flex-wrap">
          <a
            href={activeTab.file}
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-accent-border rounded-lg bg-bg text-text-dim text-sm hover:border-accent hover:text-accent transition-colors"
          >
            Download .md
          </a>
        </div>
      </div>

      <article
        className="prose-custom text-text-dim leading-relaxed font-serif"
        style={{ fontSize: '1rem', lineHeight: '1.85' }}
        dangerouslySetInnerHTML={{
          __html:
            activeContent ||
            '<p class="italic">Click "Download .md" to view the full text.</p>',
        }}
      />

      <style jsx global>{`
        .prose-custom h2 {
          color: var(--color-text);
          font-size: 1.5rem;
          font-weight: 700;
          margin: 2rem 0 0.75rem;
        }
        .prose-custom h3 {
          color: var(--color-accent);
          font-size: 1.15rem;
          font-weight: 600;
          margin: 1.5rem 0 0.5rem;
        }
        .prose-custom p { margin-bottom: 1rem; }
        .prose-custom strong { color: var(--color-text); }
        .prose-custom ul { padding-left: 1.25rem; margin-bottom: 1rem; }
        .prose-custom li { margin-bottom: 0.35rem; }
        .prose-custom hr { border: none; border-top: 1px solid var(--color-border); margin: 2rem 0; }
        .prose-custom pre {
          background: var(--color-bg-dark);
          color: #e8e8e8;
          padding: 1rem;
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          overflow-x: auto;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
}
