import type { ChiptuneScore } from "./types.js";

/**
 * Stable bridge manifest for a future BeepBox adapter.
 * We intentionally do not treat BeepBox's evolving JSON serialization as our canonical IR.
 */
export function exportBeepBoxBridge(score: ChiptuneScore): object {
  return {
    format: "codex-chiptune-beepbox-bridge-v0.1",
    source: "ChiptuneScore/0.1",
    song: {
      title: score.meta.title,
      tempo: score.music.bpm,
      key: score.music.key,
      mode: score.music.mode,
      beatsPerBar: 4,
      barCount: score.music.bars,
      loopStart: score.loop.startBar,
      loopLength: score.loop.endBar - score.loop.startBar,
    },
    channels: score.tracks.map((track) => ({
      id: track.id,
      role: track.role,
      suggestedInstrument: track.instrument,
      notes: track.notes.map((note) => ({
        beat: note.start,
        duration: note.duration,
        midi: note.midi,
        velocity: note.velocity,
      })),
    })),
    note: "This bridge is intentionally decoupled from BeepBox's private serialization. Use MIDI for immediate BeepBox/DAW import; a direct BeepBox serializer is a post-MVP adapter task.",
  };
}
