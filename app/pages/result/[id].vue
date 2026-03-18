<script setup lang="ts">
import { diagnose } from '~/utils/diagnosis'
import { jobData, jobRarity } from '~/utils/jobData'

const route = useRoute()
const { getResult } = useSupabase()

const loading = ref(true)
const notFound = ref(false)
const mainJob = ref('')
const subJobs = ref<string[]>([])
const rarity = ref<'RARE' | 'MIDDLE' | 'STANDARD'>('STANDARD')
const copied = ref(false)

const jobInfo = computed(() => jobData[mainJob.value])

const rarityClass = computed(() => {
  const map: Record<string, string> = { RARE: 'rarity-rare', MIDDLE: 'rarity-mid', STANDARD: 'rarity-standard' }
  return map[rarity.value] || ''
})

onMounted(async () => {
  const data = await getResult(route.params.id as string)
  if (!data) {
    notFound.value = true
    loading.value = false
    return
  }

  mainJob.value = data.main_job
  subJobs.value = data.sub_jobs
  rarity.value = jobRarity[data.main_job]?.tier || 'STANDARD'
  loading.value = false
})

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}

useHead({
  title: computed(() => mainJob.value ? `${mainJob.value} - 職場RPGジョブ診断` : '職場RPGジョブ診断'),
})
</script>

<template>
  <div class="container">
    <div v-if="loading" class="loading-card card">
      <p class="loading-text">読み込み中...</p>
    </div>

    <div v-else-if="notFound" class="card not-found">
      <p>結果が見つかりませんでした</p>
      <NuxtLink to="/" class="btn btn-primary" style="margin-top: 20px">診断する</NuxtLink>
    </div>

    <div v-else-if="jobInfo" class="card result-card">
      <div class="result-header">
        <p class="result-eyebrow">YOUR JOB IS</p>
        <h1 class="result-job-name">{{ mainJob }}</h1>
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
            v-for="sub in subJobs"
            :key="sub"
            :to="`/job/${sub}?from=${route.params.id}`"
            class="sub-job-link"
          >
            {{ sub }}
          </NuxtLink>
        </div>
      </div>

      <div class="result-actions">
        <button class="btn btn-primary" @click="copyUrl">
          {{ copied ? 'コピーしました！' : 'URLをコピー' }}
        </button>
        <NuxtLink to="/" class="btn btn-outline">もう一度診断する</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-card,
.not-found {
  text-align: center;
  padding: 60px 32px;
}

.loading-text {
  color: var(--text-sub);
  font-size: 14px;
}

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

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-actions .btn {
  width: 100%;
  text-align: center;
  text-decoration: none;
}

@media (max-width: 480px) {
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
