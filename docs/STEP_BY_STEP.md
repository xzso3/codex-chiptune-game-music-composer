# Step-by-step Usage Guide

[简体中文](STEP_BY_STEP.zh-CN.md)

This guide walks from a fresh clone to composition, listening, validation, revision and Codex usage.

## 1. Prerequisites

Install Node.js 20+ and npm. Git is recommended.

```bash
node --version
npm --version
```

## 2. Clone and install

```bash
git clone https://github.com/xzso3/codex-chiptune-game-music-composer.git
cd codex-chiptune-game-music-composer
npm install
```

## 3. Verify the repository

```bash
npm run typecheck
npm test
```

Do not start debugging composition quality until these checks pass.

## 4. Run the bundled example

```bash
npm run compose -- examples/boss-rock.brief.json ./output/boss-rock
```

You should receive `brief.json`, `score.chiptune.json`, `validation.json`, `song.mid`, `preview.wav`, and `song.beepbox-bridge.json`.

## 5. Listen and inspect

Listen to `preview.wav`. It is intentionally a lightweight sketch renderer.

Open `validation.json` and check:
- `valid` is true;
- errors are empty;
- warnings are understood;
- note count, arp occupancy, rest ratio and loop-fatigue risk look plausible.

## 6. Create your own brief

Create `my-brief.json`:

```json
{
  "title": "night-highway",
  "gameRole": "exploration",
  "mood": ["lonely", "curious"],
  "stylePack": "chip-ambient",
  "durationBars": 32,
  "seed": 2026
}
```

Then run:

```bash
npm run compose -- my-brief.json ./output/night-highway
```

Optional fields such as BPM/key/mode should be added only when you want explicit control.

## 7. Reproduce a result

Keep the same brief and seed and compose again into another folder. `score.chiptune.json` should be identical for the same implementation revision.

## 8. Revise without regenerating everything

Create `my-revision.json`:

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
npm run revise -- \
  ./output/night-highway/score.chiptune.json \
  my-revision.json \
  ./output/night-highway/score.revised.chiptune.json

npm run validate -- ./output/night-highway/score.revised.chiptune.json
```

If you need new MIDI/WAV derivatives after a revision, use the compose/export workflow in Codex or extend the CLI export path as needed.

## 9. Use the skill in Codex

Open this repository as the Codex workspace and say:

> Use `SKILL.md`. Compose a Chiptune + Electronic battle loop for a fast cyberpunk combat scene. Keep it energetic but leave room for SFX. Use 32 bars, pick a reproducible seed, run validation, and return the artifacts.

For a revision:

> Keep the main motif and lead. Reduce arp density, strengthen the drums, and make section B more tense. Revalidate afterward.

Codex should translate these instructions into the schema/CLI instead of manually emitting thousands of raw note events.

## 10. Choose a style pack

- `chip-core`: neutral recognizable chiptune.
- `chip-rock`: riff/backbeat/high-drive battle or boss cues.
- `chip-electro`: sequenced/dance/tech energy with denser arp.
- `chip-ambient`: sparse exploration/atmospheric cues.

## 11. Understand the outputs

`score.chiptune.json` is the source of truth. `song.mid` is for downstream editing, `preview.wav` is a sketch, `validation.json` is QA, and `song.beepbox-bridge.json` is an adapter manifest rather than native BeepBox JSON.

## 12. Troubleshooting

### `npm install` fails
Check Node/npm versions and network/package registry access.

### TypeScript fails
Run `npm run typecheck` and fix implementation errors before composing.

### `validation.valid=false`
Read `errors` first; do not ignore timing/pitch/export failures.

### The preview sounds too raw
Expected in v0.1. Judge composition separately from renderer quality and use `song.mid` / `ChiptuneScore` for downstream production.

### The music feels repetitive
Try another style pack/seed or reduce arp density; inspect `loopFatigueRisk`. Structural improvements belong in composer rules, not one-off manual note hacking.

## 13. Development loop

```text
reproduce issue
→ classify composition vs renderer vs validator problem
→ update docs/decision if architecture changes
→ implement
→ typecheck/test
→ run golden prompts
→ listen/inspect
→ PR
```

See `docs/CODEX_WORKFLOW.md` and `docs/EVAL_PLAN.md` for the full development/evaluation workflow.