# 游戏音乐参考

[English](game-music.md)

## 第一原则

Game cue 不只是一首歌，而是可复用的 gameplay resource。v0.1 只处理可循环线性 cue，adaptive state graph 留到后续。

## Game Role 默认原则

### Exploration
连续性优先于高潮；中低张力；给环境/SFX 留白；避免强调重启点的终止式；常用 `chip-ambient` / `chip-core`。

### Town
身份清晰、易记；疲劳低于 battle；友好的节奏可预测性有价值；常以 `chip-core` 为 baseline，也可按世界观选其他 pack。

### Battle
强 pulse、motif 立刻可识别、更高 rhythmic drive、减少空拍，同时给战斗 SFX 留余量；`chip-rock` / `chip-electro` 是主要适配。

### Boss
v0.1 中身份/张力最强；motif 必须在高密度编曲下仍可识别；B/B2 应提高张力而不是换无关素材；不要只靠提高 BPM 制造强度。

## Loop 设计

尽早建立 tonal center；最后一小节与第一小节节奏兼容；renderer 无 crossfade 时避免过长 tail；重复已有素材让重启像延续；后段保留适量 variation，避免单 pattern 跑步机。

## 疲劳复核

高音区持续活跃、一直快速 subdivision、always-on arp、lead 无 rest、完全复制无 phrase 变化、打击乐持续满密度都会提高长期疲劳。`loopFatigueRisk` 只是 heuristic，仍需人工试听。

## 与 SFX 共存

不要让 BGM 持续占满所有感知频段。v0.1 依靠 arrangement restraint：lead 清晰、避免多个高频 dense part 同时堆叠、使用 rest、玩法嘈杂时 bass 不要过度装饰。

## 未来 Adaptive 扩展

ChiptuneScore 预留 section/state 语义，未来可以让 runtime graph 在 section/intensity layer 间路由，但 v0.1 不虚构未被验证的实时行为。