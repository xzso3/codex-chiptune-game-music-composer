export type GameRole = "exploration" | "town" | "battle" | "boss";
export type StylePackId = "chip-core" | "chip-rock" | "chip-electro" | "chip-ambient";
export type Mode = "major" | "minor" | "dorian" | "mixolydian";
export type TrackRole = "lead" | "counter" | "arp" | "bass" | "drums" | "texture";

export interface MusicBrief {
  title?: string;
  gameRole: GameRole;
  mood: string[];
  stylePack: StylePackId;
  durationBars?: 16 | 32;
  bpm?: number;
  key?: string;
  mode?: Mode;
  seed?: number;
  chiptuneStrength?: number;
  modernStrength?: number;
}

export interface StyleProfile {
  id: StylePackId;
  bpmRange: [number, number];
  melodicDensity: number;
  arpDensity: number;
  rhythmicDrive: number;
  harmonicComplexity: number;
  chiptuneStrength: number;
  modernStrength: number;
  preferredRoles: TrackRole[];
  description: string;
}

export interface NoteEvent {
  start: number; // beats from song start
  duration: number;
  midi: number;
  velocity: number;
}

export interface DrumEvent {
  start: number;
  duration: number;
  midi: number;
  velocity: number;
}

export interface Section {
  id: string;
  startBar: number;
  bars: number;
  tension: number;
}

export interface Motif {
  id: string;
  degrees: number[];
  rhythm: number[];
}

export interface Track {
  id: string;
  role: TrackRole;
  instrument: string;
  notes: NoteEvent[];
}

export interface ChiptuneScore {
  version: "0.1";
  meta: {
    title: string;
    seed: number;
  };
  music: {
    bpm: number;
    key: string;
    mode: Mode;
    meter: [4, 4];
    bars: number;
  };
  intent: {
    gameRole: GameRole;
    mood: string[];
  };
  style: StyleProfile;
  form: Section[];
  harmony: {
    progression: number[];
    chordBeats: number;
  };
  motifs: Motif[];
  tracks: Track[];
  loop: {
    startBar: number;
    endBar: number;
  };
}

export interface ValidationFinding {
  severity: "error" | "warning" | "info";
  code: string;
  message: string;
}

export interface ValidationReport {
  valid: boolean;
  findings: ValidationFinding[];
  metrics: {
    noteCount: number;
    motifReuse: number;
    arpOccupancy: number;
    restRatio: number;
    loopFatigueRisk: number;
  };
}
