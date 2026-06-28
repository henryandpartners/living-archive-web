export interface PullQuoteProps {
  children: React.ReactNode;
  citation?: string;
}

export function PullQuote({ children, citation }: PullQuoteProps) {
  return (
    <blockquote className="border-l-3 border-coral pl-6 my-10 text-[22px] leading-[1.5] italic text-text-dim font-serif bg-coral-soft/50 py-4 pr-5 rounded-r-lg">
      <p className="m-0">&ldquo;{children}&rdquo;</p>
      {citation && (
        <cite className="block not-italic mt-3 font-sans text-[13px] tracking-[0.02em] text-text-faint">
          — {citation}
        </cite>
      )}
    </blockquote>
  );
}
