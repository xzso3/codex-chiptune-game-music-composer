# Codex Chiptune Game Music Composer

A Codex-oriented **skill + deterministic tool pipeline** for composing editable, loopable, chiptune-inspired game music.

This project intentionally targets **Chiptune-inspired** music rather than strict historical 8-bit hardware emulation. Chiptune is treated as a compositional/timbral language that can be combined with Rock, Electronic and Ambient grammar.

## MVP v0.1

The first MVP proves one workflow:

```text
Natural-language game scene
        ↓
Codex + SKILL.md
        ↓
MusicBrief
        ↓
Deterministic Composer Core
        ↓
ChiptuneScore v0.1
        ↓
Validation + MIDI + WAV preview + editor bridge
        ↓
Lock-aware revision
```

### Supported game roles

- exploration
- town
- battle
- boss

### Supported style packs

- `chip-core`
- `chip-rock`
- `chip-electro`
- `chip-ambient`

## Quick start

```bash
npm install
npm run typecheck
npm test
npm run compose -- examples/boss-rock.brief.json ./boss-rock-out
```

Output:

```text
boss-rock-out/
├── brief.json
├── score.chiptune.json
├── validation.json
├── song.mid
├── preview.wav
└── song.beepbox-bridge.json
```

The canonical editable source is `score.chiptune.json`. MIDI/WAV/editor files are derivatives.

## Revision

```bash
npm run revise -- \
  boss-rock-out/score.chiptune.json \
  examples/boss-rock.revision.json \
  boss-rock-out/score.revised.chiptune.json

npm run validate -- boss-rock-out/score.revised.chiptune.json
```

Stable IDs allow instructions such as:

> Keep `motif.main` / `track.lead`, reduce the arp, strengthen drums, and increase section B tension.

## Use as a Codex Skill

`SKILL.md` is the workflow entry point. Open the repository in Codex and explicitly ask Codex to use the skill for a chiptune game-music task, or install/share the skill using the Codex/Skills workflow available in your environment.

The skill instructs Codex to:

1. interpret gameplay/music intent;
2. build a structured brief;
3. route to the nearest style pack;
4. run deterministic composition tools;
5. inspect validation;
6. preserve stable material during revisions;
7. return editable artifacts rather than only a rendered audio file.

## Repository map

```text
SKILL.md                         Codex playbook
schemas/                         machine-readable contracts
src/                             deterministic composer core
cli/                             compose / revise / validate commands
references/                      lazily loaded music knowledge
docs/                            research, architecture, decisions, MVP spec
evals/                           golden prompt matrix
examples/                        runnable example briefs/revisions
tests/                           automated regression tests
.github/workflows/ci.yml         CI smoke test
```

## Architecture principles

### Chiptune is grammar, not console law

The project prioritizes motif, arp, pulse/square identity, active bass, digital percussion, compact form and repetition/variation. It does not require NES/Game Boy channel legality.

### Symbolic/editable first

`ChiptuneScore` sits above MIDI and audio so later edits can address semantic components such as `track.arp` or `section.B`.

### LLM for intent; code for mechanics

Codex decides what the music should do. Deterministic TypeScript code handles seed reproducibility, music-theory mapping, note generation, validation and export.

### Game-loop quality matters

The validator exposes basic structural findings plus a heuristic `loopFatigueRisk` derived from arp occupancy, rapid-note pressure, register activity and repetition.

## Important limitations

v0.1 is deliberately not:

- a professional DAW/VST production system;
- a final mixing/mastering pipeline;
- a strict NES/Game Boy/SID emulator;
- a neural music-generation model;
- an adaptive runtime music engine;
- a direct serializer for BeepBox's private/evolving song format.

The built-in `preview.wav` renderer is for fast listening and regression checks. Use MIDI/ChiptuneScore for downstream production.

## Research and process documents

Start with:

- [`docs/RESEARCH_SYNTHESIS.md`](docs/RESEARCH_SYNTHESIS.md)
- [`docs/MVP_SPEC.md`](docs/MVP_SPEC.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/DECISION_LOG.md`](docs/DECISION_LOG.md)
- [`docs/IMPLEMENTATION_LOG.md`](docs/IMPLEMENTATION_LOG.md)
- [`docs/EVAL_PLAN.md`](docs/EVAL_PLAN.md)
- [`docs/CODEX_WORKFLOW.md`](docs/CODEX_WORKFLOW.md)

## Current research references

The design was informed by OpenAI Skills/Codex guidance and existing music/chiptune tools including BeepBox, FamiStudio, Furnace, `codex-game-music-skill`, `midi-composer-mcp`, and `algo-chip`. See the research synthesis for links and the reasoning behind what was adopted or rejected.

## Next likely iteration

v0.2 should be driven by the 48-output evaluation set rather than by feature accumulation. Likely candidates include richer motif transformation, non-diatonic harmony, stronger section-level tension mapping, improved stereo/stem rendering, and a tested direct editor adapter.
