"use client";

import { useState, useEffect } from "react";

const TABS = [
  { key: "nature", label: "Nature Biotech", badge: "Technical", file: "/nature-biotech-version.md" },
  { key: "science", label: "Science Advances", badge: "Interdisciplinary", file: "/science-advances-version.md" },
  { key: "leonardo", label: "Leonardo", badge: "Bioart", file: "/leonardo-version.md" },
];

const META: Record<string, { focus: string; citation: string; length: string; audience: string }> = {
  nature: {
    focus: "Technical innovation, biotech application",
    citation: "Nature numbered",
    length: "~5,000 words",
    audience: "Synthetic biologists, bioengineers",
  },
  science: {
    focus: "Broader significance, interdisciplinary",
    citation: "Numbered + Supplementary Materials",
    length: "~6,000 words",
    audience: "Broad scientific community",
  },
  leonardo: {
    focus: "Bioart, archival theory, cultural",
    citation: "APA",
    length: "~4,000 words",
    audience: "Art-science community, MIT Press readers",
  },
};

export default function PublicationsPage() {
  const [active, setActive] = useState("nature");
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    TABS.forEach(async (tab) => {
      try {
        const res = await fetch(tab.file);
        const text = await res.text();
        setContent((prev) => ({ ...prev, [tab.key]: renderMarkdown(text) }));
      } catch {
        setContent((prev) => ({ ...prev, [tab.key]: "" }));
      }
    });
  }, []);

  const activeMeta = META[active];
  const activeContent = content[active];

  return (
    <div style={{ maxWidth: "var(--max-w-read)", margin: "0 auto", padding: "3rem 20px 4rem" }}>
      <p className="section-label" style={{ fontSize: "0.6rem", marginBottom: "0.25rem" }}>
        Research
      </p>
      <h1 style={{ marginBottom: "0.5rem" }}>Publication Versions</h1>
      <p className="lead" style={{ marginBottom: "1.5rem" }}>
        Three journal-targeted versions of the Living Archive research, written for different
        audiences.
      </p>

      <hr />

      {/* Tab buttons */}
      <div
        style={{
          display: "flex",
          gap: 8,
          margin: "1.5rem 0",
          flexWrap: "wrap",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`btn ${active === tab.key ? "btn-primary" : "btn-outline"}`}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
            <span
              style={{
                fontSize: "0.65rem",
                opacity: 0.7,
                marginLeft: 4,
              }}
            >
              ({tab.badge})
            </span>
          </button>
        ))}
      </div>

      {/* Metadata */}
      <div
        style={{
          background: "var(--bg-alt)",
          borderRadius: 10,
          padding: "1.25rem 1.5rem",
          marginBottom: "1.5rem",
          fontSize: "0.85rem",
          lineHeight: 1.6,
        }}
      >
        <p>
          <strong>Target:</strong> {activeMeta.focus}
        </p>
        <p>
          <strong>Length:</strong> {activeMeta.length} · <strong>Audience:</strong>{" "}
          {activeMeta.audience}
        </p>
        <p style={{ marginBottom: 0 }}>
          <a
            href={TABS.find((t) => t.key === active)!.file}
            download
            style={{ fontSize: "0.82rem" }}
          >
            ↓ Download .md
          </a>
        </p>
      </div>

      {activeContent ? (
        <div
          dangerouslySetInnerHTML={{ __html: activeContent }}
          style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "var(--text-secondary)" }}
        />
      ) : (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
          Loading...
        </p>
      )}
    </div>
  );
}

function renderMarkdown(text: string): string {
  let html = text;
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    const code = match.replace(/```/g, "").trim();
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  });
  html = html.replace(/^### (.+)$/gm, "<h3 style='margin-top:1.5rem'>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2 style='margin-top:2rem'>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/^---$/gm, "<hr>");
  html = html.replace(/^(•|-|–) (.+)$/gm, "<li>$2</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";
  html = html.replace(/<p>\s*<\/p>/g, "");
  html = html.replace(/<p>\s*(<(h[123]|hr|ul|pre)>)/g, "$1");
  html = html.replace(/(<\/(h[123]|ul|pre)>)\s*<\/p>/g, "$1");
  html = html.replace(/<p>\s*(<li>)/g, "$1");
  html = html.replace(/(<\/li>)\s*<\/p>/g, "$1");
  return html;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
