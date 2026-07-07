import { CHAPTERS } from "./content/chapters";
import { ChapterFooterCTA } from "./components/ChapterFooterCTA";
import Link from "next/link";

export default function StoryPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="anim-fade-in"
        style={{
          padding: "5rem 20px 3rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p
            className="section-label"
            style={{ fontSize: "0.6rem", marginBottom: "1rem" }}
          >
            NYUAD CGSB · Artist-in-Residence 2024–2025
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            DNA Libraries, Dreamscapes{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
              &amp; Organoids
            </em>
          </h1>
          <p className="lead" style={{ maxWidth: 520, margin: "0 auto 1.5rem" }}>
            Storing cultural archives in zebrafish DNA. Building a temple where the
            archive swims, reproduces, and outlives us all.
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Henry Tan &amp; Carmen Koessler · 12 min read
          </p>
        </div>
      </section>

      {/* ── Table of contents ── */}
      <div
        className="anim-fade-in anim-delay-1"
        style={{
          maxWidth: "var(--max-w-content)",
          margin: "0 auto",
          padding: "0 20px 2rem",
        }}
      >
        <hr />
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.6rem 1.5rem",
            justifyContent: "center",
            padding: "1.25rem 0",
          }}
        >
          {CHAPTERS.map((ch) => (
            <Link
              key={ch.id}
              href={`#${ch.id}`}
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
                {String(ch.number).padStart(2, "0")}.
              </span>{" "}
              {ch.short}
            </Link>
          ))}
        </nav>
        <hr />
      </div>

      {/* ── Chapters ── */}
      <div
        style={{
          maxWidth: "var(--max-w-read)",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {CHAPTERS.map((ch, i) => (
          <section
            key={ch.id}
            id={ch.id}
            className={i === 0 ? "reveal visible" : "reveal"}
            style={{
              padding: "3.5rem 0",
              scrollMarginTop: 80,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <p
              className="section-label"
              style={{ fontSize: "0.6rem", marginBottom: "0.25rem" }}
            >
              Chapter {String(ch.number).padStart(2, "0")}
            </p>
            <h2
              style={{
                fontSize: "clamp(1.3rem, 3vw, 1.7rem)",
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                lineHeight: 1.25,
                letterSpacing: "-0.015em",
                marginBottom: "1.25rem",
              }}
            >
              {ch.title}
            </h2>
            <div
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
              }}
            >
              {ch.render()}
            </div>
          </section>
        ))}
      </div>

      {/* ── CTA ── */}
      <div style={{ maxWidth: "var(--max-w-read)", margin: "0 auto", padding: "0 20px" }}>
        <ChapterFooterCTA />
      </div>

      {/* ── Footer nav ── */}
      <div
        style={{
          maxWidth: "var(--max-w-read)",
          margin: "0 auto",
          padding: "2rem 20px 3rem",
          textAlign: "center",
        }}
      >
        <hr />
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "1.5rem" }}>
          <Link href="/pipeline">View the technical pipeline →</Link>
        </p>
      </div>
    </>
  );
}
