import type { Mode } from "./types.js";

const NOTE_TO_PC: Record<string, number> = {
  C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5,
  "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11,
};

const MODE_STEPS: Record<Mode, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
};

export function pitchClass(key: string): number {
  const pc = NOTE_TO_PC[key];
  if (pc === undefined) throw new Error(`Unsupported key: ${key}`);
  return pc;
}

export function scaleMidi(key: string, mode: Mode, octave = 4): number[] {
  const root = 12 * (octave + 1) + pitchClass(key);
  return MODE_STEPS[mode].map((step) => root + step);
}

export function degreeToMidi(key: string, mode: Mode, degree: number, octave = 4): number {
  const scale = scaleMidi(key, mode, octave);
  const zeroBased = degree - 1;
  const octaves = Math.floor(zeroBased / 7);
  const index = ((zeroBased % 7) + 7) % 7;
  return scale[index]! + octaves * 12;
}

export function triadDegrees(rootDegree: number): [number, number, number] {
  return [rootDegree, rootDegree + 2, rootDegree + 4];
}

export function isScaleTone(midi: number, key: string, mode: Mode): boolean {
  const root = pitchClass(key);
  const allowed = new Set(MODE_STEPS[mode].map((s) => (root + s) % 12));
  return allowed.has(((midi % 12) + 12) % 12);
}
