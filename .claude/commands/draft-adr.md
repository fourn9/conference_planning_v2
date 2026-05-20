---
description: 重い判断を ADR として decisions/ に起草する
argument-hint: <topic-slug>
---

# /draft-adr <topic-slug>

`decisions/NNNN-<topic-slug>.md` に ADR の骨格を作る。

## いつ呼ぶか

- 同じ判断を 2 回繰り返した（型の発見）
- 不可逆な選択を行った（後で変更が高コスト）
- 複数の選択肢があり、選ばなかった選択肢の理由を残す価値がある
- 新しい技術選定・運用フロー変更・スポンサープラン設計

## いつ呼ばないか

- 軽い気付き → `/record-learning` で十分
- すでにスキルとして固まっている → `/draft-skill`
- 一時的な判断（次回見直す予定）→ `LEARNINGS.md`

## 引数

- `<topic-slug>` — kebab-case-slug。例: `external-validation-priority`

## 実行手順

1. `decisions/` 内の既存 ADR の最大番号 NNNN を確認（`ls decisions/*.md` で確認）
2. `decisions/NNNN+1-<topic-slug>.md` を以下のテンプレートで作成（`templates/adr-template.md` 参照）:

```markdown
---
name: NNNN-<topic-slug>
description: <一行、100 字以内>
created_by: agent
created_at: YYYY-MM-DD
last_used: YYYY-MM-DD
usage_count: 0
status: experimental
pinned: false
adr_status: Proposed   # Proposed | Accepted | Superseded | Deprecated
---

# ADR-NNNN: <タイトル>

**Status**: Proposed
**Date**: YYYY-MM-DD
**Decider**: <ユーザー名 / agent / 双方>

## Context

<なぜこの判断が必要になったか。背景・制約・関係者>

## Decision

<何を決めたか。1-3 文で明確に>

## Alternatives Considered

<検討した他の選択肢と、なぜ採用しなかったか>

- **A**: ...
- **B**: ...
- **C（採用）**: ...

## Consequences

<採用したことで得られるもの / 失うもの / 今後発生する作業>

## References

- `LEARNINGS.md` YYYY-MM-DD エントリ
- `failure-patterns.md` #N
- 関連 ADR: NNNN-*
```

3. `decisions/README.md` のインデックスに 1 行追加
4. ユーザーに「ADR-NNNN を起草しました（status: Proposed）。レビューをお願いします」と伝える
5. **Accepted への昇格はユーザー判断**。agent は Proposed までしか書かない

## 関連

- `decisions/template.md` — ADR フォーマット
- `decisions/README.md` — インデックス
- CLAUDE.md §C.2（書き込みトリガ）
