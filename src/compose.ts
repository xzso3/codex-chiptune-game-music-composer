import { SeededRandom } from "./random.js";
import { degreeToMidi, triadDegrees } from "./theory.js";
import { resolveStyle } from "./stylePacks.js";
import type { ChiptuneScore, Mode, Motif, MusicBrief, NoteEvent, Section, Track } from "./types.js";

const PROGRESSIONS: Record<string, number[][]> = {
  exploration: [[1, 6, 4, 5], [1, 4, 6, 5], [1, 7, 6, 4]],
  town: [[1, 4, 2, 5], [1, 6, 2, 5], [1, 3, 4, 5]],
  battle: [[1, 6, 7, 1], [1, 4, 7, 5], [1, 7, 6, 7]],
  boss: [[1, 6, 4, 7], [1, 7, 6, 5], [1, 2, 6, 7]],
};

const DEFAULT_MODES: Record<string, Mode> = {
  exploration: "dorian",
  town: "major",
  battle: "minor",
  boss: "minor",
};

const ROLE_INSTRUMENT: Record<string, string> = {
  lead: "square_lead",
  counter: "pulse_counter",
  arp: "chip_arp",
  bass: "triangle_synth",
  drums: "hybrid_chip_drums",
  texture: "digital_pad",
};

function clamp01(v: number): number { return Math.max(0, Math.min(1, v)); }

function makeForm(bars: 16 | 32): Section[] {
  if (bars === 16) return [
    { id: "A", startBar: 0, bars: 8, tension: 0.45 },
    { id: "B", startBar: 8, bars: 8, tension: 0.68 },
  ];
  return [
    { id: "A", startBar: 0, bars: 8, tension: 0.45 },
    { id: "B", startBar: 8, bars: 8, tension: 0.7 },
    { id: "A2", startBar: 16, bars: 8, tension: 0.58 },
    { id: "B2", startBar: 24, bars: 8, tension: 0.82 },
  ];
}

function makeMotif(rng: SeededRandom, density: number): Motif {
  const degreeShapes = [
    [1, 3, 5, 6, 5, 3],
    [1, 2, 3, 5, 3, 2],
    [5, 3, 1, 2, 3, 5],
    [1, 5, 4, 3, 2, 3],
    [1, 3, 4, 5, 7, 5],
  ] as const;
  const dense = [0.5, 0.5, 0.5, 0.5, 1, 1];
  const sparse = [1, 0.5, 1, 0.5, 1, 2];
  return {
    id: "motif.main",
    degrees: [...rng.pick(degreeShapes)],
    rhythm: density > 0.55 ? dense : sparse,
  };
}

function transposeDegree(degree: number, delta: number): number {
  return Math.max(1, degree + delta);
}

function renderLead(motif: Motif, bars: number, key: string, mode: Mode, rng: SeededRandom, density: number): NoteEvent[] {
  const events: NoteEvent[] = [];
  let t = 0;
  const totalBeats = bars * 4;
  let phrase = 0;
  while (t < totalBeats) {
    const sectionVariation = phrase % 4 === 3 ? 1 : phrase % 3 === 2 ? -1 : 0;
    for (let i = 0; i < motif.degrees.length && t < totalBeats; i++) {
      const dur = motif.rhythm[i % motif.rhythm.length]!;
      if (rng.next() <= Math.max(0.3, density)) {
        const degree = transposeDegree(motif.degrees[i]!, sectionVariation);
        events.push({
          start: t,
          duration: Math.min(dur * 0.9, totalBeats - t),
          midi: degreeToMidi(key, mode, degree, 5),
          velocity: 88 + rng.int(-7, 7),
        });
      }
      t += dur;
    }
    phrase++;
  }
  return events;
}

function renderCounter(lead: NoteEvent[], key: string, mode: Mode): NoteEvent[] {
  return lead
    .filter((_, i) => i % 4 === 1)
    .map((note, i) => ({
      start: note.start + (i % 2 ? 0.5 : 1),
      duration: Math.max(0.25, note.duration * 0.75),
      midi: degreeToMidi(key, mode, i % 2 ? 5 : 3, 4),
      velocity: 68,
    }));
}

function renderArp(bars: number, progression: number[], key: string, mode: Mode, density: number): NoteEvent[] {
  const events: NoteEvent[] = [];
  const step = density >= 0.7 ? 0.25 : density >= 0.4 ? 0.5 : 1;
  for (let bar = 0; bar < bars; bar++) {
    const rootDegree = progression[bar % progression.length]!;
    const chord = triadDegrees(rootDegree);
    for (let beat = 0; beat < 4; beat += step) {
      if (density < 0.35 && Math.floor(beat * 2) % 2 === 1) continue;
      const index = Math.floor(beat / step) % chord.length;
      events.push({
        start: bar * 4 + beat,
        duration: step * 0.72,
        midi: degreeToMidi(key, mode, chord[index]!, 4),
        velocity: 55 + Math.round(density * 20),
      });
    }
  }
  return events;
}

