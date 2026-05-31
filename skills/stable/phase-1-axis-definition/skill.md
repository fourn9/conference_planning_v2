---
name: phase-1-axis-definition
description: ターゲット聴衆の規模・目的・職種軸を定義する
phase: phase-1
prerequisites: []
estimated_time: 30 minutes
created_by: human
created_at: 2026-05-19
last_used: 2026-05-20
usage_count: 0
status: stable
pinned: true
patches_needed: 0
---

# スキル：Phase 1 — 軸定義

## 目的

後のすべてのフェーズを構造化する 3 つのリサーチ軸（規模、目的、職種）を定義する。

## このスキルを呼び出すとき

- 新しいカンファレンス企画プロジェクトの最初
- ユーザーが事前構造なしで「カンファレンスを企画したい」と言ったとき
- `conference-planning.yml` に `phase_1_axis_definition: pending` と表示されているとき

## 手順（エージェント向け）

### Step 1.1：イベント基本情報の確認

`conference-planning.yml` を読み、以下を確認：
- イベント名
- 想定参加者数
- 開催日
- 過去イベントデータの有無（`is_first_time`）

いずれかの項目が空なら、ユーザーに記入を求める。

### Step 1.2：規模軸（5 デフォルトセグメント）

デフォルトを提示：

| ID | セグメント | 定義 |
|---|---|---|
| S1 | 非 IT 大手 | 確立企業、技術がプロダクトの中核ではない |
| S2 | IT 大手 / IT ベンダー | 確立した技術企業 |
| S3 | 成長期 / ユニコーン | Series C+、200〜1000 エンジニア |
| S4 | スタートアップ | Pre-Series B、10〜100 エンジニア |
| S5 | PMF 前 / 非常に早期 | 売上前、<10 エンジニア |

質問する：「これらがデフォルトです。あなたの領域に合わせて適応しますか？」

よくある適応：
- SaaS フォーカス → S1 を SaaS vs エンタープライズベンダーで分割
- 国内 vs グローバル → 市場の次元が必要かも
- 規制業界（銀行、医療） → 規制ティアが必要かも

### Step 1.3：目的軸（P1-P6 デフォルト）

デフォルトを提示：

- **P1**：新規プロダクト立ち上げ（0→1、MVP、PMF 探索）
- **P2**：既存プロダクトのスケール（1→N）
- **P3**：マルチプロダクト / マルチサービス統合（M&A、プラットフォーム化）
- **P4**：モダナイゼーション（レガシーモダナイゼーション、7R — AI とは関係なく）
- **P5**：AI 組み込み（既存アーキ + AI 機能の後付け）
- **P6**：AI ネイティブ（AI を中心にアーキ再構築、または AI と共に誕生）

重要：**P5 vs P6 の境界**は最も間違えやすい。P5 は既存アーキを保持；P6 は再構築。
ユーザーに確認する。

非エンジニアリング系カンファレンスの場合：
- 聴衆に関連する戦略的優先事項に置き換える
- 例：プロダクトマネジメントカンファレンスなら：discovery / launch / growth / pivot / sunset / new category

### Step 1.4：職種軸（7 デフォルト）

デフォルトを提示：

- **J1**：BE / フルスタックエンジニア
- **J2**：テックリード
- **J3**：EM（エンジニアリングマネージャー）
- **J4**：SRE
- **J5**：インフラ
- **J6**：セキュリティ
- **J7**：データ

よくある適応：
- フロントエンドフォーカス → フロントエンドスペシャリストを J0 として追加
- DevRel フォーカス → DevRel を J0 として追加
- データ軸を分割するならデータサイエンティスト追加
- 非エンジニアリング系の場合：業界の役割タイプに置き換え

### Step 1.5：選択を文書化

ユーザーに作業ディレクトリにファイルを作成してもらう：

```
[あなたの作業ディレクトリ]/axes.md
```

`templates/matrix-a.md` の関連部分（「Axes」セクション）を使用。

### Step 1.6：状態を更新

`conference-planning.yml` を更新：

```yaml
phases:
  phase_1_axis_definition:
    status: completed
    notes: "デフォルト軸 + [適応内容]"
```

`decisions-log.md`（なければ作成）に追記：

```markdown
## YYYY-MM-DD
- Phase 1 完了。規模軸を[領域]用に適応。目的軸[デフォルト維持 / 適応：...]。職種軸[デフォルト維持 / 適応：...]。
```

### Step 1.7：次ステップを提案

伝える：「Phase 1 完了。次は Phase 2（Matrix A）です。約半日、主に claude.ai Deep Research に
委譲します。進めますか？」

## 使うテンプレート

- `templates/matrix-a.md`（軸セクション）

## 検証

- [ ] 3 軸すべてに明示的定義があり、ラベルだけではない
- [ ] P5 vs P6 の区別がユーザーに明確
- [ ] `is_first_time: true` なら、後のフェーズで代替入力を使うことをユーザーが理解

## 関連

- ADR：`decisions/0002-3d-research-framework.md`
- 方法論：`methodology/conference-planning-framework.md`（Phase 1 セクション）
- 用語集：`docs/glossary.md`
- 次スキル：`skills/phase-2-matrix-a/`

## 注意すべき失敗パターン

- 領域に合わないデフォルト軸を強制（ユーザーが沈黙で同意し、Phase 2 で詰まる）
- P5 vs P6 の説明をスキップ（後の Matrix A 誤分類の原因）
- `decisions-log.md` に適応を文書化しない（「なぜ」が失われる）
