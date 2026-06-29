'use client';

import { useState } from 'react';

const B2B: Record<string, string> = { '00': 'A', '01': 'C', '10': 'G', '11': 'T' };
const B2Binv: Record<string, string> = { 'A': '00', 'C': '01', 'G': '10', 'T': '11' };
const STOP = ['TAA', 'TAG', 'TGA'];

function a2b(t: string) { return t.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(''); }
function b2a(b: string) { b = b.slice(0, b.length - b.length % 8); return (b.match(/.{8}/g) || []).map(x => String.fromCharCode(parseInt(x, 2))).join(''); }
function b2d(b: string) { if (b.length % 2) b += '0'; let r = ''; for (let i = 0; i < b.length; i += 2) r += B2B[b[i] + b[i + 1]] || 'A'; return r; }
function d2b(d: string) { let r = ''; for (let i = 0; i < d.length; i++) r += B2Binv[d[i]] || '00'; return r; }

function findStops(dna: string) {
  let r: { p: number; c: string; fr: number }[] = [];
  for (let f = 0; f < 3; f++) for (let i = f; i < dna.length - 2; i += 3) {
    let c = dna.slice(i, i + 3); if (STOP.includes(c)) r.push({ p: i, c, fr: f });
  }
  return r;
}

function fixStops(dna: string) {
  const rep: Record<string, string> = { 'TAA': 'TAC', 'TAG': 'TGG', 'TGA': 'TGG' };
  let a = dna.split('');
  for (let f = 0; f < 3; f++) for (let i = f; i < a.length - 1; i += 3) {
    let c = a.slice(i, i + 3).join(''); if (rep[c]) { let n = rep[c]; a[i] = n[0]; a[i + 1] = n[1]; a[i + 2] = n[2]; }
  }
  return a.join('');
}

class SC {
  d: number; nD: number; nS: number; nT: number;
  constructor(d: number) { this.d = d; this.nD = d * d; this.nS = 4 * d; this.nT = this.nD + this.nS; }
  enc(dna: string) {
    let ss: { data: string; parity: string; full: string }[] = [];
    for (let s = 0; s < dna.length; s += this.nD) {
      let b = dna.slice(s, s + this.nD); while (b.length < this.nD) b += 'A';
      let p = this._p(b); ss.push({ data: b, parity: p, full: b + p });
    }
    return ss;
  }
  _p(data: string) {
    let d = this.d, g: string[] = [], r = '';
    for (let i = 0; i < d; i++) g.push(data.slice(i * d, i * d + d));
    for (let b = 0; b < 2; b++) {
      for (let i = 0; i < d; i++) { let x = 0; for (let j = 0; j < d; j++) x ^= parseInt((B2Binv[g[i][j]] || '00')[b]); r += x ? 'C' : 'A'; }
      for (let j = 0; j < d; j++) { let x = 0; for (let i = 0; i < d; i++) x ^= parseInt((B2Binv[g[i][j]] || '00')[b]); r += x ? 'C' : 'A'; }
    }
    return r;
  }
}

export default function PipelinePage() {
  const [tab, setTab] = useState<'enc' | 'dec'>('enc');
  const [encIn, setEncIn] = useState('Hello DNA World! This is a test.');
  const [encQd, setEncQd] = useState(3);
  const [decIn, setDecIn] = useState('');
  const [decQd, setDecQd] = useState(3);
  const [encOut, setEncOut] = useState('');
  const [decOut, setDecOut] = useState('');

  const runEnc = () => {
    if (!encIn) return;
    let bin = a2b(encIn), dna = b2d(bin);
    let sc = encQd > 0 ? new SC(encQd) : null;
    let stops = findStops(dna);
    let fixedDNA = fixStops(dna);

    let h = '';
    h += `<h3>Step 1: ASCII → Binary → DNA</h3>`;
    h += `<p>Input: ${encIn}</p>`;
    h += `<p>Binary (${bin.length} bits): ${bin.length < 200 ? bin : bin.slice(0, 200) + '...'}</p>`;
    h += `<p>Raw DNA (${dna.length} nt): ${dna}</p>`;
    
    h += `<h3>Step 2: Stop Codon Check & Fix</h3>`;
    if (stops.length) {
      h += `<p>⚠ ${stops.length} stop codon(s) found and fixed.</p>`;
    } else {
      h += `<p>✓ No stop codons found</p>`;
    }
    h += `<p>Clean DNA (${fixedDNA.length} nt): ${fixedDNA}</p>`;

    if (encQd > 0) {
      let fixedBlocks = new SC(encQd).enc(fixedDNA);
      h += `<h3>Step 3: QEC (Surface Code d=${encQd})</h3>`;
      h += `<p>Blocks: ${fixedBlocks.length}, Data per block: ${sc!.nD} nt, Parity per block: ${sc!.nS} nt, Overhead: ${(sc!.nT / sc!.nD).toFixed(1)}×</p>`;
    }

    h += `<h3>Final DNA Sequence</h3>`;
    h += `<p>${fixedDNA}</p>`;

    setEncOut(h);
  };

  const runDec = () => {
    let raw = decIn.trim().toUpperCase();
    if (!raw) return;
    let allDNA = raw.replace(/\s/g, '');
    let bin = d2b(allDNA);
    let ascii = b2a(bin);

    let h = '';
    h += `<h3>Input</h3><p>${allDNA.length} nt</p>`;
    h += `<h3>DNA → Binary</h3><p>${bin.length} bits: ${bin.slice(0, 240)}${bin.length > 240 ? '...' : ''}</p>`;
    h += `<h3>Binary → ASCII</h3><p>${ascii || '(empty)'}</p>`;
    h += `<h3>Result</h3><pre>${ascii || '(empty)'}</pre>`;

    setDecOut(h);
  };

  return (
    <>
      <h1>DNA Storage Pipeline</h1>
      <p>ASCII → Binary → DNA → QEC → Stop Codon Fix / Decode</p>

      <p>
        <button onClick={() => setTab('enc')}>Encode</button>
        {' '}
        <button onClick={() => setTab('dec')}>Decode</button>
      </p>

      {tab === 'enc' ? (
        <div>
          <h3>Input ASCII Text</h3>
          <textarea
            value={encIn}
            onChange={e => setEncIn(e.target.value)}
            rows={5}
            style={{ width: '100%', fontFamily: 'monospace' }}
          />
          <p>
            <button onClick={runEnc}>Encode</button>
            {' '}
            <select value={encQd} onChange={e => setEncQd(parseInt(e.target.value))}>
              <option value={0}>No QEC</option>
              <option value={3}>Surface Code d=3</option>
              <option value={5}>Surface Code d=5</option>
              <option value={7}>Surface Code d=7</option>
            </select>
          </p>
          <div dangerouslySetInnerHTML={{ __html: encOut }} />
        </div>
      ) : (
        <div>
          <h3>Paste DNA to Decode</h3>
          <textarea
            value={decIn}
            onChange={e => setDecIn(e.target.value)}
            placeholder="Paste encoded DNA..."
            rows={5}
            style={{ width: '100%', fontFamily: 'monospace' }}
          />
          <p>
            <button onClick={runDec}>Decode</button>
            {' '}
            <select value={decQd} onChange={e => setDecQd(parseInt(e.target.value))}>
              <option value={0}>No QEC</option>
              <option value={3}>Surface Code d=3</option>
              <option value={5}>Surface Code d=5</option>
              <option value={7}>Surface Code d=7</option>
            </select>
          </p>
          <div dangerouslySetInnerHTML={{ __html: decOut }} />
        </div>
      )}
    </>
  );
}
