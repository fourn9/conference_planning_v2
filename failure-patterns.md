---
name: failure-patterns
description: 既知の失敗パターン集。`.failure-inbox/` から `/promote-pattern` で昇格
created_by: human
created_at: 2026-05-20
last_used: 2026-05-20
usage_count: 0
status: stable
pinned: false
---

# failure-patterns.md

> カンファレンス企画で繰り返し観測される失敗パターン集。
> v1 から引き継ぎつつ、v2 では `.failure-inbox/` で 3 回観測されたものが
> `/promote-pattern` 経由でここに昇格してくる。
>
> 各パターンは `#N` で参照される（CLAUDE.md / skills / その他から）。
>
> ## エントリ形式
>
> ```markdown
> ## #N: <パターン名>
>
> **症状**: どう現れるか
>
> **原因仮説**: なぜ起きるか
>
> **対処**: 検出時に何をするか
>
> **関連**: skills/, decisions/ 等へのリンク
>
> **First observed**: YYYY-MM-DD
> **Last observed**: YYYY-MM-DD
> **Observed count**: N（昇格時点）
> ```

---

<!--
v1 の failure-patterns.md からの引き継ぎはここに列挙する。
初回コミット時点では空。v1 からコピーする手順は docs/migration-from-v1.md を参照。
-->

## #1: （v1 のパターンをここに移植）

> v1 リポジトリの `failure-patterns.md` を参照してコピーする。
> migration スクリプトは無いので手作業。
