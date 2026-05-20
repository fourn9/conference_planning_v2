---
name: learnings
description: セッション横断の学び。append-only。新しい順
created_by: human
created_at: 2026-05-20
last_used: 2026-05-20
usage_count: 0
status: stable
pinned: false
---

# LEARNINGS.md — 学習ログ

> セッション中に発見した非自明な知見の append-only ログ。
> `/record-learning` 経由で agent が追記する。新しいものを **末尾** に追加する。
>
> エントリ形式:
>
> ```markdown
> ## YYYY-MM-DD — <一行サマリ>
>
> **What**: 何が起きたか・何を発見したか
>
> **Why it matters**: なぜ重要か・どのフェーズに効くか
>
> **Source**: セッションの文脈（任意）
>
> **Tags**: #phase-N #role-EM #anti-pattern など
> ```
>
> ルール:
>
> - declarative で書く（観察を書く、命令は書かない）
> - PR#・SHA・一時状態は書かない（CLAUDE.md §C.2 anti-noise）
> - 同じ学びを 3 回書いていることに気づいたら `/draft-adr` 候補
> - 学びがスキル化できそうなら `/draft-skill` 候補

---

<!-- 以下、新しい順ではなく **古い順** に追記する。tail で末尾を読むため -->

## 2026-05-20 — v2 リポジトリ作成

**What**: v1 をベースに自律学習レイヤーを追加した v2 を新規リポジトリとして作成した。

**Why it matters**: v1 はフェーズ駆動の伴走者として安定しているが、セッション横断の知見蓄積機構が無く、同じ気付きを毎回ゼロから発見していた。v2 で `LEARNINGS.md` / `/curate` / プロベナンス frontmatter を導入することで、agent 自身が学びを保存・整理できるようになる。

**Source**: v2 初回スキャフォールド（hermes-agent 解析を参考に Claude Code プリミティブへポート）

**Tags**: #meta #v2-foundation