function renderBass(bars: number, progression: number[], key: string, mode: Mode, drive: number): NoteEvent[] {
  const events: NoteEvent[] = [];
  const step = drive > 0.75 ? 0.5 : 1;
  for (let bar = 0; bar < bars; bar++) {
    const root = progression[bar % progression.length]!;
    for (let beat = 0; beat < 4; beat += step) {
      const degree = drive > 0.8 && Math.floor(beat / step) % 4 === 3 ? root + 4 : root;
      events.push({
        start: bar * 4 + beat,
        duration: step * 0.86,
        midi: degreeToMidi(key, mode, degree, 2),
        velocity: 76,
      });
    }
  }
  return events;
}

function renderDrums(bars: number, drive: number, electro: boolean): NoteEvent[] {
  const events: NoteEvent[] = [];
  for (let bar = 0; bar < bars; bar++) {
    const base = bar * 4;
    for (let beat = 0; beat < 4; beat++) {
      if (electro || beat === 0 || beat === 2) events.push({ start: base + beat, duration: 0.1, midi: 36, velocity: 92 });
      if (beat === 1 || beat === 3) events.push({ start: base + beat, duration: 0.1, midi: 38, velocity: 86 });
      if (drive > 0.65) {
        events.push({ start: base + beat + 0.5, duration: 0.08, midi: 42, velocity: 58 });
        if (drive > 0.88) events.push({ start: base + beat + 0.25, duration: 0.06, midi: 42, velocity: 45 });
      }
    }
  }
  return events;
}

function renderTexture(bars: number, progression: number[], key: string, mode: Mode): NoteEvent[] {
  const events: NoteEvent[] = [];
  for (let bar = 0; bar < bars; bar += 2) {
    const root = progression[bar % progression.length]!;
    for (const degree of triadDegrees(root)) {
      events.push({ start: bar * 4, duration: 7.5, midi: degreeToMidi(key, mode, degree, 3), velocity: 40 });
    }
  }
  return events;
}

export function compose(brief: MusicBrief): ChiptuneScore {
  const seed = brief.seed ?? 1337;
  const rng = new SeededRandom(seed);
  const style = resolveStyle(brief.stylePack, {
    chiptuneStrength: brief.chiptuneStrength,
    modernStrength: brief.modernStrength,
  });
  const bars = brief.durationBars ?? 16;
  const mode = brief.mode ?? DEFAULT_MODES[brief.gameRole];
  const key = brief.key ?? rng.pick(["C", "D", "E", "F", "G", "A"] as const);
  const bpm = brief.bpm ?? rng.int(style.bpmRange[0], style.bpmRange[1]);
  const progression = [...rng.pick(PROGRESSIONS[brief.gameRole]!)];
  const motif = makeMotif(rng, style.melodicDensity);

  const lead = renderLead(motif, bars, key, mode, rng, style.melodicDensity);
  const tracks: Track[] = [
    { id: "track.lead", role: "lead", instrument: ROLE_INSTRUMENT.lead!, notes: lead },
    { id: "track.arp", role: "arp", instrument: ROLE_INSTRUMENT.arp!, notes: renderArp(bars, progression, key, mode, style.arpDensity) },
    { id: "track.bass", role: "bass", instrument: ROLE_INSTRUMENT.bass!, notes: renderBass(bars, progression, key, mode, style.rhythmicDrive) },
  ];

  if (style.preferredRoles.includes("counter")) tracks.push({
    id: "track.counter", role: "counter", instrument: ROLE_INSTRUMENT.counter!, notes: renderCounter(lead, key, mode),
  });
  if (style.preferredRoles.includes("drums")) tracks.push({
    id: "track.drums", role: "drums", instrument: ROLE_INSTRUMENT.drums!, notes: renderDrums(bars, style.rhythmicDrive, style.id === "chip-electro"),
  });
  if (style.preferredRoles.includes("texture")) tracks.push({
    id: "track.texture", role: "texture", instrument: ROLE_INSTRUMENT.texture!, notes: renderTexture(bars, progression, key, mode),
  });

  return {
    version: "0.1",
    meta: { title: brief.title ?? `${brief.gameRole}-${brief.stylePack}`, seed },
    music: { bpm, key, mode, meter: [4, 4], bars },
    intent: { gameRole: brief.gameRole, mood: brief.mood },
    style: {
      ...style,
      chiptuneStrength: clamp01(style.chiptuneStrength),
      modernStrength: clamp01(style.modernStrength),
    },
    form: makeForm(bars),
    harmony: { progression, chordBeats: 4 },
    motifs: [motif],
    tracks,
    loop: { startBar: 0, endBar: bars },
  };
}
