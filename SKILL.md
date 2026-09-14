---
name: chiptune-game-music-composer
description: Compose, validate, revise, and export editable chiptune-inspired game-music loops from game-scene briefs. Use for chiptune/8-bit-inspired BGM, especially game loops, battle/boss/town/exploration cues, and Chiptune + Rock/Electronic/Ambient hybrids.
---

# Chiptune Game Music Composer

Use this skill when the user wants chiptune-inspired **game music**, not hardware-authentic NES/Game Boy emulation.

## Scope

v0.1 supports:
- game roles: `exploration`, `town`, `battle`, `boss`
- style packs: `chip-core`, `chip-rock`, `chip-electro`, `chip-ambient`
- deterministic 16/32-bar loops with a seed
- ChiptuneScore JSON as canonical source
- MIDI, WAV preview, BeepBox bridge manifest
- structural/music heuristics and loop-fatigue checks
- lock-aware local revision for arp density, drum strength, and section tension

Do not claim v0.1 provides professional mastering, DAW/VST production, hardware-authentic chip emulation, adaptive runtime music, or direct BeepBox private-format serialization.

## Required workflow

1. Read the user's scene/gameplay intent. Do not ask for music-theory parameters unless the user explicitly wants control.
2. Convert the request to `MusicBrief` JSON using `schemas/music-brief.schema.json`.
3. Choose one style pack:
   - neutral/classic chiptune -> `chip-core`
   - riffs, aggressive battle energy -> `chip-rock`
   - sequenced/dance/tech energy -> `chip-electro`
   - sparse/exploration/atmospheric -> `chip-ambient`
4. Select defaults when absent:
   - `durationBars`: 16 for short/UI/simple loops, otherwise 32 for richer cues.
   - `seed`: choose and record an integer so the result is reproducible.
   - key/mode/BPM: allow the deterministic composer to choose unless requested.
5. Run the composer:

```bash
npm install
npm run compose -- path/to/brief.json path/to/output
```

6. Inspect `validation.json`. If `valid=false`, fix the brief/implementation before presenting output. Warnings are review signals, not automatic rejection.
7. Listen to `preview.wav` when the environment permits audio inspection. Treat it as a sketch renderer, not final production audio.
8. Keep `score.chiptune.json` as the canonical editable artifact. MIDI and preview files are derivatives.
9. When the user asks for a revision, preserve requested material. Prefer `cli/revise.ts` for supported local changes; otherwise patch the ChiptuneScore deliberately and re-run validation/export.
10. Report what changed, the seed, selected style pack, validation status, and known limitations.

## Revision contract

A revision may lock stable IDs such as:
- `motif.main`
- `track.lead`
- `track.arp`
- `track.drums`
- `section.A`
- `section.B`

Example:

```json
{
  "lock": ["motif.main", "track.lead"],
  "arpDensity": 0.35,
  "drumStrength": 0.9,
  "sectionTension": { "B": 0.9 }
}
```

Run:

```bash
npx tsx cli/revise.ts output/score.chiptune.json revision.json output/score.revised.chiptune.json
npm run validate -- output/score.revised.chiptune.json
```

## Knowledge routing

Load only the references needed for the task:
- `references/chiptune-grammar.md` for composition language.
- `references/game-music.md` for looping and game-role decisions.
- `references/style-packs/*.md` for secondary-style translation.
- `docs/ARCHITECTURE.md` when changing the implementation or IR.

## Quality bar

Before completion verify:
- deterministic repeatability for the same brief + seed;
- MIDI timing stays within the song bounds;
- lead/bass/arp roles remain distinguishable;
- motif recurrence is audible but not exact-copy-only;
- loop does not end with a strongly terminal one-shot cadence unless requested;
- high arp/high-register density warnings are considered for long loops;
- generated artifacts remain editable via ChiptuneScore/MIDI.

## Non-goals

Do not optimize for historical chip accuracy. Chiptune is treated as a compositional/timbral language that can be combined with modern production and other genres.
