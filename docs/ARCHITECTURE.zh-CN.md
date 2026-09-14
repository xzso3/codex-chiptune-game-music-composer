# 架构 v0.1

[English](ARCHITECTURE.md)

## 系统边界

```text
自然语言需求
  → Codex + SKILL.md
  → MusicBrief JSON
  → 确定性 Composer Core
  → ChiptuneScore v0.1（Revision API）
      ├→ validator → validation.json
      ├→ MIDI exporter → song.mid
      ├→ WAV renderer → preview.wav
      └→ editor bridge → song.beepbox-bridge.json
```

## 责任划分

### Codex / LLM
负责语义理解：游戏场景、情绪、游戏角色、Style Pack、必要的显式 override、修改时的 lock、以及对 validation warning 是否需要继续迭代的判断。除非在扩展/调试 Composer 本身，不应让 Codex 手写海量 note event。

### 确定性 Core
负责可复现的音乐机制：seeded random、scale/mode 音高映射、和声进行选择、motif realization/variation、arp/bass/counter/drum、序列化、结构验证和导出。

## 核心 IR

`ChiptuneScore` 与 MIDI、BeepBox、Tracker、DAW 解耦。外部格式只是 Adapter。

稳定 ID 包括：`motif.main`、`track.lead`、`track.counter`、`track.arp`、`track.bass`、`track.drums`、`track.texture`、`section.A`、`section.B` 等。这使“锁定 lead，只重做伴奏”成为可寻址操作。

## Style Pack 架构

每个 Style Pack 被解析为数值/语义约束：`bpmRange`、`melodicDensity`、`arpDensity`、`rhythmicDrive`、`harmonicComplexity`、`chiptuneStrength`、`modernStrength`、`preferredRoles`。

v0.1 尚未消费全部参数；保留这些字段是为了让未来 renderer/planner 扩展时不破坏用户侧 brief 契约。

## 渲染策略

内置 WAV renderer 只是草图合成器：square/pulse/triangle/digital-pad、noise percussion、简单 attack/release、soft limiting、mono 44.1 kHz 16-bit PCM。目标是让 Codex 无需 DAW 也能得到可试听产物。

## BeepBox 边界

BeepBox 是有价值的编辑生态，但它的内部序列化不作为本项目核心格式。v0.1 输出版本化 bridge manifest + MIDI；未来再针对被测试过的 BeepBox 版本做专门 adapter。

## 扩展点

v0.2+ 可加入：更丰富 motif transformation、非自然音和声/显式 chord、chip-jazz/metal/orchestral、stem/stereo renderer、直接 BeepBox/Furnace adapter、DAWproject、adaptive game-state graph、音频特征反馈、human-eval 数据集与回归评分。