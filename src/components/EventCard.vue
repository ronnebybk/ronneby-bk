<script setup>
import { computed } from 'vue'

import MedalIcon from './MedalIcon.vue'

import TextBlocks from './TextBlocks.vue'

import EventSlideshow from './EventSlideshow.vue'

import NewTabNote from './NewTabNote.vue'

import { useI18n } from '../i18n/index.js'

const props = defineProps({
  card: { type: Object, required: true },
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['toggle'])

const { t, localized, formatShortDate, formatDateRange, formatDate } = useI18n()

const title = computed(() => localized(props.card.title, props.card.titleEn))
const dateBlock = computed(() => (props.card.date ? formatShortDate(props.card.date) : null))
const place = computed(() => localized(props.card.place, props.card.placeEn))

// Type plus place, the date range for multi-day events, or the date text for undated ones (B1).
const meta = computed(() => {
  const parts = [t(`events.types.${props.card.type}`)]
  if (props.card.date && props.card.end && props.card.end !== props.card.date) parts.push(formatDateRange(props.card.date, props.card.end))
  else if (place.value) parts.push(place.value)
  else if (!props.card.date) parts.push(props.card.dateText || t('events.dateAnnounced'))
  return parts.join(' · ')
})

const images = computed(() => props.card.images.filter((img) => img.image))
const hasMedals = computed(() => ['gold', 'silver', 'bronze'].some((m) => props.card.medals[m] > 0))

const mapUrl = computed(() =>
  place.value ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.value)}` : '',
)

// The button reads "Anmälan & info" before/during the event and "Bilder & info" after (D3).
const linkLabel = computed(() => (props.card.upcoming ? t('events.signup') : t('events.photos')))

function placementText(result) {
  return result.medal ? t(`results.medals.${result.medal}`) : localized(result.placement, result.placementEn)
}

function onToggle(event) {
  emit('toggle', props.card, event.target.open)
}
</script>

<template>
  <details :id="`event-${card.id}`" class="event-card card" :class="{ past: !card.upcoming }" :open="open" @toggle="onToggle">
    <summary>
      <span class="date-block" aria-hidden="true">
        <template v-if="dateBlock"><span class="day">{{ dateBlock.day }}</span><span class="month">{{ dateBlock.month }}</span></template>
        <span v-else class="day">?</span>
      </span>
      <span class="head">
        <strong class="title">{{ title }}</strong>
        <span class="meta muted">{{ meta }}</span>
      </span>
      <span v-if="!card.upcoming && card.type === 'competition' && hasMedals" class="medals">
        <span v-for="m in ['gold', 'silver', 'bronze']" v-show="card.medals[m]" :key="m" class="medal-count">
          <MedalIcon :medal="m" />{{ card.medals[m] }}
        </span>
      </span>
      <span class="chevron" aria-hidden="true"></span>
    </summary>

    <div v-if="open" class="body">
      <EventSlideshow v-if="images.length" :images="images" :title="title" />

      <p v-if="localized(card.time, card.timeEn)" class="time">🕘 {{ localized(card.time, card.timeEn) }}</p>

      <p v-if="place" class="place">
        📍 {{ place }}
        <a :href="mapUrl" target="_blank" rel="noopener noreferrer">
          {{ t('events.viewMap') }}<NewTabNote />
        </a>
      </p>

      <TextBlocks v-if="localized(card.description, card.descriptionEn)" :text="localized(card.description, card.descriptionEn)" />

      <p v-if="card.link">
        <a :href="card.link" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          {{ linkLabel }} ↗<NewTabNote />
        </a>
      </p>

      <section v-if="card.results.length" class="results" aria-labelledby="`results-${card.id}`">
        <h3 :id="`results-${card.id}`">{{ t('events.results') }}</h3>
        <ul>
          <li v-for="(result, i) in card.results" :key="i">
            <span class="placement">
              <MedalIcon v-if="result.medal" :medal="result.medal" />
              {{ placementText(result) }}
            </span>
            <strong class="name">{{ result.name }}</strong>
            <span class="muted details">
              {{ [localized(result.class, result.classEn), formatDate(result.date)].filter(Boolean).join(' · ') }}
            </span>
            <a v-if="result.link" :href="result.link" target="_blank" rel="noopener noreferrer">
              {{ t('results.link') }} ↗<NewTabNote />
            </a>
          </li>
        </ul>
      </section>
    </div>
  </details>
</template>

<style scoped>
.event-card {
  padding: 0;
  scroll-margin-top: 90px;
}

.event-card.past {
  background: var(--paper);
}

summary {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  cursor: pointer;
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}

.date-block {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: var(--highlight);
  border: 1px solid var(--line);
  font-family: var(--font-display);
  text-transform: uppercase;
  line-height: 1.1;
}

.date-block .day {
  font-size: 1.3rem;
  font-weight: 700;
}

.date-block .month {
  font-size: 0.8rem;
}

.head {
  min-width: 0;
  flex: 1;
}

.title {
  display: block;
  font-family: var(--font-display);
  font-size: 1.15rem;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

.meta {
  display: block;
  font-size: 0.95rem;
}

.medals {
  display: inline-flex;
  gap: 10px;
  flex: none;
}

.medal-count {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

.chevron {
  flex: none;
  width: 10px;
  height: 10px;
  border-right: 2px solid var(--muted);
  border-bottom: 2px solid var(--muted);
  transform: rotate(45deg);
  transition: transform 0.15s;
}

details[open] .chevron {
  transform: rotate(225deg);
}

.body {
  padding: 4px 20px 20px;
  border-top: 1px solid var(--line);
}

.time,
.place {
  margin: 12px 0 0;
}

.place a {
  margin-left: 8px;
  white-space: nowrap;
}

.body .btn {
  margin-top: 16px;
}

.results {
  margin-top: 20px;
}

.results ul {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--line);
}

.results li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
  padding: 10px 0;
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

@media (max-width: 480px) {
  summary {
    gap: 10px;
    padding: 14px 14px;
  }

  .date-block {
    width: 48px;
    height: 48px;
  }

  .body {
    padding: 4px 14px 16px;
  }

  .medals {
    display: none;
  }
}
</style>
