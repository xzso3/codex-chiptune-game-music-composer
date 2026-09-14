# 评测计划

[English](EVAL_PLAN.md)

## 目的

MVP 不能只用“脚本能跑”来判断质量。评测分为确定性回归检查与人工音乐评审。

## 自动化回归门槛

每个 baseline 记录：brief + seed、ChiptuneScore 成功生成、`validation.valid=true`、MIDI/WAV 导出成功、实现未变时 score hash 可复现、validator 指标（note count、motif reuse、arp occupancy、rest ratio、loop-fatigue risk）。

硬失败包括：非法 timing/MIDI 范围、exporter 失败、缺失 lead/bass/arp、同一 brief+seed 在同实现版本产生不同 score。

## Golden Prompt 矩阵

4 个 game role × 4 个 Style Pack = 16 个 prompt；每个用固定 seed 101、202、303，共 **48 个输出**。

| Game role | chip-core | chip-rock | chip-electro | chip-ambient |
| --- | --- | --- | --- | --- |
| exploration | baseline | 非典型但合法 | 高能移动 | 主要适配 |
| town | 主要适配 | 活泼城镇 | 科技城镇 | 安静城镇 |
| battle | baseline | 主要适配 | 主要适配 | 张力实验 |
| boss | 戏剧化 core | 主要适配 | cyber boss | 稀疏压迫 boss |

## 人工评分（1–5）

1. Chiptune 身份
2. 次级曲风身份
3. 游戏角色匹配
4. Motif 记忆性
5. 结构连贯性
6. Loop 可接受度
7. 疲劳风险（5 = 适合重复）
8. 作为生产草图的可编辑/可用性

进入下一阶段的目标：全矩阵中第 1/3/5/6 项中位数 >= 3.5/5。

## 失败分类

失败前先分类：intent parsing、style-pack 参数、motif/harmony、arrangement/density、renderer-only、validator 误报/漏报、算法结果与人类偏好不一致。不要用修改作曲规则去“修复”纯 renderer 问题。

## v0.2 候选指标

audio boundary click、section tonal tension、style classifier/embedding、与旧版 pairwise preference、长时间循环试听、SFX masking、人工修改量等。