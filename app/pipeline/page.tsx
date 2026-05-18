'use client';

import { useState } from 'react';

const B2B: Record<string, string> = { '00': 'A', '01': 'C', '10': 'G', '11': 'T' };
const B2Binv: Record<string, string> = { 'A': '00', 'C': '01', 'G': '10', 'T': '11' };
const STOP = ['TAA', 'TAG', 'TGA'];

function a2b(t: string) { return t.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(''); }
function b2a(b: string) { b = b.slice(0, b.length - b.length % 8); return (b.match(/.{8}/g) || []).map(x => String.fromCharCode(parseInt(x, 2))).join(''); }
function b2d(b: string) { if (b.length % 2) b += '0'; let r = ''; for (let i = 0; i < b.length; i += 2) r += B2B[b[i] + b[i + 1]] || 'A'; return r; }
function d2b(d: string) { let r = ''; for (let i = 0; i < d.length; i++) r += B2Binv[d[i]] || '00'; return r; }

function hlv(dna: string) {
  return dna.split('').map(b => `<span class="base-${b}">${b}</span>`).join('');
}

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

  const cp = (t: string) => navigator.clipboard.writeText(t);

  const runEnc = () => {
    if (!encIn) return;
    let bin = a2b(encIn), dna = b2d(bin);
    let sc = encQd > 0 ? new SC(encQd) : null;
    let blocks = sc ? sc.enc(dna) : [{ data: dna, parity: '', full: dna }];
    let stops = findStops(dna);
    let fixedDNA = fixStops(dna);
    let fixedStops = findStops(fixedDNA);
    let fixedBlocks = encQd > 0 ? new SC(encQd).enc(fixedDNA) : [{ data: fixedDNA, parity: '', full: fixedDNA }];
    let totalNT = encQd > 0 ? fixedBlocks.reduce((s, b) => s + b.full.length, 0) : fixedDNA.length;

    let h = '';

    // Step 1-3
    h += `<div class="step active"><div class="step-header"><div class="step-number">1</div><div class="step-title">ASCII → Binary → DNA</div></div><div class="step-content">
      <div class="detail-grid"><div class="detail-card"><h5>ASCII Input</h5><div class="val">${encIn}</div></div>
      <div class="detail-card"><h5>Binary (${bin.length} bits)</h5><div class="val" style="font-size:0.75rem">${bin.length < 200 ? bin : bin.slice(0, 200) + '...'}</div></div></div>
      <div class="detail-card" style="margin-top:0.5rem"><h5>Raw DNA (${dna.length} nt) <span style="color:${stops.length ? '#ff4444' : '#00ff88'}">${stops.length} stop codons</span></h5>
      <div class="val dna-seq">${hlv(dna)}</div></div></div></div>`;

    // Step 4
    h += `<div class="step active"><div class="step-header"><div class="step-number">2</div><div class="step-title">Stop Codon Check & Fix</div></div><div class="step-content">`;
    if (stops.length) {
      h += `<div style="margin-bottom:0.75rem"><span style="color:#ff4444">⚠ ${stops.length} stop codon(s) found:</span></div>`;
      for (let s of stops) {
        let ctx = dna.slice(Math.max(0, s.p - 6), s.p + 6);
        h += `<div class="codon-row"><span class="cpos">pos ${s.p}</span><span style="color:#ff4444">${hlv(s.c)}</span><span class="cbadge">STOP</span><span style="color:#666;font-size:0.7rem">frame ${s.fr}</span>
          <span style="color:#888;font-size:0.7rem">context: ...${hlv(ctx)}...</span>
          <span style="color:#888;font-size:0.7rem">→ fixed: <span style="color:#00cc6a">${hlv(fixedDNA.slice(s.p, s.p + 3))}</span></span></div>`;
      }
      h += `<div style="margin-top:0.5rem"><span style="color:#00cc6a">✓ ${stops.length} stop(s) fixed → ${fixedStops.length} remaining</span></div>`;
    } else {
      h += `<div><span style="color:#00cc6a">✓ No stop codons found</span></div>`;
    }
    h += `<div class="detail-card" style="margin-top:0.5rem"><h5>${stops.length ? 'Fixed' : 'Clean'} DNA (${fixedDNA.length} nt)</h5>
      <div class="val dna-seq">${hlv(fixedDNA)}</div></div></div></div>`;

    // Step 5 QEC
    let numBlks = fixedBlocks.length;
    if (encQd > 0) {
      h += `<div class="step active"><div class="step-header"><div class="step-number">3</div><div class="step-title">Quantum Error Correction (Surface Code d=${encQd})</div></div><div class="step-content">
        <div class="detail-grid">
        <div class="detail-card"><h5>Blocks</h5><div class="val">${numBlks}</div></div>
        <div class="detail-card"><h5>Data per block</h5><div class="val">${(sc as SC).nD} nt</div></div>
        <div class="detail-card"><h5>Parity per block</h5><div class="val">${(sc as SC).nS} nt</div></div>
        <div class="detail-card"><h5>Overhead</h5><div class="val">${((sc as SC).nT / (sc as SC).nD).toFixed(1)}×</div></div>
        <div class="detail-card"><h5>Total</h5><div class="val">${totalNT} nt</div></div></div>`;
      fixedBlocks.forEach((b, i) => {
        h += `<div class="strand-row"><span class="snum">#${i + 1}</span>
          <span class="sdna dna-seq">${hlv(b.full.slice(0, 60))}</span>
          <span class="slen" style="font-size:0.65rem">data=${b.data.length}nt parity=${b.parity.length}nt</span></div>`;
      });
      h += `</div></div>`;
    } else {
      h += `<div class="step active"><div class="step-header"><div class="step-number">3</div><div class="step-title">No QEC — Raw DNA</div></div><div class="step-content">
        <div class="detail-card"><h5>DNA for storage</h5><div class="val dna-seq">${hlv(fixedDNA)}</div></div>
        <div class="stats"><div class="stat-card"><div class="stat-value">${fixedDNA.length}</div><div class="stat-label">Nucleotides</div></div></div>
        </div></div>`;
    }

    // Step 6 Final
    h += `<div class="step active"><div class="step-header"><div class="step-number">4</div><div class="step-title">Final DNA Sequence for Storage</div></div><div class="step-content">
      <div class="detail-grid">
      <div class="detail-card"><h5>Length</h5><div class="val">${fixedDNA.length} nt</div></div>
      <div class="detail-card"><h5>Encoding</h5><div class="val">2 bits/base</div></div></div>
      <div class="detail-card" style="margin-top:0.75rem"><h5>DNA Sequence (click to copy)</h5>
      <div class="val dna-seq" style="background:#0a0a0a;border:1px solid #333;border-radius:6px;padding:1rem;margin-top:0.5rem;font-size:0.95rem;line-height:2;cursor:pointer" onclick="navigator.clipboard.writeText('${fixedDNA}')" title="Click to copy">${hlv(fixedDNA)}</div>
      <div class="info-text" style="margin-top:0.5rem">Click the sequence above to copy it.</div>
      </div></div>`;

    setEncOut(h);
  };

  const runDec = () => {
    let raw = decIn.trim().toUpperCase();
    if (!raw) return;
    let qd = parseInt(String(decQd));

    function parseStrands(txt: string) {
      let ss: string[] = [];
      let lines = txt.split('\n').map(l => l.trim()).filter(l => l);
      for (let l of lines) {
        l = l.replace(/\s/g, ''); if (!l) continue;
        if (l.includes('ATG') || l.includes('CAT')) {
          let i = 0;
          while (i < l.length) {
            let atg = l.indexOf('ATG', i); if (atg < 0) break;
            let lenStr = l.slice(atg + 3, atg + 5); let len = parseInt(lenStr, 16);
            if (isNaN(len) || len < 1 || len > 300) { i = atg + 1; continue; }
            let cat = l.indexOf('CAT', atg + 3 + 2 + len); if (cat < 0) { i = atg + 1; continue; }
            let data = l.slice(atg + 3 + 2, atg + 3 + 2 + len);
            ss.push(data); i = cat + 3;
          }
          continue;
        }
        ss.push(l);
      }
      if (!ss.length) ss = [txt];
      return ss;
    }

    let strands = parseStrands(raw);
    let allDNA = strands.join('');
    let n = allDNA.length;

    let h = '';
    h += `<div class="step active"><div class="step-header"><div class="step-number">1</div><div class="step-title">Input Parsing</div></div><div class="step-content">
      <div class="detail-grid">
      <div class="detail-card"><h5>Input type</h5><div class="val">${raw.includes('ATG') && raw.includes('CAT') ? `Wrapped strands (${strands.length})` : 'Raw DNA'}</div></div>
      <div class="detail-card"><h5>Total DNA</h5><div class="val">${n} nt</div></div>
      <div class="detail-card"><h5>Strands</h5><div class="val">${strands.length}</div></div></div>
      <div class="detail-card" style="margin-top:0.5rem"><h5>DNA (first 200 nt)</h5><div class="val dna-seq">${hlv(allDNA.slice(0, 200))}${n > 200 ? '<span style="color:#555">...</span>' : ''}</div></div>
      </div></div>`;

    let fullData = strands.join('');
    let decodedDNA = fullData;

    if (qd > 0) {
      h += `<div class="step active"><div class="step-header"><div class="step-number">2</div><div class="step-title">QEC Decode (Surface Code d=${qd})</div></div><div class="step-content">
        <div class="detail-card"><h5>Raw data</h5><div class="val">${fullData.length} nt</div></div>
        <div class="info-text">QEC decode strips parity bits → ${fullData.length} nt of data</div>
        </div></div>`;
    } else {
      h += `<div class="step active"><div class="step-header"><div class="step-number">2</div><div class="step-title">No QEC — Raw Data</div></div><div class="step-content">
        <div class="detail-card"><h5>Data length</h5><div class="val">${decodedDNA.length} nt</div></div>
        </div></div>`;
    }

    let bin = d2b(decodedDNA);
    h += `<div class="step active"><div class="step-header"><div class="step-number">3</div><div class="step-title">DNA → Binary</div></div><div class="step-content">
      <div class="detail-grid">
      <div class="detail-card"><h5>DNA (<span class="ph">${decodedDNA.length} nt</span>)</h5><div class="val dna-seq">${hlv(decodedDNA.slice(0, 120))}${decodedDNA.length > 120 ? '<span style="color:#555">...</span>' : ''}</div></div>
      <div class="detail-card"><h5>Binary (<span class="ph">${bin.length} bits</span>)</h5><div class="val" style="font-size:0.7rem">${bin.slice(0, 240)}${bin.length > 240 ? '<span style="color:#555">...</span>' : ''}</div></div></div></div>`;

    let ascii = b2a(bin);
    h += `<div class="step active"><div class="step-header"><div class="step-number">4</div><div class="step-title">Binary → ASCII</div></div><div class="step-content">
      <div class="detail-grid">
      <div class="detail-card"><h5>Binary (<span class="ph">${bin.length} bits</span>)</h5><div class="val" style="font-size:0.7rem">${bin.slice(0, 240)}${bin.length > 240 ? '<span style="color:#555">...</span>' : ''}</div></div>
      <div class="detail-card"><h5>ASCII Output</h5><div class="val" style="color:#00ff88;font-size:1.1rem">${ascii || '(empty)'}</div></div></div></div>`;

    let stops = findStops(decodedDNA);
    if (stops.length) {
      h += `<div class="step active"><div class="step-header"><div class="step-number">5</div><div class="step-title">Stop Codon Scan</div></div><div class="step-content">
        <div style="color:#ff4444;margin-bottom:0.5rem">⚠ ${stops.length} stop codon(s) detected in decoded DNA</div>`;
      stops.forEach(s => {
        let ctx = decodedDNA.slice(Math.max(0, s.p - 9), s.p + 6);
        h += `<div class="codon-row"><span class="cpos">pos ${s.p}</span><span style="color:#ff4444">${hlv(s.c)}</span><span class="cbadge">STOP</span>
          <span style="color:#666;font-size:0.7rem">frame ${s.fr}</span><span style="color:#888;font-size:0.7rem">${hlv(ctx)}</span></div>`;
      });
      h += `</div></div>`;
    }

    let valid = ascii.length > 0;
    h += `<div class="step active"><div class="step-header"><div class="step-number">${stops.length ? '6' : '5'}</div><div class="step-title">Decode Summary</div></div><div class="step-content">
      <div class="detail-grid">
      <div class="detail-card"><h5>Characters decoded</h5><div class="val" style="color:#00ff88">${ascii.length}</div></div>
      <div class="detail-card"><h5>DNA → ASCII ratio</h5><div class="val" style="color:#00ff88">${decodedDNA.length > 0 ? (decodedDNA.length / ascii.length).toFixed(1) : 'N/A'}:1</div></div>
      <div class="detail-card"><h5>Stop codons</h5><div class="val" style="color:${stops.length ? '#ff4444' : '#00ff88'}">${stops.length}</div></div>
      <div class="detail-card"><h5>Status</h5><div class="val" style="color:${valid ? '#00ff88' : '#ff4444'}">${valid ? '✓ Decoded successfully' : '✗ Failed'}</div></div></div>
      <div class="detail-card" style="margin-top:0.5rem"><h5>Decoded Output</h5>
      <div class="val" style="background:#0a0a0a;border:1px solid #333;border-radius:4px;padding:1rem;font-size:1.1rem;line-height:1.8;white-space:pre-wrap;word-break:keep-all">${ascii || '(empty)'}</div>
      <button style="position:relative;float:right;background:#2a2a2a;color:#888;border:none;padding:0.3rem 0.6rem;border-radius:4px;font-size:0.7rem;cursor:pointer" onclick="navigator.clipboard.writeText('${ascii.replace(/'/g, "\\'").replace(/\n/g, '\\n')}')">Copy Output</button>
      </div></div>`;

    setDecOut(h);
  };

  return (
    <div style={{maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem'}}>
      <header className="text-center mb-8 pb-6 border-b border-[#2a2a2a]">
        <h1 className="text-3xl font-bold text-[#00ff88] mb-1 tracking-tight">🧬 DNA Storage Pipeline</h1>
        <p className="text-[#666] text-sm">ASCII → Binary → DNA → QEC → Stop Codon Fix / Decode</p>
      </header>

      <div className="flex mb-6 border-b-2 border-[#2a2a2a]">
        <button className={`px-6 py-3 cursor-pointer border-none border-b-2 text-sm font-inherit transition-all ${tab === 'enc' ? 'text-[#00ff88] border-b-[#00ff88]' : 'text-[#666] border-b-transparent hover:text-[#aaa]'}`} onClick={() => setTab('enc')}>Encode</button>
        <button className={`px-6 py-3 cursor-pointer border-none border-b-2 text-sm font-inherit transition-all ${tab === 'dec' ? 'text-[#00ff88] border-b-[#00ff88]' : 'text-[#666] border-b-transparent hover:text-[#aaa]'}`} onClick={() => setTab('dec')}>Decode</button>
      </div>

      {tab === 'enc' ? (
        <div>
          <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-6 mb-6">
            <label className="block mb-2 text-[#00ff88] text-xs uppercase tracking-widest">Input ASCII Text</label>
            <textarea value={encIn} onChange={e => setEncIn(e.target.value)} className="w-full min-h-[120px] bg-[#0a0a0a] border border-[#333] rounded-lg text-white font-mono p-4 resize-y focus:outline-none focus:border-[#00ff88]" />
            <div className="flex gap-3 mt-3 flex-wrap items-center">
              <button onClick={runEnc} className="bg-[#00ff88] text-black px-6 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-[#00cc6a] hover:-translate-y-0.5 transition-all">▶ Encode</button>
              <select value={encQd} onChange={e => setEncQd(parseInt(e.target.value))} className="bg-[#0a0a0a] border border-[#333] text-[#e0e0e0] px-4 py-2 rounded-lg font-mono text-sm focus:outline-none focus:border-[#00ff88]">
                <option value={0}>No QEC</option>
                <option value={3}>Surface Code d=3</option>
                <option value={5}>Surface Code d=5</option>
                <option value={7}>Surface Code d=7</option>
              </select>
            </div>
          </div>
          <div className="steps-container" dangerouslySetInnerHTML={{__html: encOut}} />
        </div>
      ) : (
        <div>
          <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-6 mb-6">
            <label className="block mb-2 text-[#00ff88] text-xs uppercase tracking-widest">Paste DNA Sequence to Decode</label>
            <textarea value={decIn} onChange={e => setDecIn(e.target.value)} placeholder="Paste encoded DNA strands or raw DNA..." className="w-full min-h-[120px] bg-[#0a0a0a] border border-[#333] rounded-lg text-white font-mono p-4 resize-y focus:outline-none focus:border-[#00ff88]" />
            <div className="flex gap-3 mt-3 flex-wrap items-center">
              <button onClick={runDec} className="bg-[#00ff88] text-black px-6 py-2 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-[#00cc6a] hover:-translate-y-0.5 transition-all">▶ Decode in Detail</button>
              <select value={decQd} onChange={e => setDecQd(parseInt(e.target.value))} className="bg-[#0a0a0a] border border-[#333] text-[#e0e0e0] px-4 py-2 rounded-lg font-mono text-sm focus:outline-none focus:border-[#00ff88]">
                <option value={0}>No QEC</option>
                <option value={3}>Surface Code d=3</option>
                <option value={5}>Surface Code d=5</option>
                <option value={7}>Surface Code d=7</option>
              </select>
            </div>
          </div>
          <div className="steps-container" dangerouslySetInnerHTML={{__html: decOut}} />
        </div>
      )}

      <style jsx global>{`
        .step { background: #111; border: 1px solid #2a2a2a; border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem; }
        .step.active { border-color: #00ff88; box-shadow: 0 0 20px rgba(0,255,136,0.1); }
        .step-header { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.5rem; background: #1a1a1a; border-bottom: 1px solid #2a2a2a; }
        .step-number { background: #00ff88; color: #000; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; flex-shrink: 0; }
        .step-title { color: #fff; font-size: 0.95rem; font-weight: 600; }
        .step-content { padding: 1.5rem; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        @media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; } }
        .detail-card { background: #0a0a0a; border: 1px solid #2a2a2a; border-radius: 6px; padding: 0.75rem; }
        .detail-card h5 { color: #888; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.4rem; }
        .detail-card .val { color: #fff; font-size: 0.85rem; word-break: break-all; line-height: 1.6; }
        .dna-seq { font-family: 'SF Mono','Fira Code',monospace; font-size: 0.85rem; letter-spacing: 0.5px; line-height: 1.8; }
        .info-text { color: #666; font-size: 0.8rem; margin-top: 0.5rem; line-height: 1.6; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit,minmax(140px,1fr)); gap: 0.75rem; margin-top: 1rem; }
        .stat-card { background: #0a0a0a; border: 1px solid #2a2a2a; border-radius: 6px; padding: 0.75rem; text-align: center; }
        .stat-value { font-size: 1.3rem; color: #00ff88; font-weight: 700; }
        .stat-label { font-size: 0.7rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 0.2rem; }
        .strand-row { display: flex; gap: 0.5rem; padding: 0.4rem; margin: 0.15rem 0; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 4px; align-items: center; font-size: 0.8rem; }
        .strand-row:hover { background: #111; border-color: #333; }
        .snum { color: #00ff88; font-weight: 600; width: 32px; flex-shrink: 0; }
        .slen { color: #666; white-space: nowrap; margin-left: auto; font-size: 0.65rem; }
        .sdna { flex: 1; word-break: break-all; line-height: 1.6; }
        .codon-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem; background: #1a1a1a; border-radius: 4px; margin-bottom: 0.15rem; font-size: 0.8rem; }
        .cpos { color: #888; width: 55px; flex-shrink: 0; font-size: 0.7rem; }
        .cbadge { background: #ff4444; color: #fff; padding: 1px 5px; border-radius: 3px; font-size: 0.65rem; font-weight: 600; }
        .cbadge.fixed { background: #00cc6a; }
        .ph { opacity: 0.5; }
      `}</style>
    </div>
  );
}
