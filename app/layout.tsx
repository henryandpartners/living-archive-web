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
