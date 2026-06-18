export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-24 bg-bg">
      <div
        className="max-w-6xl mx-auto px-6 py-12 text-[10px] tracking-[0.15em] uppercase text-text-faint flex flex-col sm:flex-row gap-4 justify-between items-center"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span>Living Archive · Encoding cultural memory into DNA</span>
        <span>
          Nature Biotech · Science Advances · Leonardo (MIT Press)
        </span>
        <span>© Henry Tan &amp; Carmen Koessler 2026</span>
      </div>
    </footer>
  );
}
