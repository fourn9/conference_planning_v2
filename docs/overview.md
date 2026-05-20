# Overview

## conference_planning v2 とは

v1 のフェーズ駆動の伴走者に「自律的学習レイヤー」を被せた第二世代フレームワーク。
[hermes-agent](https://github.com/fourn9/hermes-agent) の四層構造を
Claude Code のプリミティブで再構成している。

## 何が新しいか

| 観点 | v1 | v2 |
|---|---|---|
| スキル更新 | 人間が手で書く | `/draft-skill` で agent 起草 + `/curate` で昇格 |
| 失敗パターン蓄積 | `failure-patterns.md` を手で追記 | `.failure-inbox/` → 3 回観測で `/promote-pattern` |
| セッション知見 | 流れて消える | `LEARNINGS.md` に append-only |
| 状態管理 | `conference-planning.yml` のみ | + `MEMORY.md` + `USER.md` + `LEARNINGS.md` |
| プロベナンス | なし | `created_by` 等の frontmatter |
| スキルライフサイクル | フラット | `experimental/` → `stable/` → `archived/` |
| 自律性のトリガ | 全て人間起点 | `SessionStart` / `Stop` フック + LLM 内部判断 |

## 全体像

```
[ユーザーが Claude Code を起動]
        ↓
[CLAUDE.md §C を自動ロード]
        ↓
[SessionStart フックで MEMORY/USER/LEARNINGS tail を読む]
        ↓
[フェーズ実行（v1 と同じ）]
        ↓
[途中で発見があれば自発的に /record-learning, /draft-skill, etc.]
        ↓
[Stop フックで /reflect-session が起動]
        ↓
[必要に応じて保存系コマンドを連鎖呼出]
        ↓
[定期的に /curate で agent 作成物を整理（dry-run 提示）]
        ↓
[ユーザー承認で experimental → stable → archived]
```

## 次に読むもの

- [getting-started.md](getting-started.md) — クイックスタート
- [self-update-flow.md](self-update-flow.md) — 自律学習のフロー詳細
- [migration-from-v1.md](migration-from-v1.md) — v1 からの移行手順
