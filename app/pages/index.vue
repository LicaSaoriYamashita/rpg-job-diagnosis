<script setup lang="ts">
import { questions, diagnose } from '~/utils/diagnosis'
import { jobData, jobImages, jobEnglishNames } from '~/utils/jobData'

type Screen = 'title' | 'question' | 'loading' | 'result'

const screen = ref<Screen>('title')
const currentQuestion = ref(0)
const answers = ref<Record<string, string>>({})
const result = ref<ReturnType<typeof diagnose> | null>(null)
const isSaving = ref(false)
const saveFailed = ref(false)
const isFlashing = ref(false)
const resultId = useState<string | null>('lastResultId', () => null)
const lastMainJob = useState<string | null>('lastMainJob', () => null)

const { saveResult } = useSupabase()

function startDiagnosis() {
  currentQuestion.value = 0
  answers.value = {}
  result.value = null
  screen.value = 'question'
}

function selectAnswer(choice: string) {
  const qKey = `Q${currentQuestion.value + 1}`
  answers.value[qKey] = choice

  if (currentQuestion.value < questions.length - 1) {
    currentQuestion.value++
  } else {
    showResult()
  }
}

function goBack() {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
  } else {
    screen.value = 'title'
  }
}

async function showResult() {
  result.value = diagnose(answers.value)
  screen.value = 'loading'

  // Supabase保存を並行して開始
  isSaving.value = true
  saveFailed.value = false
  const savePromise = saveResult({
    main_job: result.value.job,
    sub_jobs: result.value.subJobs,
    answers: answers.value,
  })

  // ローディング演出の最低表示時間
  await new Promise(resolve => setTimeout(resolve, 1800))

  // ホワイトフラッシュ開始
  isFlashing.value = true
  await new Promise(resolve => setTimeout(resolve, 300))

  // 結果画面へ切り替え
  const id = await savePromise
  isSaving.value = false

  if (id) {
    resultId.value = id
    lastMainJob.value = result.value!.job
    window.history.pushState({}, '', `/result/${id}`)
  } else {
    saveFailed.value = true
  }

  screen.value = 'result'

  // フラッシュフェードアウト
  await new Promise(resolve => setTimeout(resolve, 50))
  isFlashing.value = false
}

function retry() {
  screen.value = 'title'
  window.history.pushState({}, '', '/')
  window.scrollTo({ top: 0, behavior: 'instant' })
}

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // fallback
  }
}

const copied = ref(false)

const currentQ = computed(() => questions[currentQuestion.value])

const englishName = computed(() => result.value ? (jobEnglishNames[result.value.job] || result.value.job) : '')

const rarityClass = computed(() => {
  if (!result.value) return ''
  const map: Record<string, string> = { RARE: 'rarity-rare', MIDDLE: 'rarity-mid', STANDARD: 'rarity-standard' }
  return map[result.value.rarity] || ''
})

const jobInfo = computed(() => {
  if (!result.value) return null
  return jobData[result.value.job]
})
</script>

