// 登壇候補ディープリサーチ：探索 fan-out → 候補別ゲート検証（ADR-0007）
//
// 使い方（Workflow ツールから起動）:
//   Workflow({ name: "speaker-deep-research", args: {
//     today: "YYYY-MM-DD",                       // 必須（スクリプト内で Date は使えない）
//     angles: [{ theme: "2-5", key: "2-5-a", prompt: "..." }, ...],  // 必須：探索角度（テーマ×角度）
//     gateFRules: { "2-5": "ゲートF: ...のみ採用。...は不採用。" },   // 必須：テーマ別の粒度判別ルール
//     excluded: ["既出・過去採用済みの氏名", ...], // 必須：除外名簿（既出は上流で除外する。ADR-0007）
//     conflictCheck: "site:<求人媒体> \"<企業名>\" で主催者利益相反を確認し…", // 任意：利益相反チェック手順
//     cap: 10                                    // 任意：テーマごとの検証上限（既定10）
//   }})
//
// 角度 prompt は skills/stable/research/design-prompt で設計したリサーチ仕様
// （対象小テーマ・◯✗例・採否ハードゲート ADR-0004）を圧縮して渡す。
// 結果は { themes: {テーマ: 検証済み候補[]}, searched_sources, dropped } で返る。
// 呼び出し側（メインセッション）が確定/保留リストに整形し、Vault（ADR-0006）へ
// ローカル同期パス経由で直接書き込む（実行メモ・既出フラグ付き）。

export const meta = {
  name: 'speaker-deep-research',
  description: '登壇候補ディープリサーチ：テーマ×角度の並列探索 → 候補別ゲート検証（当事者性/粒度/在籍/利益相反）',
  whenToUse: 'design-prompt で設計したリサーチ仕様（採否ハードゲート付き）を Claude Code で実行するとき',
  phases: [
    { title: 'Search', detail: 'テーマ×探索角度ごとに並列Web探索（記事起点/取り組み起点）' },
    { title: 'Verify', detail: '候補ごとにURL実在・当事者性・粒度判別・在籍・利益相反を検証' },
  ],
}

if (!args || !args.today || !args.angles || !args.gateFRules || !args.excluded) {
  throw new Error('args に today / angles / gateFRules / excluded が必要（ファイル冒頭の使い方コメント参照）')
}
const TODAY = args.today
const EXCLUDED = args.excluded
const CAP = args.cap || 10
const ANGLES = args.angles
const GATE_F_RULES = args.gateFRules
const CONFLICT_CHECK = args.conflictCheck
const THEMES = [...new Set(ANGLES.map(a => a.theme))]

const CANDIDATES_SCHEMA = {
  type: 'object',
  properties: {
    candidates: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: '氏名' },
          company: { type: 'string' },
          role: { type: 'string' },
          url: { type: 'string', description: '本人発信記事/スライドのURL（実アクセス確認済みのみ）' },
          title: { type: 'string', description: '記事/登壇タイトル' },
          date: { type: 'string', description: '公開日 YYYY-MM' },
          evidence_quote: { type: 'string', description: '小テーマ該当部分の本文引用（1-3行）' },
          theme_fit: { type: 'string', description: 'どの対象小テーマ要素に対応するか' },
          source_type: { type: 'string', description: '企業技術ブログ/個人ブログ/登壇スライド/動画/書籍/Podcast' },
        },
        required: ['name','company','url','title','date','evidence_quote','theme_fit'],
      },
    },
    searched_sources: { type: 'array', items: { type: 'string' }, description: '実行した検索クエリ・走査したソース一覧' },
  },
  required: ['candidates','searched_sources'],
}

const VERIFY_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    company_current: { type: 'string', description: '現時点の現所属（確認できた範囲）' },
    role_current: { type: 'string' },
    employment_evidence: { type: 'string', description: '在籍確認の根拠と確認日／確認不能ならその旨' },
    url_ok: { type: 'boolean', description: 'URLが実在し本文を確認できたか' },
    author_match: { type: 'boolean', description: '記事の発言者が候補者本人と一致するか' },
    g8_type: { type: 'string', description: 'a=当事者発信 / b=第一人者 / NG' },
    gate_f: { type: 'string', description: '採用/不採用 とその判別カテゴリ' },
    gate_f_reason: { type: 'string' },
    article_date: { type: 'string' },
    scale_insight: { type: 'string', description: '事業規模インサイト（記事内の具体値。なければ「記載なし」）' },
    conflict_check: { type: 'string', description: '利益相反チェック結果（あり/なし/判定不能/未設定）' },
    conflict_note: { type: 'string', description: 'チェックの根拠（URLや判定理由）' },
    priority: { type: 'string', description: 'A/B/C' },
    ai_context: { type: 'string', description: 'AI文脈/非AI文脈 等' },
    verdict: { type: 'string', description: '確定/保留/不採用' },
    verdict_reason: { type: 'string' },
    recommend_reason: { type: 'string', description: '登壇推薦理由（40-60字）。不採用なら空でよい' },
    summary: { type: 'string', description: '記事内容の要約（40-60字・本人が何を設計判断したか）' },
  },
  required: ['name','company_current','url_ok','author_match','g8_type','gate_f','gate_f_reason','article_date','conflict_check','priority','ai_context','verdict','verdict_reason'],
}

