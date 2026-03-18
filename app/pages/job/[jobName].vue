<script setup lang="ts">
import { jobData, jobRarity } from '~/utils/jobData'
import { jobSkills } from '~/utils/diagnosis'

const route = useRoute()
const jobName = computed(() => decodeURIComponent(route.params.jobName as string))
const lastResultId = useState<string | null>('lastResultId', () => null)
const fromId = computed(() => (route.query.from as string) || lastResultId.value || undefined)
const info = computed(() => jobData[jobName.value])
const rarity = computed(() => jobRarity[jobName.value])
const skills = computed(() => jobSkills[jobName.value] ? [...jobSkills[jobName.value]] : [])

const rarityClass = computed(() => {
  if (!rarity.value) return ''
  const map: Record<string, string> = { RARE: 'rarity-rare', MIDDLE: 'rarity-mid', STANDARD: 'rarity-standard' }
  return map[rarity.value.tier] || ''
})

useHead({
  title: computed(() => `${jobName.value} - 職場RPGジョブ診断`),
})
</script>

<template>
  <div class="container">
    <div v-if="!info" class="card not-found">
      <p>ジョブが見つかりませんでした</p>
      <NuxtLink to="/" class="btn btn-primary" style="margin-top: 20px">診断する</NuxtLink>
    </div>

    <div v-else class="card job-card">
      <div class="back-links">
        <NuxtLink v-if="fromId" :to="`/result/${fromId}`" class="back-link">← 診断結果に戻る</NuxtLink>
        <NuxtLink to="/" class="back-link">← 診断トップに戻る</NuxtLink>
      </div>

      <div class="job-header">
        <h1 class="job-name">{{ jobName }}</h1>
      </div>

      <div class="skill-tags">
        <span v-for="skill in skills" :key="skill" class="skill-tag">{{ skill }}</span>
      </div>

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
          <h3 class="section-label">相性のいいジョブ</h3>
          <p class="section-body">{{ info.compat }}</p>
        </div>
        <div class="job-section">
          <h3 class="section-label">このジョブが多いチームの注意点</h3>
          <p class="section-body">{{ info.warningMany }}</p>
        </div>
        <div class="job-section">
          <h3 class="section-label">このジョブがいないチームの注意点</h3>
          <p class="section-body">{{ info.warningNone }}</p>
        </div>
      </div>

      <NuxtLink to="/" class="btn btn-primary" style="width: 100%; text-decoration: none;">診断する</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 60px 32px;
}

.job-card {
  padding: 32px;
}

.back-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 24px;
}

.back-link {
  display: inline-block;
  font-size: 13px;
  color: var(--text-sub);
  text-decoration: none;
  transition: color 0.15s;
}

.back-link:hover {
  color: var(--text);
}

.job-header {
  margin-bottom: 16px;
}

.job-name {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 10px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 28px;
}

.skill-tag {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-sub);
  background: var(--hover);
  padding: 4px 12px;
  border-radius: 6px;
}

.job-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
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

@media (max-width: 480px) {
  .job-card {
    padding: 24px 20px;
  }

  .job-name {
    font-size: 28px;
  }
}
</style>
