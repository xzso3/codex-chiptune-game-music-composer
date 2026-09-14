# Style Translation 风格包

[English](style-packs.md)

Style Pack 把次级曲风翻译成参数与编曲行为，不只是 prompt adjective。

## `chip-core`
用于没有强次级曲风的明显 Chiptune：易记 square/pulse motif、中高 arp、活跃但不复杂的 bass、紧凑 pattern drums、中等和声复杂度、lead/arp/bass 分离清晰。避免所有轨都变成 dense melody。

## `chip-rock`
翻译 Rock 的语法，而不是照搬吉他乐器：riff-like motif、root/fifth 与强 tonal anchor、高 rhythmic drive、backbeat、bass 与重拍 lock、相较 core 降低 arp 让 riff 更突出；适合 battle/boss。现代 distorted synth/guitar 属于后续 production layer。

## `chip-electro`
翻译 sequencing/dance grammar：机器式 hook、高 8th/16th density、高 arp、规则 kick、强调网格与推进感的 bass、允许 synthetic texture；适合 tech/action/battle。注意 dense arp + high hats + lead 的疲劳。

## `chip-ambient`
翻译 Ambient/Exploration：低 melodic density、慢 harmonic motion、稀疏 arp/broken chord punctuation、更高 lead rest ratio、digital pad/texture、低 rhythmic drive；适合 exploration、quiet town、低动作压迫场景。不能完全丢掉 Chiptune 身份，应保留 chip-like motif/timbre anchor。

## 新增 Style Pack 的要求

先文档化：源曲风结构语法、哪些属性会被 Chiptune 化、哪些只属于 production、density/tempo/harmony 默认值、game-role use cases、anti-pattern、至少四个 evaluation prompt。之后再向 `src/stylePacks.ts` 添加数值 profile 和回归测试，最后才暴露到 MusicBrief schema。