const COMMON_FINDER_RULES = `
共通ルール（厳守）:
- 対象地域・言語のエンジニア当事者のみ。外資系現地法人は現地拠点エンジニアの実務発信のみ可。
- 記事・登壇は直近2年以内のみ。直近1年以内を優先。
- 必ずWebFetchで記事本文を開き、著者名・該当箇所の引用を確認してから候補に含める。スニペットだけで採用しない。
- 実在しない人物・記事・URLの創作は重大違反。確認できないものは含めない。
- 概念解説・入門記事・業界トレンドまとめは除外。「私たちは〜を設計した」という当事者発信、または書籍・標準化実績のある第一人者の独自フレームワーク提示のみ。
- 規模感: リサーチ仕様の規模ガイドに従う。PoC・個人検証レベルは除外。
- 以下の人物は既出のため除外: ${EXCLUDED.join('、')}
- 最大8名まで。質を優先し、確認できた候補のみ返す。
- 探索したクエリとソースをsearched_sourcesに必ず記録する。
返答は最終的にStructuredOutputツールで返すこと。`

phase('Search')
log(`${ANGLES.length}角度の並列探索を開始（${THEMES.length}テーマ）`)

const searchResults = await parallel(ANGLES.map(a => () =>
  agent(a.prompt + COMMON_FINDER_RULES, { label: `find:${a.key}`, phase: 'Search', schema: CANDIDATES_SCHEMA })
    .then(r => ({ ...r, theme: a.theme, key: a.key }))
))

const valid = searchResults.filter(Boolean)
const allSources = valid.flatMap(r => r.searched_sources || [])

// グローバル重複排除（同一人物は最初のテーマに割当）＋除外名簿適用
const seen = new Set(EXCLUDED.map(n => n.replace(/\s/g, '')))
const byTheme = Object.fromEntries(THEMES.map(t => [t, []]))
for (const r of valid) {
  for (const c of (r.candidates || [])) {
    const nameKey = (c.name || '').replace(/\s/g, '')
    if (!nameKey || seen.has(nameKey)) continue
    if (EXCLUDED.some(ex => nameKey.includes(ex.replace(/\s/g, '')))) continue
    seen.add(nameKey)
    byTheme[r.theme].push(c)
  }
}
log('候補抽出: ' + THEMES.map(t => `${t}=${byTheme[t].length}名`).join(' / '))

phase('Verify')
const conflictStep = CONFLICT_CHECK
  ? `5. 利益相反チェック: ${CONFLICT_CHECK}。結果に応じて priority を判定（相反あり→C、なし/個人/公的機関→A、判定不能→B）。`
  : `5. 利益相反チェックは未設定（conflict_check="未設定"、priority は B を既定とする）。`

const verifyTheme = async (theme) => {
  const list = byTheme[theme].slice(0, CAP)
  if (byTheme[theme].length > CAP) log(`${theme}: ${byTheme[theme].length}名中、上位${CAP}名のみ検証（残りは未検証として返却）`)
  const results = await parallel(list.map(c => () =>
    agent(`以下の登壇候補を検証せよ。本日: ${TODAY}。

候補: ${c.name}（${c.company}・${c.role || '役職不明'}）
記事: ${c.title}（${c.date}）
URL: ${c.url}
引用: ${c.evidence_quote}
テーマ適合主張: ${c.theme_fit}

検証タスク（全て実施）:
1. URLにWebFetchでアクセスし、実在・著者一致・引用の正確性を確認（url_ok / author_match）。アクセス不能なら検索で同記事を探し、見つからなければurl_ok=false。
2. 当事者性判定: (a)自社プロダクトの当事者発信（「私たちは」等の自社体験＋本人の設計判断）か、(b)第一人者（書籍/標準化実績＋独自フレームワーク提示）か、NG（トレンド解説・他社事例まとめ・概念解説）か。
3. ${GATE_F_RULES[theme]}
4. 在籍確認: Web検索で${TODAY.slice(0,4)}年時点の現所属を確認（公式SNS・企業メンバー紹介・直近登壇プロフィール等）。退職・異動があれば現所属に更新。
${conflictStep}
6. 記事内の事業規模インサイト（ユーザー数・データ量・運用年数等の具体値）を抽出。なければ「記載なし」。
7. verdict判定: url_ok && author_match && 当事者性(a|b) && 粒度判別が採用 && 記事が直近2年以内 → 「確定」。本人発信の裏取りが不完全だが取り組みは実在 → 「保留」。それ以外 → 「不採用」。
   判定は厳格に。不確実なら確定にしない。創作・推測での補完は禁止。
結果はStructuredOutputで返す。`, { label: `verify:${theme}:${c.name}`, phase: 'Verify', schema: VERIFY_SCHEMA })
      .then(v => ({ ...v, orig: c }))
  ))
  return results.filter(Boolean)
}

const verified = await parallel(THEMES.map(t => () => verifyTheme(t)))
const themesOut = Object.fromEntries(THEMES.map((t, i) => [t, verified[i] || []]))

const count = (arr, k) => (arr || []).filter(x => x.verdict === k).length
log('検証完了: ' + THEMES.map(t => `${t} 確定${count(themesOut[t],'確定')}/保留${count(themesOut[t],'保留')}`).join(' | '))

return {
  themes: themesOut,
  searched_sources: allSources,
  dropped: Object.fromEntries(THEMES.map(t => [t, byTheme[t].slice(CAP).map(c => `${c.name}（${c.company}）`)])),
}
