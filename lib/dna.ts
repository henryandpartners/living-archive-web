export type Nucleotide = 'A' | 'C' | 'G' | 'T';
export interface StopCodon { p: number; codon: string; frame: number; }
export interface SurfaceBlock { data: string; parity: string; full: string; }

export interface EncodeResult {
  ascii: string;
  binary: string;
  rawDna: string;
  stopCodons: StopCodon[];
  fixedDna: string;
  fixedStopCodons: StopCodon[];
  blocks: SurfaceBlock[];
  storedDna: string;
  totalLength: number;
  warnings: string[];
}

export interface DecodeResult { text: string; warnings: string[]; }

const B2B: Record<string, string> = { '00': 'A', '01': 'C', '10': 'G', '11': 'T' };
const B2Binv: Record<string, string> = { A: '00', C: '01', G: '10', T: '11' };
const STOP_CODONS = ['TAA', 'TAG', 'TGA'] as const;
const STOP_FIX: Record<string, string> = { TAA: 'TAC', TAG: 'TGG', TGA: 'TGG' };

export function asciiToBinary(text: string): string {
  return text
    .split('')
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

export function binaryToAscii(bin: string): string {
  const trimmed = bin.slice(0, bin.length - (bin.length % 8));
  return (trimmed.match(/.{8}/g) ?? [])
    .map((b) => String.fromCharCode(parseInt(b, 2)))
    .join('');
}

export function binaryToDna(bin: string): string {
  let b = bin;
  if (b.length % 2) b += '0';
  let out = '';
  for (let i = 0; i < b.length; i += 2) out += B2B[b[i] + b[i + 1]] ?? 'A';
  return out;
}

export function dnaToBinary(dna: string): string {
  let out = '';
  for (const c of dna) out += B2Binv[c] ?? '00';
  return out;
}

export function findStopCodons(dna: string): StopCodon[] {
  const out: StopCodon[] = [];
  for (let f = 0; f < 3; f++) {
    for (let i = f; i <= dna.length - 3; i += 3) {
      const codon = dna.slice(i, i + 3);
      if ((STOP_CODONS as readonly string[]).includes(codon)) out.push({ p: i, codon, frame: f });
    }
  }
  return out;
}

export function fixStopCodons(dna: string): string {
  const arr = dna.split('');
  for (let i = 0; i <= arr.length - 3; i += 3) {
    const codon = arr.slice(i, i + 3).join('');
    const rep = STOP_FIX[codon];
    if (rep) [arr[i], arr[i + 1], arr[i + 2]] = [rep[0], rep[1], rep[2]];
  }
  return arr.join('');
}

export function encodeSurfaceCode(dna: string, d: number): SurfaceBlock[] {
  if (d < 1) return [{ data: dna, parity: '', full: dna }];
  const nData = d * d;
  const out: SurfaceBlock[] = [];
  for (let start = 0; start < dna.length; start += nData) {
    let block = dna.slice(start, start + nData);
    while (block.length < nData) block += 'A';
    out.push({ data: block, parity: parityFor(block, d), full: block + parityFor(block, d) });
  }
  if (out.length === 0) {
    const padded = 'A'.repeat(nData);
    out.push({ data: padded, parity: parityFor(padded, d), full: padded + parityFor(padded, d) });
  }
  return out;
}

function parityFor(data: string, d: number): string {
  const rows: string[] = [];
  for (let i = 0; i < d; i++) rows.push(data.slice(i * d, (i + 1) * d));
  let out = '';
  for (let bit = 0; bit < 2; bit++) {
    for (let i = 0; i < d; i++) {
      let x = 0;
      for (let j = 0; j < d; j++) x ^= parseInt((B2Binv[rows[i][j]] ?? '00')[bit]);
      out += x ? 'C' : 'A';
    }
    for (let j = 0; j < d; j++) {
      let x = 0;
      for (let i = 0; i < d; i++) x ^= parseInt((B2Binv[rows[i][j]] ?? '00')[bit]);
      out += x ? 'C' : 'A';
    }
  }
  return out;
}

export function encode(text: string, d: number): EncodeResult {
  const warnings: string[] = [];
  const asciiClean = text
    .split('')
    .filter((c) => {
      const code = c.charCodeAt(0);
      return code >= 0x20 && code <= 0x7e;
    })
    .join('');
  if (asciiClean.length !== text.length) {
    warnings.push(
      `Skipped ${text.length - asciiClean.length} non-ASCII character(s). Living Archive's prototype encodes printable ASCII only.`
    );
  }

  const binary = asciiToBinary(asciiClean);
  const rawDna = binaryToDna(binary);
  const stopCodons = findStopCodons(rawDna);
  const fixedDna = fixStopCodons(rawDna);
  const fixedStopCodons = findStopCodons(fixedDna).filter((c) => c.frame === 0);
  const blocks = d > 0 ? encodeSurfaceCode(rawDna, d) : [{ data: rawDna, parity: '', full: rawDna }];
  const storedDna = blocks.map((b) => b.full).join('');

  return {
    ascii: asciiClean,
    binary,
    rawDna,
    stopCodons,
    fixedDna,
    fixedStopCodons,
    blocks,
    storedDna,
    totalLength: storedDna.length,
    warnings,
  };
}

export function decode(stored: string, d: number): DecodeResult {
  const warnings: string[] = [];
  const cleaned = stored
    .toUpperCase()
    .split('')
    .filter((c) => c === 'A' || c === 'C' || c === 'G' || c === 'T')
    .join('');
  if (cleaned.length !== stored.replace(/\s/g, '').length) {
    warnings.push(
      `Ignored ${stored.replace(/\s/g, '').length - cleaned.length} non-ACGT character(s) in input.`
    );
  }

  let dataDna = cleaned;
  if (d > 0) {
    const nData = d * d;
    const nParity = 4 * d;
    const blockLen = nData + nParity;
    const blocks: string[] = [];
    for (let i = 0; i + blockLen <= cleaned.length; i += blockLen) {
      blocks.push(cleaned.slice(i, i + nData));
    }
    const remainder = cleaned.length % blockLen;
    if (remainder > 0 && remainder <= nData) {
      const start = cleaned.length - remainder;
      blocks.push(cleaned.slice(start, start + Math.min(remainder, nData)));
    }
    dataDna = blocks.join('');
  }

  const binary = dnaToBinary(dataDna);
  const text = binaryToAscii(binary);
  return { text: stripTrailingPadding(text), warnings };
}

function stripTrailingPadding(text: string): string {
  return text.replace(/\x00+$/, '');
}
