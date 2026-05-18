'use client';

import { useState, useEffect } from 'react';

const TABS = [
  { key: 'nature', label: 'Nature Biotech', badge: 'Technical', accent: '#4caf50', file: 'nature-biotech-version.md' },
  { key: 'science', label: 'Science Advances', badge: 'Interdisciplinary', accent: '#2196f3', file: 'science-advances-version.md' },
  { key: 'leonardo', label: 'Leonardo', badge: 'Bioart', accent: '#ff9800', file: 'leonardo-version.md' },
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
    <div className="max-w-[960px] mx-auto px-6 pb-12">
      <header className="pt-8 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">🧬 Living Archive — Publication Versions</h1>
        <p className="text-[#888] text-sm mb-6">Three journal-targeted versions of the DNA storage research</p>

        <div className="flex border-b border-[#2a2a2a] overflow-x-auto" style={{WebkitOverflowScrolling: 'touch'}}>
          {TABS.map(tab => (
            <button key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-5 py-3 border-none text-sm cursor-pointer relative transition-colors whitespace-nowrap ${active === tab.key ? 'text-[#e0e0e0] font-semibold' : 'text-[#888] hover:text-[#e0e0e0]'}`}
            >
              {tab.label}
              <span style={{background: tab.accent, color: tab.accent === '#2196f3' ? '#fff' : '#000'}} className="inline-block px-1 py-0.5 rounded text-[0.6rem] ml-2 align-middle">{tab.badge}</span>
              {active === tab.key && <span className="absolute bottom-[-1px] left-0 right-0 h-[2px]" style={{background: tab.accent}} />}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-5 mb-6">
        <h3 className="text-xs uppercase tracking-widest text-[#888] mb-3">Target Journal Profile</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[['Focus', activeMeta.focus], ['Citation', activeMeta.citation], ['Length', activeMeta.length], ['Audience', activeMeta.audience]].map(([label, val]) => (
            <div key={label}><label className="block text-[0.65rem] uppercase tracking-widest text-[#888] mb-0.5">{label}</label><span className="text-sm">{val}</span></div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[#2a2a2a] flex gap-3 flex-wrap">
          <a href={activeTab.file} download className="inline-flex items-center gap-2 px-4 py-2 border border-[#2a2a2a] rounded-lg bg-[#141414] text-[#e0e0e0] text-xs hover:border-[#888] transition-colors">📄 Download .md</a>
        </div>
      </div>

      <div className="article-body text-[#e0e0e0] leading-relaxed"
        style={{fontFamily: 'Georgia, Times New Roman, serif', fontSize: '0.95rem', lineHeight: '1.8'}}
        dangerouslySetInnerHTML={{__html: activeContent || '<p><em>Click "Download .md" to view the full text.</em></p>'}}
      />
    </div>
  );
}
