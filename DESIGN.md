# DESIGN.md — conference_planning v2 アーキテクチャ

> v1 の「フェーズ駆動の伴走者」に **自律的学習レイヤー** を被せた設計。
> Hermes Agent の四層構造（指示注入 / 書き込み口 / キュレータ / 状態ストア）を
> Claude Code のプリミティブにマッピングする。

## 1. 設計原則

1. **削除しない、退避する** — agent 作成物は archive へ。誤判断のロールバック余地を残す
2. **書き込みは LLM 駆動の明示的ツール呼び出し** — 自動スクレイプはしない。LLM が「これは保存に値する」と判断したときだけ
3. **プロベナンスは frontmatter で完結** — `created_by: agent|human` で curator の対象を機械的に区別
4. **anti-noise が最優先** — PR#、コミット SHA、一時状態は memory に書かない（hermes の規律をそのまま継承）
5. **declarative > imperative** — 「ユーザーは簡潔な応答を好む ✓」「常に簡潔に応答する ✗」
6. **patch on discovery** — スキルを使ってバグや古さに気づいたら次回のためにそこで直す

## 2. レイヤー構成

### Layer 1: 指示注入（CLAUDE.md）

Hermes の `prompt_builder.py` に相当。CLAUDE.md に以下のセクションを常時ロード:

- **§A 役割定義** — 伴走者として何をするか（v1 から継承）
- **§B フェーズフロー** — Phase 1〜5 のマッピング（v1 から継承）
- **§C 自律的学習プロトコル** ★v2 新規
  - 書き込みトリガ条件（何を見たら何を呼ぶか）
  - anti-noise ルール（書いてはいけないものリスト）
  - patch-on-discovery 規律
- **§D 安全装置** — 外部送信前は必ず人間確認（v1 から継承）

### Layer 2: 書き込み口（`.claude/commands/`）

Hermes の `memory` tool / `skill_manage` tool に相当。
LLM が自発的に呼ぶ 7 個のスラッシュコマンド:

| コマンド | 書き込み先 | トリガ条件 |
|---|---|---|
| `/record-learning` | `LEARNINGS.md` 末尾 | セッション中に非自明な発見があった |
| `/draft-skill <name>` | `skills/experimental/<name>/skill.md` | 5+ ツール呼び出しの複雑タスクを完遂した |
| `/draft-adr <topic>` | `decisions/NNNN-<slug>.md` | 同じ判断を 2 回繰り返した、または不可逆な選択を行った |
| `/promote-pattern <id>` | `failure-patterns.md` に追加 | `.failure-inbox/` で同パターンを 3 回観測した |
| `/patch-skill <path>` | 既存スキルを直接編集 | スキル使用中に古さ・誤り・抜けに気づいた |
| `/curate` | 複数（dry-run 提示） | 最終 curate から N 日経過、または手動起動 |
| `/reflect-session` | 必要なら他コマンドを連鎖呼出 | セッション終了時（Stop フックから自動起動） |

### Layer 3: キュレータ（`/curate` コマンド）

Hermes の `curator.py` に相当。バックグラウンドデーモンの代わりに
SessionStart フックで「最終 curate から X 日経過」を検知して提案。

`/curate` の処理:

1. `created_by: agent` の md を全列挙
2. **昇格判定** — `skills/experimental/` のうち `usage_count >= 3` かつ `patches_needed == 0` のもの → `skills/stable/` に移動候補
3. **アーカイブ判定** — `last_used` が 90 日以上前 → `skills/archived/` に移動候補
4. **重複統合** — `LEARNINGS.md` 内の semantic 重複を提示（自動マージはしない）
5. **failure-pattern 昇格** — `.failure-inbox/` で `observed_count >= 3` のパターン → `failure-patterns.md` に昇格候補
6. すべて **dry-run で差分提示**。`/curate --apply` で確定

### Layer 4: 状態ストア（ファイルベース）

