export interface CalloutProps {
  children: React.ReactNode;
}

export function Callout({ children }: CalloutProps) {
  return (
    <aside
      role="note"
      className="bg-accent-soft border-l-3 border-accent rounded-lg py-5 px-6 my-8 text-[16px] leading-[1.7] text-text-dim shadow-sm"
    >
      {children}
    </aside>
  );
}
