import { isScaleTone } from "./theory.js";
import type { ChiptuneScore, ValidationFinding, ValidationReport } from "./types.js";

function ratio(n: number, d: number): number { return d === 0 ? 0 : n / d; }
function clamp01(v: number): number { return Math.max(0, Math.min(1, v)); }

export function validateScore(score: ChiptuneScore): ValidationReport {
  const findings: ValidationFinding[] = [];
  const totalBeats = score.music.bars * 4;
  const notes = score.tracks.flatMap((track) => track.notes.map((note) => ({ ...note, role: track.role, trackId: track.id })));

  if (score.loop.startBar !== 0 || score.loop.endBar !== score.music.bars) {
    findings.push({ severity: "warning", code: "LOOP_NON_FULL", message: "v0.1 expects a full-song loop from bar 0 to the final bar." });
  }

  for (const note of notes) {
    if (note.start < 0 || note.duration <= 0 || note.start + note.duration > totalBeats + 0.0001) {
      findings.push({ severity: "error", code: "TIMING_RANGE", message: `${note.trackId} contains an event outside song bounds.` });
    }
    if (note.midi < 0 || note.midi > 127) {
      findings.push({ severity: "error", code: "MIDI_RANGE", message: `${note.trackId} contains invalid MIDI pitch ${note.midi}.` });
    }
    if (note.role !== "drums" && !isScaleTone(note.midi, score.music.key, score.music.mode)) {
      findings.push({ severity: "warning", code: "NON_SCALE_TONE", message: `${note.trackId} contains pitch ${note.midi} outside the selected mode.` });
    }
  }

  const lead = score.tracks.find((track) => track.role === "lead");
  const arp = score.tracks.find((track) => track.role === "arp");
  if (!lead || lead.notes.length < score.music.bars * 2) {
    findings.push({ severity: "warning", code: "LEAD_TOO_SPARSE", message: "Lead density is below the v0.1 chiptune target." });
  }

  const noteCount = notes.length;
  const arpBeats = arp?.notes.reduce((sum, n) => sum + n.duration, 0) ?? 0;
  const arpOccupancy = clamp01(arpBeats / totalBeats);
  const occupiedLeadBeats = lead?.notes.reduce((sum, n) => sum + n.duration, 0) ?? 0;
  const restRatio = clamp01(1 - occupiedLeadBeats / totalBeats);

  const mainMotif = score.motifs.find((m) => m.id === "motif.main");
  const expectedPhraseNotes = mainMotif?.degrees.length ?? 1;
  const motifReuse = lead ? lead.notes.length / expectedPhraseNotes : 0;

  if (arpOccupancy > 0.82) {
    findings.push({ severity: "warning", code: "ARP_FATIGUE", message: "Arpeggio occupancy is very high and may fatigue in a long gameplay loop." });
  }
  if (restRatio < 0.08) {
    findings.push({ severity: "warning", code: "LEAD_NO_SPACE", message: "Lead has very little negative space." });
  }

  const highRegister = ratio(notes.filter((n) => n.role !== "drums" && n.midi >= 84).length, Math.max(1, noteCount));
  const rapidEvents = ratio(notes.filter((n) => n.duration <= 0.25).length, Math.max(1, noteCount));
  const repetitionPressure = clamp01(Math.max(0, motifReuse - 6) / 10);
  const loopFatigueRisk = clamp01(0.35 * arpOccupancy + 0.25 * highRegister + 0.2 * rapidEvents + 0.2 * repetitionPressure);

  if (loopFatigueRisk > 0.7) {
    findings.push({ severity: "warning", code: "LOOP_FATIGUE_HIGH", message: `Heuristic loop fatigue risk is ${loopFatigueRisk.toFixed(2)}.` });
  }

  return {
    valid: !findings.some((f) => f.severity === "error"),
    findings,
    metrics: {
      noteCount,
      motifReuse: Number(motifReuse.toFixed(2)),
      arpOccupancy: Number(arpOccupancy.toFixed(3)),
      restRatio: Number(restRatio.toFixed(3)),
      loopFatigueRisk: Number(loopFatigueRisk.toFixed(3)),
    },
  };
}
