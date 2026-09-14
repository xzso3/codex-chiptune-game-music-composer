# Research Synthesis — Chiptune-inspired Game Music Agent

## Research question

How should a Codex-native skill compose game music that is recognizably chiptune-inspired without being constrained by historically authentic 8-bit hardware?

## Conclusion

The system should treat **chiptune as a compositional/timbral grammar**, not as a fixed console specification. The canonical product should be an editable symbolic score with stable semantic roles (lead, arp, bass, drums, texture), while MIDI and audio previews are derived artifacts.

The preferred architecture is hybrid:

1. Codex interprets game intent and chooses/edits a structured MusicBrief.
2. Deterministic code implements music-theory and style rules.
3. A versioned `ChiptuneScore` is the source of truth.
4. Validators check hard constraints plus game-loop heuristics.
5. Exporters derive MIDI, preview WAV, and editor bridges.

This avoids the failure mode where a language model emits thousands of raw notes with no stable representation for revision.

## Why Chiptune-inspired rather than hardware-authentic

Historically, chiptune aesthetics emerged from limited voices, simple oscillators, trackers, arpeggiation, short loops, and aggressive reuse of material. Modern chiptune music routinely combines those ideas with contemporary synthesis, stereo production, effects, richer harmony, additional voices, and other genres.

For this project the desired identity is therefore captured through:

- short memorable motifs;
- repetition plus controlled variation;
- square/pulse-like melodic identity;
- broken chords and rapid arpeggiation;
- active bass motion;
- regular, pattern-oriented rhythm;
- digital/noise percussion vocabulary;
- concise repeatable forms;
- optional modern pads, drums, delay, reverb, distortion, and layering.

Hardware channel-count legality is explicitly not a v0.1 goal.

## Style translation

A secondary genre is represented as rules rather than as a prompt adjective.

### Chiptune + Rock

Translate riff logic, fifth/power-chord motion, strong backbeat and bass/drum locking into pulse/square riffs, dyads/broken fifths, aggressive chip bass and hybrid drums.

### Chiptune + Electronic

Translate sequencing, repetitive dance pulse, sixteenth-note motion and automation into denser arpeggiation, regular kick patterns, repeating bass cells and synthetic texture.

### Chiptune + Ambient

Translate long space, slow harmonic rhythm and atmosphere into sparse motifs, reduced arp occupancy, sustained digital texture and greater negative space.

### Chiptune Core

Provide a neutral baseline emphasizing motif, arp, bass and concise loop form without a strong secondary genre.

## Game-music implications

Unlike a standalone song, a game cue can repeat for a long and unpredictable amount of time. The system therefore needs to optimize not only first-listen impact but also repeatability.

v0.1 introduces a heuristic loop-fatigue metric using:

- arpeggio occupancy;
- high-register activity;
- very-short-note activity;
- motif repetition pressure;
- lead rest ratio.

This is not an aesthetic oracle. It is a review signal that helps Codex notice obvious density/fatigue risks.

## Symbolic-first decision

MIDI alone is insufficient as a long-term domain model, while rendered WAV is too destructive for editing. `ChiptuneScore` therefore sits above both.

The IR stores:

- music metadata and seed;
- game intent;
- style profile;
- form and section tension;
- harmonic progression;
- reusable motifs;
- semantic tracks and note events;
- loop boundaries.

Stable IDs make revisions addressable, e.g. `motif.main`, `track.lead`, `section.B`.

## Tooling findings

Relevant prior art informed the design:

- OpenAI Skills guidance: skills combine `SKILL.md`, workflow instructions, resources, examples and scripts.
  - https://openai.com/academy/skills/
- OpenAI Codex: skills can package instructions/resources/scripts for Codex workflows.
  - https://openai.com/index/introducing-the-codex-app/
- BeepBox: browser-based chiptune/instrumental composition with modern effects and layered instruments.
  - https://github.com/johnnesky/beepbox
- FamiStudio/Furnace: valuable references for tracker/chip workflows, but too hardware-specific to serve as the v0.1 canonical model.
  - https://famistudio.org/
  - https://tildearrow.org/furnace/
- `codex-game-music-skill`: evidence that a Codex skill can drive game-scene-to-MIDI workflows.
  - https://github.com/sora16bit/codex-game-music-skill
- `midi-composer-mcp`: useful architectural precedent for putting deterministic music rules in tools while leaving creative intent to the model.
  - https://github.com/voho/midi-composer-mcp
- `algo-chip`: useful precedent for seed-based procedural chiptune with motifs/structure/diagnostics.
  - https://github.com/abagames/algo-chip

## v0.1 research boundary

The first MVP intentionally excludes:

- authentic NES/Game Boy/C64 emulation;
- DAW/VST orchestration;
- professional mixing/mastering;
- neural audio generation;
- vocals;
- adaptive runtime state graphs;
- direct private-format BeepBox serialization;
- broad genre coverage beyond Core/Rock/Electronic/Ambient.

These exclusions are intended to protect the experiment: **can a Codex skill reliably produce, validate, revise and export coherent chiptune-inspired game loops from a short gameplay brief?**
