---
description: 反復可能な手順をスキルとして skills/experimental/ に骨格生成
argument-hint: <skill-name>
---

# /draft-skill <skill-name>

`skills/experimental/<skill-name>/skill.md` に新規スキルの骨格を作る。

## いつ呼ぶか

- 5+ ツール呼び出しを伴う複雑なタスクを完遂した
- そのタスクが**今後も繰り返し発生しそう**と判断した
- 既存スキルでは捕捉できていない

## いつ呼ばないか

- 一回限りの作業
- 既存スキルの軽微な変種（その場合は `/patch-skill` で元スキルを拡張）
- まだ手順が固まっていない（その場合は `/record-learning` で観察を残す）

## 引数

- `<skill-name>` — kebab-case-slug。例: `vendor-comparison-matrix`

## 実行手順

1. `skills/experimental/<skill-name>/` ディレクトリを作成
2. `skills/experimental/<skill-name>/skill.md` を以下のテンプレートで作成:

```markdown
---
name: <skill-name>
description: <一行、100 字以内>
phase: <該当フェーズ名 または "cross-phase">
prerequisites: []
estimated_time: <例: 30min>
created_by: agent
created_at: YYYY-MM-DD
last_used: YYYY-MM-DD
usage_count: 0
status: experimental
pinned: false
patches_needed: 0
---

# <スキル名>

## 目的

<このスキルが何を達成するか、1-2 文>

## いつ使うか

<どんな状況で呼ばれるべきか>

## 前提

<入力として必要なもの、conference-planning.yml の状態など>

## 手順

1. <ステップ 1>
2. <ステップ 2>
...

## 出力

<成果物の形式・保存先>

## Exit Criteria（終了条件）

- [ ] <検証 1>
- [ ] <検証 2>

## 既知の落とし穴

- <あれば>

## 関連

- `failure-patterns.md` #N
- `decisions/NNNN-*.md`
```

3. 作成後、ユーザーに「`skills/experimental/<skill-name>/skill.md` を起草しました。
   `/curate` で 3 回使用 + パッチ不要が確認されたら `skills/stable/` への昇格を提案します」と伝える
4. `skills/experimental/README.md` に 1 行追記（任意）

## 関連

- `CLAUDE.md` §C.2（書き込みトリガ）
- `CLAUDE.md` §C.5（プロベナンス frontmatter）
- `/curate` — 3 回使用 + パッチ不要で stable 昇格候補に
