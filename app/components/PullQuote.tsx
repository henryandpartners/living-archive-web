export interface PullQuoteProps {
  children: React.ReactNode;
  citation?: string;
}

export function PullQuote({ children, citation }: PullQuoteProps) {
  return (
    <blockquote className="border-l-2 border-accent pl-6 my-10 text-[22px] leading-[1.5] italic text-text-dim">
      <p className="m-0">{children}</p>
      {citation && (
        <cite className="block not-italic mt-3 font-mono text-[10px] tracking-[0.15em] uppercase text-text-faint">
          — {citation}
        </cite>
      )}
    </blockquote>
  );
}
