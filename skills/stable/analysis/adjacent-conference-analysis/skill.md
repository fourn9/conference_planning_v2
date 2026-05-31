---
name: adjacent-conference-analysis
description: 隣接カンファレンスの登壇傾向を分析して候補・テーマの裏取りに使う
phase: cross-phase
prerequisites: []
estimated_time: 2-4 hours
created_by: human
created_at: 2026-05-19
last_used: 2026-05-20
usage_count: 0
status: stable
pinned: true
patches_needed: 0
---

# スキル：隣接カンファレンス分析

## 目的

2〜4 の隣接または領域整合カンファレンスの公開セッションリストを分析し、
「何がホットか」の外部分布を構築する。Phase 4.6 分布チェックの過去データなし代替。

## このスキルを呼び出すとき

- 過去イベントデータなしで Phase 4.6 に接近
- テーマ構造の外部検証が必要
- 領域の「現在の議論ランドスケープ」を確認したい

## 手順（エージェント向け）

### Step A.1：2〜4 の隣接カンファレンスを選定

基準：

- 同一または隣接領域（例：ソフトウェアアーキテクチャカンファレンスの場合：
  QCon、GOTO、O'Reilly Software Architecture）
- 直近 12〜18 ヶ月以内に開催
- セッションリストが公開されている

領域ごとの出発リストを提案：

| 領域 | 推奨カンファレンス |
|---|---|
| ソフトウェアアーキテクチャ | QCon (SF/London/NYC)、GOTO Copenhagen/Aarhus、O'Reilly SAC |
| SRE | SREcon (Americas/EMEA/Asia/Pacific)、ローカル SRE ミートアップ |
| プラットフォームエンジニアリング | PlatformCon、KubeCon、Platform Engineering Kaigi (JP) |
| データエンジニアリング | Data Engineering Summit、Snowflake Summit、Databricks AI Summit |
| プロダクトマネジメント | ProductCon、Mind the Product、pmconf (JP) |

### Step A.2：セッションリストを収集

各カンファレンスについて：

- カンファレンスウェブサイトを訪問
- スケジュール／セッションリストをコピー
- 記録：タイトル + アブストラクト + トラック（利用可能なら）

カンファレンスあたり 30〜100+ セッションを想定。

### Step A.3：ジャンルでタグ付け

`matrix-b-genre-aggregation` と同じジャンル（または領域固有ジャンル）を使い、
各セッションにタグ付け。

セッションは複数ジャンルにタグ付け可能。

### Step A.4：カンファレンス別と全体で集計

カンファレンス別：

```
| ジャンル | 数 | % |
|---|---|---|
| AI 関連 | X | Y% |
| ... | ... | ... |
```

全体（2〜4 カンファレンスを統合）：

```
| ジャンル | Conf-1 | Conf-2 | Conf-3 | 全体 |
|---|---|---|---|---|
| AI 関連 | Y1% | Y2% | Y3% | Yavg% |
```

### Step A.5：Matrix B 集計と比較

並列で：

| ジャンル | Matrix B 集計 | 隣接カンファ | デルタ |
|---|---|---|---|
| AI | M% | A% | (M-A)% |
| ... | ... | ... | ... |

大きなデルタ（>15 パーセンテージポイント）はシグナル：

- M > A：あなたの領域がこのジャンルで先行／遅行している可能性
- M < A：既に主流になっているものを見逃している可能性

### Step A.6：Phase 4.6 の抜け論点チェックへ供給

Phase 4.6 Step 4.6.7 は、抜け論点分析の複数入力の 1 つとしてこれを使う。

## 使うテンプレート

- （なし — アウトプットはインライン分析）

## 検証

- [ ] 2〜4 カンファレンス分析（三角測量のため 1 つでは不十分）
- [ ] `matrix-b-genre-aggregation` と同じジャンル分類（比較可能のため）
- [ ] 直近 12〜18 ヶ月開催のカンファレンス
- [ ] セッション数がカンファレンスの実際の規模と一致（セッション漏れなし）

## 関連

- 使用者：`skills/phase-4-6-session-theme-structuring/`（Step 4.6.7）
- 仲間：`skills/analysis/matrix-b-genre-aggregation/`
- 代替する対象：過去セッション分布

## 注意すべき失敗パターン

- 1 つだけのカンファレンス選定（三角測量なし；1 カンファレンスのバイアスがデータを汚染）
- 既に想定構造に合うカンファレンスだけ選定（確認バイアス）
- 非常に異なる規模／フォーカスのカンファレンスを混在（リンゴ vs オレンジ）
