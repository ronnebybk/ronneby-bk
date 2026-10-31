<script setup>
import { computed } from 'vue'

import { nextEvent } from '../data/store.js'

import { useI18n } from '../i18n/index.js'

const { t, localized, formatDate } = useI18n()

// Only dated upcoming events qualify (AC9); undated ones are never used.
const card = nextEvent
const to = computed(() => (card.value ? { path: '/evenemang', query: { visa: card.value.id } } : '/evenemang'))
const place = computed(() => (card.value ? localized(card.value.place, card.value.placeEn) : ''))
</script>

<template>
  <section v-if="card" class="next-event card" aria-labelledby="next-event-title">
    <h2 id="next-event-title">{{ t('home.nextEvent') }}</h2>
    <RouterLink :to="to" class="link">
      <time :datetime="card.date">{{ formatDate(card.date) }}</time>
      <strong>{{ localized(card.title, card.titleEn) }}</strong>
      <span class="muted">{{ t(`events.types.${card.type}`) }}<template v-if="place"> · {{ place }}</template></span>
    </RouterLink>
  </section>
</template>

<style scoped>
.next-event {
  border-top: 4px solid var(--red);
  margin-top: 32px;
}

.next-event h2 {
  margin-bottom: 8px;
}

.link {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
  text-decoration: none;
  color: inherit;
}

.link time {
  color: var(--muted);
  font-size: 0.9rem;
}

.link strong {
  color: var(--link);
}
</style>
