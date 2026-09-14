# v0.1 基础乐理参考

[English](music-theory.md)

MVP 只实现紧凑的乐理子集。Codex 默认按此理解需求，只有真实用例要求时再扩展 Composer。

## 音高系统

支持 schema 接受的 chromatic note name；mode 支持 major、minor（natural minor/Aeolian-like）、Dorian、Mixolydian。确定性引擎把 scale degree 映射成 MIDI note，非自然音和声暂缓。

## Degree notation

`1` 是主音级，`3` 是三级；超过 7 后进入下一八度。这样 motif 可以跨 key/mode 移调而无需重写绝对音高。

## Harmony

v0.1 progression 是按 game role 选择的 scale-degree loop。Triad 在 degree space 用 `root, root+2, root+4` 表示。重点不是复杂功能和声，而是为 motif、Style Translation 和 Loop 提供稳定 harmonic context。

## Melody

优先级进为主、偶尔跳进；短而明确的轮廓；phrase-level repetition；对已知 motif 做有限 mutation。避免逐小节独立随机音符。

## Rhythm

引擎使用 beat-relative duration，常见为 1 beat、1/2 beat、1/4 beat，Style Pack 间接控制密度。

## Form

16 bars：A(8) + B(8)。32 bars：A(8) + B(8) + A2(8) + B2(8)。简单结构提供稳定 section ID，便于 revision 与未来 adaptive research。

## 后续扩展

harmonic/melodic minor、7th/extended chord、borrowed/modal interchange、secondary dominant、显式 chord-tone targeting、chromatic approach、强 voice-leading/counterpoint、rhythmic motif transformation、把 tension curve 映射到和声操作。