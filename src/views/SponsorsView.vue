<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { state } from '../data/store.js'
import { useI18n } from '../i18n/index.js'
import SponsorLogo from '../components/SponsorLogo.vue'

const { t, locale, localized } = useI18n()

// Sponsors in sheet order; the description falls back to Swedish when the English cell is empty.
const sponsors = computed(() =>
  state.sponsors.map((s) => ({
    ...s,
    description: localized(s.description, s.descriptionEn),
  })),
)

// A description the line clamp actually cuts off gets a "Visa mer" button (D21). Measured in the
// browser after render; the observer on the grid re-measures on resize and language switch.
const cutOff = ref(new Set())
const grid = ref(null)
let observer

function measure() {
  const next = new Set()
  grid.value?.querySelectorAll('.description').forEach((el) => {
    if (el.scrollHeight > el.clientHeight) next.add(Number(el.dataset.index))
  })
  cutOff.value = next
}

onMounted(() => {
  observer = new ResizeObserver(measure)
  if (grid.value) observer.observe(grid.value)
  nextTick(measure)
})
watch(locale, () => nextTick(measure))
onBeforeUnmount(() => observer?.disconnect())

// One pop-up for the page; the browser's <dialog> gives Esc, backdrop and focus return for free (G1).
const dialog = ref(null)
const selected = ref(null)

function open(sponsor) {
  selected.value = sponsor
  dialog.value.showModal()
}

function close() {
  dialog.value.close()
}

// Clicking the dimmed backdrop means the click target is the <dialog> itself.
function onDialogClick(event) {
  if (event.target === dialog.value) close()
}
</script>

<template>
  <div class="container page">
    <h1>{{ t('sponsors.title') }}</h1>

    <ul v-if="sponsors.length" ref="grid" class="grid">
      <li v-for="(sponsor, i) in sponsors" :key="sponsor.name" class="card">
        <a v-if="sponsor.url" :href="sponsor.url" target="_blank" rel="noopener noreferrer" class="card-link">
          <span v-if="sponsor.logo" class="sponsor-tile">
            <SponsorLogo :sponsor="sponsor" :height="64" :fallback-text="false" />
          </span>
          <span class="name">{{ sponsor.name }}</span>
        </a>
        <template v-else>
          <span v-if="sponsor.logo" class="sponsor-tile">
            <SponsorLogo :sponsor="sponsor" :height="64" :fallback-text="false" />
          </span>
          <span class="name">{{ sponsor.name }}</span>
        </template>
        <span v-if="sponsor.description" class="description" :data-index="i">{{ sponsor.description }}</span>
        <button
          v-if="sponsor.description && cutOff.has(i)"
          type="button"
          class="show-more"
          @click="open(sponsor)"
        >
          {{ t('sponsors.showMore') }}
        </button>
      </li>
    </ul>

    <p v-if="state.club.email" class="become">
      {{ t('sponsors.become') }}
      <a :href="`mailto:${state.club.email}`">{{ state.club.email }}</a>
    </p>

    <dialog ref="dialog" class="sponsor-dialog" @click="onDialogClick">
      <template v-if="selected">
        <button type="button" class="close" :aria-label="t('sponsors.close')" @click="close">×</button>
        <span v-if="selected.logo" class="sponsor-tile">
          <SponsorLogo :sponsor="selected" :height="64" :fallback-text="false" />
        </span>
        <h2 class="dialog-name">{{ selected.name }}</h2>
        <p v-if="selected.description" class="dialog-description">{{ selected.description }}</p>
        <p v-if="selected.url" class="dialog-link">
          <a :href="selected.url" target="_blank" rel="noopener noreferrer">{{ t('sponsors.visit') }} ↗</a>
        </p>
      </template>
    </dialog>
  </div>
</template>

<style scoped>
.grid {
  list-style: none;
  padding: 0;
  margin: 24px 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
  gap: 16px;
}

.card {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

/* Only the logo and name link to the sponsor; the card itself must stay clickable for the button. */
.card-link {
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sponsor-tile {
  min-width: 100px;
}

.name {
  font-weight: 600;
}

.description {
  font-size: 0.9rem;
  color: var(--muted);
  /* Editors sometimes paste long multi-line text; clamp it so cards stay compact. */
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.show-more {
  background: none;
  border: none;
  padding: 0;
  color: var(--link);
  cursor: pointer;
  font: inherit;
  text-decoration: underline;
}

.become {
  margin-top: 8px;
}

.sponsor-dialog {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 24px;
  width: min(92vw, 520px);
  max-height: 85vh;
  overflow: auto;
  background: var(--paper);
  color: var(--ink);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
}

.sponsor-dialog:not([open]) {
  display: none;
}

.sponsor-dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.dialog-name {
  margin: 0;
}

/* Line breaks the editor typed are kept in the pop-up. */
.dialog-description {
  margin: 0;
  white-space: pre-line;
}

.dialog-link {
  margin: 0;
}

.close {
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: var(--ink);
  padding: 4px 8px;
}
</style>
