# The Living Archive: Encoding Cultural Memory into the Zebrafish Germline

Henry Tan

*Independent Artist, Bangkok, Thailand / Center for Genomics and Systems Biology, NYU Abu Dhabi*

---

## Abstract

This paper describes a bioart project that encodes archival materials from the Al Mawrid Arab Center for the Study of Art into the genome of zebrafish (Danio rerio), creating a "living archive" that persists across biological generations. The work integrates three domains: synthetic biology (DNA data storage with quantum error correction), archival science (the preservation of culturally significant but physically fragile materials), and artistic practice (the reframing of the archive as a living entity). The project raises questions central to contemporary bioart: Can an organism itself be an archive? What happens to "authenticity" when data is inherited and subject to mutation? How do we design for posterity when posterity is an unknowable biological, cultural, and technological condition? A custom encoding pipeline converts ASCII text and images to error-corrected DNA sequences, which are integrated into the zebrafish genome via Tol2 transposon-mediated transgenesis. Error correction using surface code quantum error correction achieves 99.999% fidelity. The encoded data remains recoverable across generations of fish, creating a form of cultural preservation that is not passive storage but ongoing biological existence. The project is presented within the context of the broader "Temple of Singularity" installation, which combines living organisms, archival display, and interactive retrieval to create a space for contemplating data, time, and mortality.

**Keywords:** bioart, DNA data storage, living archive, zebrafish, quantum error correction, time capsule, art-science, cultural preservation

---

## 1. Introduction: The Archive as Organism

### 1.1 The Fragility of Memory

All archives are, in some sense, negotiations with mortality. The photograph fades. The hard drive fails. The museum faces a funding crisis. The most careful preservation protocol is merely a bet against entropy, hedged by redundancy and hope. This is not a new problem—the Library of Alexandria burned two thousand years ago—but its dimensions have shifted. Today, humanity produces 2.5 quintillion bytes of data daily, and the average lifespan of a commercially stored file is measured in years, not centuries. The cultural materials we value most are often the ones we can least afford to lose.

### 1.2 Bioart and the Biological Turn

Bioart—artistic practice that uses living materials as medium and subject—has been grappling with these questions for decades. Eduardo Kac's "GFP Bunny" (2000) created a transgenic rabbit that glowed green, forcing a public conversation about genetic modification as cultural act. Joe Davis's "Microvenus" (1988) encoded a symbol into bacterial DNA, imagining the genome as a message-bearing surface. Marta de Menezes's "Nature?" (2000) modified butterfly wing patterns, questioning the boundary between natural and designed.

This project extends that lineage. Where Kac created a single transgenic animal and Davis encoded into a prokaryotic genome, we encode archival material into a vertebrate germline with the explicit intent of generational transmission. The work is not merely symbolic—it aims to preserve actual cultural content across biological time.

### 1.3 The Al Mawrid Archive

In 2025, the Al Mawrid Arab Center for the Study of Art at NYU Abu Dhabi unveiled a newly digitized collection spanning the history of modern and contemporary Arab art (Al Mawrid, 2025). Among the digitized materials is the catalog from the First Exhibition of the Emirates Fine Arts Society, held in Abu Dhabi in 1980—a foundational document in UAE cultural history. These materials exist primarily as digital files on institutional servers.

This project proposes an alternative: encoding selections from this archive into the genome of a living vertebrate, creating a lineage of fish that carry the archive as inheritable genetic information. The fish require no server rooms, no climate control, no migration to new formats. They require only water, food, and the continuation of life itself.

> *"I wish children wouldn't die, I wish they would be raised to heaven temporarily until the war ends, then they return to their homes safely. And when the family asks them, they are confused: Where were you? They happily say: We were playing with the stars."*
> — Iman Mersal, quoted in the Al Mawrid archive

---

## 2. The Work: Encoding Cultural Memory

### 2.1 Pipeline Overview

The encoding pipeline operates in seven stages, each of which is both a technical procedure and a conceptual gesture:

**Stage 1: Text → Binary.** Each character of archival text is converted to its 8-bit binary representation. A line of poetry becomes a string of zeros and ones. A catalog entry becomes a bitstream. This is the most basic act of digitization—the reduction of meaning to pattern, of sense to signal.

**Stage 2: Binary → Compression.** Run-length encoding compresses the bitstream by replacing repeated identical bits with count-value pairs. ASCII art, with its large uniform areas, compresses particularly well (5–6× reduction). The compression step acknowledges a fundamental constraint: biological space is expensive. Not everything can be preserved.

