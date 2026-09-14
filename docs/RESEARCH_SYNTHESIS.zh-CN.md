# 研究总结 — Chiptune-inspired Game Music Agent

[English](RESEARCH_SYNTHESIS.md)

## 研究问题

如何设计一套 Codex-native Skill，使它能生成明显具有 Chiptune 身份、但又不被历史 8-bit 硬件限制的游戏音乐？

## 结论

系统应把 **Chiptune 当作作曲/音色语法，而不是固定主机规格**。核心产品应是带稳定语义角色（lead、arp、bass、drums、texture）的可编辑符号 score，MIDI 和音频只是派生物。

推荐混合架构：Codex 理解意图并编辑结构化 MusicBrief → 确定性代码实现乐理和 Style Rule → `ChiptuneScore` 成为 source of truth → Validator 检查硬约束和游戏循环启发式 → Exporter 生成 MIDI/WAV/editor bridge。

这样可以避免 LLM 直接输出海量 raw notes、却没有稳定修改表示的问题。

## 为什么选择 Chiptune-inspired

历史 Chiptune 的审美来自有限声部、简单振荡器、Tracker、快速琶音、短循环和高复用；现代 Chiptune 已普遍结合现代 synthesis、stereo、effects、更复杂和声、更多声部与其他曲风。因此项目身份来自：短而易记 motif、重复+受控变化、square/pulse lead、broken chord/rapid arp、active bass、pattern rhythm、digital/noise percussion、紧凑 loop，以及可选的现代 pad/drums/delay/reverb/distortion/layering。

硬件声道合法性明确不是 v0.1 目标。

## Style Translation

- Chiptune + Rock：把 riff、fifth/power-chord movement、backbeat、bass/drum lock 映射为 pulse/square riff、dyad/broken fifth、chip bass 与 hybrid drums。
- Chiptune + Electronic：把 sequencing、dance pulse、16th movement、automation 映射为更密 arp、规则 kick、重复 bass cell 和 synthetic texture。
- Chiptune + Ambient：把空间、慢和声、氛围映射为 sparse motif、低 arp occupancy、sustained digital texture 和更多留白。
- Chiptune Core：强调 motif/arp/bass/简洁 loop，不引入强次级曲风。

## 游戏音乐影响

游戏 cue 可能被未知时长地重复，因此不仅要追求首次冲击，还要控制长期疲劳。v0.1 用 arp occupancy、高音区活动、短音符活动、motif 重复压力和 lead rest ratio 形成启发式 loop-fatigue metric。它不是审美裁判，只是复核信号。

## Symbolic-first

MIDI 不够表达长期领域模型，WAV 又太难编辑，所以 `ChiptuneScore` 位于二者之上，保存 music metadata/seed、game intent、style profile、form/section tension、harmony、motif、semantic tracks/note events 和 loop boundary，并通过 `motif.main`、`track.lead`、`section.B` 等稳定 ID 支持修改。

## 工具调研影响

OpenAI Skills/Codex 提供 Skill 工作流范式；BeepBox 提供现代 chip 编辑生态；FamiStudio/Furnace 提供 Tracker/芯片工作流参考但过于硬件导向；`codex-game-music-skill` 证明 Codex 可驱动 game-scene-to-MIDI；`midi-composer-mcp` 支持“规则放工具、创意留给模型”；`algo-chip` 提供 seed/motif/structure/diagnostics 先例。

## v0.1 研究边界

排除 authentic NES/GB/C64、DAW/VST、专业混音、神经音频、vocals、adaptive runtime graph、直接 BeepBox 私有格式、Core/Rock/Electronic/Ambient 之外的大范围曲风。核心实验只有一个：**Codex Skill 是否能从短 gameplay brief 稳定生成、验证、修改和导出连贯 Chiptune-inspired loop。**