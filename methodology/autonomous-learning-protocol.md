---
name: autonomous-learning-protocol
description: CLAUDE.md §C の詳細実行ガイド。書き込みトリガ・anti-noise・declarative の判断基準を具体例付きで示す
created_by: human
created_at: 2026-05-20
last_used: 2026-05-20
usage_count: 0
status: stable
pinned: true
---

# 自律的学習プロトコル — 実行ガイド

> このドキュメントは `CLAUDE.md` §C の詳細版。具体例とトラブルシューティングを含む。
> CLAUDE.md は宣言、こちらは「迷ったとき何を見るか」のリファレンス。

## 1. 「保存に値する」を判断する 3 つの問い

会話の中で何か気づいたとき、以下を順に問う:

1. **同じ気付きを次回も役立てたいか？**
   - Yes → 保存候補
   - No → 保存しない（一時的な作業状態）

2. **これは観察か、それとも命令か？**
   - 観察（「X を好む」）→ 書ける
   - 命令（「常に X せよ」）→ 書き直す or 書かない

3. **これは事実か、推測か？**
   - 事実 → 書ける
   - 推測 → `[推測]` プレフィクスを付けるか、書かない

3 つすべて Yes（または事実）でなければ保存しない。

## 2. 書き込み先の選び方

| 観察したもの | 書き込み先 | 呼ぶコマンド |
|---|---|---|
| 「ユーザーは X を好む」（人物像） | `USER.md` | 直接 Edit |
| 「このプロジェクトでは Y が規約」（事実・型） | `MEMORY.md` | 直接 Edit |
| 「Z という気付き」（時系列の学び） | `LEARNINGS.md` 末尾 | `/record-learning` |
| 「W という反復可能な手順」 | `skills/experimental/` | `/draft-skill <name>` |
| 「V という重い判断」 | `decisions/` | `/draft-adr <topic>` |
| 「U という失敗パターン」（初回〜2 回目） | `.failure-inbox/` | 直接 Write |
| 「U という失敗パターン」（3 回目以降） | `failure-patterns.md` | `/promote-pattern` |
| 「既存スキルの不備」 | 該当スキル | `/patch-skill <path>` |

## 3. anti-noise ルール — 書いてはいけないものリスト

絶対に書かない:

- **取引的記録**: 「PR #123 を出した」「コミット abc1234 を作った」「Issue #45 をクローズした」
- **一時状態**: 「今 Phase 3 を実装中」「TODO: あとで X する」
- **推測の事実化**: 「Y が原因と思われる」を「Y が原因」と書かない
- **ユーザー評価**: 「ユーザーはこの判断を間違えた」のようなネガティブ評価
- **機密**: パスワード、API キー、内部 URL、個人名（公開許諾なし）

例外:
- 一時状態でも `conference-planning.yml` のフェーズ更新は OK（そこが状態管理の場所）
- ユーザーが自分について自己評価したものを USER.md に書くのは OK

## 4. declarative > imperative の具体例

| ✗ imperative（書かない） | ✓ declarative（書く） |
|---|---|
| 「常に簡潔に応答せよ」 | 「ユーザーは簡潔な応答を好む」 |
| 「Phase 4.5 を必ず外部に拡張せよ」 | 「Phase 4.5 を外部に拡張するパターンが多い」 |
| 「Matrix B には CTO を含めるな」 | 「CTO 除外は ADR-0003（v1）で決定済み」 |
| 「`failure-patterns.md` を毎回読め」 | 「`failure-patterns.md` には既知の失敗パターンが集まっている」 |

ルールを書くな、観察を書け。ルールはあなた（agent）が観察から推論する。

## 5. Patch on discovery — 具体例

例 1（OK）:
> Phase 3 で `skills/stable/3-matrix-b/skill.md` を実行中、
> ステップ 4 が古い API を参照していることに気づく
> → `/patch-skill skills/stable/3-matrix-b/skill.md` で修正

例 2（NG、frontmatter を確認）:
> 同じ状況だが、対象スキルが `pinned: true`
> → 修正しない。代わりに `LEARNINGS.md` に
>   「`skills/stable/3-matrix-b/skill.md` のステップ 4 が古い API を参照している」と記録

例 3（大幅改修）:
> 古いどころか手順全体が時代遅れ
> → `/patch-skill` ではなく `/draft-skill 3-matrix-b-v2` で代替スキルを起草
> → 元スキルの frontmatter を `status: deprecated` に変更（人間承認後）

## 6. `/curate` の閾値判断

デフォルト値:

- 昇格: `usage_count >= 3 && patches_needed == 0`
- アーカイブ: `last_used > 90 日 && usage_count <= 1`
- failure-pattern 昇格: `.failure-inbox/` で `observed_count >= 3`
- 周期提案: 最終 curate から 14 日以上経過

これらは現時点のデフォルト。3 イベント分動かして経験データが溜まったら見直す
（ADR-0001 Follow-up に記載）。

## 7. トラブルシューティング

### Q: agent が何も保存しない

- CLAUDE.md §C を読み直したか？
- 「これは保存に値する」の 3 つの問いを通したか？
- 通過しても agent が動かない場合、明示的に「今の発見を `/record-learning` で
  保存して」と指示する

### Q: agent が保存しすぎる

- anti-noise リスト（§3）を読み直す
- `/curate` を走らせて重複統合候補を確認
- CLAUDE.md §C.2 に anti-noise 例を追記して挙動を抑制

### Q: `/curate` の提案が信頼できない

- 昇格候補のスキルを Read して内容を確認
- `created_by: agent` 作成のスキルは品質ゲートを通っていない（DESIGN.md §8 既知制約）
- 信頼できないものは `pinned: true` に変更して以後 curator が触らないようにする

### Q: v1 のスキルが v2 でうまく動かない

- frontmatter が無いせい。`docs/migration-from-v1.md` の手順で追加する
- `pinned: true` を推奨（人間が信頼している前提）

## 8. 関連

- `CLAUDE.md` §C（自律学習プロトコルの宣言）
- `DESIGN.md`（四層構造の設計根拠）
- `decisions/0001-self-update-architecture.md`（採用ADR）
- `.claude/commands/`（各書き込み口の実装）