Hermes の SQLite + FTS5 の代わりに純粋にファイル。FTS は Claude の grep で代替。

```
MEMORY.md      # 事実・規約（常時ロード）
USER.md        # ユーザー人物像（常時ロード）
LEARNINGS.md   # 時系列ログ（必要時 tail 読み）
conference-planning.yml  # フェーズ状態（v1 継承）
skills/{experimental,stable,archived}/  # スキル
decisions/     # ADR
.failure-inbox/  # 失敗観測の生ログ
failure-patterns.md  # キュレーション済み
```

## 3. プロベナンス frontmatter

全 md は次の frontmatter を持つ:

```yaml
---
name: <kebab-case-slug>
description: <one-line, < 100 chars>
created_by: agent | human
created_at: 2026-05-20
last_used: 2026-05-20
usage_count: 0
status: experimental | stable | deprecated | archived
pinned: false
patches_needed: 0
---
```

curator は `created_by: agent` かつ `pinned: false` のものだけを操作する。
`human` 作成のものは触らない（人間の意図を尊重）。

## 4. フック配線

`.claude/settings.example.json` を `settings.json` にコピーして使用:

- **SessionStart** — `MEMORY.md`, `USER.md`, `LEARNINGS.md tail -20`, `conference-planning.yml` を読み込みさせる
- **Stop** — `/reflect-session` を起動して「今回保存すべき学びはあったか」を Claude に自問させる

フックは**任意**。設定しなくても全コマンドは手動で動く。

## 5. 安全装置

| 操作 | デフォルト | 上書き方法 |
|---|---|---|
| `/curate` | dry-run | `--apply` フラグ |
| スキル削除 | 不可（archive のみ） | なし |
| `created_by: human` への curator 操作 | 不可 | なし |
| `pinned: true` への curator 操作 | 不可 | `pinned: false` に変更 |
| 外部送信（Slack/Gmail/Notion） | 必ず人間確認 | なし（v1 と同じ） |

## 6. v1 との互換性

- `skills/stable/` には v1 のフェーズスキル（`phase-1-axis-definition` 〜
  `phase-4-6-session-theme-structuring`、`analysis/`、`validation/`）を
  そのまま配置可能。frontmatter を追加するだけ
- `conference-planning.yml` のスキーマは v1 と互換
- v1 で書かれた失敗パターン・ADR・テンプレートはそのまま流用

詳細は `docs/migration-from-v1.md`。

## 7. Hermes との対応表

| Hermes 構成要素 | v2 での実装 |
|---|---|
| `agent/prompt_builder.py` の `MEMORY_GUIDANCE` / `SKILLS_GUIDANCE` | `CLAUDE.md` §C |
| `memory` tool | `/record-learning`, `MEMORY.md` への直接編集 |
| `skill_manage` tool | `/draft-skill`, `/patch-skill` |
| `agent/curator.py` | `/curate` コマンド + SessionStart フック |
| `~/.hermes/skills/.archive/` | `skills/archived/` |
| `~/.hermes/skills/.usage.json` | 各スキルの frontmatter `usage_count` |
| `created_by: agent` プロベナンス | 同名 frontmatter キー |
| `hermes curator pin` | frontmatter `pinned: true` |
| SQLite + FTS5 | 不採用（grep で代替） |
| バックグラウンド常駐 | 不採用（SessionStart フック起動） |

## 8. 既知の制約

- **検出ロジックは LLM 内部にある** — 「5+ ツール呼び出しで複雑」は曖昧。
  プロンプトの遵守度に依存する（Hermes と同じ制約）
- **書き込みの差分プレビューは write 時には無い** — curator 時のみ。
  誤った `/record-learning` は次の curate まで `LEARNINGS.md` に残る
- **agent 作成スキルは品質ゲートを通らない** — `skills/experimental/` に
  分離して人間昇格を必須にすることで mitigation
