<script setup lang="ts">
import { jobData, jobRarity, jobImages, jobEnglishNames, jobOgpImages } from '~/utils/jobData'

const BASE_URL = 'https://rpg-job-diagnosis.vercel.app'

const route = useRoute()
const { getResult } = useSupabase()

const lastMainJob = useState<string | null>('lastMainJob', () => null)
const copied = ref(false)

const { data: resultData, status } = await useAsyncData(
  `result-${route.params.id}`,
  () => getResult(route.params.id as string)
)

const loading = computed(() => status.value === 'pending')
const notFound = computed(() => status.value === 'success' && !resultData.value)
const mainJob = computed(() => resultData.value?.main_job ?? '')
const subJobs = computed(() => resultData.value?.sub_jobs ?? [])
watch(mainJob, (val) => { if (val) lastMainJob.value = val }, { immediate: true })

const jobInfo = computed(() => jobData[mainJob.value])
const englishName = computed(() => jobEnglishNames[mainJob.value] || mainJob.value)

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}

const resultUrl = computed(() => `${BASE_URL}/result/${route.params.id}`)
const ogpImage = computed(() => `${BASE_URL}${jobOgpImages[mainJob.value] ?? '/ogp/ogp-result-1.png'}`)

useHead({
  title: computed(() => mainJob.value ? `${mainJob.value} - ファンタジージョブ診断` : 'ファンタジージョブ診断'),
  meta: computed(() => [
    { property: 'og:title', content: 'ファンタジージョブ診断' },
    { property: 'og:description', content: mainJob.value ? `あなたのジョブは…「${mainJob.value}」` : 'ファンタジージョブ診断' },
    { property: 'og:url', content: resultUrl.value },
    { property: 'og:image', content: ogpImage.value },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'ファンタジージョブ診断' },
    { name: 'twitter:description', content: mainJob.value ? `あなたのジョブは…「${mainJob.value}」` : 'ファンタジージョブ診断' },
    { name: 'twitter:image', content: ogpImage.value },
  ]),
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
      <div class="frame-outer">
        <div class="frame-inner">

          <!-- 上部：ヘッダー・画像・セクション -->
          <div class="result-top">
            <div class="result-header">
              <h1 class="english-name">{{ englishName }}</h1>
              <p class="job-name-jp">{{ mainJob }}</p>
            </div>

            <div class="divider" />

            <img v-if="jobImages[mainJob]" :src="jobImages[mainJob]" :alt="mainJob" class="job-image" />

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
                  v-for="sub in subJobs"
                  :key="sub"
                  :to="`/job/${sub}?from=${route.params.id}`"
                  class="sub-job-card"
                >
                  <img v-if="jobImages[sub]" :src="jobImages[sub]" :alt="sub" class="sub-job-image" />
                  <p class="sub-job-name">{{ sub }}</p>
                </NuxtLink>
              </div>
            </div>

            <div class="result-actions">
              <button class="btn btn-outline" @click="copyUrl">
                <span class="material-icons btn-icon">content_copy</span>
                {{ copied ? 'コピーしました！' : 'URLをコピー' }}
              </button>
              <NuxtLink to="/" class="btn btn-primary">もう一度診断する</NuxtLink>
            </div>
          </div>

        </div>
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
  font-size: 16px;
}

/* スタガーアニメーション */
.result-header  { animation: item-slide-up 0.5s ease both; animation-delay: 0.1s; }
.result-top > .divider { animation: item-slide-up 0.5s ease both; animation-delay: 0.18s; }
.job-image      { animation: item-slide-up 0.5s ease both; animation-delay: 0.26s; }
.result-sections { animation: item-slide-up 0.5s ease both; animation-delay: 0.34s; }
.result-bottom  { animation: item-slide-up 0.5s ease both; animation-delay: 0.44s; }

/* カードフレーム */
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

/* 上部コンテンツ */
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

/* セクション */
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

/* 相性ジョブ */
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

/* 下部コンテンツ */
.result-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  width: 100%;
}

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

/* ボタン */
.result-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.result-actions .btn {
  width: 400px;
  max-width: 100%;
  text-align: center;
  text-decoration: none;
  box-shadow: 0px 2px 4px 0px rgba(72, 72, 72, 0.3);
}

@media (max-width: 480px) {
  .frame-inner {
    padding: 20px 16px 36px;
    gap: 36px;
  }

  .english-name {
    font-size: 44px;
  }

  .job-name-jp {
    font-size: 20px;
  }

  .compat-image,
  .sub-job-image {
    width: 120px;
    height: 120px;
  }
}
</style>
