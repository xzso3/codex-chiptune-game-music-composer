import { describe, expect, it } from "vitest";
import { compose, exportMidi, renderWav, reviseScore, validateScore, type MusicBrief } from "../src/index.js";

const brief: MusicBrief = {
  title: "test-boss",
  gameRole: "boss",
  mood: ["tense", "heroic"],
  stylePack: "chip-rock",
  durationBars: 16,
  seed: 12345,
};

describe("composer v0.1", () => {
  it("is deterministic for the same brief and seed", () => {
    expect(compose(brief)).toEqual(compose(brief));
  });

  it("produces a valid editable score", () => {
    const score = compose(brief);
    const report = validateScore(score);
    expect(score.version).toBe("0.1");
    expect(score.tracks.some((t) => t.role === "lead")).toBe(true);
    expect(score.tracks.some((t) => t.role === "bass")).toBe(true);
    expect(report.valid).toBe(true);
  });

  it("exports standard MIDI and RIFF/WAVE preview bytes", () => {
    const score = compose(brief);
    const midi = exportMidi(score);
    const wav = renderWav(score);
    expect(Buffer.from(midi.subarray(0, 4)).toString("ascii")).toBe("MThd");
    expect(Buffer.from(wav.subarray(0, 4)).toString("ascii")).toBe("RIFF");
    expect(Buffer.from(wav.subarray(8, 12)).toString("ascii")).toBe("WAVE");
  });

  it("supports lock-aware local revisions", () => {
    const score = compose(brief);
    const originalLead = structuredClone(score.tracks.find((t) => t.id === "track.lead")!.notes);
    const revised = reviseScore(score, { lock: ["track.lead"], arpDensity: 0.2, drumStrength: 1 });
    expect(revised.tracks.find((t) => t.id === "track.lead")!.notes).toEqual(originalLead);
    expect(revised.style.arpDensity).toBe(0.2);
  });
});
