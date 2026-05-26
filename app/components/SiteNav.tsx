import Link from 'next/link';

const LINKS = [
  { label: 'Story', href: '/', match: (p: string) => p === '/' },
  { label: 'Pipeline', href: '/pipeline', match: (p: string) => p.startsWith('/pipeline') },
  { label: 'Publications', href: '/publications', match: (p: string) => p.startsWith('/publications') },
];

export interface SiteNavProps {
  pathname: string;
  children?: React.ReactNode;
}

export function SiteNav({ pathname, children }: SiteNavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-elev-2/90 backdrop-blur-sm border-b border-border-soft">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-[15px] font-bold tracking-tight text-text">
          Living Archive
        </Link>
        <div className="flex gap-7 font-mono text-[10px] tracking-[0.18em] uppercase text-text-dim">
          {LINKS.map((l) => {
            const active = l.match(pathname);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={
                  'pb-0.5 transition-colors ' +
                  (active
                    ? 'text-text border-b border-accent'
                    : 'hover:text-text')
                }
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
      {children}
    </nav>
  );
}
