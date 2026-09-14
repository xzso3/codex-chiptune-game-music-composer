import type { ChiptuneScore, NoteEvent, Track } from "./types.js";

const PPQ = 480;
const PROGRAM: Record<string, number> = {
  square_lead: 80,
  pulse_counter: 81,
  chip_arp: 80,
  triangle_synth: 38,
  hybrid_chip_drums: 0,
  digital_pad: 89,
};

function u32(n: number): number[] { return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]; }
function u16(n: number): number[] { return [(n >>> 8) & 255, n & 255]; }
function ascii(s: string): number[] { return [...Buffer.from(s, "ascii")]; }
function vlq(value: number): number[] {
  let buffer = value & 0x7f;
  const out: number[] = [];
  while ((value >>= 7)) { buffer <<= 8; buffer |= (value & 0x7f) | 0x80; }
  while (true) {
    out.push(buffer & 0xff);
    if (buffer & 0x80) buffer >>= 8; else break;
  }
  return out;
}
function chunk(type: string, data: number[]): number[] { return [...ascii(type), ...u32(data.length), ...data]; }

interface MidiEvt { tick: number; order: number; bytes: number[]; }

function trackChunk(track: Track, channel: number): number[] {
  const events: MidiEvt[] = [];
  const isDrums = track.role === "drums";
  if (!isDrums) events.push({ tick: 0, order: 0, bytes: [0xc0 | channel, PROGRAM[track.instrument] ?? 80] });
  for (const n of track.notes) {
    const start = Math.round(n.start * PPQ);
    const end = Math.max(start + 1, Math.round((n.start + n.duration) * PPQ));
    events.push({ tick: start, order: 2, bytes: [0x90 | channel, n.midi & 0x7f, Math.max(1, Math.min(127, n.velocity))] });
    events.push({ tick: end, order: 1, bytes: [0x80 | channel, n.midi & 0x7f, 0] });
  }
  events.sort((a, b) => a.tick - b.tick || a.order - b.order);
  const data: number[] = [];
  let last = 0;
  for (const e of events) {
    data.push(...vlq(e.tick - last), ...e.bytes);
    last = e.tick;
  }
  data.push(0x00, 0xff, 0x2f, 0x00);
  return chunk("MTrk", data);
}

function metaTrack(score: ChiptuneScore): number[] {
  const micros = Math.round(60_000_000 / score.music.bpm);
  const name = ascii(score.meta.title);
  const data = [
    0x00, 0xff, 0x03, name.length, ...name,
    0x00, 0xff, 0x51, 0x03, (micros >>> 16) & 255, (micros >>> 8) & 255, micros & 255,
    0x00, 0xff, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08,
    0x00, 0xff, 0x2f, 0x00,
  ];
  return chunk("MTrk", data);
}

export function exportMidi(score: ChiptuneScore): Uint8Array {
  const chunks: number[][] = [metaTrack(score)];
  let melodicChannel = 0;
  for (const track of score.tracks) {
    let channel: number;
    if (track.role === "drums") channel = 9;
    else {
      if (melodicChannel === 9) melodicChannel++;
      channel = melodicChannel++;
    }
    chunks.push(trackChunk(track, channel));
  }
  const header = chunk("MThd", [...u16(1), ...u16(chunks.length), ...u16(PPQ)]);
  return Uint8Array.from([...header, ...chunks.flat()]);
}