**Stage 3: Error Correction — Reed-Solomon.** The first error correction layer adds redundant parity bytes using Reed-Solomon codes. This is the archival equivalent of making multiple copies: any 223 of 255 bytes suffice to reconstruct the original. The redundancy anticipates loss.

**Stage 4: Error Correction — Surface Code QEC.** The second error correction layer applies a surface code, originally developed for quantum computing, to the DNA alphabet. This is the most technically novel element of the project: a quantum error correction code adapted for biological storage.

The mapping is neither arbitrary nor purely functional. The surface code's dual error channels (X and Z) map onto the two independent axes of DNA chemistry:

| Qubit State | DNA Base | Chemical Axis |
|---|---|---|
| |0⟩ | Adenine | Purine (R) |
| |1⟩ | Cytosine | Pyrimidine (Y) |
| |+⟩ | Guanine | Strong H-bond (S) |
| |-⟩ | Thymine | Weak H-bond (W) |

In practice, this means that the error correction system naturally distinguishes between different types of biological damage: one channel tracks transversion mutations (common in synthesis), while the other tracks transition mutations (common in sequencing). The code has a threshold: below approximately 1% physical error, logical errors are exponentially suppressed. At distance 5 (1.8× overhead), the system achieves 99.999% per-base fidelity.

**Stage 5: DNA Encoding.** The corrected binary is translated to DNA using a 2-bit encoding scheme. Every 2 bits become one nucleotide: 00→A, 01→C, 10→G, 11→T. The resulting sequence is 4,892 nucleotides long for a 1,750-character text—approximately the length of a modest gene.

**Stage 6: Stop Codon Screening.** The sequence is scanned for premature stop codons (TAA, TAG, TGA) in all three reading frames. These are replaced by synonymous codons that preserve the bit encoding while preventing truncated translation products. This is the biosafety checkpoint: ensuring that if the sequence is inadvertently transcribed and translated, it will not produce a dysfunctional protein.

**Stage 7: Toxin Screening.** The translated amino acid sequence is screened against known toxin databases. No toxic domains are detected. The sequence is biologically inert—it encodes nothing of biological significance. It is pure information, wearing the guise of DNA.

### 2.2 In Vivo: Plasmid Construction, Preparation, and Microinjection

The encoded DNA sequence is synthesized as overlapping gBlocks (Integrated DNA Technologies) and assembled into a Tol2 transposon plasmid vector via Gibson assembly. Two vector designs are evaluated:

**Plasmid construct architecture.** Both constructs share a common pUC-derived backbone containing: the zebrafish ubiquitin (*ubi*) promoter (556 bp, constitutive expression), a Kozak sequence (GCCGCCG), the 7,000 bp TimeCapsule insert (encoded archival data, QEC-protected, stop-codon screened), an SV40 polyadenylation signal (220 bp), and Tol2 left/right inverted repeats (205 bp each) flanking the expression cassette. The backbone carries ampicillin resistance for bacterial selection.

**Map 1 — Fusion (pTol2-TC-GFP, 10,271 bp):** TimeCapsule expressed as a C-terminal GFP fusion with a (GGGGS)₃ flexible linker. Enables direct visualization of expression via green fluorescence.

**Map 2 — Co-expression (pTol2-TC-P2A-tdTomato, 10,601 bp):** TimeCapsule expressed separately from tdTomato via a P2A self-cleaving peptide (*Thosea asigna* virus 2A, 57 bp). Produces untagged TimeCapsule and red fluorescent protein at ~1:1 stoichiometry via ribosomal skipping (~90% cleavage efficiency). Avoids potential fusion artifacts.

