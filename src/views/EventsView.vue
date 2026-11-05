<script setup>
import { computed, ref, watch, nextTick } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { useModalDialog } from '../composables/useModalDialog.js'

import EventCard from '../components/EventCard.vue'

import ImageSlideshow from '../components/ImageSlideshow.vue'

import TextBlocks from '../components/TextBlocks.vue'

import DataNotice from '../components/DataNotice.vue'

import MedalIcon from '../components/MedalIcon.vue'

import NewTabNote from '../components/NewTabNote.vue'

import { state, eventCards, eventSplit, medalCount } from '../data/store.js'

import { useI18n } from '../i18n/index.js'

import { firstQuery } from '../router.js'

const route = useRoute()
const router = useRouter()
const { t, localized, formatDate, formatDateRange } = useI18n()

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
// removes the id again.
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
  [() => firstQuery(route.query, 'visa'), eventCards],
  async ([visa]) => {
    // A click has already set openId; only a URL that differs is a deep link.
    if (visa && visa !== openId.value) deepLink.value = true
    openId.value = visa
    if (!visa || !eventCards.value.some((c) => c.id === visa)) return
    await nextTick()
    document.getElementById(`event-${visa}`)?.scrollIntoView()
  },
  { immediate: true },
)

// One pop-up for the page (T9); the browser's <dialog> gives Esc, backdrop and focus return to
// the card button for free. The content is v-if'd, so no slideshow image is requested before the
// dialog opens (AC6).
const dialog = ref(null)
const { open: openDialog, close: closeDialog, release, onBackdropClick } = useModalDialog(dialog)
const openCard = computed(() => eventCards.value.find((c) => c.id === openId.value) ?? null)

watch(openCard, async (card) => {
  await nextTick()
  if (!dialog.value) return
  if (card && !dialog.value.open) openDialog()
  else if (!card && dialog.value.open) closeDialog()
}, { immediate: true })

// Left/Right move focus between the cards, Home/End jump to the first/last of the same list.
// The handler sits on each <ul> (upcoming plus one per past year), so wrapping stays within one
// group. Up/Down are left alone: the cards are multi-column grids, so they scroll the page.
function onCardsKeydown(event) {
  const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
  if (!keys.includes(event.key)) return
  const buttons = [...event.currentTarget.querySelectorAll('.card-button')]
  const current = buttons.indexOf(document.activeElement)
  if (current === -1) return
  event.preventDefault()
  let next = current
  if (event.key === 'ArrowRight') next = (current + 1) % buttons.length
  else if (event.key === 'ArrowLeft') next = (current - 1 + buttons.length) % buttons.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = buttons.length - 1
  buttons[next]?.focus()
}

// The dialog's close event also fires on Esc and backdrop; route the state through onToggle so
// the URL loses the visa id exactly once. The scroll lock is released here because on the Esc
// path the browser has already closed the dialog, so the watch above sees dialog.open === false.
function onDialogClose() {
  release()
  if (openCard.value) onToggle(openCard.value, false)
}

