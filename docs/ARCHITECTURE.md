# Architecture v0.1

## System boundary

```text
Natural-language request
        |
        v
Codex + SKILL.md
        |
        v
MusicBrief JSON
        |
        v
Deterministic Composer Core
  | theory / motif / form
  | style translation
  | arrangement
        |
        v
ChiptuneScore v0.1  <---- revision API
        |
        +---- validator ------> validation.json
        +---- MIDI exporter --> song.mid
        +---- WAV renderer ---> preview.wav
        +---- editor bridge --> song.beepbox-bridge.json
```

## Responsibility split

### Codex / LLM

Responsible for semantic interpretation:
- understand the gameplay scene;
- infer game role and mood;
- select the nearest style pack;
- choose explicit overrides only when justified;
- preserve user-requested locks during revision;
- inspect validation warnings and decide whether another pass is needed.

Codex should not manually author thousands of raw note events unless extending/debugging the composer itself.

### Deterministic core

Responsible for reproducible musical mechanics:
- seeded random choices;
- scale/mode pitch mapping;
- progression selection;
- motif realization and simple variation;
- arpeggio, bass, counter-line and drum realization;
- score serialization;
- structural validation;
- export.

## Canonical IR

`ChiptuneScore` is deliberately independent of MIDI, BeepBox, trackers and DAWs. External formats are adapters.

Stable semantic IDs are part of the interface:
- `motif.main`
- `track.lead`
- `track.counter`
- `track.arp`
- `track.bass`
- `track.drums`
- `track.texture`
- `section.A`, `section.B`, etc.

This enables precise future operations such as "lock lead, regenerate accompaniment".

## Style-pack architecture

Each style pack resolves to numeric/semantic constraints:

```text
bpmRange
melodicDensity
arpDensity
rhythmicDrive
harmonicComplexity
chiptuneStrength
modernStrength
preferredRoles
```

The current composer consumes a subset of these parameters. `harmonicComplexity`, `chiptuneStrength`, and `modernStrength` are retained in the IR now so later renderers/planners can use them without changing the user-facing brief contract.

## Render strategy

The built-in WAV renderer is intentionally a sketch renderer:
- square/pulse/triangle/digital-pad oscillators;
- noise percussion;
- simple attack/release envelopes;
- soft limiting;
- mono 44.1 kHz 16-bit PCM.

It exists so a Codex workflow can produce an audible artifact without a DAW. Production rendering is a later layer.

## BeepBox boundary

BeepBox is useful as an editing/reference ecosystem, but its internal serialization is not the canonical format of this project. v0.1 emits a versioned bridge manifest and MIDI. A future adapter can map the bridge to a tested BeepBox release.

## Extension points

v0.2+ can add:
- richer motif transformations;
- explicit chord objects and non-diatonic harmony;
- style packs such as chip-jazz/chip-metal/chip-orchestral;
- stems/stereo renderer;
- direct BeepBox/Furnace adapters;
- DAWproject output;
- adaptive game-state music graph;
- audio feature analysis feedback;
- human-eval datasets and regression scoring.
