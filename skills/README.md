# skills/

> v2 ではスキルを 3 段階のライフサイクルで管理する。
> **削除はしない。常に archived/ への移動のみ。**

## 三段階

| ディレクトリ | 説明 | created_by の典型 |
|---|---|---|
| `stable/` | 昇格済み・人間承認済み。普段はここから呼ぶ | human または agent → curator 昇格 |
| `experimental/` | agent が `/draft-skill` で起草。未承認 | agent |
| `archived/` | 退役。参照はできるが新規呼び出しはしない | 任意 |

## ライフサイクル

```
[agent が /draft-skill]
        ↓
   experimental/<name>/
        ↓ （usage_count >= 3 && patches_needed == 0）
[/curate が昇格を提案]
        ↓ ユーザー承認
   stable/<name>/
        ↓ （last_used > 90 日 && usage_count <= 1）
[/curate がアーカイブを提案]
        ↓ ユーザー承認
   archived/<name>/
```

## 各スキルの最小構成

```
skills/<lifecycle>/<name>/
└── skill.md          # frontmatter + 本体
```

複雑なスキルは以下を追加可:

```
skills/<lifecycle>/<name>/
├── skill.md
├── templates/         # このスキル専用のテンプレ
├── references/        # 参考資料
└── examples/          # 過去の使用例
```

## frontmatter 必須項目

```yaml
---
name: <kebab-case>
description: <一行、100 字以内>
phase: <phase-N> または cross-phase
prerequisites: []
estimated_time: <例: 30min>
created_by: human | agent
created_at: YYYY-MM-DD
last_used: YYYY-MM-DD
usage_count: 0
status: experimental | stable | deprecated | archived
pinned: false              # true なら curator が触らない
patches_needed: 0          # /patch-skill 適用ごとに +1
---
```

## v1 から移植する場合

v1 の `skills/phase-*` を `skills/stable/` 配下にコピーし、各 skill.md の冒頭に
上記 frontmatter を追加（`created_by: human`, `status: stable`, `pinned: true` 推奨）。
詳細は `docs/migration-from-v1.md`。

## 参照規約

- Claude は通常 `stable/` から呼ぶ
- `experimental/` は agent 自身が `/draft-skill` で作ったもの。
  ユーザー承認まで他のスキルから依存しない
- `archived/` は読むのは自由、新規依存はしない
