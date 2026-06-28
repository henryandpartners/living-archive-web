export interface StepProps {
  number: number;
  title: string;
  meta?: string;
  children: React.ReactNode;
}

export function Step({ number, title, meta, children }: StepProps) {
  return (
    <section className="bg-bg-elev border border-border-soft rounded-lg p-7 mb-4">
      <header className="flex items-center gap-3.5 mb-4">
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent w-10">
          {String(number).padStart(2, '0')}
        </span>
        <h3 className="text-xl font-semibold tracking-[-0.01em] text-text">{title}</h3>
        {meta && (
          <span className="ml-auto font-mono text-[10px] tracking-[0.12em] uppercase text-text-faint">
            {meta}
          </span>
        )}
      </header>
      <div>{children}</div>
    </section>
  );
}
