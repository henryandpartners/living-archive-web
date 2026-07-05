"use client";

import { useState } from "react";
import { encode, decode } from "@/lib/dna";

const QEC_OPTIONS = [
  { value: 0, label: "No QEC" },
  { value: 3, label: "Surface Code d=3" },
  { value: 5, label: "Surface Code d=5" },
  { value: 7, label: "Surface Code d=7" },
];

export default function PipelinePage() {
  const [tab, setTab] = useState<"enc" | "dec">("enc");
  const [encIn, setEncIn] = useState("Hello DNA World! This is a test.");
  const [encQd, setEncQd] = useState(3);
  const [decIn, setDecIn] = useState("");
  const [encResult, setEncResult] = useState<string>("");
  const [decResult, setDecResult] = useState<string>("");

  const runEnc = () => {
    if (!encIn) return;
    const result = encode(encIn, encQd);
    let h = "";

    h += `<h3 style="margin-top:1.5rem;font-size:1rem">1. ASCII → Binary</h3>`;
    h += `<p>${encIn.length} chars → ${result.binary.length} bits</p>`;

    h += `<h3 style="margin-top:1.5rem;font-size:1rem">2. Binary → DNA</h3>`;
    h += `<p>${result.rawDna.length} nucleotides</p>`;
    h += `<pre style="font-size:0.75rem">${result.rawDna}</pre>`;

    if (result.stopCodons.length) {
      h += `<h3 style="margin-top:1.5rem;font-size:1rem">3. Stop Codon Check</h3>`;
      h += `<p>⚠ ${result.stopCodons.length} stop codon(s) found and fixed</p>`;
      h += `<pre style="font-size:0.75rem">${result.fixedDna}</pre>`;
    } else {
      h += `<h3 style="margin-top:1.5rem;font-size:1rem">3. Stop Codon Check</h3>`;
      h += `<p>✓ No stop codons found</p>`;
    }

    if (encQd > 0) {
      h += `<h3 style="margin-top:1.5rem;font-size:1rem">4. Surface Code (d=${encQd})</h3>`;
      h += `<p>${result.blocks.length} block(s) · ${result.blocks[0].data.length} data nt + ${result.blocks[0].parity.length} parity nt per block · Overhead: ${(result.blocks[0].full.length / result.blocks[0].data.length).toFixed(1)}×</p>`;
    }

    h += `<h3 style="margin-top:1.5rem;font-size:1rem">Final Output</h3>`;
    h += `<p>${result.totalLength} nucleotides total</p>`;

    setEncResult(h);
  };

  const runDec = () => {
    if (!decIn.trim()) return;
    const result = decode(decIn, 0);
    setDecResult(
      `<h3 style="margin-top:1.5rem;font-size:1rem">Decoded Text</h3><pre>${result.text || "(empty)"}</pre>` +
        (result.warnings.length
          ? `<p style="color:var(--text-muted);font-size:0.82rem">${result.warnings.join(" · ")}</p>`
          : "")
    );
  };

  return (
    <div style={{ maxWidth: "var(--max-w-read)", margin: "0 auto", padding: "3rem 20px 4rem" }}>
      <p className="section-label" style={{ fontSize: "0.6rem", marginBottom: "0.25rem" }}>
        Technical
      </p>
      <h1 style={{ marginBottom: "0.5rem" }}>DNA Storage Pipeline</h1>
      <p className="lead" style={{ marginBottom: "1.5rem" }}>
        Encode text into DNA sequences with stop codon screening and quantum error correction.
      </p>

      <hr />

      {/* Tab buttons */}
      <div style={{ display: "flex", gap: 8, margin: "1.5rem 0" }}>
        <button
          className={`btn ${tab === "enc" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setTab("enc")}
        >
          Encode
        </button>
        <button
          className={`btn ${tab === "dec" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setTab("dec")}
        >
          Decode
        </button>
      </div>

      {tab === "enc" ? (
        <div>
          <label
            style={{
              display: "block",
              fontWeight: 500,
              fontSize: "0.85rem",
              marginBottom: 6,
              color: "var(--text)",
            }}
          >
            Input text
          </label>
          <textarea
            value={encIn}
            onChange={(e) => setEncIn(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              fontFamily: "var(--font-mono)",
              fontSize: "0.82rem",
              padding: "10px 12px",
              border: "1px solid var(--border)",
              borderRadius: 8,
              background: "var(--bg-card)",
              resize: "vertical",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            <button className="btn btn-primary" onClick={runEnc}>
              Encode
            </button>
            <select
              value={encQd}
              onChange={(e) => setEncQd(parseInt(e.target.value))}
              style={{ fontFamily: "var(--font-sans)", fontSize: "0.82rem" }}
            >
              {QEC_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: encResult }}
            style={{ fontSize: "0.9rem", lineHeight: 1.7 }}
          />
        </div>
      ) : (
        <div>
          <label
            style={{
              display: "block",
              fontWeight: 500,
              fontSize: "0.85rem",
              marginBottom: 6,
              color: "var(--text)",
            }}
          >
            Paste encoded DNA
          </label>
          <textarea
            value={decIn}
            onChange={(e) => setDecIn(e.target.value)}
            placeholder="Paste encoded DNA sequence..."
            rows={4}
            style={{
              width: "100%",
              fontFamily: "var(--font-mono)",
              fontSize: "0.82rem",
              padding: "10px 12px",
              border: "1px solid var(--border)",
              borderRadius: 8,
              background: "var(--bg-card)",
              resize: "vertical",
            }}
          />
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={runDec}>
              Decode
            </button>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: decResult }}
            style={{ fontSize: "0.9rem", lineHeight: 1.7 }}
          />
        </div>
      )}
    </div>
  );
}
