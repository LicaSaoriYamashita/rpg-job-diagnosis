// 質問データ
export const questions = [
  {
    text: '仕事で一番大事にしていることは？',
    choices: [
      { label: 'A', text: 'スピードと行動力' },
      { label: 'B', text: '正確さと計画性' },
      { label: 'C', text: 'チームの空気と人間関係' },
      { label: 'D', text: '自分の専門性と質' },
    ],
  },
  {
    text: 'チームに不機嫌な人がいる。\nあなたは？',
    choices: [
      { label: 'A', text: '不安になって、なんとか場を和ませようとする' },
      { label: 'B', text: '自分の機嫌は自分でとってほしい、と苛立つ' },
      { label: 'C', text: '無視して自分の仕事に集中する' },
      { label: 'D', text: '原因を探って、こっそり解決策を考える' },
    ],
  },
  {
    text: 'あなたが一番力を発揮できる場所は？',
    choices: [
      { label: 'A', text: 'チームの中で、メンバーと近い距離で動くとき' },
      { label: 'B', text: '対外的な場面で、人前に出て発信するとき' },
      { label: 'C', text: '自分の専門領域の中で、深く集中できるとき' },
      { label: 'D', text: '自分で状況を見ながら、何でも柔軟に対応してよいとき' },
    ],
  },
  {
    text: '大きな問題が発覚して大焦り。\n取り急ぎの初動対応を終えたあと、頭をよぎるのは？',
    choices: [
      { label: 'A', text: 'とにかく動いて埋め合わせしなくては' },
      { label: 'B', text: '本当に自分のスコープだったのかを冷静に分析しなくては' },
      { label: 'C', text: '迷惑をかけたメンバーに謝らなくては' },
      { label: 'D', text: '今からリカバリできる上手い方法を考えなくては' },
    ],
  },
  {
    text: '自分が一番輝いていると感じるのはどんな場面？',
    choices: [
      { label: 'A', text: '誰も突破できなかった問題を解決したとき' },
      { label: 'B', text: '大勢の前で話したり、注目を集めているとき' },
      { label: 'C', text: 'チームメンバーから信頼されていると感じたとき' },
      { label: 'D', text: '誰もやらない問題にこっそり対処したのを、誰かに気づいてもらえたとき' },
    ],
  },
  {
    text: '正直、自分が一番苦手なことは？',
    choices: [
      { label: 'A', text: '計画を立てて継続すること' },
      { label: 'B', text: '自分で手を動かすこと' },
      { label: 'C', text: 'NOと言うこと' },
      { label: 'D', text: '人に言葉で説明すること' },
    ],
  },
  {
    text: '誰も手を挙げない面倒なタスクが出てきた。\nあなたは？',
    choices: [
      { label: 'A', text: '場が固まるくらいなら、自分がやる' },
      { label: 'B', text: '適切な担当者を考え、指名する' },
      { label: 'C', text: '自分の担当ならやるし、そうでないならやらない' },
      { label: 'D', text: '外部のリソースやツールで解決できないか考える' },
    ],
  },
  {
    text: 'あなたが急に1週間休むことになった。\n何が一番気になる？',
    choices: [
      { label: 'A', text: '外部との繋がりや情報が自分にしかわからない' },
      { label: 'B', text: '意思決定待ちでチームの作業が止まる' },
      { label: 'C', text: '自分が処理していた細かいタスクが溜まる' },
      { label: 'D', text: 'チーム間の連携やコミュニケーションが止まる' },
    ],
  },
  {
    text: 'チームで意見が割れ、空気が重くなってきた。\nこのとき自分の頭の中で一番強い感情は？',
    choices: [
      { label: 'A', text: '誰かが決めなければならないなら、自分が決めてしまおうか' },
      { label: 'B', text: 'データが示す方向に進めていくのが良いに決まっている' },
      { label: 'C', text: '誰も傷つかない落とし所を見つけなければ' },
      { label: 'D', text: '決断さえしてくれれば、それに合わせてどんどん進められるのに' },
    ],
  },
  {
    text: 'やってみたいことがある。でもリスクがある。\nあなたは？',
    choices: [
      { label: 'A', text: 'リスクは覚悟の上で、まず一歩踏み出す' },
      { label: 'B', text: '先のことは置いておいて、まずはアイデアをどんどん育てる' },
      { label: 'C', text: '誰かを巻き込んで一緒にやる' },
      { label: 'D', text: 'リスクを考慮して、実行できるタイミングを待つ' },
    ],
  },
  {
    text: '新しいスキルや知識が必要になったとき、あなたは？',
    choices: [
      { label: 'A', text: 'とにかくやってみて、実践の中で覚える' },
      { label: 'B', text: '専門書をいくつか購入して学ぶ' },
      { label: 'C', text: '一緒に勉強できるコミュニティやイベントを企画する' },
      { label: 'D', text: '大学や専門的な社会人スクールに通う' },
    ],
  },
]

