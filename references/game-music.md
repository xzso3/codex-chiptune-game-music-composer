# Game Music Reference

## First principle

A game cue is not only a piece of music; it is a reusable gameplay resource. v0.1 focuses on loopable linear cues. Adaptive state graphs are deferred.

## Game-role defaults

### Exploration
- prioritize continuity over climax;
- moderate/low tension;
- leave negative space for environment/SFX;
- avoid an ending cadence that calls attention to the restart;
- `chip-ambient` or `chip-core` are typical starting packs.

### Town
- clear identity and memorability;
- lower fatigue than battle cues;
- friendly rhythmic predictability is useful;
- `chip-core` is a typical baseline, but any pack may be justified by worldbuilding.

### Battle
- strong pulse and immediate motif recognition;
- higher rhythmic drive;
- fewer dead bars;
- keep enough headroom for combat SFX;
- `chip-rock` and `chip-electro` are primary fits.

### Boss
- strongest identity/tension in the v0.1 role set;
- motif should survive repetition and remain recognizable under dense arrangement;
- B/B2 sections may increase tension rather than introduce unrelated material;
- avoid relying only on faster BPM as the source of intensity.

## Loop design

A robust loop should:
- establish its tonal center early;
- make the final bar rhythmically compatible with the first;
- avoid excessive long-tail events in a renderer that cannot crossfade;
- use recurring material so restart feels like continuation rather than a new song;
- reserve some variation for later sections so repeated playback does not become a one-pattern treadmill.

## Fatigue review

Long-term listening risk increases with:
- constant high-register activity;
- continuous very-fast subdivisions;
- always-on arp;
- zero rests in lead;
- exact repetition with no phrase-level change;
- relentless percussion density.

The validator's `loopFatigueRisk` is only a heuristic. Codex/humans should still listen.

## SFX coexistence

Game BGM should not consume every perceptual band continuously. For v0.1 use arrangement restraint rather than mix engineering:
- keep lead role clear;
- avoid multiple dense high-frequency parts simultaneously unless intentional;
- use rests;
- keep bass stable rather than excessively ornamented when gameplay is noisy.

## Future adaptive extension

The ChiptuneScore is intentionally compatible with later section/state semantics. A future runtime graph may route among sections or intensity layers, but v0.1 should not invent runtime behavior that has not been requested or tested.
