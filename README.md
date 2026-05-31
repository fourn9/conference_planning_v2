# conference_planning v2

> カンファレンス企画の伴走フレームワーク（企画フェーズスキル同梱）+ **自律的学習レイヤー**

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

clone するだけで `skills/stable/` に企画フェーズスキル9本が揃っており、`CLAUDE.md §B` のフェーズフローがそのまま動きます（v1 からの手動コピー不要）。

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
│   ├── stable/                  # 昇格済みスキル（企画フェーズ9本を同梱・人間承認済み）
│   ├── experimental/            # agent 起草・未承認
│   └── archived/                # 退役（削除はしない）
├── decisions/                   # ADR
├── methodology/                 # 標準フレーム + 自律学習プロトコル
├── templates/                   # 各 md の雛形
└── docs/                        # ユーザー向けガイド
```

## スキル一覧

`skills/stable/` に同梱。clone 直後から `CLAUDE.md` のフェーズフローで呼び出される。

### 企画フェーズ（順に実行）
| スキル | 説明 |
|---|---|
| `1-axis-definition` | ターゲット聴衆の規模・目的・職種の軸を定義する |
| `2-matrix-a` | 規模×目的の Matrix A を IR・中期計画・経営層発言から構築する |
| `3-matrix-b` | 職種×目的の Matrix B を採否ハードゲートで構築する |
| `4-core-themes` | 複数規模×職種で重複する「知りたいこと」からコアテーマを抽出する |
| `4-5-internal-validation` | Matrix B 仮説を社内エンジニアへのヒアリングで検証する |
| `4-6-theme-structuring` | コアテーマを大／中／小テーマの階層に構造化する |

### research/ — リサーチ・ループ（外部 LLM への深掘りリサーチを設計→レビュー→改善）
| スキル | 説明 |
|---|---|
| `design-prompt` | ディープリサーチ用プロンプトを設計（カバレッジ最大化×ハルシネーション最小化・closed list 禁止） |
| `review-output` | 返ってきた成果ドキュメントを品質レビュー（実在性・カバレッジ・引用・越境・偏り） |
| `iterate-from-failures` | 見つけた問題を失敗パターン #1–20 にマップし、次プロンプトを改善 |
| `hardgate-evaluation` | リサーチ候補を G1–G7 ハードゲートで採否判定（review 内のソース単位ゲート） |

### analysis/ — 補助分析
| スキル | 説明 |
|---|---|
| `adjacent-conferences` | 隣接カンファレンスの登壇傾向を分析（過去データなしの代替にも） |
| `genre-aggregation` | Matrix B をジャンル集約し職種横断の傾向を抽出する |

> 自律学習のスラッシュコマンド（`/record-learning`・`/draft-skill`・`/draft-adr`・`/promote-pattern`・`/patch-skill`・`/curate`・`/reflect-session`）は `.claude/commands/` を参照。

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