// スコアリング定義
const scoring: Record<string, Record<string, Record<string, number>>> = {
  Q1: { A: { スピード: 2 }, B: { 分析力: 2, 戦略力: 1 }, C: { 調整力: 2, 継続力: 1 }, D: { 専門性: 2, 問題把握力: 1 } },
  Q2: { A: { 調整力: 2, 継続力: 1 }, B: { 調整力: 1, 意思決定力: 2 }, C: { 専門性: 1, スピード: 1 }, D: { 問題把握力: 2, 分析力: 1 } },
  Q3: { A: { 調整力: 2, 継続力: 1 }, B: { 発信力: 2, 発想力: 1 }, C: { 専門性: 2, 問題把握力: 1 }, D: { リソース活用力: 2, 問題把握力: 1 } },
  Q4: { A: { 実行力: 2, スピード: 1 }, B: { 専門性: 1, 継続力: 1 }, C: { 調整力: 2, 継続力: 1 }, D: { 問題把握力: 2, 意思決定力: 1 } },
  Q5: { A: { 問題把握力: 2, 専門性: 1 }, B: { 発信力: 2, 発想力: 1 }, C: { 調整力: 2, 継続力: 1 }, D: { 問題把握力: 2, 人脈力: 1 } },
  Q6: { A: { 発想力: 2, 実行力: 1 }, B: { 戦略力: 2, 分析力: 1 }, C: { 調整力: 2, 継続力: 1 }, D: { 専門性: 2, 実行力: 1 } },
  Q7: { A: { 実行力: 2, 調整力: 1 }, B: { 問題把握力: 2, 人脈力: 1 }, C: { 専門性: 2 }, D: { リソース活用力: 2, 分析力: 1 } },
  Q8: { A: { 人脈力: 2, 問題把握力: 1 }, B: { 意思決定力: 2, 戦略力: 1 }, C: { スピード: 2, 継続力: 1 }, D: { 調整力: 2, 人脈力: 1 } },
  Q9: { A: { 意思決定力: 2 }, B: { 分析力: 2, 戦略力: 1 }, C: { 調整力: 2, 継続力: 1 }, D: { 専門性: 1, スピード: 1 } },
  Q10: { A: { 意思決定力: 2, 実行力: 1 }, B: { 発想力: 2, 発信力: 1 }, C: { 人脈力: 2, 調整力: 1 }, D: { 戦略力: 2, 分析力: 1 } },
  Q11: { A: { 実行力: 2, スピード: 1 }, B: { 専門性: 2, 分析力: 1 }, C: { 発信力: 2, 人脈力: 1 }, D: { リソース活用力: 2, 問題把握力: 1 } },
}

// ジョブのスキルセット定義
export const jobSkills: Record<string, Set<string>> = {
  勇者: new Set(['実行力', '意思決定力', '発信力', '調整力']),
  ルーラー: new Set(['戦略力', '意思決定力', '調整力', '分析力', '問題把握力']),
  踊り子: new Set(['発信力', '発想力', '人脈力', '調整力']),
  召喚士: new Set(['リソース活用力', '問題把握力', '分析力', '人脈力']),
  ネクロマンサー: new Set(['問題把握力', '実行力', '専門性', 'スピード', '分析力']),
  遊び人: new Set(['発想力', '発信力']),
  盗賊: new Set(['人脈力', '問題把握力', '調整力']),
  賢者: new Set(['分析力', '戦略力', '問題把握力', '専門性']),
  忍者: new Set(['専門性', '実行力', '問題把握力', 'スピード']),
  僧侶: new Set(['調整力', '継続力', '専門性']),
  武闘家: new Set(['実行力', '継続力', 'スピード']),
  戦士: new Set(['専門性', '問題把握力']),
  魔法使い: new Set(['専門性', '戦略力']),
}

// レアリティ階層
const rareTiers: string[][] = [
  ['勇者', 'ルーラー', '踊り子', '召喚士', 'ネクロマンサー'],
  ['遊び人', '盗賊', '賢者', '忍者'],
  ['僧侶', '武闘家', '戦士', '魔法使い'],
]

export type RarityTier = 'RARE' | 'MIDDLE' | 'STANDARD'

export interface DiagnosisResult {
  job: string
  tierIdx: number
  rarity: RarityTier
  topSkills: Set<string>
  skillScores: Record<string, number>
  subJobs: string[]
}

