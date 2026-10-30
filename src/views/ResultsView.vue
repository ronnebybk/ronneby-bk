<script setup>
import { computed } from 'vue'

import MedalIcon from '../components/MedalIcon.vue'

import { state, resultsByYear, medalCount } from '../data/store.js'

import { useI18n } from '../i18n/index.js'

const { t, localized, formatDate } = useI18n()

// The summary is hidden when the current year has no medals, rather than shown as zeros.
const hasMedalsThisYear = computed(() => {
  const { gold, silver, bronze } = medalCount.value
  return gold + silver + bronze > 0
})

const currentYear = computed(() => String(new Date().getFullYear()))

// A medal shows the site's translated word; any other placement shows the sheet text as typed.
function placementText(result) {
  return result.medal ? t(`results.medals.${result.medal}`) : localized(result.placement, result.placementEn)
}

function entryDetails(result) {
  return [localized(result.class, result.classEn), localized(result.competition, result.competitionEn), result.place, formatDate(result.date)]
    .filter(Boolean)
    .join(' · ')
}
</script>

<template>
  <div class="container page">
    <h1>{{ t('results.title') }}</h1>

    <p v-if="state.status === 'loading' && !state.results.length" class="muted">{{ t('common.loading') }}</p>
    <p v-else-if="!state.results.length" class="muted">{{ t('results.empty') }}</p>

    <template v-else>
      <p v-if="hasMedalsThisYear" class="summary">
        <strong>{{ currentYear }}:</strong>
        <span v-for="m in ['gold', 'silver', 'bronze']" :key="m" class="medal-count">
          <MedalIcon :medal="m" />{{ t(`results.medals.${m}`) }} {{ medalCount[m] }}
        </span>
      </p>

      <section v-for="group in resultsByYear" :key="group.year" class="year">
        <h2>{{ group.year }}</h2>
        <ul class="list">
          <li v-for="(result, i) in group.results" :key="`${result.date}-${i}`" class="entry">
            <span class="placement">
              <MedalIcon v-if="result.medal" :medal="result.medal" />
              {{ placementText(result) }}
            </span>
            <strong class="name">{{ result.name }}</strong>
            <span class="muted details">{{ entryDetails(result) }}</span>
            <a v-if="result.link" :href="result.link" target="_blank" rel="noopener">{{ t('results.link') }} ↗</a>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 20px;
  margin-bottom: 32px;
}

.medal-count {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.year {
  margin-bottom: 32px;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--line);
}

.entry {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}

.placement {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 7ch;
  font-weight: 600;
}

.details {
  font-size: 0.95rem;
}
</style>
