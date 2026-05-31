# ADR-0006: リサーチナレッジパイプライン（claude.ai ↔ Claude Code）

- **Status**: Accepted
- **Date**: 2026-05
- **Tags**: research, tooling, methodology
- **Related**: [ADR-0002](0002-research-source-evaluation.md), [ADR-0003](0003-3d-research-framework.md), [ADR-0004](0004-matrix-b-research-hardgate.md)

## Context（背景・問題）

Phase 2（Matrix A）と Phase 3（Matrix B）のリサーチは、長時間の Deep Research（クラウド側 LLM）に
向いている。一方、ハードゲート評価、テーマ抽出、ペルソナ統合、Memory.md の状態管理など
後続フェーズの作業は、ローカルのファイル群をまたいで Claude Code が直接読み書きしながら
進めるほうが速い。

つまり同じプロジェクトで **2 つの実行環境** が混在する：

| 実行環境 | 得意なこと | 苦手なこと |
|---|---|---|
| クラウド LLM（claude.ai 等） | 長時間 Deep Research、Web 横断、大量 URL 評価 | プロジェクト状態の継続保持、ローカルファイルの一括編集 |
| Claude Code（ローカル） | ファイル横断分析、Memory.md 更新、コード／markdown の編集、MCP 経由の業務システム接続 | 数十分単位の Web 検索を背景で回し続けること |

両者の出力を **手作業で markdown を貼り付けて往復する** のは、規模が大きくなるほど破綻する：

- どれが最新版か分からなくなる
- フロントマターやファイル名規約がブレる
- Claude Code 側から「Phase 3 で claude.ai が出した出典 URL」を再度参照したいとき、辿れない
- inbox／reviewed のような **整理状態** がコピペでは保てない

明示的なパイプラインがないと、Phase 4 以降は Phase 2/3 のリサーチを再現性なく再消費することになる。

## Decision（決定）

クラウド LLM と Claude Code の間に **共有 Vault（ファイルベースのナレッジリポジトリ）** を
1 枚挟む。Vault は以下を満たす：

### 1. 二方向アクセス可能なストレージに置く

- クラウド LLM 側から書き込めるストレージ（例：Google Drive、Dropbox、S3 互換）
- 同じファイル群がローカルにも同期される（例：Google Drive クライアント、rclone、Dropbox クライアント）
- Claude Code 側からはローカルファイルとして MCP 経由で読める

### 2. inbox → reviewed の 2 層構造

- `00-inbox/` — クラウド LLM が投入する生の出力（`status: raw`）
- `01-research/` — Claude Code が整理した検証済み素材（`status: reviewed`）
  - 下位は `people/` `companies/` `themes/` `venues/` のように 3D フレームワークの軸に対応

整理を経ないものは Phase 4 以降で引用しない、というハードルを設けることで、生 Deep Research が
そのまま増殖するのを防ぐ。

### 3. ファイル単位のフロントマター必須

各 markdown ファイルは YAML フロントマターを持つ：

```yaml
---
status: raw | reviewed
type: person | company | theme | venue
sources: [URL1, URL2, ...]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

これにより Claude Code 側で `search_files` した結果が **何のソースから来た情報か** を
即座に判定できる。

### 4. MCP 経由の読み込みを優先

Claude Code から Vault を読むときは、クラウドストレージ API ではなく
**ローカル同期ファイル＋ filesystem 系 MCP**（例：Obsidian MCP、filesystem MCP）を優先する。

理由：

- API レイテンシなしで高速に list/search/read できる
- 認証トークンの管理が不要
- ストレージベンダーを差し替えても MCP 接続部分は変わらない

API は同期未完了時のフォールバックに限る。

### 5. Memory.md でフェーズ状態を保持

Vault 内に 2 階層の Memory.md を置く：

- 領域全体の Memory.md（複数イベントをまたぐ知見）
- イベント単独の Memory.md（`conference-planning.yml` と相補：状態の自由記述側）

Claude Code はセッション開始時に両方を読み、終了時に確定事項・次にやることを書き戻す。

## Consequences（結果・影響）

### Positive

- claude.ai が出した Deep Research 成果が「捨てられない」「上書きされない」「再引用できる」状態で残る
- Claude Code は短いセッションでも `01-research/` を読みに行けば即座に文脈を取り戻せる
- ベンダー（ストレージ・MCP）を差し替え可能（Google Drive を S3 に、Obsidian MCP を filesystem MCP に等）
- 複数イベントをまたいだ知見（例：A 社の登壇者は B イベントでも候補）が自然に蓄積する

### Negative / Trade-offs

- 初期セットアップに 30〜60 分かかる（クラウドストレージ、同期クライアント、MCP の三点接続）
- フロントマター規約を守らないと検索が機能しない
- inbox 整理を怠ると `00-inbox/` がただのゴミ箱になる

### Risks

- 同期コンフリクト（同じファイルをクラウド側／ローカル側で同時編集すると衝突）
  → claude.ai は `00-inbox/` 専用、Claude Code は `01-research/` 専用、と書き込み権限を分けて回避
- センシティブ情報の取扱い（個人情報・スポンサー情報を含むファイルがクラウドに残る）
  → Vault は private アクセス前提。公開リポには Vault そのものを置かない

## Alternatives Considered（検討した代替案）

### 代替案 A：手動コピペで往復

却下 — 上記 Context のとおり、規模が増えると整合性が破綻する。

### 代替案 B：クラウド DB（Notion／Airtable 等）に集約

却下 —

- Claude Code から markdown としての横断検索が遅い／柔軟性が低い
- フロントマターのような構造化メタデータと自由本文の両立がやりにくい
- バージョン管理（git でローカル Vault を版管理）がしづらい

ただしリサーチ成果の **共有・閲覧用** にエクスポートする選択肢としては残せる。

### 代替案 C：クラウド LLM 側に状態を全部持たせる

却下 — クラウド LLM のセッション履歴は永続性に乏しく、Phase 4 以降の編集主体は Claude Code 側
（ファイルベース）にあるため、状態の所在を寄せるならローカルが妥当。

### 代替案 D：Claude Code だけで Deep Research も完結させる

却下 — 短時間セッションを想定した Claude Code に長時間の Web 横断リサーチを担わせると、
コンテキストウィンドウとレイテンシの両面で非効率。「適材適所」を ADR-0003 の精神
（Matrix A は IR ベースの長時間リサーチ）から維持する。

## References

- 関連 ADR：[0002](0002-research-source-evaluation.md)（ソース評価がフロントマターの根拠）、
  [0003](0003-3d-research-framework.md)（軸が Vault のフォルダ構造に対応）、
  [0004](0004-matrix-b-research-hardgate.md)（ハードゲートが `reviewed` 昇格の条件）
- 実行ガイド：[`docs/research-pipeline.md`](../docs/research-pipeline.md)
- 関連スキル：`skills/stable/2-matrix-a/`、`skills/stable/3-matrix-b/`、
  `skills/stable/research/hardgate-evaluation/`

## Revision History

- 2026-05：初版。Architecture Conference 2026 の運用から抽出。
