# conference_planning v2

> カンファレンス企画の伴走フレームワーク + **自律的学習レイヤー**

[v1](https://github.com/fourn9/conference_planning) を出発点に、
[hermes-agent](https://github.com/fourn9/hermes-agent) の自律学習機構を
Claude Code のプリミティブ（CLAUDE.md / スラッシュコマンド / フック / frontmatter）で
再構成した第二世代。

## v1 との違い（要約）

| 観点 | v1 | v2 |
|---|---|---|
| スキルの更新 | 人間が手で書く | 会話から `/draft-skill` で骨格自動生成 → 人間が承認して `stable/` へ昇格 |
| 失敗パターンの蓄積 | `failure-patterns.md` を手で追記 | `.failure-inbox/` に随時記録 → 3 回観測で `/promote-pattern` 候補化 |
| セッション知見 | 流れて消える | `LEARNINGS.md` に append-only で保存、`/curate` で重複統合 |
| 状態管理 | `conference-planning.yml` のみ | `MEMORY.md`（事実）/ `USER.md`（人物像）/ `LEARNINGS.md`（時系列）の 3 層 |
| プロベナンス | なし | 全 md に `created_by`, `status`, `usage_count`, `last_used`, `pinned` の frontmatter |
| スキルのライフサイクル | フラット | `experimental/` → `stable/` → `archived/`（削除しない） |
| 自律性のトリガ | 全て人間起点 | `SessionStart` / `Stop` フックで Claude 側に再思考を促す |
| Curator | なし | `/curate` で agent 作成物のみを dry-run で整理 |

## クイックスタート

```bash
git clone <this-repo> my-conference
cd my-conference
claude   # Claude Code を起動
```

セッション開始直後に Claude が以下を自動で行う（CLAUDE.md の指示による）:

1. `conference-planning.yml` で現在フェーズを確認
2. `MEMORY.md` / `USER.md` / `LEARNINGS.md` の末尾を読む
3. 該当フェーズの `skills/stable/` を呼び出して伴走を開始

セッション中、Claude は以下のスラッシュコマンドを**自発的に**呼ぶ（または提案する）:

- `/record-learning` — このセッションで発見した知見を `LEARNINGS.md` に追記
- `/draft-skill` — 新規スキルの骨格を `skills/experimental/` に生成
- `/draft-adr` — 重い判断を `decisions/` に ADR として記録
- `/promote-pattern` — `.failure-inbox/` から `failure-patterns.md` へ昇格
- `/patch-skill` — 使用中に発見したスキルの不備をその場で修正
- `/curate` — agent 作成物の昇格・統合・アーカイブを dry-run で提案
- `/reflect-session` — セッション終了時に「保存すべき学びがあったか」を自問

## ディレクトリ構成

```
conference_planning_v2/
├── CLAUDE.md                    # 常時ロード。自律学習プロトコル含む
├── AGENTS.md                    # 全 LLM 共通の前提
├── DESIGN.md                    # v2 アーキテクチャ
├── CHANGELOG.md                 # v1 → v2 差分
├── conference-planning.yml      # フェーズ状態
├── MEMORY.md                    # 事実・規約（常時ロード、frontmatter 付き）
├── USER.md                      # ユーザー人物像（常時ロード）
├── LEARNINGS.md                 # 時系列学習ログ（append-only）
├── failure-patterns.md          # キュレーション済み失敗パターン
├── .failure-inbox/              # 失敗観測の append-only 受け皿
├── .claude/
│   ├── commands/                # スラッシュコマンド 7 種
│   ├── hooks/                   # SessionStart / Stop フック
│   └── settings.example.json    # フック配線のサンプル
├── skills/
│   ├── stable/                  # 昇格済みスキル（人間承認済み）
│   ├── experimental/            # agent 起草・未承認
│   └── archived/                # 退役（削除はしない）
├── decisions/                   # ADR
├── methodology/                 # 標準フレーム + 自律学習プロトコル
├── templates/                   # 各 md の雛形
└── docs/                        # ユーザー向けガイド
```

## 設計上の Non-Goals

- **完全な無人運用**: Claude Code が永続プロセスを持たない以上、Hermes のような
  バックグラウンド curator デーモンは作らない。SessionStart フック + 手動 `/curate`
  で代替する
- **送信を伴う自動アクション**: Slack / Gmail / Notion への書き込みは v1 と同じく
  常に人間確認を経る
- **v1 の置き換え**: v1 は安定動作するフレームワークとして残し、v2 は自律学習を
  追加で試したい人向け

## ライセンス

MIT
