# decisions/

> ADR（Architecture Decision Records）。重い判断を後から辿れる形で残す。
> 軽い気付きは `LEARNINGS.md` へ。両者の使い分けは `CLAUDE.md` §C を参照。

## インデックス

| # | タイトル | Status | 日付 |
|---|---|---|---|
| 0001 | [自律学習レイヤーのアーキテクチャ](0001-self-update-architecture.md) | Accepted | 2026-05-20 |

<!-- v1 から ADR を引き継ぐ場合はここに追記 -->

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
