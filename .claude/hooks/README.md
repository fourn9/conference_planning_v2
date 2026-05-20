# .claude/hooks/

> v2 のフックは `.claude/settings.example.json` の `hooks` セクションで定義されている。
> このディレクトリは、より複雑なフックスクリプトを置く場所として用意してある（任意）。

## 有効化手順

```bash
cp .claude/settings.example.json .claude/settings.json
```

`.claude/settings.json` は `.gitignore` で除外されているのでユーザー固有設定として残る。

## デフォルトの 2 つのフック

### SessionStart

Claude Code 起動時に echo でリマインダーを出す。Claude は出力を見て:

1. `MEMORY.md` / `USER.md` / `LEARNINGS.md tail -20` / `conference-planning.yml` を読む
2. 最終 `/curate` が 14 日以上前なら一度だけ curate を提案

### Stop

Claude のターン終了時に echo で `/reflect-session` の起動を促す。

## 注意

- フックは echo するだけで、Claude に直接コマンドを実行させるわけではない
  （フック内でスラッシュコマンドを呼ぶことは Claude Code の仕様上できない）
- Claude が echo メッセージを読んで自発的に動くことに依存している
- 確実に動かしたいなら、CLAUDE.md §C.1 / §C.6 の指示が一義的な仕様

## カスタムフックを追加したい場合

このディレクトリにシェルスクリプトや Python スクリプトを置き、
`.claude/settings.json` の `hooks` セクションから呼ぶ。
詳細は [Claude Code Hooks 公式ドキュメント](https://docs.claude.com/en/docs/claude-code/hooks) を参照。
