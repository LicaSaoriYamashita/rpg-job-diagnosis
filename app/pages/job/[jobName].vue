<script setup lang="ts">
import { jobData, jobRarity, jobImages, jobEnglishNames } from '~/utils/jobData'
const route = useRoute()
const jobName = computed(() => decodeURIComponent(route.params.jobName as string))
const lastResultId = useState<string | null>('lastResultId', () => null)
const lastMainJob = useState<string | null>('lastMainJob', () => null)
const fromId = computed(() => (route.query.from as string) || lastResultId.value || undefined)
const fromJobName = computed(() => lastMainJob.value || '')
const info = computed(() => jobData[jobName.value])
const englishName = computed(() => jobEnglishNames[jobName.value] || jobName.value)

useHead({
  title: computed(() => `${jobName.value} - ファンタジージョブ診断`),
})
</script>

<template>
  <div class="container">
    <div v-if="!info" class="card not-found">
      <p>ジョブが見つかりませんでした</p>
      <NuxtLink to="/" class="btn btn-primary" style="margin-top: 20px">診断する</NuxtLink>
    </div>

    <div v-else class="card job-card">
      <div class="frame-outer">
        <div class="frame-inner">
          <div class="result-top">
            <div class="job-header">
              <p v-if="fromId" class="job-subtitle">「{{ fromJobName }}」のあなたが転職できそうなジョブは…</p>
              <h1 class="english-name">{{ englishName }}</h1>
              <p class="job-name-jp">{{ jobName }}</p>
            </div>

            <div class="divider" />

            <img v-if="jobImages[jobName]" :src="jobImages[jobName]" :alt="jobName" class="job-image" />

            <div class="job-sections">
              <div class="job-section">
                <h3 class="section-label">得意なこと</h3>
                <p class="section-body">{{ info.strength }}</p>
              </div>
              <div class="job-section">
                <h3 class="section-label">苦手なこと</h3>
                <p class="section-body">{{ info.weakness }}</p>
              </div>
              <div class="job-section">
                <h3 class="section-label">チームでの役割</h3>
                <p class="section-body">{{ info.role }}</p>
              </div>
              <div class="job-section">
                <h3 class="section-label">このジョブが多いチームの注意点</h3>
                <p class="section-body">{{ info.warningMany }}</p>
              </div>
              <div class="job-section">
                <h3 class="section-label">このジョブがいないチームの注意点</h3>
                <p class="section-body">{{ info.warningNone }}</p>
              </div>
              <div class="job-section">
                <h3 class="section-label">相性のいいジョブ</h3>
                <div class="compat-jobs">
                  <div v-for="c in info.compat" :key="c.job" class="compat-job">
                    <img v-if="jobImages[c.job]" :src="jobImages[c.job]" :alt="c.job" class="compat-image" />
                    <p class="compat-name">{{ c.job }}</p>
                    <p class="compat-desc">{{ c.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="job-actions">
            <NuxtLink v-if="fromId" :to="`/result/${fromId}`" class="btn btn-outline job-btn">
              <span class="material-icons btn-icon">arrow_back</span>診断結果にもどる
            </NuxtLink>
            <NuxtLink to="/" class="btn btn-primary job-btn">もう一度診断する</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 60px 32px;
}

.job-card {
  padding: 12px;
}

/* スタガーアニメーション */
.job-header  { animation: item-slide-up 0.5s ease both; animation-delay: 0.1s; }
.result-top > .divider { animation: item-slide-up 0.5s ease both; animation-delay: 0.18s; }
.job-image   { animation: item-slide-up 0.5s ease both; animation-delay: 0.26s; }
.job-sections { animation: item-slide-up 0.5s ease both; animation-delay: 0.34s; }
.job-actions  { animation: item-slide-up 0.5s ease both; animation-delay: 0.44s; }

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
  gap: 72px;
}

.result-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.job-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.job-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-sub);
  line-height: 1.6;
  margin-bottom: 4px;
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

.job-sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
}

.job-section {
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
  padding: 8px;
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

.compat-desc {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-sub);
  text-align: center;
}

.job-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.job-btn {
  width: 400px;
  max-width: 100%;
  text-decoration: none;
  box-shadow: 0px 2px 4px 0px rgba(72, 72, 72, 0.3);
}

@media (max-width: 480px) {
  .job-card {
    padding: 12px 8px;
  }

  .frame-inner {
    padding: 20px 16px 36px;
    gap: 48px;
  }

  .english-name {
    font-size: 44px;
  }

  .compat-image {
    width: 120px;
    height: 120px;
  }
}
</style>
