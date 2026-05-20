---
name: conference-planning-framework
description: 3D リサーチフレームの実行ガイド（v1 から継承）
created_by: human
created_at: 2026-05-20
last_used: 2026-05-20
usage_count: 0
status: stable
pinned: true
---

# Conference Planning Framework — 3D リサーチフレーム

> このドキュメントは v1 リポジトリ（[fourn9/conference_planning](https://github.com/fourn9/conference_planning)）
> の `methodology/conference-planning-framework.md` をベースにしている。
>
> **v2 リポジトリ初期化時点では中身は未移植**。実イベントで使う前に v1 から
> コピーすること。手順は `docs/migration-from-v1.md` を参照。

## 移植手順（概要）

```bash
# v1 リポジトリのクローンがある前提
cp ~/path/to/conference_planning/methodology/conference-planning-framework.md \
   ./methodology/conference-planning-framework.md

# frontmatter を維持するため、ヘッダだけマージする
# （手作業: 上のような frontmatter ブロックを保ち、本文を v1 から差し替える）
```

## v1 からの主な変更点（移植時に追加すべき）

- v2 では `decisions-log.md` ではなく `LEARNINGS.md` に時系列の気付きを書く
- v2 では `failure-patterns.md` への追記は `.failure-inbox/` 経由
  （3 回観測で `/promote-pattern` 昇格）
- v2 では同じ判断を 2 回繰り返したら `/draft-adr` の起動を検討

## 参照

- v1 原本: https://github.com/fourn9/conference_planning/blob/main/methodology/conference-planning-framework.md
- 関連 ADR（v1）: 0001-research-source-evaluation, 0002-3d-research-framework,
  0003-matrix-b-research-hardgate, 0004-session-theme-structuring
