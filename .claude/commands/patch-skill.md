---
description: 使用中に発見したスキルの古さ・誤り・抜けをその場で修正
argument-hint: <skill-path>
---

# /patch-skill <skill-path>

スキルを使っている最中に気づいた不備を、**待たずに**直す。

## いつ呼ぶか

- スキルの手順を実行していて、ステップが古い・足りない・誤っていることに気づいた
- 既知の落とし穴セクションに新しく追加すべきものがある
- 関連リンクが切れている

## いつ呼ばないか

- 不備の確証がない（その場合は `LEARNINGS.md` に「このスキルは古い可能性がある」と書く）
- 大幅な改修（その場合は `/draft-skill` で代替スキルを起草し、元を `deprecated` にする）

## 引数

- `<skill-path>` — `skills/stable/1-axis-definition/skill.md` のような相対パス

## 実行手順

1. 対象スキルの frontmatter を確認
2. **`created_by: human` かつ `pinned: true` の場合は中止**し、
   代わりに `LEARNINGS.md` に「`<skill-path>` に以下の不備が見つかった: ...」と記録
3. それ以外なら、修正内容の差分を Edit で適用
4. frontmatter の以下を更新:
   - `last_used: YYYY-MM-DD`（今日）
   - `patches_needed`: +1（patches を当てた事実を記録）
5. スキル末尾の `## 変更履歴`（無ければ作る）に 1 行追記:
   - `- YYYY-MM-DD (agent): <修正サマリ>`
6. ユーザーに差分を提示し、承認を求める
7. **承認後**、変更を確定

## 関連

- CLAUDE.md §C.4（patch on discovery）
- `/curate` — `patches_needed` の合計が多いスキルは見直し候補として提示される
