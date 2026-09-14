import type { StylePackId, StyleProfile } from "./types.js";

export const STYLE_PACKS: Record<StylePackId, StyleProfile> = {
  "chip-core": {
    id: "chip-core",
    bpmRange: [110, 150],
    melodicDensity: 0.72,
    arpDensity: 0.62,
    rhythmicDrive: 0.62,
    harmonicComplexity: 0.38,
    chiptuneStrength: 0.9,
    modernStrength: 0.25,
    preferredRoles: ["lead", "counter", "arp", "bass", "drums"],
    description: "Motif-forward square/pulse language with active bass and concise loop form.",
  },
  "chip-rock": {
    id: "chip-rock",
    bpmRange: [140, 190],
    melodicDensity: 0.78,
    arpDensity: 0.45,
    rhythmicDrive: 0.92,
    harmonicComplexity: 0.42,
    chiptuneStrength: 0.82,
    modernStrength: 0.5,
    preferredRoles: ["lead", "counter", "arp", "bass", "drums"],
    description: "Chiptune translated through riff logic, backbeat, fifth motion and aggressive bass locking.",
  },
  "chip-electro": {
    id: "chip-electro",
    bpmRange: [125, 175],
    melodicDensity: 0.68,
    arpDensity: 0.82,
    rhythmicDrive: 0.88,
    harmonicComplexity: 0.36,
    chiptuneStrength: 0.78,
    modernStrength: 0.68,
    preferredRoles: ["lead", "arp", "bass", "drums", "texture"],
    description: "Sequenced sixteenth-note energy, repetitive hooks, dance-derived pulse and automation-friendly space.",
  },
  "chip-ambient": {
    id: "chip-ambient",
    bpmRange: [70, 120],
    melodicDensity: 0.35,
    arpDensity: 0.28,
    rhythmicDrive: 0.25,
    harmonicComplexity: 0.5,
    chiptuneStrength: 0.68,
    modernStrength: 0.7,
    preferredRoles: ["lead", "arp", "bass", "texture"],
    description: "Sparse chip motifs, slow harmonic motion, negative space and modern atmospheric support.",
  },
};

export function resolveStyle(id: StylePackId, overrides?: { chiptuneStrength?: number; modernStrength?: number }): StyleProfile {
  const base = STYLE_PACKS[id];
  return {
    ...base,
    chiptuneStrength: overrides?.chiptuneStrength ?? base.chiptuneStrength,
    modernStrength: overrides?.modernStrength ?? base.modernStrength,
  };
}
