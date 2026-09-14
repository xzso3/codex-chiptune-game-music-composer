import type { ChiptuneScore, NoteEvent, Track } from "./types.js";

const SAMPLE_RATE = 44100;

function midiHz(midi: number): number { return 440 * Math.pow(2, (midi - 69) / 12); }
function frac(x: number): number { return x - Math.floor(x); }
function osc(kind: Track["instrument"], phase: number): number {
  const p = frac(phase);
  if (kind === "triangle_synth") return 1 - 4 * Math.abs(p - 0.5);
  if (kind === "digital_pad") return 0.65 * Math.sin(phase * Math.PI * 2) + 0.35 * (p < 0.5 ? 1 : -1);
  if (kind === "pulse_counter") return p < 0.25 ? 1 : -1;
  return p < 0.5 ? 1 : -1;
}

function env(t: number, duration: number): number {
  const attack = Math.min(0.01, duration * 0.15);
  const release = Math.min(0.08, duration * 0.35);
  if (t < attack) return t / Math.max(attack, 1e-6);
  if (t > duration - release) return Math.max(0, (duration - t) / Math.max(release, 1e-6));
  return 1;
}

function seededNoise(index: number): number {
  let x = (index + 1) | 0;
  x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
  return ((x >>> 0) / 0xffffffff) * 2 - 1;
}

function sampleNote(note: NoteEvent, track: Track, sampleTime: number, beatSeconds: number, sampleIndex: number): number {
  const start = note.start * beatSeconds;
  const dur = note.duration * beatSeconds;
  const local = sampleTime - start;
  if (local < 0 || local >= dur) return 0;
  const amplitude = (note.velocity / 127) * env(local, dur);
  if (track.role === "drums") {
    const decay = Math.exp(-local * (note.midi === 36 ? 18 : 35));
    if (note.midi === 36) return (Math.sin(2 * Math.PI * (70 - local * 35) * local) * 0.8 + seededNoise(sampleIndex) * 0.2) * decay * amplitude;
    return seededNoise(sampleIndex) * decay * amplitude;
  }
  return osc(track.instrument, local * midiHz(note.midi)) * amplitude;
}

function writeAscii(view: DataView, offset: number, text: string): void {
  for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
}

export function renderWav(score: ChiptuneScore): Uint8Array {
  const beatSeconds = 60 / score.music.bpm;
  const duration = score.music.bars * 4 * beatSeconds;
  const frames = Math.ceil(duration * SAMPLE_RATE);
  const samples = new Int16Array(frames);
  const gains: Record<string, number> = { lead: 0.18, counter: 0.11, arp: 0.08, bass: 0.16, drums: 0.18, texture: 0.07 };

  for (let i = 0; i < frames; i++) {
    const t = i / SAMPLE_RATE;
    let mixed = 0;
    for (const track of score.tracks) {
      const gain = gains[track.role] ?? 0.1;
      for (const note of track.notes) {
        const start = note.start * beatSeconds;
        const end = (note.start + note.duration) * beatSeconds;
        if (t >= start && t < end) mixed += sampleNote(note, track, t, beatSeconds, i) * gain;
      }
    }
    const limited = Math.tanh(mixed * 1.25);
    samples[i] = Math.round(limited * 32767);
  }

  const dataBytes = samples.byteLength;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, dataBytes, true);
  new Int16Array(buffer, 44).set(samples);
  return new Uint8Array(buffer);
}
