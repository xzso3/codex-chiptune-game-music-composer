# Music Theory Reference for v0.1

The MVP intentionally implements a compact subset of theory. Codex should use this as the default mental model when interpreting requests, and only expand the engine when a real use case requires it.

## Pitch system

Supported tonal centers are chromatic note names accepted by the schema. Supported modes:
- major;
- minor (natural minor / Aeolian-like pitch set);
- Dorian;
- Mixolydian.

The deterministic engine maps scale degrees to MIDI notes. Non-diatonic harmony is deferred.

## Degree notation

`1` means tonic scale degree, `3` means the third scale degree, etc. Degrees above 7 continue into the next octave.

This allows motif cells to be transposed across keys/modes without rewriting pitches.

## Harmony

v0.1 progressions are scale-degree loops chosen by game role. Triads are represented as `root, root+2, root+4` in scale-degree space.

The main design goal is not sophisticated functional harmony; it is a stable harmonic context for testing motif, style translation and looping.

## Melody

Prefer:
- stepwise motion with occasional leaps;
- short contour identity;
- phrase-level repetition;
- limited mutation of a known motif.

Avoid independent random-note generation per bar.

## Rhythm

The engine uses beat-relative durations. Common v0.1 values are whole-beat, half-beat and quarter-beat subdivisions. Style packs control density indirectly.

## Form

16 bars:
- A (8)
- B (8)

32 bars:
- A (8)
- B (8)
- A2 (8)
- B2 (8)

This intentionally simple form provides stable section IDs for later revision and adaptive-music research.

## Future theory extensions

Potential v0.2+ work:
- harmonic minor/melodic minor;
- seventh/extended chords;
- borrowed/modal-interchange harmony;
- secondary dominants;
- explicit chord-tone targeting;
- non-diatonic approach tones;
- stronger voice-leading/counterpoint rules;
- rhythmic motif transformations;
- tension curves mapped to harmonic operations.
