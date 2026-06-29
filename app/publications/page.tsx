'use client';

import { useState, useEffect } from 'react';

const TABS = [
  { key: 'nature', label: 'Nature Biotech', badge: 'Technical', file: 'nature-biotech-version.md' },
  { key: 'science', label: 'Science Advances', badge: 'Interdisciplinary', file: 'science-advances-version.md' },
  { key: 'leonardo', label: 'Leonardo', badge: 'Bioart', file: 'leonardo-version.md' },
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

  const activeMeta = META[active];
  const activeContent = content[active];

  return (
    <>
      <h1>Publication Versions</h1>
      <p>Three journal-targeted versions of the Living Archive research</p>

      <p>
        {TABS.map(tab => (
          <span key={tab.key}>
            <button onClick={() => setActive(tab.key)}>
              {tab.label} ({tab.badge})
            </button>
            {' '}
          </span>
        ))}
      </p>

      <h2>Target Journal Profile</h2>
      <ul>
        <li>Focus: {activeMeta.focus}</li>
        <li>Citation: {activeMeta.citation}</li>
        <li>Length: {activeMeta.length}</li>
        <li>Audience: {activeMeta.audience}</li>
      </ul>
      <p><a href={TABS.find(t => t.key === active)!.file} download>Download .md</a></p>

      <hr />
      <div dangerouslySetInnerHTML={{ __html: activeContent || '<p><em>Click "Download .md" to view the full text.</em></p>' }} />
    </>
  );
}
