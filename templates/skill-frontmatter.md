# skill frontmatter テンプレ

`skills/{experimental,stable,archived}/<name>/skill.md` の冒頭。

```yaml
---
name: <kebab-case-slug>
description: <一行、100 字以内。「何をするスキルか」を端的に>
phase: phase-N | cross-phase
prerequisites:
  - <必要な前提スキルや状態>
estimated_time: <例: 30min, 2h>
created_by: human | agent
created_at: YYYY-MM-DD
last_used: YYYY-MM-DD
usage_count: 0
status: experimental | stable | deprecated | archived
pinned: false
patches_needed: 0
---
```

## フィールドの意味

| キー | 意味 | curator の利用 |
|---|---|---|
| `name` | ファイル名と一致する slug | 識別子 |
| `description` | 一行説明 | インデックス生成時に使用 |
| `phase` | フェーズ識別子 | フィルタ用 |
| `prerequisites` | 前提条件のリスト | チェーン解析用 |
| `estimated_time` | おおよその実行時間 | スケジューリング参考 |
| `created_by` | `human` or `agent` | **curator は agent のみ操作** |
| `created_at` | 作成日 | 古さ判定 |
| `last_used` | 最終使用日 | アーカイブ判定 |
| `usage_count` | 累積使用回数 | 昇格判定 |
| `status` | ライフサイクル状態 | 移動先判定 |
| `pinned` | true なら curator 不可侵 | **safety lock** |
| `patches_needed` | パッチ適用累計 | 安定度判定（多いほど不安定） |

## 更新タイミング

| イベント | 更新フィールド |
|---|---|
| スキル呼び出し時 | `last_used: today`, `usage_count: +1` |
| `/patch-skill` 実行時 | `last_used: today`, `patches_needed: +1` |
| `/curate --apply` 実行時（昇格） | `status: stable`, `last_used: today` |
| `/curate --apply` 実行時（アーカイブ） | `status: archived` |

## サンプル（experimental）

```yaml
---
name: vendor-comparison-matrix
description: 配信プラットフォームを 5 軸で比較するマトリクスを生成
phase: phase-8-venue-and-experience
prerequisites:
  - 候補プラットフォームのリスト
estimated_time: 45min
created_by: agent
created_at: 2026-05-25
last_used: 2026-05-25
usage_count: 1
status: experimental
pinned: false
patches_needed: 0
---
```

## サンプル（stable, v1 から移植）

```yaml
---
name: 1-axis-definition
description: ターゲット聴衆の規模・目的・職種軸を定義する
phase: phase-1
prerequisites: []
estimated_time: 2h
created_by: human
created_at: 2026-05-19
last_used: 2026-05-20
usage_count: 0
status: stable
pinned: true
patches_needed: 0
---
```
