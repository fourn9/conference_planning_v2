# CHANGELOG

## v2.2.0 — 2026-06-12

### Added — ディープリサーチの Claude Code 完結化（ADR-0007）
- **`.claude/workflows/speaker-deep-research.js`** — 探索 fan-out → 候補別ゲート検証のマルチエージェントワークフロー。探索角度・ゲート判別ルール・既出除外名簿・検証上限を `args` で注入する汎用実行系。
- **`decisions/0007-deep-research-in-claude-code.md`** — 外部 LLM 貼り付け実行から Claude Code 内ワークフロー実行への移行判断（実証：3テーマ・42エージェント・確定27名）。

### Changed
- `CLAUDE.md` リサーチ・ループ：Claude Code 内ワークフロー実行を第一選択に変更（外部 LLM はフォールバック）。`design-prompt` → 実行 → `review-output` → `iterate-from-failures` のループは実行系によらず共通。
- `decisions/README.md`：ADR-0007 を索引に追加。

## v2.1.0 — 2026-05-31

### Added — 企画フレームワーク本体を同梱（clone 即使える化）
- **`skills/stable/` に企画フェーズスキル6本**（`1-axis-definition`〜`4-6-theme-structuring`）を同梱。CLAUDE.md §B のフェーズフローが clone 直後に発火する。
- **`skills/stable/research/` にリサーチ・ループ4スキル**：`design-prompt`（ディープリサーチ用プロンプト設計）／`review-output`（成果の品質レビュー）／`iterate-from-failures`（失敗→改善）／`hardgate-evaluation`（G1-G7 ソース採否・旧 `validation/` から移動）。claude.ai 等への深掘りリサーチを「設計→レビュー→改善」の1ループで回せる。
- **`methodology/conference-planning-framework.md`** を実体化（スタブ → 3D リサーチフレーム本体）。
- **`failure-patterns.md`** に失敗パターン #1–#20 を同梱。
- **企画手法 ADR 5本**を `decisions/0002–0006` として追加（上流 v1 の 0001–0005 を v2 採番に +1 シフト。`0001` は自律学習レイヤーを維持）。
- **`methodology/templates/claude-ai-prompt-matrix-b.md`** — 再利用可能な Matrix B リサーチ用 claude.ai プロンプトテンプレ。

### Changed
- `docs/getting-started.md` §3：v1 からの手動コピー手順を撤去（同梱済みのため）。
- `README.md` / `llms.txt`：スキル同梱を反映。
- スキル名を使いやすく整理：`phase-N-…` を番号付き短縮名（例 `1-axis-definition`）に改名、リサーチ系を `research/` に集約。

### Note
- 自律学習レイヤー（`autonomous-learning-protocol.md`・`/`コマンド7種・3層メモリ）は v2.0.0 のまま据え置き。

## v2.0.0 — 2026-05-20

### Added — 自律的学習レイヤー（hermes-agent から着想）
- **`CLAUDE.md` §C 自律的学習プロトコル** — 書き込みトリガ条件・anti-noise ルール・patch-on-discovery 規律
- **`MEMORY.md` / `USER.md` / `LEARNINGS.md`** — 事実 / 人物像 / 時系列ログの 3 層メモリ
- **`.claude/commands/` 7 種** — `/record-learning`, `/draft-skill`, `/draft-adr`, `/promote-pattern`, `/patch-skill`, `/curate`, `/reflect-session`
- **プロベナンス frontmatter** — 全 md に `created_by`, `status`, `usage_count`, `last_used`, `pinned`, `patches_needed`
- **スキルライフサイクル** — `skills/{experimental,stable,archived}/` の三段構成
- **`.failure-inbox/`** — 失敗観測の append-only 受け皿。3 回観測で `/promote-pattern` 候補化
- **`.claude/hooks/`** — `SessionStart` / `Stop` フックのサンプル
- **`/curate` コマンド** — `created_by: agent` のみを対象に、昇格・アーカイブ・統合を dry-run で提示
- **`decisions/0001-self-update-architecture.md`** — 自律学習レイヤーの設計 ADR
- **`methodology/autonomous-learning-protocol.md`** — 詳細実行ガイド
- **`docs/self-update-flow.md` / `docs/migration-from-v1.md`** — 新規ガイド

### Changed — v1 からの引き継ぎ部分
- `CLAUDE.md` 既存セクションは保持（§A 役割定義 / §B フェーズフロー / §D 安全装置）
- `conference-planning.yml` スキーマ互換
- v1 の `skills/phase-*` はそのまま `skills/stable/` に配置可能（frontmatter 追加のみ）
- `failure-patterns.md` は v1 のコンテンツを引き継ぎつつ curator の昇格先になる

### Removed
- なし（v1 機能はすべて保持）

### Migration
`docs/migration-from-v1.md` を参照。最小限の手順:
1. v1 の `skills/` を v2 の `skills/stable/` 配下にコピー
2. 各スキルの frontmatter に `created_by: human`, `status: stable` を追加
3. v1 の `failure-patterns.md` をそのまま上書き
4. v1 の `decisions/` をそのまま上書き
5. 起動して `/curate --dry-run` で初期状態を確認

---

## v1.0.0 — 2026-05-19

[fourn9/conference_planning](https://github.com/fourn9/conference_planning) 初版。
フェーズ駆動の伴走フレームワーク。詳細は v1 リポジトリの CHANGELOG を参照。