<template>
  <div class="container">
    <!-- Title Screen -->
    <div v-if="screen === 'title'" class="title-screen">
      <div class="card title-card">
        <div class="frame-outer">
          <div class="frame-inner frame-inner--title">
            <img src="/images/header.png" alt="ジョブキャラクター" class="title-hero" />
            <div class="title-group">
              <h1 class="title-english">Fantasy Job Finder</h1>
              <p class="title-jp">ファンタジージョブ診断</p>
            </div>
            <div class="divider" />
            <div class="title-desc-group">
              <p class="title-desc-bold">あなたがファンタジーの世界に生まれ変わったら、どんな職業になるのでしょうか？</p>
              <p class="title-desc-body">あなたが今のチームの中でどんな役割を担い、どんな強みを持っているかを<br>ゲームの中の世界のジョブ（職業）に例えて診断します。</p>
            </div>
            <button class="btn btn-primary title-btn" @click="startDiagnosis">診断をはじめる</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Question Screen -->
    <div v-if="screen === 'question'" class="question-screen">
      <div class="card question-card">
        <div class="frame-outer">
          <div class="frame-inner frame-inner--question">
            <Transition name="q-fade" mode="out-in">
              <div :key="currentQuestion" class="q-content">
                <!-- Q Number -->
                <div class="q-number">
                  <span class="q-num-main">Q{{ currentQuestion + 1 }}</span>
                  <span class="q-num-total">/ {{ questions.length }}</span>
                </div>
                <!-- Question Text -->
                <h2 class="question-text">{{ currentQ.text }}</h2>
                <!-- Choices -->
                <div class="choices">
                  <button
                    v-for="choice in currentQ.choices"
                    :key="choice.label"
                    class="choice-btn"
                    @click="selectAnswer(choice.label)"
                  >
                    <span class="choice-badge">{{ choice.label }}</span>
                    <span class="choice-text">{{ choice.text }}</span>
                  </button>
                </div>
                <!-- Back -->
                <button class="back-btn" @click="goBack">前の質問に戻る</button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Screen -->
    <div v-if="screen === 'loading'" class="loading-screen">
      <svg class="mc-svg" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
        <!-- 外側リング1: 点線, 超ゆっくりCW -->
        <circle class="mc-r1" cx="120" cy="120" r="114" fill="none"
          stroke="rgba(72,72,72,0.28)" stroke-width="1" stroke-dasharray="4 10" />
        <!-- 外側リング2: 実線, ゆっくりCCW -->
        <circle class="mc-r2" cx="120" cy="120" r="99" fill="none"
          stroke="rgba(72,72,72,0.22)" stroke-width="1" />
        <!-- 六芒星グループ: ゆっくりCW -->
        <g class="mc-hex">
          <!-- 上向き三角 (r=80) -->
          <polygon points="120,40 189.3,160 50.7,160" fill="none"
            stroke="rgba(72,72,72,0.28)" stroke-width="1" />
          <!-- 下向き三角 (r=80) -->
          <polygon points="120,200 50.7,80 189.3,80" fill="none"
            stroke="rgba(72,72,72,0.28)" stroke-width="1" />
          <!-- 内接六角形 (r=46.2) -->
          <polygon points="166.2,120 143.1,160 96.9,160 73.8,120 96.9,80 143.1,80" fill="none"
            stroke="rgba(72,72,72,0.18)" stroke-width="1" />
          <!-- 星の先端6点 -->
          <circle cx="120"   cy="40"  r="2.5" fill="rgba(72,72,72,0.32)" />
          <circle cx="189.3" cy="80"  r="2.5" fill="rgba(72,72,72,0.32)" />
          <circle cx="189.3" cy="160" r="2.5" fill="rgba(72,72,72,0.32)" />
          <circle cx="120"   cy="200" r="2.5" fill="rgba(72,72,72,0.32)" />
          <circle cx="50.7"  cy="160" r="2.5" fill="rgba(72,72,72,0.32)" />
          <circle cx="50.7"  cy="80"  r="2.5" fill="rgba(72,72,72,0.32)" />
        </g>
        <!-- 中間リング: 点線, 中速CCW -->
        <circle class="mc-r3" cx="120" cy="120" r="62" fill="none"
          stroke="rgba(72,72,72,0.32)" stroke-width="1" stroke-dasharray="5 5" />
        <!-- 内側リング: 実線, 速めCW -->
        <circle class="mc-r4" cx="120" cy="120" r="40" fill="none"
          stroke="rgba(72,72,72,0.28)" stroke-width="1.5" />
        <!-- 最内リング: 点線, 速いCCW -->
        <circle class="mc-r5" cx="120" cy="120" r="22" fill="none"
          stroke="rgba(72,72,72,0.42)" stroke-width="1" stroke-dasharray="2 3" />
        <!-- 中心ドット -->
        <circle class="mc-dot" cx="120" cy="120" r="5" fill="rgba(72,72,72,0.32)" />
      </svg>
      <p class="loading-message">あなたにふさわしいジョブは…</p>
    </div>

    <!-- White Flash Overlay -->
    <Transition name="flash">
      <div v-if="isFlashing" class="flash-overlay" />
    </Transition>

    <!-- Result Screen -->
    <div v-if="screen === 'result' && result && jobInfo" class="result-screen">
      <div class="card result-card">
        <div class="frame-outer">
          <div class="frame-inner">

            <!-- 上部：ヘッダー・画像・セクション -->
            <div class="result-top">
              <div class="result-header">
                <h1 class="english-name">{{ englishName }}</h1>
                <p class="job-name-jp">{{ result.job }}</p>
              </div>

              <div class="divider" />

              <img v-if="jobImages[result.job]" :src="jobImages[result.job]" :alt="result.job" class="job-image" />

              <div class="result-sections">
                <div class="result-section">
                  <h3 class="section-label">得意なこと</h3>
                  <p class="section-body">{{ jobInfo.strength }}</p>
                </div>
                <div class="result-section">
                  <h3 class="section-label">苦手なこと</h3>
                  <p class="section-body">{{ jobInfo.weakness }}</p>
                </div>
                <div class="result-section">
                  <h3 class="section-label">チームでの役割</h3>
                  <p class="section-body">{{ jobInfo.role }}</p>
                </div>
                <div class="result-section">
                  <h3 class="section-label">このジョブが多いチームの注意点</h3>
                  <p class="section-body">{{ jobInfo.warningMany }}</p>
                </div>
                <div class="result-section">
                  <h3 class="section-label">このジョブがいないチームの注意点</h3>
                  <p class="section-body">{{ jobInfo.warningNone }}</p>
                </div>
                <div class="result-section">
                  <h3 class="section-label">相性のいいジョブ</h3>
                  <div class="compat-jobs">
                    <div v-for="c in jobInfo.compat" :key="c.job" class="compat-job">
                      <img v-if="jobImages[c.job]" :src="jobImages[c.job]" :alt="c.job" class="compat-image" />
                      <p class="compat-name">{{ c.job }}</p>
                      <p class="section-body">{{ c.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="divider" />

            <!-- 下部：転職候補・ボタン -->
            <div class="result-bottom">
              <div class="sub-jobs-section">
                <h3 class="section-label">転職候補ジョブ</h3>
                <div class="sub-jobs">
                  <NuxtLink
                    v-for="sub in result.subJobs"
                    :key="sub"
                    :to="resultId ? `/job/${sub}?from=${resultId}` : `/job/${sub}`"
                    class="sub-job-card"
                  >
                    <img v-if="jobImages[sub]" :src="jobImages[sub]" :alt="sub" class="sub-job-image" />
                    <p class="sub-job-name">{{ sub }}</p>
                  </NuxtLink>
                </div>
              </div>

              <div class="result-actions">
                <button v-if="isSaving" class="btn btn-outline" disabled>保存中...</button>
                <button v-else-if="saveFailed" class="btn btn-outline" disabled>URLをコピー（保存失敗）</button>
                <button v-else class="btn btn-outline" @click="copyUrl">
                  <span class="material-icons btn-icon">content_copy</span>
                  {{ copied ? 'コピーしました！' : 'URLをコピー' }}
                </button>
                <button class="btn btn-primary" @click="retry">もう一度診断する</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Title */
.title-screen {}

.title-card {
  text-align: center;
  padding: 12px;
}


.frame-inner--title {
  padding: 0 12px 40px;
  gap: 24px;
}

.title-hero {
  width: 100%;
  height: 260px;
  object-fit: contain;
  object-position: center bottom;
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.title-english {
  font-family: 'Taprom', cursive;
  font-weight: 400;
  font-size: 68px;
  color: var(--text);
  line-height: normal;
}

.title-jp {
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 900;
  font-size: 24px;
  color: var(--text);
}

.title-desc-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: var(--text-sub);
  font-size: 14px;
  text-align: center;
}

.title-desc-bold {
  font-weight: 700;
  line-height: normal;
  color: var(--text-sub);
}

.title-desc-body {
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-sub);
}

.title-btn {
  width: 400px;
  max-width: 100%;
  box-shadow: 0px 2px 4px 0px rgba(72, 72, 72, 0.3);
}

.question-card {
  padding: 12px;
}

/* Loading */
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  gap: 48px;
}

