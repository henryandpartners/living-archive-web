'use client';

import { useState, useEffect } from 'react';

const TABS = [
  { key: 'nature', label: 'Nature Biotech', badge: 'Technical', accent: '#00d4aa', file: 'nature-biotech-version.md' },
  { key: 'science', label: 'Science Advances', badge: 'Interdisciplinary', accent: '#4aa0ff', file: 'science-advances-version.md' },
  { key: 'leonardo', label: 'Leonardo', badge: 'Bioart', accent: '#ffaa00', file: 'leonardo-version.md' },
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
    <div className="max-w-[960px] mx-auto px-6 pb-16 bg-bg">
      <header className="pt-10 mb-8">
        <h1
          className="text-3xl md:text-4xl tracking-[-0.02em] mb-2 text-text"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Publication Versions
        </h1>
        <p
          className="text-text-dim text-sm mb-8"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Three journal-targeted versions of the DNA storage research
        </p>

        <div className="flex border-b border-border overflow-x-auto" style={{WebkitOverflowScrolling: 'touch'}}>
          {TABS.map(tab => (
            <button key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-5 py-3 border-none text-sm cursor-pointer relative transition-colors whitespace-nowrap bg-transparent ${
                active === tab.key
                  ? 'text-text font-semibold'
                  : 'text-text-dim hover:text-text'
              }`}
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {tab.label}
              <span
                className="inline-block px-1.5 py-0.5 ml-2 text-[0.6rem] uppercase tracking-[0.1em] align-middle"
                style={{
                  background: 'transparent',
                  color: tab.accent,
                  border: `1px solid ${tab.accent}`,
                }}
              >
                {tab.badge}
              </span>
              {active === tab.key && (
                <span
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px]"
                  style={{ background: tab.accent }}
                />
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="p-6 border border-border mb-8">
        <h3
          className="text-[10px] uppercase tracking-[0.2em] text-text-faint mb-4"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Target Journal Profile
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[['Focus', activeMeta.focus], ['Citation', activeMeta.citation], ['Length', activeMeta.length], ['Audience', activeMeta.audience]].map(([label, val]) => (
            <div key={label}>
              <label
                className="block text-[0.65rem] uppercase tracking-[0.15em] text-text-faint mb-1"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {label}
              </label>
              <span className="text-sm text-text-dim">{val}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-5 border-t border-border flex gap-3 flex-wrap">
          <a
            href={activeTab.file}
            download
            className="inline-flex items-center gap-2 px-4 py-2 border border-border text-text-dim text-[11px] uppercase tracking-[0.1em] hover:border-accent hover:text-accent transition-all"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            ↓ Download .md
          </a>
        </div>
      </div>

      <div
        className="text-text-dim leading-[1.8] text-[16px] space-y-5"
        style={{ fontFamily: 'var(--font-body)' }}
        dangerouslySetInnerHTML={{__html: activeContent || '<p><em>Click "Download .md" to view the full text.</em></p>'}}
      />
    </div>
  );
}
