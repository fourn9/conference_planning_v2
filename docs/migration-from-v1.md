# Migration from v1

> v1（[fourn9/conference_planning](https://github.com/fourn9/conference_planning)）
> の資産を v2 に移植する手順。

> **v2.1.0 以降の注記**：v1 のストック資産（`skills/stable/` のフェーズスキル6本＋リサーチ/分析スキル6本・`methodology/`・
> `decisions/0002-0006`・`failure-patterns.md`・Matrix B テンプレ）は **v2 に同梱済み**です。
> 本ガイドは「v1 に独自のカスタムスキルがあり追加で持ち込みたい」場合、または v2 がどう組み上がって
> いるかを理解したい場合にのみ参照してください。採番方針（§5・トラブルシュート）は実際の同梱結果
> （self-update=0001／企画手法=0002-0006）と一致しています。

## 移植する / しない

| v1 のもの | v2 で | 移植方法 |
|---|---|---|
| `skills/phase-*/` | `skills/stable/phase-*/` | コピー + frontmatter 追加 |
| `skills/analysis/`, `skills/validation/` | `skills/stable/analysis/` 等 | コピー + frontmatter 追加 |
| `failure-patterns.md` | 同名ファイル | 内容をマージ |
| `decisions/0001-0005` | 同ディレクトリ | コピー + frontmatter 追加 |
| `decisions/template.md` | 同ファイル | v2 のものを優先（frontmatter キー追加済み） |
| `methodology/conference-planning-framework.md` | 同ファイル | コピー + frontmatter 追加 |
| `templates/matrix-a.md` etc. | 同ディレクトリ | コピー（frontmatter 不要、テンプレ素材なので） |
| `docs/*.md` | 同ディレクトリ | overview/getting-started は v2 で書き直し済み |
| `conference-planning.yml` | 同ファイル | v2 のものを優先（`curator:` セクション追加済み） |
| `CLAUDE.md`, `AGENTS.md` | v2 で完全書き換え | 移植しない |
| `DESIGN.md`, `README.md` | v2 で完全書き換え | 移植しない |

## 詳細手順

### 1. v1 のローカルクローンを用意

```bash
git clone https://github.com/fourn9/conference_planning ~/conference_planning_v1
```

### 2. スキルをコピー

```bash
V1=~/conference_planning_v1
V2=.

cp -r $V1/skills/phase-1-axis-definition $V2/skills/stable/
cp -r $V1/skills/phase-2-matrix-a $V2/skills/stable/
cp -r $V1/skills/phase-3-matrix-b $V2/skills/stable/
cp -r $V1/skills/phase-4-core-themes $V2/skills/stable/
cp -r $V1/skills/phase-4-5-internal-validation $V2/skills/stable/
cp -r $V1/skills/phase-4-6-session-theme-structuring $V2/skills/stable/
cp -r $V1/skills/analysis $V2/skills/stable/
cp -r $V1/skills/validation $V2/skills/stable/
```

### 3. 各スキルに frontmatter を追加

各 `skill.md` の冒頭に以下を追加（既存メタデータと統合）:

```yaml
---
name: <既存の name か、フォルダ名 slug>
description: <既存の description>
phase: <既存の phase>
prerequisites: <既存の prerequisites>
estimated_time: <既存の estimated_time>
created_by: human          # ★追加
created_at: 2026-05-19     # ★追加（v1 リリース日）
last_used: 2026-05-20      # ★追加（今日）
usage_count: 0             # ★追加
status: stable             # ★追加
pinned: true               # ★追加（v1 由来は人間信頼前提）
patches_needed: 0          # ★追加
---
```

`pinned: true` を推奨する理由: v1 由来のスキルは人間が時間をかけて作ったもの。
curator に勝手に動かされたくない。明示的に `pinned: false` にしない限り
`/curate` の対象外になる。

### 4. failure-patterns.md をマージ

v2 の `failure-patterns.md`（frontmatter 付き、本文は空）に、
v1 の `failure-patterns.md` の本文（## #1 〜 ## #20）をコピーする。

```bash
# 本文のみ抜き出してマージ（手作業推奨）
# v2 の frontmatter は保持、## #1 以降を v1 から差し替える
```

### 5. ADR をコピー

```bash
cp $V1/decisions/0001-research-source-evaluation.md $V2/decisions/
cp $V1/decisions/0002-3d-research-framework.md $V2/decisions/
cp $V1/decisions/0003-matrix-b-research-hardgate.md $V2/decisions/
cp $V1/decisions/0004-session-theme-structuring.md $V2/decisions/
cp $V1/decisions/0005-research-knowledge-pipeline.md $V2/decisions/
```

各 ADR の冒頭に frontmatter を追加（v2 の `decisions/template.md` を参考に）:

```yaml
---
name: NNNN-<slug>
description: <一行説明>
created_by: human
created_at: <v1 での作成日>
last_used: 2026-05-20
usage_count: 0
status: stable
pinned: true
adr_status: Accepted       # v1 で既に Accepted のものは Accepted のまま
---
```

`decisions/README.md` のインデックス表に追記:

```markdown
| 0001 | [自律学習レイヤーのアーキテクチャ](0001-self-update-architecture.md) | Accepted | 2026-05-20 |
| 0002 | [リサーチソース評価](0002-research-source-evaluation.md) | Accepted | <日付> |
...
```

**ADR 番号の衝突**: v1 と v2 で 0001 が衝突する。
v2 の自律学習 ADR を 0001、v1 由来を 0002 以降にリナンバリング推奨。

### 6. methodology をコピー

```bash
cp $V1/methodology/conference-planning-framework.md $V2/methodology/conference-planning-framework.md
```

v2 で書いたプレースホルダ frontmatter を保ち、本文を v1 から差し替える。

### 7. templates をコピー

```bash
cp $V1/templates/*.md $V2/templates/
```

frontmatter は不要（素材ファイル）。

### 8. conference-planning.yml の event セクションを書く

v2 の `conference-planning.yml` の `event:` ブロックに実イベントの情報を記入。
`curator:` セクションは触らない。

### 9. 動作確認

```bash
claude
```

セッション開始後、Claude に以下を確認させる:

- `MEMORY.md` / `USER.md` / `LEARNINGS.md` を読めるか
- `skills/stable/1-axis-definition/skill.md` を呼べるか
- `/curate` を dry-run で実行できるか

すべて OK なら移植完了。

## トラブルシューティング

### Q: 移植後に `/curate` が v1 由来のスキルを動かそうとする

`pinned: true` を付け忘れている可能性。各 stable スキルの frontmatter を確認。

### Q: ADR 番号が衝突した

ファイル名と frontmatter の `name:` をリナンバリング。
v2 の 0001 を別番号に移すか、v1 由来を 0002 以降にする方針推奨（後者）。

### Q: v1 の `CLAUDE.md` / `AGENTS.md` のカスタマイズを移植したい

v2 の `CLAUDE.md` §A / §B（v1 から継承）に該当箇所を追記する。
§C（自律学習）は触らない。
