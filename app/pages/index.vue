<script setup lang="ts">
import { questions, diagnose } from '~/utils/diagnosis'
import { jobData } from '~/utils/jobData'

type Screen = 'title' | 'question' | 'result'

const screen = ref<Screen>('title')
const currentQuestion = ref(0)
const answers = ref<Record<string, string>>({})
const result = ref<ReturnType<typeof diagnose> | null>(null)
const isSaving = ref(false)
const saveFailed = ref(false)
const resultId = useState<string | null>('lastResultId', () => null)

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

async function showResult() {
  result.value = diagnose(answers.value)
  screen.value = 'result'

  // Generate a temporary client-side ID immediately
  const tempId = crypto.randomUUID()
  resultId.value = tempId

  // Save to Supabase and replace with real ID if available
  isSaving.value = true
  saveFailed.value = false
  const id = await saveResult({
    main_job: result.value.job,
    sub_jobs: result.value.subJobs,
    answers: answers.value,
  })
  isSaving.value = false

  if (id) {
    resultId.value = id
    window.history.pushState({}, '', `/result/${id}`)
  } else {
    saveFailed.value = true
  }
}

function retry() {
  screen.value = 'title'
  window.history.pushState({}, '', '/')
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
const progressPercent = computed(() => ((currentQuestion.value) / questions.length) * 100)

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
        <p class="title-badge">Job Diagnosis</p>
        <h1 class="title-main">職場RPG<br>ジョブ診断</h1>
        <p class="title-desc">
          11の質問に答えて、あなたの職場でのジョブを診断します。<br>
          直感で答えてください。
        </p>
        <button class="btn btn-primary" @click="startDiagnosis">診断をはじめる</button>
      </div>
    </div>

    <!-- Question Screen -->
    <div v-if="screen === 'question'" class="question-screen">
      <div class="card">
        <!-- Progress -->
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
        </div>
        <p class="question-number">Q{{ currentQuestion + 1 }} / {{ questions.length }}</p>
        <h2 class="question-text">{{ currentQ.text }}</h2>
        <div class="choices">
          <button
            v-for="choice in currentQ.choices"
            :key="choice.label"
            class="choice-btn"
            @click="selectAnswer(choice.label)"
          >
            <span class="choice-label">{{ choice.label }}</span>
            <span class="choice-text">{{ choice.text }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Result Screen -->
    <div v-if="screen === 'result' && result && jobInfo" class="result-screen">
      <div class="card result-card">
        <div class="result-header">
          <p class="result-eyebrow">YOUR JOB IS</p>
          <h1 class="result-job-name">{{ result.job }}</h1>
        </div>

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
            <h3 class="section-label">相性のいいジョブ</h3>
            <p class="section-body">{{ jobInfo.compat }}</p>
          </div>
          <div class="result-section">
            <h3 class="section-label">このジョブが多いチームの注意点</h3>
            <p class="section-body">{{ jobInfo.warningMany }}</p>
          </div>
          <div class="result-section">
            <h3 class="section-label">このジョブがいないチームの注意点</h3>
            <p class="section-body">{{ jobInfo.warningNone }}</p>
          </div>
        </div>

        <!-- Sub Jobs -->
        <div class="sub-jobs-section">
          <h3 class="section-label">転職候補ジョブ</h3>
          <div class="sub-jobs">
            <NuxtLink
              v-for="sub in result.subJobs"
              :key="sub"
              :to="resultId ? `/job/${sub}?from=${resultId}` : `/job/${sub}`"
              class="sub-job-link"
            >
              {{ sub }}
            </NuxtLink>
          </div>
        </div>

        <!-- Actions -->
        <div class="result-actions">
          <button v-if="isSaving" class="btn btn-primary" disabled>保存中...</button>
          <button v-else-if="saveFailed" class="btn btn-primary" disabled title="URLシェアには保存が必要です">URLをコピー（保存失敗）</button>
          <button v-else class="btn btn-primary" @click="copyUrl">
            {{ copied ? 'コピーしました！' : 'URLをコピー' }}
          </button>
          <button class="btn btn-outline" @click="retry">もう一度診断する</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Title */
.title-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.title-card {
  text-align: center;
  padding: 60px 40px;
}

.title-badge {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-sub);
  text-transform: uppercase;
  margin-bottom: 20px;
}

.title-main {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 16px;
}

.title-desc {
  font-size: 14px;
  color: var(--text-sub);
  line-height: 1.8;
  margin-bottom: 40px;
}

/* Question */
.progress-track {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  margin-bottom: 24px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--text);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.question-number {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-sub);
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.question-text {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.7;
  margin-bottom: 28px;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.choice-btn {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: transparent;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 16px 18px;
  text-align: left;
  cursor: pointer;
  font-family: 'Noto Sans JP', system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text);
  transition: background 0.15s, border-color 0.15s;
}

.choice-btn:hover {
  background: var(--hover);
  border-color: var(--text-sub);
}

.choice-label {
  font-weight: 700;
  color: var(--text-sub);
  font-size: 12px;
  min-width: 18px;
  margin-top: 2px;
}

.choice-text {
  flex: 1;
}

/* Result */
.result-card {
  padding: 40px 32px;
}

.result-header {
  text-align: center;
  margin-bottom: 36px;
  padding-bottom: 28px;
  border-bottom: 1.5px solid var(--border);
}

.result-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--text-sub);
  margin-bottom: 10px;
}

.result-job-name {
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 12px;
}

.result-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 28px;
}

.result-section {
  padding: 0;
}

.section-label {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.section-body {
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-sub);
}

/* Sub Jobs */
.sub-jobs-section {
  margin-bottom: 32px;
  padding-top: 24px;
  border-top: 1.5px solid var(--border);
}

.sub-jobs {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.sub-job-link {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background: var(--hover);
  border-radius: 10px;
  color: var(--text);
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  transition: background 0.15s;
}

.sub-job-link:hover {
  background: var(--border);
}

/* Actions */
.result-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-actions .btn {
  width: 100%;
}

@media (max-width: 480px) {
  .title-card {
    padding: 40px 24px;
  }

  .result-card {
    padding: 28px 20px;
  }

  .result-job-name {
    font-size: 32px;
  }

  .sub-jobs {
    flex-direction: column;
  }
}
</style>
