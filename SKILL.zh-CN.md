---
name: chiptune-game-music-composer-zh-cn
description: 用于从游戏场景描述生成、验证、修改和导出可编辑的 Chiptune-inspired 游戏音乐循环。
---

# Chiptune 游戏音乐编曲器（中文镜像）

> 运行时入口仍以根目录 `SKILL.md` 为准。本文件是中文说明镜像。

当用户需要 Chiptune/8-bit-inspired 游戏 BGM 时使用本 Skill；不要把它解释为严格 NES/Game Boy 硬件模拟。

## v0.1 范围

- 游戏角色：`exploration`、`town`、`battle`、`boss`
- 风格包：`chip-core`、`chip-rock`、`chip-electro`、`chip-ambient`
- 16/32 小节、带 seed 的确定性循环
- `ChiptuneScore` JSON 作为核心真源
- 输出 MIDI、WAV preview、BeepBox bridge manifest
- 结构/音乐启发式检查与 loop fatigue 指标
- 支持 arp 密度、鼓强度、section tension 的局部修订与锁定

不要声称 v0.1 提供专业母带、DAW/VST 制作、真实芯片模拟、自适应运行时音乐或直接 BeepBox 私有格式兼容。

## 必须遵循的工作流

1. 读取用户的场景与玩法意图；除非用户主动要求，不要逼用户填写乐理参数。
2. 按 `schemas/music-brief.schema.json` 生成 `MusicBrief`。
3. 选择最近的 Style Pack：经典/中性 → `chip-core`；riff/高能战斗 → `chip-rock`；电子/科技/舞曲驱动 → `chip-electro`；稀疏/探索/氛围 → `chip-ambient`。
4. 缺省时：简单/短循环用 16 bars，丰富 cue 用 32 bars；选择并记录整数 seed；key/mode/BPM 可交给 Composer 决定。
5. 执行 `npm run compose -- path/to/brief.json path/to/output`。
6. 检查 `validation.json`；`valid=false` 必须修复，warning 作为复核信号。
7. 环境允许时试听 `preview.wav`，把它当作草图 renderer，而不是最终商业音频。
8. 始终保留 `score.chiptune.json` 作为核心可编辑资产。
9. 修改时尽量保留用户指定素材，优先走 revise；不支持的操作再有意识地 patch score 并重新验证/导出。
10. 最终汇报 seed、style pack、验证状态、改动内容和已知限制。

## 修改契约

可锁定 `motif.main`、`track.lead`、`track.arp`、`track.drums`、`section.A`、`section.B` 等稳定 ID。

```json
{
  "lock": ["motif.main", "track.lead"],
  "arpDensity": 0.35,
  "drumStrength": 0.9,
  "sectionTension": { "B": 0.9 }
}
```

```bash
npx tsx cli/revise.ts output/score.chiptune.json revision.json output/score.revised.chiptune.json
npm run validate -- output/score.revised.chiptune.json
```

## 知识路由

按需读取：`references/chiptune-grammar.md`、`references/game-music.md`、`references/style-packs.md`；修改实现/IR 时再读取 `docs/ARCHITECTURE.md`。

## 质量底线

必须确认：同 brief + seed 可复现；MIDI timing 不越界；lead/bass/arp 可辨；motif 有复现但不是纯复制；loop 不出现强终止式突兀重启；高 arp/高音区密度警告得到复核；产物仍可通过 ChiptuneScore/MIDI 编辑。

## 非目标

不要优化历史芯片准确性。这里把 Chiptune 当成可以与现代制作及其他曲风融合的作曲/音色语言。