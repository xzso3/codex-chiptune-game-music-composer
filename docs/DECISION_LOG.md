# Decision Log

## D-001 — Chiptune-inspired over hardware-authentic

**Status:** accepted

The project targets the compositional/timbral language associated with chiptune, not strict NES/Game Boy/C64 hardware constraints.

Reason: the intended game-music use case benefits from modern layering, effects, additional voices and hybrid genres. Historical chip accuracy would add substantial complexity without serving the primary goal.

## D-002 — ChiptuneScore is canonical

**Status:** accepted

Do not use MIDI, WAV, tracker formats or BeepBox serialization as the source of truth.

Reason: revisions need stable semantic roles and IDs. Render/export formats are lossy or implementation-specific.

## D-003 — Hybrid LLM + deterministic composer

**Status:** accepted

Codex handles game/music intent and workflow decisions. TypeScript code handles seeded composition, music-theory mechanics, validation and export.

Reason: raw LLM note emission is difficult to reproduce, test and surgically revise.

## D-004 — Four style packs only in v0.1

**Status:** accepted

`chip-core`, `chip-rock`, `chip-electro`, `chip-ambient`.

Reason: they span neutral chiptune, riff-driven high energy, sequenced/dance energy and sparse atmosphere. This is enough to test whether style translation works before expanding genre coverage.

## D-005 — Built-in preview renderer

**Status:** accepted

Provide a minimal WAV renderer rather than requiring a DAW/VST stack.

Reason: every Codex environment should be able to produce an audible smoke-test artifact. Final production quality remains out of scope.

## D-006 — BeepBox is an adapter, not an IR

**Status:** accepted

v0.1 exports MIDI plus a versioned BeepBox bridge manifest, not an unverified direct private-format serializer.

Reason: coupling the core model to an external editor's evolving internal JSON is fragile. A dedicated tested adapter can be added after the composition model is validated.

## D-007 — Partial revision belongs in MVP

**Status:** accepted

Support stable IDs, locks, arp-density changes, drum-strength changes and section-tension edits.

Reason: the product hypothesis is a **composer agent**, not a one-shot generator. Iteration must be represented from the first version.

## D-008 — No neural music generation in v0.1

**Status:** accepted

Reason: neural audio would make it difficult to determine whether failures originate in composition, rendering or model behavior. The first MVP isolates symbolic composition quality.
