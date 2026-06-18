import type { Metadata } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { PageTransition } from "./components/PageTransition";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";
import { ScrollProgress } from "./components/ScrollProgress";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

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
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <body>
        <SiteNav pathname={pathname}>
          {pathname === "/" && <ScrollProgress />}
        </SiteNav>
        <main className="pt-14">
          <PageTransition pathname={pathname}>{children}</PageTransition>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
