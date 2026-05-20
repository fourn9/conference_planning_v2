---
name: 0001-self-update-architecture
description: v2 で導入する自律学習レイヤーのアーキテクチャ。Hermes Agent の四層構造を Claude Code プリミティブにマッピングする
created_by: human
created_at: 2026-05-20
last_used: 2026-05-20
usage_count: 0
status: stable
pinned: true
adr_status: Accepted
---

# ADR-0001: 自律学習レイヤーのアーキテクチャ

**Status**: Accepted
**Date**: 2026-05-20
**Decider**: fourn9（人間）+ Claude Code（協働起案）

## Context

v1（`conference_planning`）はカンファレンス企画の伴走フレームワークとして
フェーズ駆動の振る舞いと安全装置を備えていたが、**セッション横断で学びを
蓄積する仕組みが無い**。同じ気付きを毎セッション再発見する非効率があり、
また「3 回目に気づいたパターン」のような型の発見が記録に残らない。

[Hermes Agent](https://github.com/fourn9/hermes-agent)（Nous Research の
LLM 非依存エージェントフレームワーク）が、自律的にメモリ・スキルを書き、
キュレータで定期整理する仕組みを実装している。これを Claude Code の
プリミティブで近似することで、v1 の弱点を解消できる可能性がある。

ただし Claude Code は永続プロセスを持たないため、Hermes と完全同形の
バックグラウンドデーモンは作れない。SessionStart フック + 手動 `/curate` で
代替する必要がある。

## Decision

v2 で以下の **四層構造** を採用する:

1. **指示注入層** — `CLAUDE.md` §C「自律的学習プロトコル」を常時ロード
2. **書き込み口層** — `.claude/commands/` 配下の 7 個のスラッシュコマンド
   （`/record-learning`, `/draft-skill`, `/draft-adr`, `/promote-pattern`,
   `/patch-skill`, `/curate`, `/reflect-session`）
3. **キュレータ層** — `/curate` コマンド + SessionStart フックでの周期提案
4. **状態ストア層** — ファイルベース（`MEMORY.md` / `USER.md` / `LEARNINGS.md` /
   `skills/{experimental,stable,archived}/` / `decisions/` / `.failure-inbox/`）

加えて、すべての md にプロベナンス frontmatter を持たせる
（`created_by`, `status`, `usage_count`, `last_used`, `pinned`, `patches_needed`）。
curator は `created_by: agent` かつ `pinned: false` のものだけを操作する。

## Alternatives Considered

### A. v1 を直接拡張する

- Pros: 既存ユーザーの移行コストゼロ
- Cons: 自律学習層の追加で安定動作を壊すリスク。v1 を「実績ある安定版」として
  残せない

### B. Hermes をそのまま使う

- Pros: 既に動いている設計をフル活用できる
- Cons: Hermes は LLM 非依存・Python スタック前提。Claude Code（TS/CLI 一体型）
  と思想が違いすぎる。Claude Code ユーザーには敷居が高い

### C（採用）. v1 を別リポジトリとして残し、v2 を新規作成

- 採用理由:
  1. v1 のシンプルさが好きな人は v1 のままで良い
  2. v2 で実験的な自律性を試したい人は v2 を選べる
  3. v1 → v2 への移植パスを明確にできる（`docs/migration-from-v1.md`）
  4. v2 が安定したら将来 v1 を deprecate する選択肢を残せる

## Consequences

### 良い影響

- agent が会話の中で学びを保存・整理する基盤ができる
- プロベナンス frontmatter により、人間作成物と agent 作成物を機械的に区別できる
- `skills/experimental/` の隔離により、未承認スキルが本流を汚染しない
- `archived/` への退避方式で、誤判断のロールバックが常に可能
- v1 ユーザーは強制移行されない

### 悪い影響・トレードオフ

- リポジトリが分かれることでメンテナンス負荷が 2 倍に
- 自律性のトリガが LLM 内部にある以上、プロンプトの遵守度に品質が依存する
  （Hermes と同じ制約）
- 書き込み時の差分プレビューは curator 時にしかない。誤った
  `/record-learning` は次の curate まで `LEARNINGS.md` に残る
- フックが任意のため、設定しないユーザーは自律性の半分しか得られない

### Follow-up actions

- [ ] v1 から `failure-patterns.md` / 既存 ADR / `skills/phase-*` の移植手順を
      `docs/migration-from-v1.md` に書く
- [ ] 実イベントで 1 回回して、自律性のトリガが妥当に発火するか確認
- [ ] 3 イベント分動かしたら、curator の昇格・アーカイブ閾値を見直す
- [ ] v2 が安定したら、v1 を deprecate する判断を ADR 化する

## References

- Hermes Agent: https://github.com/fourn9/hermes-agent
- v1: https://github.com/fourn9/conference_planning
- `DESIGN.md` §2-§7（具体的なマッピング）
- `methodology/autonomous-learning-protocol.md`（実行ガイド）
