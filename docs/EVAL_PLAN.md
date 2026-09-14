# Evaluation Plan

## Purpose

MVP quality must not be judged only by "does the script run". Evaluation is split into deterministic regression checks and human musical review.

## Automated regression gates

Every baseline case should record:
- brief and seed;
- successful ChiptuneScore generation;
- `validation.valid=true`;
- MIDI/WAV export succeeds;
- deterministic score hash for unchanged implementation;
- validator metrics: note count, motif reuse, arp occupancy, rest ratio, loop-fatigue risk.

Hard failures:
- invalid timing or MIDI range;
- exporter failure;
- missing lead/bass/arp role;
- same brief+seed produces different score within the same implementation revision.

## Golden prompt matrix

Use four game roles x four style packs = 16 prompts.

| Game role | chip-core | chip-rock | chip-electro | chip-ambient |
| --- | --- | --- | --- | --- |
| exploration | baseline | unusual-but-valid | energetic traversal | primary fit |
| town | primary fit | lively town | tech town | quiet town |
| battle | baseline | primary fit | primary fit | tension experiment |
| boss | dramatic core | primary fit | cyber boss | ominous sparse boss |

Each prompt is rendered with 3 fixed seeds: 101, 202, 303. Total first evaluation set: **48 outputs**.

## Human scorecard

Rate 1-5 without showing the style-pack label first where practical:

1. Chiptune identity
2. Secondary-style identity
3. Gameplay-role fit
4. Motif memorability
5. Structural coherence
6. Loop acceptability
7. Fatigue risk (5 = comfortable for repetition)
8. Editability/usefulness as a production sketch

Target for advancing beyond MVP: median >= 3.5/5 on items 1, 3, 5, 6 across the full matrix.

## Diagnostic questions

When a case fails, classify failure before changing code:
- intent parsing failure;
- style-pack parameter failure;
- motif/harmony failure;
- arrangement/density failure;
- renderer-only failure;
- validator false positive/negative;
- mismatch between algorithmic output and human preference.

Do not solve renderer problems by changing composition rules unless listening confirms the score itself is at fault.

## v0.2 evaluation candidates

- audio boundary click detection;
- tonal tension analysis by section;
- style classifier or embedding-based secondary signal;
- pairwise preference tests against previous composer versions;
- long-loop listening sessions;
- in-game SFX masking tests;
- human edits required before acceptance as a practical productivity metric.