.mc-svg {
  width: 240px;
  height: 240px;
  overflow: visible;
}

.mc-r1, .mc-r2, .mc-r3, .mc-r4, .mc-r5, .mc-hex {
  transform-origin: 120px 120px;
}

.mc-r1  { animation: svg-cw  20s linear infinite; }
.mc-r2  { animation: svg-ccw 12s linear infinite; }
.mc-hex { animation: svg-cw  35s linear infinite; }
.mc-r3  { animation: svg-ccw  8s linear infinite; }
.mc-r4  { animation: svg-cw   5s linear infinite; }
.mc-r5  { animation: svg-ccw  3s linear infinite; }

.mc-dot { animation: pulse-center 2s ease-in-out infinite; }

@keyframes svg-cw  {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes svg-ccw {
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
}

@keyframes pulse-center {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50%       { opacity: 0.9; transform: translate(-50%, -50%) scale(1.4); }
}

.loading-message {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.05em;
  animation: fade-up 0.9s ease 0.4s both;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* White Flash */
.flash-overlay {
  position: fixed;
  inset: 0;
  background: white;
  z-index: 200;
  pointer-events: none;
}

.flash-enter-active { transition: opacity 0.3s ease; }
.flash-leave-active { transition: opacity 1.5s ease; }
.flash-enter-from, .flash-leave-to { opacity: 0; }
.flash-enter-to, .flash-leave-from { opacity: 1; }

/* Question transition */
.q-fade-enter-active { transition: opacity 0.6s ease; }
.q-fade-leave-active  { transition: opacity 0.3s ease; }
.q-fade-enter-from,
.q-fade-leave-to { opacity: 0; }

/* 質問コンテンツのスタガー */
.q-fade-enter-active > *:nth-child(1) { animation: item-slide-up 0.3s ease both; animation-delay: 0s; }
.q-fade-enter-active > *:nth-child(2) { animation: item-slide-up 0.3s ease both; animation-delay: 0.04s; }
.q-fade-enter-active > *:nth-child(3) { animation: item-slide-up 0.3s ease both; animation-delay: 0.08s; }
.q-fade-enter-active > *:nth-child(4) { animation: item-slide-up 0.3s ease both; animation-delay: 0.12s; }

.q-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  width: 100%;
}

/* Question */
.frame-inner--question {
  padding: 28px;
}

.q-number {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.q-num-main {
  font-family: 'Taprom', cursive;
  font-weight: 400;
  font-size: 44px;
  color: var(--text);
  line-height: normal;
}

.q-num-total {
  font-family: 'Taprom', cursive;
  font-weight: 400;
  font-size: 24px;
  color: var(--text);
  line-height: normal;
}

.question-text {
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.6;
  color: var(--text);
  text-align: center;
  white-space: pre-line;
  min-height: calc(17px * 1.6 * 2);
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 600px;
}

.choice-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--card);
  border: 1px solid #484848;
  border-radius: 8px;
  padding: 8px 16px;
  min-height: 40px;
  text-align: left;
  cursor: pointer;
  font-family: 'Noto Sans JP', system-ui, sans-serif;
  line-height: 1.6;
  color: var(--text);
  transition: background 0.15s;
  width: 100%;
}

