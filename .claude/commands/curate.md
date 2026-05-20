---
description: agent 作成物の昇格・統合・アーカイブを dry-run で提案
argument-hint: [--apply]
---

# /curate [--apply]

`created_by: agent` のファイルを横断的に整理する。
**デフォルトは dry-run**。実際の変更には `--apply` が必要。

## いつ呼ぶか

- `conference-planning.yml > curator.last_run` が 14 日以上前
- `skills/experimental/` が肥大化してきた
- `LEARNINGS.md` が長くなって重複が増えてきた
- ユーザーから明示的に呼ばれた

## いつ呼ばないか

- セッション開始直後（先にユーザーの作業を進める）
- ユーザーが進行中タスクを抱えている最中（中断を避ける）

## 引数

- なし（デフォルト dry-run）
- `--apply` — 提案を確定し、ファイルを移動・統合する

## 実行手順

### Step 1: 列挙

以下を全列挙し、frontmatter を読む:

- `skills/experimental/**/skill.md`
- `skills/stable/**/skill.md`
- `skills/archived/**/skill.md`
- `decisions/*.md`
- `.failure-inbox/*.md`
- `LEARNINGS.md`（行単位で内容を解析）

### Step 2: 4 種の判定

#### a) 昇格候補（experimental → stable）

条件:
- `created_by: agent`
- `pinned: false`
- `usage_count >= 3`
- `patches_needed == 0`
- frontmatter の `status: experimental`

#### b) アーカイブ候補（stable → archived）

条件:
- `created_by: agent`（human 作成のものは触らない）
- `pinned: false`
- `last_used` が **90 日以上前**
- `usage_count <= 1`

#### c) 重複統合候補（LEARNINGS.md 内）

条件:
- `LEARNINGS.md` の中で、**同じトピック**を扱う 3 件以上のエントリ
- 検出は agent のセマンティック判断（厳密一致は不要）

統合は提案のみ。自動マージはしない。ユーザーが手で統合するか、
`/draft-adr` で ADR 化する判断を仰ぐ。

#### d) failure-pattern 昇格候補

条件:
- `.failure-inbox/` 内で同じパターンが 3 件以上
- まだ `failure-patterns.md` に未昇格

`/promote-pattern` の起動を提案する。

### Step 3: 差分提示

以下のフォーマットで提示:

```markdown
## /curate dry-run — YYYY-MM-DD

### 昇格候補（experimental → stable）N 件
- `skills/experimental/X/skill.md` (usage_count: 4, patches_needed: 0)
- ...

### アーカイブ候補（stable → archived）M 件
- `skills/stable/Y/skill.md` (last_used: 2026-02-01, usage_count: 0)
- ...

### LEARNINGS.md 重複統合候補 K 件
- 「Phase 4.5 を外部に拡張」が 5 件 → ADR 化候補
- ...

### failure-pattern 昇格候補 L 件
- `.failure-inbox/` で「同一企業集中」を 4 回観測 → `/promote-pattern same-company-cluster` を提案
- ...

`/curate --apply` で確定します。
個別に拒否したい場合は項目を指定してください。
```

### Step 4: --apply の場合

1. 昇格: `skills/experimental/X/` → `skills/stable/X/` に `git mv`
   frontmatter `status: stable`, `last_used: today` に更新
2. アーカイブ: `skills/stable/Y/` → `skills/archived/Y/` に `git mv`
   frontmatter `status: archived` に更新
3. 重複統合: **自動マージはしない**。ユーザーへの提案のみ
4. failure-pattern 昇格: `/promote-pattern` を別途呼ぶよう促す
5. `conference-planning.yml > curator.last_run` を today に更新
6. `conference-planning.yml > curator.last_actions` に上記サマリを追記（5 件まで保持）

### Step 5: 不変条件の検査

- `created_by: human` のファイルは絶対に移動・編集しない
- `pinned: true` のファイルは絶対に移動・編集しない
- **削除はしない**。常に move のみ

## 関連

- CLAUDE.md §C（自律的学習プロトコル）
- DESIGN.md §3（curator の設計根拠）
- `decisions/0001-self-update-architecture.md`
