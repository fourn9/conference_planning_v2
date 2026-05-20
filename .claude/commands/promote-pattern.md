---
description: .failure-inbox/ で 3 回以上観測した失敗パターンを failure-patterns.md に昇格
argument-hint: <inbox-file-id>
---

# /promote-pattern <inbox-file-id>

`.failure-inbox/` 内の観測ログを `failure-patterns.md` に昇格する。

## いつ呼ぶか

- `.failure-inbox/` 内に同じパターンが 3 件以上溜まっている
- そのパターンに対処法が見えてきた

## いつ呼ばないか

- 観測 1〜2 回（まだ偶発の可能性）
- パターンの対処法が「気をつける」しか書けない（具体化されていない）

## 引数

- `<inbox-file-id>` — `.failure-inbox/YYYY-MM-DD-<slug>.md` のスラッグ部分
  または「最新の `<キーワード>` 系」のような自然言語指定

## 実行手順

1. `.failure-inbox/` を Read で全件読む
2. 指定されたパターンに該当するエントリを集める（observed_count を数える）
3. **3 件未満なら中止** し、「まだ N 件しか観測されていません。閾値は 3 件です」と伝える
4. 3 件以上なら、`failure-patterns.md` の末尾を読み、次の番号 #N+1 を決定
5. `failure-patterns.md` の末尾に追記:

```markdown
## #N+1: <パターン名>

**症状**: どう現れるか

**原因仮説**: なぜ起きるか

**対処**: 検出時に何をするか

**関連**: skills/, decisions/ 等へのリンク

**First observed**: YYYY-MM-DD（最古のエントリの日付）
**Last observed**: YYYY-MM-DD（最新のエントリの日付）
**Observed count**: N
```

6. 昇格元の `.failure-inbox/` ファイルに `promoted_to: "failure-patterns.md#N+1"` を frontmatter に追加（削除はしない、退避もしない）
7. ユーザーに差分を提示し、承認を求める
8. 承認後、関連するスキルに「`failure-patterns.md #N+1` を参照」と追記する提案を行う

## 関連

- `.failure-inbox/README.md` — inbox の運用ルール
- `CLAUDE.md` §C.2
