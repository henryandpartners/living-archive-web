export interface CalloutProps {
  children: React.ReactNode;
}

export function Callout({ children }: CalloutProps) {
  return (
    <aside
      role="note"
      className="bg-bg-elev border-l-2 border-accent rounded-r-md py-5 px-6 my-8 text-[16px] leading-[1.7] text-text-dim"
    >
      {children}
    </aside>
  );
}
