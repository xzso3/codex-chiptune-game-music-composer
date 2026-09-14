# Implementation Log — MVP v0.1

## Phase 0 — Research narrowing

Initial investigation covered general game-music composition, adaptive music, symbolic MIDI workflows, audio generators and middleware. Scope was then deliberately narrowed twice:

1. general game music -> chiptune/8-bit family;
2. hardware-authentic chiptune -> chiptune-inspired modern game music.

The second narrowing changed the architecture materially: hardware channel profiles stopped being canonical, and Style Grammar + symbolic arrangement became the center of the system.

## Phase 1 — MVP freeze

Frozen product hypothesis:

> Codex can interpret a short game-scene request and use deterministic music tools to create, validate, export and revise a coherent chiptune-inspired loop.

Frozen packs: Core, Rock, Electronic, Ambient.

Frozen roles: Exploration, Town, Battle, Boss.

## Phase 2 — Core implementation

Implemented:
- `MusicBrief` and `ChiptuneScore` TypeScript contracts;
- deterministic xorshift seed source;
- scale/mode degree mapping;
- role-specific progression pools;
- short motif generation and phrase-level variation;
- lead/counter/arp/bass/drum/texture renderers;
- style-pack parameterization;
- structural validator and loop-fatigue heuristic;
- dependency-free Standard MIDI File exporter;
- built-in PCM chiptune preview renderer;
- versioned BeepBox bridge manifest;
- lock-aware partial revision API;
- CLI entry points;
- unit tests and CI smoke test.

## Phase 3 — Codex packaging

`SKILL.md` defines:
- activation conditions;
- natural-language-to-brief workflow;
- style-pack routing;
- compose/validate/revise commands;
- knowledge routing;
- quality gates;
- v0.1 non-goals.

Schemas and references are kept outside `SKILL.md` to avoid turning the playbook into a music encyclopedia.

## Known shortcuts in v0.1

The implementation intentionally uses simple heuristics:
- harmonic progressions are diatonic degree sequences;
- motif variation is small degree displacement rather than a full transformation engine;
- counterpoint is rule-lite;
- style parameters such as harmonic complexity are partly descriptive and not yet fully consumed;
- the preview renderer is deliberately lo-fi and mono;
- loop validation is structural/heuristic rather than audio-boundary analysis;
- BeepBox output is a bridge manifest, not direct editor JSON.

These shortcuts are acceptable for the first hypothesis test and are explicitly tracked for v0.2 research.
