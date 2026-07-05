import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Living Archive — DNA Libraries",
  description:
    "A bioart project encoding cultural archives into zebrafish DNA. The archive swims, reproduces, and outlives us all.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {/* ── Top nav ── */}
        <header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: "rgba(250,248,245,0.92)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            height: 52,
          }}
        >
          <nav
            style={{
              maxWidth: "var(--max-w-content)",
              margin: "0 auto",
              padding: "0 20px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "var(--text)",
                letterSpacing: "-0.01em",
                textDecoration: "none",
              }}
            >
              Living Archive
            </Link>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <NavLink href="/">Story</NavLink>
              <NavLink href="/pipeline">Pipeline</NavLink>
              <NavLink href="/publications">Publications</NavLink>
            </div>
          </nav>
        </header>

        {/* ── Push content below fixed nav ── */}
        <div style={{ paddingTop: 52 }}>{children}</div>

        {/* ── Footer ── */}
        <footer
          style={{
            borderTop: "1px solid var(--border)",
            padding: "2.5rem 20px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "var(--max-w-content)", margin: "0 auto" }}>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 4 }}>
              <strong style={{ fontFamily: "var(--font-serif)", color: "var(--text)" }}>
                Living Archive
              </strong>{" "}
              · Henry Tan &amp; Carmen Koessler · NYUAD CGSB
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Artist-in-Residence 2024–2025 · Center for Genomics and Systems Biology
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        fontSize: "0.82rem",
        fontWeight: 500,
        color: "var(--text-secondary)",
        textDecoration: "none",
        transition: "color 0.2s",
      }}
      className="nav-link"
    >
      {children}
    </Link>
  );
}
