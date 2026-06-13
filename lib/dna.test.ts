import { describe, it, expect } from 'vitest';
import {
  asciiToBinary, binaryToAscii, binaryToDna, dnaToBinary,
  findStopCodons, fixStopCodons, encodeSurfaceCode,
  encode, decode,
} from './dna';

describe('basic ASCII <-> binary conversions', () => {
  it('encodes "A" to 01000001', () => {
    expect(asciiToBinary('A')).toBe('01000001');
  });

  it('roundtrips ASCII through binary', () => {
    expect(binaryToAscii(asciiToBinary('Hello'))).toBe('Hello');
  });
});

describe('binary <-> DNA mapping', () => {
  it('uses 00->A 01->C 10->G 11->T', () => {
    expect(binaryToDna('00011011')).toBe('ACGT');
  });

  it('roundtrips binary through DNA', () => {
    const b = '0100100001100101';
    expect(dnaToBinary(binaryToDna(b))).toBe(b);
  });
});

describe('stop codon screening', () => {
  it('returns empty array when no stop codons present', () => {
    expect(findStopCodons('ACGCAC')).toEqual([]);
  });

  it('finds TAA at frame 0 position 0', () => {
    const stops = findStopCodons('TAAACG');
    expect(stops).toContainEqual({ p: 0, codon: 'TAA', frame: 0 });
  });

  it('finds TAG at frame 1', () => {
    const stops = findStopCodons('ATAGCC');
    expect(stops.some((s) => s.codon === 'TAG' && s.frame === 1)).toBe(true);
  });

  it('fixes TAA -> TAC and TAG/TGA -> TGG', () => {
    expect(fixStopCodons('TAAACG')).toBe('TACACG');
    expect(fixStopCodons('TAGACG')).toBe('TGGACG');
    expect(fixStopCodons('TGAACG')).toBe('TGGACG');
  });

  it('is idempotent — fixed DNA has no stop codons in fixed regions', () => {
    const fixed = fixStopCodons('TAATAGCTGA');
    for (let i = 0; i < fixed.length - 2; i += 3) {
      expect(['TAA', 'TAG', 'TGA']).not.toContain(fixed.slice(i, i + 3));
    }
  });
});

describe('surface code', () => {
  it('produces 1 block of d*d data + 4d parity for short input at d=3', () => {
    const blocks = encodeSurfaceCode('ACGTACGTA', 3);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].data).toHaveLength(9);
    expect(blocks[0].parity).toHaveLength(12);
    expect(blocks[0].full).toHaveLength(21);
  });

  it('pads the final block with A to fill d*d data', () => {
    const blocks = encodeSurfaceCode('ACG', 3);
    expect(blocks[0].data).toBe('ACGAAAAAA');
  });
});

describe('encode() full pipeline', () => {
  it('produces matching ascii, binary, rawDna, fixedDna, blocks', () => {
    const r = encode('Hi!', 3);
    expect(r.ascii).toBe('Hi!');
    expect(r.binary).toBe(asciiToBinary('Hi!'));
    expect(r.rawDna).toBe(binaryToDna(r.binary));
    expect(r.fixedDna).toBe(fixStopCodons(r.rawDna));
    expect(r.fixedStopCodons).toEqual([]);
    expect(r.blocks.length).toBeGreaterThan(0);
    expect(r.storedDna).toBe(r.blocks.map((b) => b.full).join(''));
  });

  it('handles d=0 (no QEC) by producing a single block with empty parity', () => {
    const r = encode('Hi', 0);
    expect(r.blocks).toHaveLength(1);
    expect(r.blocks[0].parity).toBe('');
    expect(r.blocks[0].data).toBe(r.fixedDna);
    expect(r.storedDna).toBe(r.fixedDna);
  });
});

describe('decode() roundtrip', () => {
  it.each([0, 3, 5, 7])('decodes back to the original text at d=%i', (d) => {
    const text = 'Living archives are not neutral.';
    const result = encode(text, d);
    const decoded = decode(result.storedDna, d);
    expect(decoded.text).toBe(text);
    expect(decoded.warnings).toEqual([]);
  });

  it('emits a warning for non-ACGT input', () => {
    const r = decode('ACGTNNN', 0);
    expect(r.warnings.length).toBeGreaterThan(0);
  });
});

describe('encode warning behavior', () => {
  it('warns about non-ASCII characters but proceeds', () => {
    const r = encode('café', 0);
    expect(r.warnings).toBeDefined();
    expect(r.warnings.length).toBeGreaterThan(0);
  });
});
