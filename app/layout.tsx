import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Living Archive",
  description: "Encoding cultural memory into DNA",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header>
          <p><a href="/">Living Archive</a></p>
          <nav>
            <a href="/">Story</a> · <a href="/pipeline">Pipeline</a> · <a href="/publications">Publications</a>
          </nav>
          <hr />
        </header>
        <main>{children}</main>
        <footer>
          <hr />
          <p>Living Archive · Henry Tan &amp; Carmen Koessler · NYUAD CGSB</p>
          <p>Artist-in-Residence 2024–2025 · Center for Genomics and Systems Biology</p>
        </footer>
      </body>
    </html>
  );
}
