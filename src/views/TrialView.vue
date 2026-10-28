<script setup>
import { computed } from 'vue'
import TextBlocks from '../components/TextBlocks.vue'
import { state } from '../data/store.js'
import { useI18n } from '../i18n/index.js'

const { t, localized } = useI18n()

// Editors' sections replace the built-in ones as a whole, so an edited page never mixes sources.
const sections = computed(() =>
  state.trial.length
    ? state.trial.map((section) => ({
        title: localized(section.title, section.titleEn),
        text: localized(section.text, section.textEn),
      }))
    : t('trial.sections'),
)

// Only groups with an age are useful for "which group fits me?".
const ageGroups = computed(() => state.groups.filter((group) => group.ages))

// While loading there is nothing to list yet: don't flash "no ages" before the data arrives.
const agesReady = computed(() => state.status !== 'loading' || state.groups.length > 0)
</script>

<template>
  <div class="container page">
    <h1>{{ t('trial.title') }}</h1>
    <p class="page-intro">{{ t('trial.intro') }}</p>

    <p v-if="state.status === 'loading' && !state.trial.length" class="muted">{{ t('common.loading') }}</p>
    <div v-else class="sections">
      <section v-for="(section, index) in sections" :key="index" class="card">
        <h2 v-if="section.title">{{ section.title }}</h2>
        <TextBlocks :text="section.text" />
      </section>
    </div>

    <section class="card ages">
      <h2>{{ t('trial.agesTitle') }}</h2>
      <template v-if="agesReady">
        <p>{{ ageGroups.length ? t('trial.agesIntro') : t('trial.agesNone') }}</p>
        <ul v-if="ageGroups.length" class="ages-list">
          <li v-for="group in ageGroups" :key="group.name">
            <span>{{ localized(group.name, group.nameEn) }}</span>
            <span class="tag">{{ t('common.age') }} {{ group.ages }}</span>
          </li>
        </ul>
      </template>
      <p><RouterLink to="/grupper">{{ t('trial.agesLink') }} →</RouterLink></p>
    </section>

    <div class="cta">
      <RouterLink to="/schema" class="btn btn-outline">{{ t('trial.ctaSchedule') }}</RouterLink>
      <RouterLink to="/kontakt" class="btn btn-primary">{{ t('trial.ctaJoin') }}</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.sections {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  margin-bottom: 16px;
}

.sections h2 {
  font-size: 1.4rem;
}

.ages {
  margin-bottom: 28px;
  border-top: 4px solid var(--red);
}

.ages-list {
  list-style: none;
  margin: 0 0 12px;
  padding: 0;
  display: grid;
  gap: 6px;
  max-width: 420px;
}

.ages-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid var(--line);
}

.cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* On the light page the outline button needs a dark outline to stay readable. */
.cta .btn-outline {
  border-color: var(--text);
}
</style>
