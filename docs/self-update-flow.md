# Self-Update Flow

> v2 の自律学習レイヤーがどう動くかをフロー図で示す。
> 設計根拠は `DESIGN.md`、実行ガイドは `methodology/autonomous-learning-protocol.md`。

## 全体フロー

```
┌─────────────────────────────────────────────────┐
│  Layer 1: 指示注入 (CLAUDE.md §C 常時ロード)    │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  Layer 2: 書き込み口 (.claude/commands/)         │
│  ┌──────────────────────────────────────────┐   │
│  │ /record-learning  → LEARNINGS.md          │   │
│  │ /draft-skill      → skills/experimental/  │   │
│  │ /draft-adr        → decisions/            │   │
│  │ /promote-pattern  → failure-patterns.md   │   │
│  │ /patch-skill      → 既存スキル            │   │
│  │ /reflect-session  → 上記を連鎖呼出        │   │
│  └──────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  Layer 3: キュレータ (/curate コマンド)          │
│  ┌──────────────────────────────────────────┐   │
│  │ 昇格: experimental → stable               │   │
│  │ アーカイブ: stable → archived             │   │
│  │ 重複統合: LEARNINGS.md 内                 │   │
│  │ failure-pattern 昇格: inbox → patterns    │   │
│  │ 全て dry-run 提示。--apply で確定         │   │
│  └──────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  Layer 4: 状態ストア (ファイルベース)            │
│  ┌──────────────────────────────────────────┐   │
│  │ MEMORY.md      USER.md      LEARNINGS.md  │   │
│  │ skills/{experimental,stable,archived}/    │   │
│  │ decisions/     .failure-inbox/            │   │
│  │ failure-patterns.md   conference-planning.yml │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## セッション内の典型フロー

```
[SessionStart フック]
   ↓
   Claude が MEMORY/USER/LEARNINGS tail を読む
   ↓
[ユーザーが「Phase 3 を進めたい」と発言]
   ↓
   Claude が skills/stable/phase-3-matrix-b/ を呼ぶ
   ↓
[ステップ 4 で古さに気づく]
   ↓
   Claude が「このステップ古いです、/patch-skill しますか？」と提案
   ↓
   ユーザー承認
   ↓
[ステップ完遂、新しい発見]
   ↓
   Claude が「`/record-learning` で残しますか？」と提案
   ↓
[セッション終わり]
   ↓
[Stop フック]
   ↓
   /reflect-session が起動
   ↓
   Claude が「保存すべきもの 2 件あります」と提示
   ↓
   ユーザー承認 → 各コマンド実行
```

## キュレータの典型フロー

```
[2 週間後の SessionStart]
   ↓
   Claude が「最終 /curate から 14 日経過。実行しますか？」と提案
   ↓
   ユーザー: はい
   ↓
   /curate （dry-run）
   ↓
   ┌────────────────────────────────────────┐
   │ 昇格候補 (experimental → stable): 2件  │
   │  - skills/experimental/vendor-cmp/     │
   │    (usage_count: 4, patches_needed: 0) │
   │  - skills/experimental/lt-recruit/     │
   │    (usage_count: 3, patches_needed: 0) │
   │                                        │
   │ アーカイブ候補 (stable → archived): 1件 │
   │  - skills/stable/old-marketing/        │
   │    (last_used: 100日前, usage_count: 1)│
   │                                        │
   │ LEARNINGS.md 重複統合候補: 3件         │
   │  - 「Phase 4.5 外部拡張」を 5回観測    │
   │    → /draft-adr 候補                   │
   │                                        │
   │ failure-pattern 昇格候補: 1件          │
   │  - 「同一企業集中」を 4 回観測          │
   │    → /promote-pattern を提案           │
   └────────────────────────────────────────┘
   ↓
   ユーザー: 確認しました
   ↓
   /curate --apply
   ↓
   ファイル移動・frontmatter 更新
   ↓
   conference-planning.yml > curator.last_run を更新
```

## anti-noise を弾くフロー

```
[Claude が何か気づく]
   ↓
[CLAUDE.md §C.2 の anti-noise リストと照合]
   ↓
 ┌─ 該当（PR#, SHA, 取引的記録, etc.）
 │  ↓
 │  保存しない（書かない）
 │
 └─ 非該当
    ↓
    [§C.3 の declarative チェック]
    ↓
   ┌─ imperative になっている
   │  ↓
   │  declarative に書き直す
   │  ↓
   │  保存
   │
   └─ declarative
      ↓
      保存
```

## 関連

- `DESIGN.md` §2-§7
- `decisions/0001-self-update-architecture.md`
- `methodology/autonomous-learning-protocol.md`
