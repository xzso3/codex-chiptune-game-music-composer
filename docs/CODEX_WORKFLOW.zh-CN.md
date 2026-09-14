# Codex 工作流

[English](CODEX_WORKFLOW.md)

## 作为工作仓库使用

在 Codex 中打开仓库，并明确要求对 Chiptune 游戏音乐任务使用 `SKILL.md`。仓库同时保存 playbook、references、schemas 和 scripts，因此 Codex 在需要时可以检查或修改实现。

## 普通生成请求

例如：

> 创建一首 Chiptune + Rock 的 Boss 循环，速度快、紧张但仍有英雄感；主旋律容易记忆，避免恐怖审美。

Codex 应：映射为 `MusicBrief` → 记录可复现 seed → 运行 compose CLI → 检查 `validation.json` → 条件允许时试听 → 返回产物路径和简洁音乐摘要。

示例 brief：

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

```bash
npm install
npm run compose -- brief.json output/heroic-boss
```

## 修改请求

用户说“保留旋律、减少 arp、加强鼓、B 段更紧张”时，应翻译为 revision，而不是整首重生：

```json
{
  "lock": ["motif.main", "track.lead"],
  "arpDensity": 0.35,
  "drumStrength": 0.9,
  "sectionTension": { "B": 0.9 }
}
```

执行 revise + validate。

## 什么时候应该修改 Composer 实现

把“用户要一首曲子”和“修改作曲引擎”看成不同任务。只有当操作不被 IR/tool API 支持、多个案例暴露系统性规则问题、增加 Style Pack/validator、扩展导出/渲染后端时才改 `src/`。不要为了某一个 seed 更好听而做不可泛化的算法补丁。

## 推荐开发闭环

```text
research/issue
→ branch/worktree
→ 架构变化则更新 spec/decision log
→ implement
→ typecheck/test
→ golden prompt smoke runs
→ review generated artifacts
→ PR
```

仓库刻意兼容常规 Codex + Git worktree/PR，而不强依赖自定义 Agent runtime。