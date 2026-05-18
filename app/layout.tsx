import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Living Archive",
  description: "Encoding cultural memory into DNA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#2a2a2a]">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="text-sm font-semibold tracking-tight">Living Archive 🧬</a>
            <div className="flex gap-6 text-sm text-[#888]">
              <a href="/" className="hover:text-[#e0e0e0] transition-colors">Story</a>
              <a href="/pipeline" className="hover:text-[#e0e0e0] transition-colors">Pipeline</a>
              <a href="/publications" className="hover:text-[#e0e0e0] transition-colors">Publications</a>
            </div>
          </div>
        </nav>
        <main className="pt-14">
          {children}
        </main>
      </body>
    </html>
  );
}
