export interface DnaSequenceProps {
  sequence: string;
  maxLength?: number;
}

export function DnaSequence({ sequence, maxLength }: DnaSequenceProps) {
  const truncated = maxLength != null && sequence.length > maxLength;
  const shown = truncated ? sequence.slice(0, maxLength) : sequence;
  return (
    <span className="font-mono text-[14px] leading-[2] tracking-[0.06em] break-all">
      {shown.split('').map((c, i) => (
        <span key={i} className={`base-${c}`}>{c}</span>
      ))}
      {truncated && '…'}
    </span>
  );
}