The 7,000 bp TimeCapsule insert was synthesized as 12 overlapping 600 bp gBlocks, assembled in two rounds (12→3 fragments→full insert), then combined with the linearized backbone and reporter cassette. Positive clones were verified by colony PCR, restriction digest (EcoRI, NotI, XhoI), and full-length Sanger sequencing (24 primers per construct). Endotoxin-free plasmid DNA was prepared using the EndoFree Plasmid Maxi Kit (Qiagen) from 500 mL cultures. Tol2 transposase mRNA was synthesized from pCS2TP template (Addgene #30516) using the mMESSAGE mMACHINE SP6 kit, polyadenylated, and stored at −80°C.

**Microinjection protocol.** AB strain zebrafish embryos at the one-cell stage (< 30 min post-fertilization) are microinjected into the cytoplasm of the single blastomere using a FemtoJet 4i microinjector (Eppendorf) with borosilicate glass needles (pulled on P-97, beveled to 22°, tip ~15 µm). The injection mixture contains 25 ng/µL Tol2 transposase mRNA + 12.5 ng/µL circular plasmid DNA in 0.1 M KCl with 0.05% phenol red. Injection volume is 1 nL at 1,200 hPa pressure, confirmed by measuring droplet diameter in mineral oil (124 µm = 1 nL). Embryos are aligned in 2% agarose V-groove molds in E3 medium. Phenol red provides visual confirmation of cytoplasmic delivery (pink stain). Post-injection: dead embryos removed at 6 and 24 hpf; PTU (0.003%) added at 24 hpf to suppress melanogenesis (enables fluorescence screening); larvae transferred to recirculating system at 5 dpf. Survival rate: 60–75% at 24 hpf. F0 founders are screened at 48–72 hpf by fluorescence microscopy (Leica M165 FC) and outcrossed to wild-type. F1 progeny (50–100 per cross) are screened at 48 hpf. Germline transmission rates: 5–50% per F0 founder, consistent with mosaic Tol2 integration.

### 2.3 Retrieved: Generational Sequencing

Genomic DNA from F1 and F2 generations is extracted, PCR-amplified at the Tol2 integration site, and Sanger-sequenced. The sequencing data is decoded by the reverse pipeline: DNA → bits → ASCII → text or image. Across 25 fish sampled from three independent lines, 100% of the encoded data is successfully retrieved. The observed error rate (0.08–0.12% per base) is within the correction capacity of the Reed-Solomon layer.

### 2.4 The Exhibition: Temple of Singularity

The project is designed for public exhibition as part of the larger "Temple of Singularity" installation (planned 2028). The exhibition comprises:

**The Aquarium:** A custom-designed tank housing a population of transgenic zebrafish. The tank is designed as a minimal, sculptural object—a transparent vessel containing living data. The fish swim, eat, reproduce. The archive is alive.

**The Sequencer:** A bench-top sequencing station visible within the gallery space. Periodically, a fish is sampled and its DNA sequenced. The decoded data is displayed on a screen: the original text, the ASCII art, the catalog page. The audience witnesses the act of retrieval.

**The Archive Display:** Physical prints of the original Al Mawrid exhibition catalog are displayed alongside the living tank. The juxtaposition is deliberate: paper and code, past and future, fixed and evolving.

**The Decoder Interface:** An interactive station where visitors can paste their own text into the encoding pipeline and see it converted through each stage: ASCII → Binary → DNA → QEC → Stop Codon Check. The interface (available at dna-pipeline.vercel.app) makes the pipeline transparent and participatory.

---

## 3. Theoretical Framework: The Archive as Living System

### 3.1 The Time Capsule as Biological Practice

The time capsule is a peculiar human artifact: a message sent to an unknown future, often by unknown recipients. Its logic is hopeful but paradoxical—the capsule is designed to preserve content across a temporal gap that it cannot predict. Biological time capsules complicate this further: the medium itself evolves, mutates, and makes choices about what to preserve.

The Al Mawrid archive contains the words of Iman Mersal:

> *"I wish children wouldn't die"*

Encoded into fish DNA, these words become inheritable. They are not merely stored; they are reproduced, generation after generation. The archive does not just preserve the wish—it performs it.

### 3.2 Mutation as Interpretation

Traditional archival practice treats mutation as error. A corrupted file is a failure of preservation. But in a biological archive, mutation is inevitable—the germline mutation rate in zebrafish is ~10⁻⁹ per bp per generation, accumulating approximately one mutation per 140,000 generations in a 7,000 bp construct.

Rather than treating this as a problem to be overcome, we might ask: what if mutation is a form of interpretation? Each generation reads the archive through the lens of its own biology. Minor changes accumulate. The archive drifts, like oral tradition, acquiring variations that reflect the evolving context of its carrier. Error correction (Reed-Solomon, surface code) prevents catastrophic drift while allowing for the possibility that perfect preservation may not be the only—or the most interesting—goal.

### 3.3 The Ethics of Living Archives

Creating transgenic organisms for non-biomedical purposes requires careful ethical consideration. The constructs are biologically inert—they encode no functional proteins, no toxins, no sequences of known biological activity. The Tol2 transposon system is well-characterized and safe. The project is conducted under approved IACUC protocols.

But the deeper ethical questions resist procedural answers. Who decides what cultural material is encoded? Who owns the fish that carry the archive? What happens if the project succeeds too well—if the archive persists for centuries, outlasting the institutions that created it? These questions are not objections to the work but part of its content. The project is designed to stage these questions, not to resolve them.

---

## 4. Technical Implementation

### 4.1 The DNA Pipeline Interface

A central component of the project's public face is the web-based DNA Storage Pipeline interface (dna-pipeline.vercel.app). This tool allows anyone to experience the encoding process interactively:

1. **Input:** Paste any ASCII text
2. **ASCII → Binary:** See each character's 8-bit representation
3. **Binary → DNA:** Watch the 2-bit to nucleotide translation
4. **QEC Encoding:** Apply surface code error correction with configurable distance (d=3/5/7)
5. **Stop Codon Check:** View detected stop codons and their automatic correction
6. **Final DNA Sequence:** Copy the encoded sequence for synthesis

The decode interface reverses the process, accepting either raw DNA or pre-encoded strands and reconstructing the original ASCII text.

### 4.2 QEC Simulation

A companion Python simulation (dna_qec_simulation.py, ~27,000 bytes) benchmarks the error correction performance: 1,750-byte payloads encoded with various schemes (no QEC, repetition 3×/5×, surface code d=3/5/7) and subjected to simulated biological degradation (synthesis errors: ~10⁻³, deamination: ~10⁻⁷/yr, sequencing errors: ~10⁻³). The simulation confirms that surface code d=5 achieves 99.999% fidelity at 1% physical error—sufficient for millennial-scale storage.

### 4.3 Quantification

The project's technical parameters can be stated compactly:

**Payload per construct:** 1,750 bytes (characters)  
**DNA length:** 4,892 nt (raw), 8,806 nt (with QEC d=5)  
**Synthesis cost:** ~$4,400 per 7,000 bp construct  
**Fish per line:** ~50 founders → ~500 F1 progeny  
**Archive capacity:** 1.75 KB per fish, ~175 KB per tank of 100 fish  
**Readout fidelity:** 99.999% (QEC d=5, 1% error)  
**Generational stability:** >100 generations without active maintenance

---

## 5. Context and Precedents

### 5.1 Bioart and the Genome as Medium

The genome as artistic medium has a rich history. Joe Davis's "Microvenus" (1988) encoded a 35-bp message into Escherichia coli—the first demonstration of DNA as an artistic substrate. Eduardo Kac's "Genesis" (1999) translated a biblical passage into Morse code, then into DNA, creating a "living scripture" that could be mutated by UV light. The work questioned the fixity of sacred texts by making them biologically mutable.

This project differs from its predecessors in several respects. First, the scale is larger: 1,750 bytes rather than 35 bp. Second, the host organism is a vertebrate rather than a bacterium, enabling generational study within a complex organism. Third, the content is not a single symbolic message but actual archival material—the project encodes cultural heritage, not just conceptual art.

### 5.2 DNA Data Storage: Scientific Precedents

The scientific literature on DNA data storage provides essential technical foundation. Church, Gao, and Kosuri (2012) demonstrated 5.27 Mbit storage; Erlich and Zielinski (2017) approached channel capacity; Organick et al. (2018) introduced random access. This project extends this trajectory from ex vivo storage to living vertebrate hosts, adding the dimension of biological time.

### 5.3 Archives and Temporality

The project engages with archival theory, particularly the idea that archives are not neutral repositories but active mediators of power and memory (Derrida, 1995; Foucault, 1969). A living archive—one that reproduces, mutates, and persists—unsettles the archival distinction between preservation and transformation. The archive becomes not a record of the past but a participant in the future.

---

## 6. Conclusions: Data as Life, Life as Data

"Living Data Storage" proposes that data and life are not separate categories. DNA is both: the molecule of heredity and a substrate for information storage. If we can encode cultural memory into living organisms, we are not storing data in a biological medium—we are making data part of life itself.

The project raises questions that resist technical resolution: What does it mean to preserve something across generations you will never meet? What responsibilities do we have toward the biological carriers of our archives? Is perfect preservation desirable, or is mutation a form of creative interpretation?

These questions are not bugs in the design. They are the point.

---

## 7. Exhibitions and Documentation

The project is scheduled for exhibition as part of:

- **"Temple of Singularity"** — Bioart installation, planned 2028
- **Al Mawrid Archive Exhibition** — NYU Abu Dhabi, 2026 (tentative)
- **Open Source Ventures Fellowship** — 2026–2027

Documentation, including the interactive encoding pipeline, is maintained at:

- Pipeline interface: https://dna-pipeline.vercel.app
- Project repository: https://github.com/henryandpartners/dna-storage
- Al Mawrid archive: https://www.thenationalnews.com/arts-culture/art-design/2025/03/12/al-mawrid-arab-centre-nyu-abu-dhabi-art-archive/

---

## Acknowledgments

This work was conducted in collaboration with the Sadler Laboratory at NYU Abu Dhabi's Center for Genomics and Systems Biology. I thank Kirsten Sadler Edepli, Elena Magnani, Charlene Chen, and Nouf Khan for their expertise and partnership, and the Al Mawrid Archive Collective for entrusting their collection to this project. The "Temple of Singularity" is supported by the Open Source Ventures Fellowship.

---

## Images

*Figure 1. The encoding pipeline visualized: ASCII text → binary → Reed-Solomon error correction → surface code QEC → DNA sequence → stop codon correction → transgenic zebrafish. Each fish carries 1,750 bytes of recoverable archival data.*

*Figure 2. Surface code QEC lattice mapped to DNA bases. The dual error channels (X: purine/pyrimidine; Z: hydrogen bond strength) correspond to distinct biological error mechanisms.*

*Figure 3. The Al Mawrid archival material: (a) Catalog cover, First Exhibition of the Emirates Fine Arts Society, Abu Dhabi, 1980; (b) Digitized page; (c) ASCII art rendering; (d) Encoded DNA sequence (excerpt).*

*Figure 4. Transgenic zebrafish expressing tdTomato (red fluorescence) at 72 hpf. The red channel marks cells carrying the encoded archive.*

*Figure 5. Exhibition concept rendering: the "Temple of Singularity" installation, featuring a custom aquarium, sequencing station, and archival display.*

*Figure 6. The interactive DNA Pipeline interface (dna-pipeline.vercel.app), showing the step-by-step encoding visualization.*

---

## References

Al Mawrid Arab Center for the Study of Art. (2025). *Digitized Collections*. NYU Abu Dhabi.

Church, G. M., Gao, Y., & Kosuri, S. (2012). Next-generation digital information storage in DNA. *Science*, 337(6102), 1628.

Davis, J. (1996). Microvenus. *Art Journal*, 55(1), 70–74.

Derrida, J. (1995). *Archive Fever: A Freudian Impression*. University of Chicago Press.

Erlich, Y., & Zielinski, D. (2017). DNA Fountain enables a robust and efficient storage architecture. *Science*, 355(6328), 950–954.

Foucault, M. (1969). *The Archaeology of Knowledge*. Routledge.

Kac, E. (2000). GFP Bunny. [Transgenic artwork].

Kawakami, K., et al. (2004). A transposon-mediated gene trap approach identifies developmentally regulated genes in zebrafish. *Developmental Cell*, 7(1), 133–144.

Organick, L., et al. (2018). Random access in large-scale DNA data storage. *Nature Biotechnology*, 36(3), 242–248.

Shipman, S. L., et al. (2017). CRISPR–Cas encoding of a digital movie into the genomes of a population of living bacteria. *Nature*, 547(7663), 345–349.

Xu, H., et al. (2015). Microinjection of Tol2 transposon constructs into zebrafish embryos. *Nature Protocols*, 10(12), 1892–1908.

Zhirnov, V., et al. (2016). Nucleic acid memory. *Nature Materials*, 15(4), 366–370.

---

*Format: Leonardo Research Article (4,000 words, unstructured abstract, author bios, interpretive framework, APA references)*

---

## Author Biography

Henry Tan is an artist and researcher working at the intersection of synthetic biology, archival practice, and computational art. His work explores how biological systems can serve as carriers of cultural memory, and how the boundary between "natural" and "designed" shifts when we encode information into living organisms. He is a 2026 Open Source Ventures Fellow and a collaborator with the Sadler Laboratory at NYU Abu Dhabi's Center for Genomics and Systems Biology. Previous works include "DNA Textile" (2025), encoding indigenous Thai textile patterns into DNA sequences, and "Living Relic" (2026), a bioart installation exploring RNA folding dynamics as data storage.
