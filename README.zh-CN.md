# Codex Chiptune 游戏音乐编曲器

[English](README.md)

这是一个面向 Codex 的 **Skill + 确定性 Tool Pipeline**，用于生成可编辑、可循环、Chiptune-inspired 的游戏音乐。

项目追求的是 **Chiptune-inspired**，而不是严格复刻 NES、Game Boy 等历史 8-bit 硬件。这里把 Chiptune 视为一套“作曲与音色语言”，可以与 Rock、Electronic、Ambient 等现代曲风融合。

## MVP 能做什么

```text
自然语言游戏场景
        ↓
Codex + SKILL.md
        ↓
MusicBrief
        ↓
确定性 Composer Core
        ↓
ChiptuneScore v0.1
        ↓
验证 + MIDI + WAV 试听 + 编辑器桥接
        ↓
支持锁定素材的局部修改
```

当前支持游戏角色：`exploration`、`town`、`battle`、`boss`。

当前支持风格包：`chip-core`、`chip-rock`、`chip-electro`、`chip-ambient`。

项目的可编辑真源是 `score.chiptune.json`；MIDI、WAV 和编辑器桥接文件都是派生输出。

## 5 分钟快速开始

要求：Node.js 20+、npm。

```bash
git clone https://github.com/xzso3/codex-chiptune-game-music-composer.git
cd codex-chiptune-game-music-composer
npm install
npm run typecheck
npm test
npm run compose -- examples/boss-rock.brief.json ./boss-rock-out
```

预期输出：

```text
boss-rock-out/
├── brief.json
├── score.chiptune.json
├── validation.json
├── song.mid
├── preview.wav
└── song.beepbox-bridge.json
```

先听 `preview.wav`，再检查 `validation.json`，后续修改始终以 `score.chiptune.json` 为核心。

完整教程见 **[逐步使用教程](docs/STEP_BY_STEP.zh-CN.md)**。

## 在 Codex 中使用

用 Codex 打开仓库，明确要求它使用 `SKILL.md` 完成 Chiptune 游戏音乐任务，例如：

> 使用 chiptune game music composer skill。生成一首 Chiptune + Rock 的 Boss 战循环音乐，快速、紧张但保留英雄感；主旋律要容易记忆，长度 32 小节，并完成验证。

Codex 应完成：理解游戏/音乐意图 → 生成 `MusicBrief` → 选择 Style Pack → 调用 Composer → 检查验证 → 条件允许时试听 → 修改时锁定既有素材 → 返回可编辑产物。

详细 Agent 工作方式见 [Codex 工作流](docs/CODEX_WORKFLOW.zh-CN.md)。

## 手工生成

可以直接创建 brief：

```json
{
  "title": "heroic-boss",
  "gameRole": "boss",
  "mood": ["tense", "heroic"],
  "stylePack": "chip-rock",
  "durationBars": 32,
  "seed": 42731
}
```

执行：

```bash
npm run compose -- brief.json output/heroic-boss
```

同一份 brief + 同一个 seed 应生成相同的 `ChiptuneScore`。

## 局部修改

```bash
npm run revise -- \
  boss-rock-out/score.chiptune.json \
  examples/boss-rock.revision.json \
  boss-rock-out/score.revised.chiptune.json

npm run validate -- boss-rock-out/score.revised.chiptune.json
```

稳定语义 ID 包括 `motif.main`、`track.lead`、`track.arp`、`track.drums`、`section.A`、`section.B` 等。

例如：

```json
{
  "lock": ["motif.main", "track.lead"],
  "arpDensity": 0.35,
  "drumStrength": 0.9,
  "sectionTension": { "B": 0.9 }
}
```

这代表：保留主 motif 与 lead，降低琶音密度、增强鼓，并提高 B 段张力。

## 输出文件说明

| 文件 | 用途 |
| --- | --- |
| `brief.json` | 标准化后的音乐需求 |
| `score.chiptune.json` | 核心可编辑乐谱/IR |
| `validation.json` | 错误、警告和量化指标 |
| `song.mid` | 下游 MIDI 编辑和制作 |
| `preview.wav` | 内置轻量 PCM 合成器试听 |
| `song.beepbox-bridge.json` | 版本化的编辑器桥接清单 |

内置 renderer 使用简单的 square/pulse/triangle-like 波形、噪声打击乐、基础包络和 mono 44.1 kHz/16-bit PCM。它用于快速试听和回归验证，不是最终商业级母带输出。

## 仓库结构

```text
SKILL.md                         Codex 工作流入口
SKILL.zh-CN.md                   中文镜像
schemas/                         机器可读数据契约
src/                             确定性 Composer Core
cli/                             compose / revise / validate
references/                      按需加载的音乐知识
references/*.zh-CN.md            中文知识镜像
docs/                            研究、架构、决策、教程
docs/*.zh-CN.md                  中文文档镜像
evals/                           Golden Prompt 评测矩阵
examples/                        可运行示例
tests/                           自动化回归测试
.github/workflows/ci.yml         CI smoke test
```

## 核心架构原则

- **Chiptune 是语法，不是主机法规。** 重点是 motif、arp、square/pulse 身份、active bass、数字打击乐和紧凑 loop，而不是历史硬件声道合法性。
- **符号化、可编辑优先。** `ChiptuneScore` 位于 MIDI/WAV 之上，允许对 `track.arp`、`section.B` 等语义组件定点修改。
- **LLM 管意图，程序管机制。** Codex 决定音乐应该做什么；TypeScript 负责 seed、音高映射、音符生成、验证和导出。
- **游戏循环体验是一等公民。** Validator 会检查结构问题，并输出启发式 `loopFatigueRisk`。

## v0.1 明确不做

专业 DAW/VST 制作、最终混音/母带、严格硬件芯片模拟、神经音乐模型、运行时自适应音乐状态图、直接序列化 BeepBox 私有格式。

## 文档导航

- [逐步使用教程](docs/STEP_BY_STEP.zh-CN.md) / [English](docs/STEP_BY_STEP.md)
- [研究总结](docs/RESEARCH_SYNTHESIS.zh-CN.md) / [English](docs/RESEARCH_SYNTHESIS.md)
- [MVP 规格](docs/MVP_SPEC.zh-CN.md) / [English](docs/MVP_SPEC.md)
- [架构](docs/ARCHITECTURE.zh-CN.md) / [English](docs/ARCHITECTURE.md)
- [决策日志](docs/DECISION_LOG.zh-CN.md) / [English](docs/DECISION_LOG.md)
- [实现日志](docs/IMPLEMENTATION_LOG.zh-CN.md) / [English](docs/IMPLEMENTATION_LOG.md)
- [评测计划](docs/EVAL_PLAN.zh-CN.md) / [English](docs/EVAL_PLAN.md)
- [Codex 工作流](docs/CODEX_WORKFLOW.zh-CN.md) / [English](docs/CODEX_WORKFLOW.md)

参考知识：

- [Chiptune 编曲语法](references/chiptune-grammar.zh-CN.md)
- [游戏音乐](references/game-music.zh-CN.md)
- [基础乐理](references/music-theory.zh-CN.md)
- [风格包](references/style-packs.zh-CN.md)

## 开发检查

```bash
npm run typecheck
npm test
npm run compose -- examples/boss-rock.brief.json /tmp/chiptune-mvp
```

下一阶段应优先由 48 个固定评测输出驱动，而不是单纯堆功能。