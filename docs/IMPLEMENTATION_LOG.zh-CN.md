# 实现日志 — MVP v0.1

[English](IMPLEMENTATION_LOG.md)

## Phase 0 — 研究收敛

最初研究覆盖通用游戏作曲、自适应音乐、符号 MIDI、音频生成模型和 middleware，随后两次收窄：通用游戏音乐 → Chiptune/8-bit 家族；硬件真实 Chiptune → Chiptune-inspired 现代游戏音乐。第二次收窄改变了架构中心：硬件声道 Profile 不再是核心，Style Grammar + symbolic arrangement 成为中心。

## Phase 1 — MVP 冻结

产品假设：Codex 能理解短游戏场景需求，并通过确定性音乐工具创建、验证、导出和修改连贯的 Chiptune-inspired loop。

固定 Style Pack：Core、Rock、Electronic、Ambient。固定 Role：Exploration、Town、Battle、Boss。

## Phase 2 — Core 实现

已实现：`MusicBrief`/`ChiptuneScore` TypeScript contract、xorshift seed、scale/mode degree mapping、按 role 的 progression pool、短 motif 与 phrase variation、lead/counter/arp/bass/drum/texture、Style Pack 参数化、结构 validator + loop-fatigue heuristic、无依赖 Standard MIDI File exporter、内置 PCM preview renderer、BeepBox bridge manifest、支持 lock 的 revision API、CLI、单测与 CI smoke test。

## Phase 3 — Codex 封装

`SKILL.md` 定义激活条件、natural-language → brief、style routing、compose/validate/revise、知识路由、质量门槛与 v0.1 非目标。Schema/reference 与 SKILL 分离，避免 playbook 变成音乐百科。

## v0.1 已知捷径

和声进行仍是 diatonic degree sequence；motif variation 主要是小范围 degree displacement；counterpoint 规则较轻；部分 Style 参数仍是描述字段；preview renderer 是 lo-fi mono；loop validation 主要是结构/启发式而不是音频边界分析；BeepBox 输出是 bridge，不是直接私有 JSON。

这些是为了先验证产品假设，统一进入 v0.2 研究队列。