# 决策日志

[English](DECISION_LOG.md)

## D-001 — 选择 Chiptune-inspired，而非硬件真实模拟
**状态：已接受。** 项目关注 Chiptune 的作曲/音色语言，不强制 NES/Game Boy/C64 硬件约束。原因是现代游戏音乐需要 layering、效果、额外声部和混合曲风；历史芯片准确性会显著增加复杂度，却不服务核心目标。

## D-002 — ChiptuneScore 是核心真源
**状态：已接受。** MIDI、WAV、Tracker、BeepBox 都不能作为 source of truth。修改需要稳定语义角色与 ID，而渲染/导出格式要么有损、要么与具体实现耦合。

## D-003 — LLM + 确定性 Composer 混合架构
**状态：已接受。** Codex 管游戏/音乐意图与流程决策，TypeScript 管 seed 作曲、乐理机制、验证和导出。原因是 LLM 直接吐 raw notes 难以复现、测试和局部修订。

## D-004 — v0.1 只做四个 Style Pack
`chip-core`、`chip-rock`、`chip-electro`、`chip-ambient`。它们足以覆盖中性 Chiptune、riff 高能、sequenced/dance 和稀疏氛围，用于验证 Style Translation 是否成立。

## D-005 — 内置 Preview Renderer
提供最小 WAV renderer，不要求 DAW/VST，使每个 Codex 环境都能产出可试听 smoke-test；最终商业级制作不在 v0.1 范围。

## D-006 — BeepBox 是 Adapter，不是 IR
v0.1 输出 MIDI + 版本化 bridge manifest，不直接耦合外部编辑器不断变化的私有 JSON。

## D-007 — 局部 Revision 属于 MVP
从第一版就支持稳定 ID、lock、arp density、drum strength 和 section tension，因为产品假设是“Composer Agent”，不是一次性 Generator。

## D-008 — v0.1 不使用神经音乐生成
为了隔离问题来源：先判断 symbolic composition 是否成立，避免把 composition、renderer 和神经模型行为混在一起。