// Everything the pop-up shows for the open card.
const dialogTitle = computed(() => (openCard.value ? localized(openCard.value.title, openCard.value.titleEn) : ''))
const dialogImages = computed(() => (openCard.value ? openCard.value.images.filter((img) => img.image) : []))
const dialogTime = computed(() => (openCard.value ? localized(openCard.value.time, openCard.value.timeEn) : ''))
const dialogPlace = computed(() => (openCard.value ? localized(openCard.value.place, openCard.value.placeEn) : ''))
const dialogDescription = computed(() =>
  openCard.value ? localized(openCard.value.description, openCard.value.descriptionEn) : '',
)
const dialogMeta = computed(() => {
  const card = openCard.value
  if (!card) return ''
  const parts = [t(`events.types.${card.type}`)]
  if (card.date && card.end && card.end !== card.date) parts.push(formatDateRange(card.date, card.end))
  else if (dialogPlace.value) parts.push(dialogPlace.value)
  else if (!card.date) parts.push(card.dateText || t('events.dateAnnounced'))
  return parts.join(' · ')
})
const dialogMapUrl = computed(() =>
  dialogPlace.value ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dialogPlace.value)}` : '',
)
// The button reads "Anmälan & info" before/during the event and "Bilder & info" after (D3).
const dialogLinkLabel = computed(() => (openCard.value?.upcoming ? t('events.signup') : t('events.photos')))

function placementText(result) {
  return result.medal ? t(`results.medals.${result.medal}`) : localized(result.placement, result.placementEn)
}
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
          class="pill-hover"
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
        <ul class="cards upcoming" @keydown="onCardsKeydown">
          <li v-for="card in upcoming" :key="card.id">
            <EventCard :card="card" :open="openId === card.id" @toggle="onToggle" />
          </li>
        </ul>
      </section>

      <section v-for="group in pastByYear" :key="group.year" :aria-labelledby="`past-${group.year}`">
        <h2 :id="`past-${group.year}`">{{ group.year }}</h2>
        <ul class="cards past" @keydown="onCardsKeydown">
          <li v-for="card in group.cards" :key="card.id">
            <EventCard :card="card" :open="openId === card.id" @toggle="onToggle" />
          </li>
        </ul>
      </section>
    </template>

    <dialog ref="dialog" class="event-dialog" @click="onBackdropClick" @close="onDialogClose">
      <template v-if="openCard">
        <button type="button" class="close" :aria-label="t('events.close')" @click="closeDialog">×</button>
        <div class="dialog-scroll">
          <ImageSlideshow v-if="dialogImages.length" :images="dialogImages" :title="dialogTitle" />

          <h2 class="dialog-title">{{ dialogTitle }}</h2>
          <p class="meta muted">{{ dialogMeta }}</p>

          <p v-if="dialogTime" class="time">🕘 {{ dialogTime }}</p>

          <p v-if="dialogPlace" class="place">
            📍 {{ dialogPlace }}
            <a :href="dialogMapUrl" target="_blank" rel="noopener noreferrer">
              {{ t('events.viewMap') }}<NewTabNote />
            </a>
          </p>

          <TextBlocks v-if="dialogDescription" :text="dialogDescription" />

          <p v-if="openCard.link">
            <a :href="openCard.link" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              {{ dialogLinkLabel }} ↗<NewTabNote />
            </a>
          </p>

          <section v-if="openCard.results.length" class="results" aria-labelledby="dialog-results">
            <h3 id="dialog-results">{{ t('events.results') }}</h3>
            <ul>
              <li v-for="(result, i) in openCard.results" :key="i">
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
      </template>
    </dialog>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

/* :where() keeps this below the shared .pill-hover:hover, which would lose to the scoped attribute. */
:where(.filters) button {
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

/* Active pill darkens on hover, matching .btn-primary:hover (D5). */
@media (hover: hover) {
  .filters button.active:hover {
    background: var(--red-strong-hover);
    border-color: var(--red-strong-hover);
  }
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

/* Stretch each card to the row height so cards with shorter content (e.g. no place line)
   aren't visibly smaller than their siblings in the same row. */
.cards li {
  display: grid;
}

/* Big cards for Kommande: one column at 390 px, wider columns on desktop. */
.cards.upcoming {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
}

/* Smaller cards for past years: two columns even at 390 px. */
.cards.past {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr));
  gap: 12px;
}

.event-dialog {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 0;
  width: min(94vw, 720px);
  max-height: 90vh;
  background: var(--paper);
  color: var(--text);
  display: flex;
  flex-direction: column;
}

.event-dialog:not([open]) {
  display: none;
}

.event-dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

/* The close button stays visible while the content scrolls. */
.close {
  flex: none;
  align-self: flex-end;
  background: var(--surface);
  border: none;
  border-bottom: 1px solid var(--line);
  width: 100%;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--text);
  padding: 8px 12px;
  text-align: right;
}

.dialog-scroll {
  overflow: auto;
  /* Keep a scroll that reaches the end of the dialog from chaining to the page behind it. */
  overscroll-behavior: contain;
  padding: 20px 24px 24px;
}

.dialog-title {
  margin: 16px 0 4px;
}

.meta {
  margin: 0;
  font-size: 0.95rem;
}

.time,
.place {
  margin: 12px 0 0;
}

.place a {
  margin-left: 8px;
  white-space: nowrap;
}

.dialog-scroll .btn {
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
  /* Center, not baseline: the placement's first flex item is the medal SVG, whose baseline is
     its bottom edge, so baseline alignment drops the icon below the text line. */
  align-items: center;
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

/* Full-screen sheet at phone widths. */
@media (max-width: 480px) {
  .event-dialog {
    width: 100vw;
    height: 100dvh;
    max-height: 100dvh;
    margin: 0;
    border: none;
    border-radius: 0;
  }

  .dialog-scroll {
    padding: 16px 16px 20px;
  }
}
</style>
