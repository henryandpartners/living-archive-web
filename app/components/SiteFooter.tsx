import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative z-[3] bg-[#04263d] text-center text-[#7fa0bd] text-[13px] py-[46px] px-6 leading-[1.9]">
      <p>
        <b className="text-white font-semibold font-serif">Living Archive</b>{" "}
        · Henry Tan &amp; Carmen Koessler · NYUAD CGSB
      </p>
      <p className="mt-1">
        <Link href="/pipeline" className="text-[#bfe0f7] hover:text-white">
          Pipeline
        </Link>{" "}
        ·{" "}
        <Link href="/publications" className="text-[#bfe0f7] hover:text-white">
          Publications
        </Link>{" "}
        ·{" "}
        <Link href="/" className="text-[#bfe0f7] hover:text-white">
          Story
        </Link>
      </p>
      <p className="mt-3 text-[11px] text-[#5a7d94]">
        Artist-in-Residence 2024–2025 · Center for Genomics and Systems Biology
      </p>
    </footer>
  );
}
