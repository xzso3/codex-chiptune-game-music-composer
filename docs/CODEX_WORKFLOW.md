# Codex Workflow

## Install as a working repository

Open the repository in Codex and tell Codex to use `SKILL.md` for chiptune game-music tasks. The repository keeps the playbook, references, schemas and scripts together so a Codex session can inspect or modify the implementation when needed.

## Normal composition request

User request example:

> Create a chiptune + rock boss loop. Fast and tense but still heroic. Keep the main melody memorable and avoid horror aesthetics.

Codex should:

1. map the request to a `MusicBrief`;
2. record a reproducible seed;
3. run the compose CLI;
4. inspect `validation.json`;
5. listen/inspect preview when possible;
6. return the artifact paths and a concise musical summary.

Example brief:

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

Command:

```bash
npm install
npm run compose -- brief.json output/heroic-boss
```

## Revision request

User:

> Keep the melody, reduce the arp, strengthen the drums, and make B more tense.

Codex should translate that into a revision request rather than regenerating from scratch:

```json
{
  "lock": ["motif.main", "track.lead"],
  "arpDensity": 0.35,
  "drumStrength": 0.9,
  "sectionTension": { "B": 0.9 }
}
```

Then run:

```bash
npm run revise -- output/score.chiptune.json revision.json output/score.revised.chiptune.json
npm run validate -- output/score.revised.chiptune.json
```

## When Codex should edit the implementation

Treat a user composition request and a composer-engine change as separate tasks.

Edit `src/` only when:
- a requested musical operation is unsupported by the current IR/tool API;
- repeated examples expose a systemic rule problem;
- adding a new style pack or validator;
- extending export/render backends.

Do not patch algorithms just to force one seed to sound better unless the change generalizes and is covered by tests/evals.

## Suggested Codex development loop

```text
research/issue
   -> branch/worktree
   -> update spec/decision log if architecture changes
   -> implement
   -> typecheck/test
   -> golden prompt smoke runs
   -> review generated artifacts
   -> PR
```

The repo is intentionally compatible with the normal Codex + Git worktree/PR workflow rather than requiring a custom agent runtime.