export function diagnose(answers: Record<string, string>): DiagnosisResult {
  // スキルポイント集計
  const skillScores: Record<string, number> = {}
  for (const [q, choice] of Object.entries(answers)) {
    const skills = scoring[q]?.[choice]
    if (!skills) continue
    for (const [skill, pts] of Object.entries(skills)) {
      skillScores[skill] = (skillScores[skill] || 0) + pts
    }
  }

  // 上位6スキル抽出
  const topSkills = new Set(
    Object.entries(skillScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([s]) => s),
  )

  const skillRanking = Object.entries(skillScores).sort((a, b) => b[1] - a[1])

  let job: string
  let tierIdx: number

  // ===== 特殊判定（レア→ミドル→スタンダードの順）=====

  // 【レア】ネクロマンサー：問題把握力+実行力+専門性が全部上位
  if (topSkills.has('問題把握力') && topSkills.has('実行力') && topSkills.has('専門性')) {
    job = 'ネクロマンサー'
    tierIdx = 0
  }
  // 【レア】勇者：意思決定力+実行力が上位
  else if (topSkills.has('意思決定力') && topSkills.has('実行力')) {
    job = '勇者'
    tierIdx = 0
  }
  // 【レア】召喚士 vs ルーラー
  else if ((skillScores['リソース活用力'] || 0) > 0 || (skillScores['戦略力'] || 0) > 0) {
    const resourceScore = skillScores['リソース活用力'] || 0
    const strategyScore = skillScores['戦略力'] || 0
    if (resourceScore > strategyScore) {
      job = '召喚士'
      tierIdx = 0
    } else if (topSkills.has('意思決定力')) {
      job = 'ルーラー'
      tierIdx = 0
    } else {
      // フォールスルー
      job = ''
      tierIdx = -1
    }
  } else {
    job = ''
    tierIdx = -1
  }

  // 【レア】踊り子：発信力が1位 かつ 発想力も上位
  if (!job && skillRanking[0]?.[0] === '発信力' && topSkills.has('発想力')) {
    job = '踊り子'
    tierIdx = 0
  }

  // 【ミドル】盗賊：人脈力+問題把握力+調整力が全部上位
  if (!job && topSkills.has('人脈力') && topSkills.has('問題把握力') && topSkills.has('調整力')) {
    job = '盗賊'
    tierIdx = 1
  }

  // 【ミドル】通常一致判定（遊び人・賢者・忍者）
  if (!job) {
    const midJobs: Record<string, Set<string>> = {
      遊び人: new Set(['発想力', '発信力']),
      賢者: new Set(['分析力', '戦略力', '問題把握力', '専門性']),
      忍者: new Set(['専門性', '実行力', '問題把握力', 'スピード']),
    }
    for (const [j, skills] of Object.entries(midJobs)) {
      if ([...skills].every(s => topSkills.has(s))) {
        job = j
        tierIdx = 1
        break
      }
    }
  }

  // 【ミドル】賢者：分析力+戦略力が上位
  if (!job && topSkills.has('分析力') && topSkills.has('戦略力')) {
    job = '賢者'
    tierIdx = 1
  }

  // 【スタンダード】戦士 vs 魔法使い：専門性が1位のとき
  if (!job && skillRanking[0]?.[0] === '専門性') {
    job = topSkills.has('実行力') ? '戦士' : '魔法使い'
    tierIdx = 2
  }

  // 【スタンダード】通常一致判定
  if (!job) {
    const stdJobs: Record<string, Set<string>> = {
      僧侶: new Set(['調整力', '継続力', '専門性']),
      武闘家: new Set(['実行力', '継続力', 'スピード']),
      戦士: new Set(['専門性', '問題把握力']),
      魔法使い: new Set(['専門性', '戦略力']),
    }
    for (const [j, skills] of Object.entries(stdJobs)) {
      if ([...skills].every(s => topSkills.has(s))) {
        job = j
        tierIdx = 2
        break
      }
    }
  }

  // 一致度最大（フォールバック）
  if (!job) {
    let bestMatch = 0
    job = '武闘家'
    tierIdx = 2
    const allJobs: Record<string, Set<string>> = {
      遊び人: new Set(['発想力', '発信力']),
      賢者: new Set(['分析力', '戦略力', '問題把握力', '専門性']),
      忍者: new Set(['専門性', '実行力', '問題把握力', 'スピード']),
      僧侶: new Set(['調整力', '継続力', '専門性']),
      武闘家: new Set(['実行力', '継続力', 'スピード']),
      戦士: new Set(['専門性', '問題把握力']),
      魔法使い: new Set(['専門性', '戦略力']),
    }
    for (const [j, skills] of Object.entries(allJobs)) {
      const match = [...skills].filter(s => topSkills.has(s)).length / skills.size
      if (match > bestMatch) {
        bestMatch = match
        job = j
        // determine tier
        if (rareTiers[1].includes(j)) tierIdx = 1
        else tierIdx = 2
      }
    }
  }

  // 転職候補ジョブの判定
  const subJobs = getSubJobs(job, topSkills)

  const rarityMap: Record<number, RarityTier> = { 0: 'RARE', 1: 'MIDDLE', 2: 'STANDARD' }

  return {
    job,
    tierIdx,
    rarity: rarityMap[tierIdx] || 'STANDARD',
    topSkills,
    skillScores,
    subJobs,
  }
}

function getSubJobs(mainJob: string, topSkills: Set<string>): string[] {
  const allJobs = Object.keys(jobSkills)
  const scores: { job: string; score: number }[] = []

  for (const j of allJobs) {
    if (j === mainJob) continue
    const skills = jobSkills[j]
    const match = [...skills].filter(s => topSkills.has(s)).length / skills.size
    scores.push({ job: j, score: match })
  }

  scores.sort((a, b) => b.score - a.score)
  return scores.slice(0, 2).map(s => s.job)
}
