# Style Translation Packs

Style packs translate a secondary musical language into parameters and arrangement behaviors. They are not mere prompt adjectives.

## `chip-core`

Use when the user wants recognizable chiptune without a strong secondary genre.

Priorities:
- memorable square/pulse-forward motif;
- medium/high arp presence;
- active but uncomplicated bass;
- concise pattern-oriented drums;
- moderate harmonic complexity;
- clear separation of lead / arp / bass.

Avoid turning every track into a dense melody.

## `chip-rock`

Translate Rock grammar, not Rock instrumentation literally.

Priorities:
- riff-like melodic cells;
- fifth/root motion and strong tonal anchors;
- high rhythmic drive;
- backbeat-oriented drums;
- bass locked to rhythmic accents;
- arp reduced relative to `chip-core` so riff identity stays clear;
- useful for battle/boss cues.

Modern production may later add distorted synth/guitar layers, but v0.1 expresses the identity symbolically first.

## `chip-electro`

Translate sequencing/dance grammar.

Priorities:
- repetitive, machine-like hook cells;
- high sixteenth-note or eighth-note sequencing density;
- high arp density;
- regular kick pulse;
- bass patterns that reinforce grid and forward motion;
- synthetic texture is allowed;
- useful for tech/action/battle contexts.

Watch fatigue: continuous dense arp + high hats + lead can become exhausting quickly.

## `chip-ambient`

Translate ambient/exploration grammar.

Priorities:
- lower melodic density;
- slower harmonic motion;
- sparse arp or broken-chord punctuation instead of continuous streams;
- larger lead rest ratio;
- digital pad/texture role;
- lower rhythmic drive;
- useful for exploration, quiet towns and ominous low-action scenes.

Do not remove chiptune identity entirely: keep a clear chip-like motif/timbre anchor.

## Adding a future style pack

Before adding a pack, document:
1. source genre's structural grammar;
2. which properties survive translation into chiptune;
3. which properties are production-only and should not distort symbolic composition;
4. density/tempo/harmony defaults;
5. game-role use cases;
6. anti-patterns;
7. at least four evaluation prompts.

Then add the numeric profile to `src/stylePacks.ts` and regression tests before exposing the pack in `MusicBrief` schema.
