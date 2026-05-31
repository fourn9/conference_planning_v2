---
name: memory
description: 事実・規約・このプロジェクトの「型」。常時ロードされる
created_by: human
created_at: 2026-05-20
last_used: 2026-05-20
usage_count: 0
status: stable
pinned: true
---

# MEMORY.md — このリポジトリの事実

> 規約・前提・このプロジェクトの「型」を書く。
> ユーザー個別の情報は `USER.md`、時系列の学びは `LEARNINGS.md` へ。
>
> **書き方ルール（CLAUDE.md §C.3）**: declarative で書く（観察を書く、命令は書かない）。

## フレームワーク前提

- フェーズは 7 段階（Phase 1〜5 + 4.5 / 4.6）。`conference-planning.yml` で状態管理。
- スキルは `skills/stable/`（昇格済み）/ `skills/experimental/`（agent 起草）/ `skills/archived/`（退役）の三段。
- 判断記録は `decisions/`（ADR）と `LEARNINGS.md`（軽い気付き）の二層。

## 規模セグメント（5 区分、v1 から継承）

- small: 〜100 名
- medium: 100〜500 名
- large: 500〜2,000 名
- xl: 2,000〜5,000 名
- xxl: 5,000+ 名

## 目的軸（6 軸、v1 から継承）

P1 立上 / P2 拡張 / P3 統合 / P4 刷新 / P5 AI 組込 / P6 AI ネイティブ

## 職種軸（7 区分、v1 から継承、ADR-0003 にて CTO 除外）

EM / TL / Senior / Mid / Junior / SRE / Data

## ハードゲート（G1〜G7、登壇者選定時）

詳細は `skills/stable/research/hardgate-evaluation/`。

## anti-pattern よく出るもの（詳細は `failure-patterns.md`）

- AI 偏重（#18）
- 粒度揃え過剰（#16）
- 同一企業集中（#13）

---

<!-- ここから先は agent が `/record-learning` 経由で追記する領域 -->
<!-- 各エントリは frontmatter なしの ## 見出しで書く -->

## （ここに学んだ規約・型を追記）
