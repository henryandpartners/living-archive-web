export interface SurfaceCodeGridProps {
  d: 3 | 5 | 7;
  data?: string;
}

export function SurfaceCodeGrid({ d, data }: SurfaceCodeGridProps) {
  const size = 2 * d - 1;
  const cells: { kind: 'data' | 'parityX' | 'parityZ'; ch?: string }[] = [];
  let dataIdx = 0;
  const padded = (data ?? '').padEnd(d * d, 'A');

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (r % 2 === 0 && c % 2 === 0) {
        cells.push({ kind: 'data', ch: padded[dataIdx++] ?? 'A' });
      } else if (r % 2 === 0 && c % 2 === 1) {
        cells.push({ kind: 'parityX' });
      } else if (r % 2 === 1 && c % 2 === 0) {
        cells.push({ kind: 'parityZ' });
      } else {
        cells.push({ kind: 'parityZ' });
      }
    }
  }

  return (
    <div
      className="inline-grid gap-1 font-mono text-[10px] font-semibold"
      style={{ gridTemplateColumns: `repeat(${size}, 28px)` }}
      aria-label={`Surface code d=${d}`}
    >
      {cells.map((cell, i) => {
        if (cell.kind === 'data') {
          return (
            <span
              key={i}
              className="w-7 h-7 grid place-items-center rounded-sm bg-accent-soft border border-accent text-accent"
            >
              {cell.ch}
            </span>
          );
        }
        const label = cell.kind === 'parityX' ? 'X' : 'Z';
        return (
          <span
            key={i}
            className="w-7 h-7 grid place-items-center rounded-sm bg-border-soft border border-border text-text-faint"
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
