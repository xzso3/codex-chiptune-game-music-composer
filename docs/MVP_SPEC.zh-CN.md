# MVP v0.1 规格

[English](MVP_SPEC.md)

## 产品定义

一套面向 Codex 的 Skill/Tool Pipeline，把自然语言游戏音乐需求转换成确定性、可编辑、Chiptune-inspired 的循环音乐，并支持验证与局部修改。

## 核心用户故事

作为使用 Codex 的游戏开发者，我描述游戏场景和 Chiptune 混合风格，Skill 应产出可复用 score、MIDI、可听 preview、验证报告，以及足够的语义元数据，让我能修改局部而不整首重做。

## 支持的意图词汇

Game role：`exploration`、`town`、`battle`、`boss`。

Style Pack：`chip-core`、`chip-rock`、`chip-electro`、`chip-ambient`。

Loop 长度：16 或 32 bars。

## 必须输出

```text
output/
├── brief.json
├── score.chiptune.json
├── validation.json
├── song.mid
├── preview.wav
└── song.beepbox-bridge.json
```

`score.chiptune.json` 为 canonical source，其余皆为派生物。

## 功能要求

1. 同一 input + seed 生成相同 ChiptuneScore。
2. 至少生成 lead、arp、bass；Style Pack 可增加 counter/drums/texture。
3. 音符不得越出 MIDI/timing 边界。
4. Score 提供稳定 ID 供定点修改。
5. Validation 返回 errors、warnings 与量化 metrics。
6. MIDI exporter 输出合法 SMF 与独立 tracks。
7. WAV renderer 无需外部插件即可试听。
8. Revision 可锁 lead/motif，并调整 arp density、drum strength、section tension。
9. Codex 默认不要求用户掌握乐理输入。

## 质量要求

自动化：strict typecheck、单测、compose smoke test、golden baseline `validation.valid=true`。

人工目标：Chiptune identity、secondary style、gameplay fit、coherence、loop acceptability 的中位数均达到约 3.5/5。

## 明确非目标

历史芯片精确模拟、专业混音/母带、自动 DAW 工程、神经音乐模型、运行时 adaptive graph、直接 BeepBox 私有 JSON、无限自由曲风、vocals。

## Definition of Done

全新 clone 后能成功运行：

```bash
npm install
npm run typecheck
npm test
npm run compose -- examples/boss-rock.brief.json /tmp/chiptune-mvp
```

并生成完整 bundle 且 `validation.valid=true`。