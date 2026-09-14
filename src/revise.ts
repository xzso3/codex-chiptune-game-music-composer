import type { ChiptuneScore } from "./types.js";

export interface RevisionRequest {
  lock?: string[];
  arpDensity?: number;
  drumStrength?: number;
  sectionTension?: Record<string, number>;
}

function clamp01(v: number): number { return Math.max(0, Math.min(1, v)); }

export function reviseScore(input: ChiptuneScore, request: RevisionRequest): ChiptuneScore {
  const score: ChiptuneScore = structuredClone(input);
  const locked = new Set(request.lock ?? []);

  if (request.arpDensity !== undefined && !locked.has("track.arp")) {
    const target = clamp01(request.arpDensity);
    score.style.arpDensity = target;
    const arp = score.tracks.find((t) => t.id === "track.arp");
    if (arp && arp.notes.length > 0) {
      const keepEvery = target >= 0.75 ? 1 : target >= 0.5 ? 2 : target >= 0.25 ? 3 : 4;
      arp.notes = arp.notes.filter((_, i) => i % keepEvery === 0);
    }
  }

  if (request.drumStrength !== undefined && !locked.has("track.drums")) {
    const strength = clamp01(request.drumStrength);
    const drums = score.tracks.find((t) => t.id === "track.drums");
    if (drums) {
      drums.notes = drums.notes.map((n) => ({ ...n, velocity: Math.max(20, Math.min(127, Math.round(45 + strength * 82))) }));
    }
  }

  if (request.sectionTension) {
    for (const section of score.form) {
      const requested = request.sectionTension[section.id];
      if (requested !== undefined && !locked.has(`section.${section.id}`)) section.tension = clamp01(requested);
    }
  }

  return score;
}
