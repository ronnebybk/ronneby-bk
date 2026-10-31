<script setup>
import { computed, reactive } from 'vue'

import MedalIcon from './MedalIcon.vue'

import { useI18n } from '../i18n/index.js'

const props = defineProps({
  card: { type: Object, required: true },
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['toggle'])

const { t, localized, formatShortDate, formatDateRange } = useI18n()

const title = computed(() => localized(props.card.title, props.card.titleEn))
const dateBlock = computed(() => (props.card.date ? formatShortDate(props.card.date) : null))
const place = computed(() => localized(props.card.place, props.card.placeEn))
const typeLabel = computed(() => t(`events.types.${props.card.type}`))

// Place, the date range for multi-day events, or the date text for undated ones (B1).
const meta = computed(() => {
  if (props.card.date && props.card.end && props.card.end !== props.card.date)
    return formatDateRange(props.card.date, props.card.end)
  if (place.value) return place.value
  if (!props.card.date) return props.card.dateText || t('events.dateAnnounced')
  return ''
})

// The cover is the first usable image; the slideshow in the pop-up shows them all.
const cover = computed(() => props.card.images.find((img) => img.image)?.image ?? null)

// A cover that fails to load falls back to the branded date tile, like a card with no image.
const failedCovers = reactive(new Set())

const hasMedals = computed(() => ['gold', 'silver', 'bronze'].some((m) => props.card.medals[m] > 0))

function openCard() {
  emit('toggle', props.card, true)
}
</script>

<template>
  <article :id="`event-${card.id}`" class="event-card card" :class="{ past: !card.upcoming }">
    <button
      type="button"
      class="card-button"
      :aria-expanded="open"
      aria-haspopup="dialog"
      :aria-labelledby="`event-title-${card.id}`"
      @click="openCard"
    >
      <span class="cover">
        <img
          v-if="cover && !failedCovers.has(cover)"
          :src="cover"
          alt=""
          loading="lazy"
          referrerpolicy="no-referrer"
          @error="failedCovers.add(cover)"
        />
        <span v-else class="cover-fallback" aria-hidden="true">
          <span class="fallback-date">{{ dateBlock ? dateBlock.day : '?' }}</span>
          <span v-if="dateBlock" class="fallback-month">{{ dateBlock.month }}</span>
          <span class="fallback-type">{{ typeLabel }}</span>
        </span>
        <span class="date-block" aria-hidden="true">
          <template v-if="dateBlock"><span class="day">{{ dateBlock.day }}</span><span class="month">{{ dateBlock.month }}</span></template>
          <span v-else class="day">?</span>
        </span>
        <span v-if="!card.upcoming && card.type === 'competition' && hasMedals" class="medal-badge">
          <span v-for="m in ['gold', 'silver', 'bronze']" v-show="card.medals[m]" :key="m" class="medal-count">
            <MedalIcon :medal="m" />{{ card.medals[m] }}
          </span>
        </span>
      </span>
      <span class="card-body">
        <strong class="title" :id="`event-title-${card.id}`">{{ title }}</strong>
        <span class="meta-line">
          <span class="tag">{{ typeLabel }}</span>
          <span v-if="meta" class="meta muted">{{ meta }}</span>
        </span>
      </span>
    </button>
  </article>
</template>

<style scoped>
.event-card {
  padding: 0;
  overflow: hidden;
  scroll-margin-top: 90px;
}

.event-card.past {
  background: var(--paper);
}

.card-button {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.cover {
  position: relative;
  display: block;
  aspect-ratio: 3 / 2;
  background: var(--ink);
  overflow: hidden;
}

.cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  text-transform: uppercase;
  line-height: 1.1;
}

.fallback-date {
  font-family: var(--font-display);
  font-size: 2.6rem;
  font-weight: 700;
  color: var(--red-on-ink);
}

.fallback-month {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--red-on-ink);
}

.fallback-type {
  margin-top: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid var(--red-on-ink);
  color: var(--red-on-ink);
}

.date-block {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background: var(--surface);
  border: 1px solid var(--line);
  font-family: var(--font-display);
  text-transform: uppercase;
  line-height: 1.1;
}

.date-block .day {
  font-size: 1.2rem;
  font-weight: 700;
}

.date-block .month {
  font-size: 0.75rem;
}

.medal-badge {
  position: absolute;
  left: 10px;
  bottom: 10px;
  display: inline-flex;
  gap: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--surface);
  border: 1px solid var(--line);
}

.medal-count {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 0.9rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px 16px;
}

.title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

.meta-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.meta {
  font-size: 0.9rem;
}

/* Past-year grids use smaller cards (compact variant). */
.past .cover {
  aspect-ratio: 16 / 10;
}

.past .card-body {
  padding: 10px 12px 12px;
}

.past .title {
  font-size: 0.95rem;
}

.past .date-block {
  width: 42px;
  height: 42px;
  top: 8px;
  left: 8px;
}

.past .date-block .day {
  font-size: 1rem;
}

.past .date-block .month {
  font-size: 0.65rem;
}

.past .meta {
  font-size: 0.8rem;
}
</style>
