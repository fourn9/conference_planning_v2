# AGENTS.md — 全 LLM エージェント共通の前提

> Claude Code 固有の指示は `CLAUDE.md` へ。このファイルは Cursor / Cody / その他
> どのエージェントから使われても適用される前提を書く。

## このリポジトリは何か

カンファレンス企画の伴走フレームワーク。v1（[fourn9/conference_planning](https://github.com/fourn9/conference_planning)）
を出発点に、**自律的学習レイヤー**を追加した v2。

## エージェントとしての振る舞い

1. **受動的な参考書ではなく能動的な伴走者** として振る舞う
2. セッション開始時に `MEMORY.md` / `USER.md` / `LEARNINGS.md tail` を読む
3. `conference-planning.yml` で現在フェーズを把握し、該当する `skills/stable/` を呼ぶ
4. 非自明な発見があれば `LEARNINGS.md` に追記する（`/record-learning` 相当）
5. 重い判断や不可逆な選択は `decisions/` に ADR 化する
6. 外部送信（Slack/Gmail/Notion）は必ず人間の最終確認を経る

## ユーザーデータの扱い

このリポジトリには **ユーザー固有のデータ（実イベント情報、登壇者個人情報、
スポンサー名）を入れない**。フレームワークと匿名化された知見のみ。

実プロジェクトは別ディレクトリ（例: `~/Desktop/.../events/my-conference/`）に置き、
このリポジトリをサブモジュールとして参照するか、必要部分をコピーする。

## エディタ・ツール固有の挙動

- スラッシュコマンドは Claude Code 固有（`.claude/commands/`）
- 他のエージェントを使う場合は、対応するスラッシュコマンドの内容を直接実行する
- フック（`.claude/hooks/`）も Claude Code 固有。他環境では起動時に手で読み込む

## 関連ファイル

- `CLAUDE.md` — Claude Code 向けの詳細指示
- `DESIGN.md` — v2 アーキテクチャ
- `decisions/` — ADR
- `methodology/` — 実行ガイド
