# Getting Started

## 1. リポジトリを取得

```bash
git clone <this-repo> my-conference
cd my-conference
```

## 2. フックを有効化（推奨）

```bash
cp .claude/settings.example.json .claude/settings.json
```

`.claude/settings.json` は `.gitignore` で除外されているのでユーザー固有のまま残る。

## 3. フレームワークのスキルは同梱済み

企画フェーズのスキル（`skills/stable/phase-*`・`skills/stable/validation/hardgate-evaluation`・
`skills/stable/analysis/*`）と方法論（`methodology/`）・ADR（`decisions/`）・失敗パターン
（`failure-patterns.md`）は**このリポジトリに同梱済み**です。v1 から手動コピーする必要はありません。
clone した直後から `CLAUDE.md §B` のフェーズフローがそのまま動きます。

## 4. ユーザープロフィールを書く

`USER.md` を編集して、自分のロール・好み・環境を書く。
declarative で書く（「X を好む」「Y の環境」）。命令形は避ける。

## 5. Claude Code を起動

```bash
claude
```

セッション開始直後に Claude が:

1. `CLAUDE.md` を読む
2. `MEMORY.md` / `USER.md` / `LEARNINGS.md tail -20` を読む
3. `conference-planning.yml` でフェーズ確認
4. 該当する `skills/stable/` を提案

## 6. 最初のセッションで試すこと

実イベントの企画を進めながら、以下が自然に起きるか観察する:

- 非自明な発見をしたとき、Claude が `/record-learning` を提案する
- 反復可能な手順を完遂したとき、Claude が `/draft-skill` を提案する
- 失敗パターンを観測したとき、`.failure-inbox/` への追記を提案する

提案が出ないときは、明示的に「今の発見を `/record-learning` で保存して」と指示する。

## 7. 定期的に `/curate`

2 週間に 1 回、または `LEARNINGS.md` が長くなったタイミングで:

```
/curate
```

dry-run で差分提示される。問題なければ:

```
/curate --apply
```

## 8. 困ったとき

- `CLAUDE.md` §C を読み直す
- `methodology/autonomous-learning-protocol.md` のトラブルシューティングを見る
- `decisions/0001-self-update-architecture.md` で設計意図を確認
