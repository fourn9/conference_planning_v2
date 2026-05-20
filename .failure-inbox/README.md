# .failure-inbox/

> 失敗・ハマりパターンの **append-only 受け皿**。
> 3 回観測されたら `/promote-pattern` で `failure-patterns.md` に昇格する。

## なぜ inbox を分けるか

v1 では失敗を観測したらすぐ `failure-patterns.md` に追記していたが、
**1 回限りの偶発か、繰り返すパターンか** の判断が難しかった。

v2 では:
1. 観測したら `.failure-inbox/YYYY-MM-DD-<slug>.md` に追記
2. 同じパターンが 3 回溜まったら `/promote-pattern` で `failure-patterns.md` に昇格
3. 昇格元の inbox ファイルには `promoted_to:` フラグを立てる（削除はしない）

## エントリ形式

```markdown
---
name: YYYY-MM-DD-<slug>
description: <一行、100 字以内>
created_by: human | agent
created_at: YYYY-MM-DD
status: observed         # observed | promoted | discarded
pattern_id: <キー>       # 同パターンを束ねるための識別子
promoted_to: null        # 昇格時に "failure-patterns.md#N" のように設定
---

# <観測したパターン>

## 症状

<何が起きたか>

## 状況

<どのフェーズ・どんな文脈で起きたか>

## 原因仮説（任意）

<推測。確証なくて良い。複数仮説併記 OK>

## 暫定対処

<その場でどう対処したか>

## 関連

<関連スキル・ADR・他の inbox エントリへのリンク>
```

## `pattern_id` の付け方

同じパターンを束ねるために `pattern_id` を共有させる。例:

- `same-company-cluster` — 同一企業から複数候補
- `ai-bias-in-themes` — AI 偏重テーマ生成
- `g3-bypass-pressure` — 時間圧で G3 ゲートをスキップしたくなる

新しいパターンを観測したら自由に `pattern_id` を命名。
3 回同じ `pattern_id` が溜まったら `/promote-pattern <pattern_id>` で昇格。

## ファイル名

```
YYYY-MM-DD-<slug>.md
```

slug は内容を端的に表す kebab-case。`pattern_id` と同じである必要はない
（複数 pattern_id を含むエントリもあり得る）。

## 自動カウント

`/curate` が `.failure-inbox/` を読むとき、各 `pattern_id` の observed_count
を集計する。3 件以上のものは「昇格候補」として提示される。

## アーカイブはしない

inbox エントリは削除しない・移動しない。`promoted_to:` フラグを立てるだけ。
履歴として残す。
