<script setup>
import { computed, ref, watch, nextTick } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import EventCard from '../components/EventCard.vue'

import DataNotice from '../components/DataNotice.vue'

import MedalIcon from '../components/MedalIcon.vue'

import { state, eventCards, eventSplit, medalCount } from '../data/store.js'

import { useI18n } from '../i18n/index.js'

import { firstQuery } from '../router.js'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const FILTERS = [
  { value: 'alla', key: 'events.all' },
  { value: 'tavlingar', key: 'events.competitions' },
  { value: 'lager', key: 'events.camps' },
]
const TYPE_BY_FILTER = { tavlingar: 'competition', lager: 'camp' }

// The chosen filter lives in the URL, so it survives a reload (AC4).
const urlFilter = computed(() => {
  const typ = firstQuery(route.query, 'typ')
  return FILTERS.some((f) => f.value === typ) ? typ : 'alla'
})

const openId = ref(firstQuery(route.query, 'visa'))
// A deep link opened from the URL forces the filter to Alla (AC7); opening a card by clicking
// keeps the chosen filter, so the card stays visible in its own category.
const deepLink = ref(Boolean(firstQuery(route.query, 'visa')))

const filter = computed(() => (deepLink.value && openId.value ? 'alla' : urlFilter.value))

function setFilter(value) {
  deepLink.value = false
  const query = { ...route.query }
  if (value === 'alla') delete query.typ
  else query.typ = value
  router.replace({ query })
}

const matchesFilter = (card) => filter.value === 'alla' || card.type === TYPE_BY_FILTER[filter.value]

const upcoming = computed(() => eventSplit.value.upcoming.filter(matchesFilter))
const pastByYear = computed(() =>
  eventSplit.value.pastByYear
    .map((group) => ({ ...group, cards: group.cards.filter(matchesFilter) }))
    .filter((group) => group.cards.length),
)

// Only medals with at least one win are listed; the summary is hidden when the current year has
// no medals, rather than shown as zeros.
const MEDAL_ORDER = ['gold', 'silver', 'bronze']
const medalsWithCount = computed(() => MEDAL_ORDER.filter((m) => medalCount.value[m] > 0))

// Opening a card puts its id in the address bar without adding a history entry (D4); closing it
// removes the id again. The toggle event also fires when `open` is set programmatically, so the
// handler no-ops when the state already agrees.
function onToggle(card, isOpen) {
  if (isOpen === (openId.value === card.id)) return
  if (isOpen) {
    openId.value = card.id
    router.replace({ query: { ...route.query, visa: card.id } })
  } else {
    openId.value = null
    deepLink.value = false
    const query = { ...route.query }
    delete query.visa
    router.replace({ query })
  }
}

// A link opened in a new tab: open the card and scroll it into view once the data is there.
watch(
  [() => route.query.visa, eventCards],
  async ([visa]) => {
    openId.value = visa ?? null
    if (visa) deepLink.value = true
    if (!visa || !eventCards.value.some((c) => c.id === visa)) return
    await nextTick()
    document.getElementById(`event-${visa}`)?.scrollIntoView()
  },
  { immediate: true },
)
</script>

<template>
  <div class="container page">
    <h1>{{ t('events.title') }}</h1>
    <DataNotice />

    <p v-if="state.status === 'loading' && !eventCards.length" class="muted">{{ t('common.loading') }}</p>
    <p v-else-if="!eventCards.length" class="muted">
      {{ state.status === 'error' ? t('common.loadError') : t('events.empty') }}
    </p>

    <template v-else>
      <div class="filters" role="group" :aria-label="t('events.title')">
        <button
          v-for="f in FILTERS"
          :key="f.value"
          type="button"
          :class="{ active: filter === f.value }"
          :aria-pressed="filter === f.value"
          @click="setFilter(f.value)"
        >
          {{ t(f.key) }}
        </button>
      </div>

      <p v-if="filter === 'tavlingar' && medalsWithCount.length" class="summary">
        <strong>{{ medalCount.year }}:</strong>
        <span v-for="m in medalsWithCount" :key="m" class="medal-count">
          <MedalIcon :medal="m" />{{ t(`results.medals.${m}`) }} {{ medalCount[m] }}
        </span>
      </p>

      <section v-if="upcoming.length" aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading">{{ t('events.upcoming') }}</h2>
        <ul class="cards">
          <li v-for="card in upcoming" :key="card.id">
            <EventCard :card="card" :open="openId === card.id" @toggle="onToggle" />
          </li>
        </ul>
      </section>

      <section v-for="group in pastByYear" :key="group.year" aria-labelledby="`past-${group.year}`">
        <h2 :id="`past-${group.year}`">{{ group.year }}</h2>
        <ul class="cards">
          <li v-for="card in group.cards" :key="card.id">
            <EventCard :card="card" :open="openId === card.id" @toggle="onToggle" />
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.filters button {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
}

.filters button.active {
  background: var(--red-strong);
  border-color: var(--red-strong);
  color: #fff;
}

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

.cards {
  list-style: none;
  margin: 0 0 32px;
  padding: 0;
  display: grid;
  gap: 16px;
}
</style>
