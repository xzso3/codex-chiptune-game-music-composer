# Step-by-step 逐步使用教程

[English](STEP_BY_STEP.md)

本教程从全新 clone 开始，一步走到生成、试听、验证、局部修改和 Codex 使用。

## 1. 准备环境

安装 Node.js 20+ 与 npm，建议同时安装 Git。

```bash
node --version
npm --version
```

## 2. Clone 与安装依赖

```bash
git clone https://github.com/xzso3/codex-chiptune-game-music-composer.git
cd codex-chiptune-game-music-composer
npm install
```

## 3. 先验证仓库状态

```bash
npm run typecheck
npm test
```

这两步没通过前，不要先讨论“音乐不好听”，因为那可能只是工程问题。

## 4. 运行仓库自带示例

```bash
npm run compose -- examples/boss-rock.brief.json ./output/boss-rock
```

应生成：`brief.json`、`score.chiptune.json`、`validation.json`、`song.mid`、`preview.wav`、`song.beepbox-bridge.json`。

## 5. 试听与检查

先播放 `preview.wav`。注意：它只是轻量草图 renderer。

再打开 `validation.json`，确认：
- `valid` 为 true；
- errors 为空；
- warning 已理解；
- note count、arp occupancy、rest ratio、loop-fatigue risk 看起来合理。

## 6. 编写自己的 MusicBrief

创建 `my-brief.json`：

```json
{
  "title": "night-highway",
  "gameRole": "exploration",
  "mood": ["lonely", "curious"],
  "stylePack": "chip-ambient",
  "durationBars": 32,
  "seed": 2026
}
```

执行：

```bash
npm run compose -- my-brief.json ./output/night-highway
```

BPM、key、mode 等字段只有在你确实需要精确控制时再填写，默认可以交给 Composer 决定。

## 7. 验证可复现性

保持 brief 与 seed 不变，再生成到另一个目录。在同一实现版本中，两次 `score.chiptune.json` 应一致。

## 8. 不整首重做，进行局部修改

创建 `my-revision.json`：

```json
{
  "lock": ["motif.main", "track.lead"],
  "arpDensity": 0.35,
  "drumStrength": 0.9,
  "sectionTension": { "B": 0.9 }
}
```

执行：

```bash
npm run revise -- \
  ./output/night-highway/score.chiptune.json \
  my-revision.json \
  ./output/night-highway/score.revised.chiptune.json

npm run validate -- ./output/night-highway/score.revised.chiptune.json
```

如果修改后还需要新的 MIDI/WAV，可让 Codex 继续走导出流程，或扩展 CLI 的导出路径。

## 9. 在 Codex 中调用 Skill

把仓库作为 Codex workspace 打开，然后可以直接说：

> 使用 `SKILL.md`。为一个高速赛博朋克战斗场景生成 Chiptune + Electronic 的 battle loop；保持高能但给 SFX 留空间，长度 32 小节，选择可复现 seed，执行验证并返回所有产物。

修改时可以说：

> 保留主 motif 和 lead，把 arp 降低、鼓加强、B 段更紧张，之后重新验证。

Codex 应把自然语言转换成 schema/CLI 调用，而不是手写几千个 raw note event。

## 10. 如何选 Style Pack

- `chip-core`：中性、明显的 Chiptune 基线。
- `chip-rock`：riff、backbeat、高驱动力，适合 battle/boss。
- `chip-electro`：sequencing、舞曲/科技能量、更密的 arp。
- `chip-ambient`：稀疏、探索、氛围化。

## 11. 如何理解输出

`score.chiptune.json` 是真源；`song.mid` 用于后续编辑；`preview.wav` 是草图试听；`validation.json` 是 QA；`song.beepbox-bridge.json` 是桥接 manifest，不是原生 BeepBox JSON。

## 12. 常见问题

### `npm install` 失败
检查 Node/npm 版本，以及网络或 npm registry 是否可访问。

### TypeScript 报错
先执行 `npm run typecheck` 并修复工程问题。

### `validation.valid=false`
先读 errors，不要忽略 timing/pitch/export 这类硬错误。

### WAV 听起来太“裸”
这是 v0.1 预期行为。把“作曲质量”和“renderer 音色质量”分开评价，后续制作请使用 MIDI/ChiptuneScore。

### 音乐太重复
可以换 seed/style pack、降低 arp density，并查看 `loopFatigueRisk`。系统性问题应该修 Composer 规则，而不是为某一个 seed 手改音符。

## 13. 推荐开发循环

```text
复现问题
→ 判断是 composition / renderer / validator 哪一层
→ 架构变化时更新 docs/decision
→ 实现
→ typecheck/test
→ 跑 golden prompts
→ 试听/检查
→ PR
```

完整开发与评测方法见 `docs/CODEX_WORKFLOW.zh-CN.md` 与 `docs/EVAL_PLAN.zh-CN.md`。