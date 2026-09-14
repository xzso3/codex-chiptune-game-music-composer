# Codex Chiptune Game Music Composer

[简体中文](README.zh-CN.md)

A Codex-oriented **skill + deterministic tool pipeline** for composing editable, loopable, chiptune-inspired game music.

This project targets **Chiptune-inspired** music rather than strict historical 8-bit hardware emulation. Chiptune is treated as a compositional/timbral language that can be combined with Rock, Electronic and Ambient grammar.

## What this MVP does

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

Supported game roles: `exploration`, `town`, `battle`, `boss`.

Supported style packs: `chip-core`, `chip-rock`, `chip-electro`, `chip-ambient`.

The canonical editable source is `score.chiptune.json`; MIDI/WAV/editor files are derivatives.

## 5-minute quick start

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/xzso3/codex-chiptune-game-music-composer.git
cd codex-chiptune-game-music-composer
npm install
npm run typecheck
npm test
npm run compose -- examples/boss-rock.brief.json ./boss-rock-out
```

Expected output:

```text
boss-rock-out/
├── brief.json
├── score.chiptune.json
├── validation.json
├── song.mid
├── preview.wav
└── song.beepbox-bridge.json
```

Listen to `preview.wav`, inspect `validation.json`, and keep `score.chiptune.json` as the editable source of truth.

For a complete walkthrough, see **[Step-by-step Usage Guide](docs/STEP_BY_STEP.md)**.

## Use with Codex

Open the repository in Codex and ask it to use `SKILL.md` for a chiptune game-music task. A useful request is:

> Use the chiptune game music composer skill. Create a fast, tense but heroic Chiptune + Rock boss loop. Keep the lead memorable, use a 32-bar form, and validate the result.

Codex should:

1. interpret gameplay/music intent;
2. build a structured `MusicBrief`;
3. choose the nearest style pack;
4. run the deterministic composer;
5. inspect validation;
6. listen to the preview when possible;
7. preserve stable material during revisions;
8. return editable artifacts, not only rendered audio.

See [Codex Workflow](docs/CODEX_WORKFLOW.md) for the full agent workflow.

## Manual composition

Create or edit a brief:

```json
{
  "title": "heroic-boss",
  "gameRole": "boss",
  "mood": ["tense", "heroic"],
  "stylePack": "chip-rock",
  "durationBars": 32,
  "seed": 42731
}
```

Run:

```bash
npm run compose -- brief.json output/heroic-boss
```

Use the same brief + seed to reproduce the same `ChiptuneScore`.

## Revision

```bash
npm run revise -- \
  boss-rock-out/score.chiptune.json \
  examples/boss-rock.revision.json \
  boss-rock-out/score.revised.chiptune.json

npm run validate -- boss-rock-out/score.revised.chiptune.json
```

Stable IDs let you preserve musical material such as `motif.main`, `track.lead`, `track.arp`, `track.drums`, `section.A`, and `section.B`.

Example revision:

```json
{
  "lock": ["motif.main", "track.lead"],
  "arpDensity": 0.35,
  "drumStrength": 0.9,
  "sectionTension": { "B": 0.9 }
}
```

## Output files

| File | Purpose |
| --- | --- |
| `brief.json` | normalized composition request |
| `score.chiptune.json` | canonical editable score/IR |
| `validation.json` | errors, warnings and metrics |
| `song.mid` | downstream MIDI editing/production |
| `preview.wav` | fast built-in PCM sketch renderer |
| `song.beepbox-bridge.json` | versioned editor-bridge manifest |

The built-in preview renderer uses simple square/pulse/triangle-like oscillators, noise percussion, basic envelopes and mono 44.1 kHz/16-bit PCM. It is intended for listening and regression checks, not final mastering.

## Repository map

```text
SKILL.md                         Codex playbook
SKILL.zh-CN.md                   Chinese mirror of the playbook
schemas/                         machine-readable contracts
src/                             deterministic composer core
cli/                             compose / revise / validate commands
references/                      lazily loaded music knowledge
references/*.zh-CN.md            Chinese knowledge mirrors
docs/                            research, architecture, decisions and tutorials
docs/*.zh-CN.md                  Chinese documentation mirrors
evals/                           golden prompt matrix
examples/                        runnable example briefs/revisions
tests/                           automated regression tests
.github/workflows/ci.yml         CI smoke test
```

## Architecture principles

- **Chiptune is grammar, not console law.** The project prioritizes motif, arp, pulse/square identity, active bass, digital percussion and compact loop forms instead of NES/Game Boy channel legality.
- **Symbolic/editable first.** `ChiptuneScore` sits above MIDI and audio so revisions can address semantic components such as `track.arp` or `section.B`.
- **LLM for intent; code for mechanics.** Codex decides what the music should do; deterministic TypeScript handles seeded composition, timing, note generation, validation and export.
- **Game-loop quality matters.** Validation includes structural checks and a heuristic `loopFatigueRisk`.

## Important limitations

v0.1 is deliberately not a professional DAW/VST production system, final mixing/mastering pipeline, hardware-authentic chip emulator, neural music model, adaptive runtime music engine, or direct serializer for BeepBox's private/evolving song format.

## Documentation

English / 中文:

- [Step-by-step Usage Guide](docs/STEP_BY_STEP.md) / [逐步使用教程](docs/STEP_BY_STEP.zh-CN.md)
- [Research Synthesis](docs/RESEARCH_SYNTHESIS.md) / [研究总结](docs/RESEARCH_SYNTHESIS.zh-CN.md)
- [MVP Specification](docs/MVP_SPEC.md) / [MVP 规格](docs/MVP_SPEC.zh-CN.md)
- [Architecture](docs/ARCHITECTURE.md) / [架构](docs/ARCHITECTURE.zh-CN.md)
- [Decision Log](docs/DECISION_LOG.md) / [决策日志](docs/DECISION_LOG.zh-CN.md)
- [Implementation Log](docs/IMPLEMENTATION_LOG.md) / [实现日志](docs/IMPLEMENTATION_LOG.zh-CN.md)
- [Evaluation Plan](docs/EVAL_PLAN.md) / [评测计划](docs/EVAL_PLAN.zh-CN.md)
- [Codex Workflow](docs/CODEX_WORKFLOW.md) / [Codex 工作流](docs/CODEX_WORKFLOW.zh-CN.md)

Reference mirrors:

- [Chiptune Grammar](references/chiptune-grammar.md) / [Chiptune 编曲语法](references/chiptune-grammar.zh-CN.md)
- [Game Music](references/game-music.md) / [游戏音乐](references/game-music.zh-CN.md)
- [Music Theory](references/music-theory.md) / [基础乐理](references/music-theory.zh-CN.md)
- [Style Packs](references/style-packs.md) / [风格包](references/style-packs.zh-CN.md)

## Development checks

```bash
npm run typecheck
npm test
npm run compose -- examples/boss-rock.brief.json /tmp/chiptune-mvp
```

The next iteration should be driven by the 48-output evaluation set rather than feature accumulation.