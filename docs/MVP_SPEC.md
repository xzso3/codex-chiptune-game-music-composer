# MVP v0.1 Specification

## Product statement

A Codex-oriented skill/tool pipeline that converts a natural-language game-music request into a deterministic, editable chiptune-inspired loop with validation and revision support.

## Primary user story

> As a game developer using Codex, I describe a gameplay scene and desired chiptune hybrid style. The skill produces a reusable score, MIDI, audible preview, validation report and enough metadata to revise specific parts without regenerating the entire composition.

## Supported intent vocabulary

### Game roles
- `exploration`
- `town`
- `battle`
- `boss`

### Style packs
- `chip-core`
- `chip-rock`
- `chip-electro`
- `chip-ambient`

### Loop lengths
- 16 bars
- 32 bars

## Required outputs

For one brief the compose CLI must write:

```text
output/
├── brief.json
├── score.chiptune.json
├── validation.json
├── song.mid
├── preview.wav
└── song.beepbox-bridge.json
```

`score.chiptune.json` is canonical. Other files are derivatives.

## Functional requirements

1. Same input + same seed produces identical ChiptuneScore.
2. Composer creates at least lead, arp and bass tracks; style packs may add counter, drums and texture.
3. Notes remain inside MIDI/timing bounds.
4. Song exposes stable IDs for targeted revisions.
5. Validation returns errors, warnings and quantitative metrics.
6. MIDI exporter writes a valid SMF header and independent tracks.
7. WAV renderer creates an immediately audible sketch without external plugins.
8. Revision API can lock lead/motif and modify arp density, drum strength and section tension.
9. Codex usage is described in `SKILL.md` and requires no music-theory input from the user by default.

## Quality requirements

Automated:
- TypeScript strict typecheck passes.
- Unit tests pass.
- Example compose smoke test exits successfully.
- `validation.valid` is true for golden baseline examples.

Human evaluation target for the next iteration:
- median >= 3.5/5 for Chiptune identity;
- median >= 3.5/5 for secondary style identity;
- median >= 3.5/5 for gameplay fit;
- median >= 3.5/5 for coherence;
- median >= 3.5/5 for loop acceptability.

## Explicit non-goals

- exact emulation of historical chips;
- professional production/mastering;
- automatic DAW projects;
- neural audio/music models;
- runtime adaptive-music graphs;
- direct BeepBox private JSON compatibility;
- unrestricted free-form genres;
- vocals.

## Definition of Done

The MVP is accepted when a fresh clone can run:

```bash
npm install
npm run typecheck
npm test
npm run compose -- examples/boss-rock.brief.json /tmp/chiptune-mvp
```

and produces the required bundle with `validation.valid=true`.