.choice-btn:hover {
  background: var(--hover);
}

.choice-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  min-width: 24px;
  background: #484848;
  border-radius: 50%;
  font-family: 'League Gothic', sans-serif;
  font-size: 16px;
  color: white;
  line-height: 1;
}

.choice-text {
  flex: 1;
  font-size: 14px;
  color: #484848;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 14px;
  color: var(--text-sub);
  padding: 12px 16px;
  transition: color 0.15s;
}

.back-btn:hover {
  color: var(--text);
}

/* 結果画面スタガー */
.result-header  { animation: item-slide-up 0.5s ease both; animation-delay: 0.1s; }
.result-top > .divider { animation: item-slide-up 0.5s ease both; animation-delay: 0.18s; }
.job-image      { animation: item-slide-up 0.5s ease both; animation-delay: 0.26s; }
.result-sections { animation: item-slide-up 0.5s ease both; animation-delay: 0.34s; }
.result-bottom  { animation: item-slide-up 0.5s ease both; animation-delay: 0.44s; }

/* Result */
.result-card {
  padding: 12px;
}

.frame-outer {
  border: 3px solid var(--border);
  padding: 6px;
}

.frame-inner {
  border: 2px solid var(--border);
  padding: 28px 28px 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 52px;
}

.result-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.result-header {
  text-align: center;
}

.english-name {
  font-family: 'Taprom', cursive;
  font-weight: 400;
  font-size: 68px;
  color: var(--text);
  line-height: normal;
  margin-bottom: -4px;
}

.job-name-jp {
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 900;
  font-size: 24px;
  color: var(--text);
}

.divider {
  width: 566px;
  max-width: 100%;
  height: 1px;
  background-color: var(--border);
}

.job-image {
  width: 400px;
  height: 400px;
  object-fit: cover;
  max-width: 100%;
}

.result-sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-label {
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.4;
}

.section-body {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-sub);
  white-space: pre-line;
}

.compat-jobs {
  display: flex;
  gap: 8px;
  width: 100%;
}

.compat-job {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
}

.compat-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  max-width: 100%;
}

.compat-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  text-align: center;
}

.result-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  width: 100%;
}

/* Sub Jobs */
.sub-jobs-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.sub-jobs {
  display: flex;
  gap: 9px;
}

.sub-job-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 4px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  transition: box-shadow 0.15s;
}

.sub-job-card:hover {
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
}

.sub-job-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  max-width: 100%;
}

.sub-job-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  text-align: center;
}

/* Actions */
.result-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.result-actions .btn {
  width: 400px;
  max-width: 100%;
  box-shadow: 0px 2px 4px 0px rgba(72, 72, 72, 0.3);
}

@media (max-width: 480px) {
  .title-card {
    padding: 40px 24px;
  }

  .frame-inner {
    padding: 20px 16px 36px;
    gap: 36px;
  }

  .english-name {
    font-size: 44px;
  }

  .compat-image,
  .sub-job-image {
    width: 120px;
    height: 120px;
  }
}
</style>
