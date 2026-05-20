---
description: セッション終了時の自己振り返り。保存すべき学びを発掘して各 record-* コマンドを連鎖呼出する
---

# /reflect-session

セッションを閉じる前に、保存すべきことが残っていないかを自問する。

## いつ呼ばれるか

- `Stop` フックから自動起動（`.claude/settings.example.json` 参照）
- ユーザーから明示的に呼ばれた

## 実行手順

このセッションの会話履歴を振り返り、以下を順に自問する:

### 1. 非自明な発見はあったか？

- あれば → `/record-learning` を提案・実行
- なければ次へ

### 2. 反復可能な手順を完遂したか？

- 5+ ツール呼び出しを伴うタスクを完遂し、かつ今後も再発しそうなら
  → `/draft-skill <name>` を提案
- なければ次へ

### 3. 重い判断を行ったか？

- 同じ判断を 2 回目、または不可逆な選択をした
  → `/draft-adr <topic>` を提案
- なければ次へ

### 4. 失敗・ハマりパターンを観測したか？

- 失敗を観測 → `.failure-inbox/YYYY-MM-DD-<slug>.md` に追記
- 既に同じパターンが 3 件溜まっているなら `/promote-pattern` を提案

### 5. 既存スキルの不備に気づいたか？

- 気づいた箇所を `LEARNINGS.md` に記録（patch は `/patch-skill` で別途）

### 6. ユーザーの好み・規約・環境を学んだか？

- 学んだ → `USER.md` または `MEMORY.md` への追記を提案
  （`declarative` で書く。命令形は書かない）

### 7. curator の周期チェック

- `conference-planning.yml > curator.last_run` が 14 日以上前なら
  「次回起動時に `/curate` を提案します」とだけ報告

## 出力フォーマット

```markdown
## /reflect-session — YYYY-MM-DD

### 保存すべきもの

- [ ] 学び: 「X について Y を発見」→ `/record-learning` を実行しますか？
- [ ] スキル化: 「Z の手順」→ `/draft-skill z-procedure` を実行しますか？
- [ ] ADR 候補: 「W の選択」→ `/draft-adr w-decision` を実行しますか？

### 保存しなくて良いもの

- 単なる作業ログ
- まだ確証のない仮説
```

各項目について、ユーザーの承認を得てから対応するコマンドを実行する。
**自動で保存はしない**。常に提案 → 確認の流れを守る。

## anti-noise の自己チェック

提案前に以下を確認:

- PR# / Issue# / SHA を含めようとしていないか
- 取引的な記録（「X を修正した」「Y を出した」）になっていないか
- 推測を事実として書こうとしていないか
- ユーザーへのネガティブな評価になっていないか

該当すれば提案しない。

## 関連

- CLAUDE.md §C.6（セッション終了時の自問）
- `/record-learning`, `/draft-skill`, `/draft-adr`, `/promote-pattern`
