<script setup>
import DataNotice from '../components/DataNotice.vue'
import { state, hasData, currentSeason, sessionsFor, groupStyle, timeRange, priceText } from '../data/store.js'
import { useI18n } from '../i18n/index.js'

const { t, localized } = useI18n()

function sessionsOf(group) {
  return sessionsFor(currentSeason.value).filter((s) => s.groups.includes(group.name))
}
</script>

<template>
  <div class="container page">
    <h1>{{ t('groups.title') }}</h1>
    <p class="page-intro">{{ t('groups.intro') }}</p>
    <DataNotice />

    <p v-if="state.status === 'loading' && !hasData" class="muted">{{ t('common.loading') }}</p>
    <p v-else-if="!state.groups.length" class="muted">{{ t('groups.empty') }}</p>

    <div v-else class="grid">
      <article
        v-for="group in state.groups"
        :key="group.name"
        class="card group"
        :style="groupStyle(group.name)"
      >
        <header>
          <h2>{{ localized(group.name, group.nameEn) }}</h2>
          <span v-if="group.ages" class="tag">{{ t('common.age') }} {{ group.ages }}</span>
        </header>

        <p v-if="group.description">{{ localized(group.description, group.descriptionEn) }}</p>

        <div class="trains">
          <h3>{{ t('groups.trains') }}</h3>
          <ul v-if="sessionsOf(group).length">
            <li v-for="(s, i) in sessionsOf(group)" :key="i">
              <span>{{ t('days')[s.day - 1] }}</span>
              <span>{{ timeRange(s) }}</span>
            </li>
          </ul>
          <p v-else class="muted">{{ t('groups.noSessions') }}</p>
        </div>

        <p v-if="group.prices.length" class="price">{{ priceText(group) }}</p>
      </article>
    </div>

    <p v-if="state.groups.length" class="print-link">
      <RouterLink to="/affisch/grupper">{{ t('poster.link') }}</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.print-link {
  margin: 24px 0 0;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 5px solid var(--group-color);
}

.group p {
  margin: 0;
}

header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.trains h3 {
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 6px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid var(--line);
}

.price {
  margin-top: auto !important;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--link);
}
</style>
