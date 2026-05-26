export interface ChapterProps {
  number: number;
  title: string;
  id: string;
  children: React.ReactNode;
}

export function Chapter({ number, title, id, children }: ChapterProps) {
  const padded = String(number).padStart(2, '0');
  return (
    <section id={id} className="py-20 md:py-28 border-t border-border-soft scroll-mt-24">
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent mb-4">
        Chapter {padded}
      </p>
      <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.02em] mb-8 leading-[1.1] text-text">
        {title}
      </h2>
      <div className="text-[17px] leading-[1.78] text-text-dim space-y-5 [&_strong]:text-text [&_strong]:font-semibold">
        {children}
      </div>
    </section>
  );
}
