# LEARNINGS.md エントリ テンプレ

`LEARNINGS.md` に追記するときの形式。`/record-learning` が agent から呼ばれて生成する。
新しいエントリは **末尾に追加**（古い順に並ぶ。tail で末尾を読むため）。

```markdown
## YYYY-MM-DD — <一行サマリ（30 字以内）>

**What**: 何が起きたか・何を発見したか（2-3 行）

**Why it matters**: なぜ重要か・どのフェーズに効くか（1-2 行）

**Source**: セッションの文脈・元となった会話（任意、1 行）

**Tags**: #phase-N #role-X #anti-pattern など（任意、1 行）
```

## ✓ 良い例

```markdown
## 2026-06-15 — 初開催イベントでも Matrix B は職種 7 軸維持

**What**: Architecture Conference の初回開催で `is_first_time: true` を立てたが、
Matrix B の職種軸は 7 区分のまま使えた。過去データが無くてもジャンル集約スキルで
代替できた。

**Why it matters**: Phase 3 で「初回だから職種を減らそう」と判断しないで済む。
Matrix B のフレームは初開催にもロバスト。

**Source**: Architecture Conference 2026 の Phase 3 セッション

**Tags**: #phase-3 #first-time #matrix-b
```

## ✗ 悪い例

```markdown
## 2026-06-15 — PR #45 をマージした

<- 取引的記録なので anti-noise ルール違反
```

```markdown
## 2026-06-15 — Matrix B は今後も 7 軸で行くべき

<- 命令形（「べき」）。「7 軸で機能するパターンが観測された」のように観察形で
```
