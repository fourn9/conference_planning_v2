# decisions/

> ADR（Architecture Decision Records）。重い判断を後から辿れる形で残す。
> 軽い気付きは `LEARNINGS.md` へ。両者の使い分けは `CLAUDE.md` §C を参照。

## インデックス

| # | タイトル | Status | 日付 |
|---|---|---|---|
| 0001 | [自律学習レイヤーのアーキテクチャ](0001-self-update-architecture.md) | Accepted | 2026-05-20 |
| 0002 | [ソース評価と規模 × フェーズクロスカット](0002-research-source-evaluation.md) | Accepted | 2026-05 |
| 0003 | [3D リサーチフレームワーク（規模 × 目的 × 職種）](0003-3d-research-framework.md) | Accepted | 2026-05 |
| 0004 | [Matrix B リサーチの採否ハードゲートとプロセス規律](0004-matrix-b-research-hardgate.md) | Accepted | 2026-05 |
| 0005 | [セッションテーマ構造化方法論](0005-session-theme-structuring.md) | Accepted | 2026-05 |
| 0006 | [リサーチナレッジパイプライン（claude.ai ↔ Claude Code）](0006-research-knowledge-pipeline.md) | Accepted | 2026-05 |
| 0007 | [ディープリサーチを Claude Code 内ワークフローで完結させる](0007-deep-research-in-claude-code.md) | Accepted | 2026-06 |

> **採番メモ**：`0001` は v2 の自律学習レイヤー（v2 を定義する中核）。`0002`–`0006` は企画手法 ADR で、上流テンプレ v1（[conference_planning](https://github.com/fourn9/conference_planning)）の `0001`–`0005` に対応する（v2 で +1 シフト）。

## ADR の書き方

`template.md` をコピーして使う。`/draft-adr <topic-slug>` が agent から自動で
起動する場合もある（その場合は Status: Proposed で起草される）。

## Status の意味

- **Proposed** — agent または人間が起案中。レビュー待ち
- **Accepted** — レビュー承認済み。これに沿って実装する
- **Superseded by NNNN** — 後続 ADR で置き換えられた
- **Deprecated** — 採用を取り下げた（残すが従わない）

## 命名規則

- `NNNN-<kebab-case-slug>.md`（4 桁ゼロパディング）
- 番号は連番。重複しないよう作成前に `ls *.md` で確認
