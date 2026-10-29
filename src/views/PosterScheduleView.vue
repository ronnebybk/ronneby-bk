<script setup>
import { computed, ref } from 'vue'
import PosterToolbar from '../components/PosterToolbar.vue'
import PosterFrame from '../components/PosterFrame.vue'
import { useI18n } from '../i18n/index.js'
import { state, hasData, visibleSeasons, useSeasonSchedule, groupStyle, groupName, timeRange } from '../data/store.js'

const { t, localized, formatDate } = useI18n()

const seasonName = ref(null)
const group = ref('')
const showCoaches = ref(true)

const { season, sessions, groupsInSeason } = useSeasonSchedule(seasonName)
// The selects follow what the poster shows, so they never start blank. A group chosen for another
// season falls back to all groups.
const chosenSeason = computed({ get: () => season.value?.name, set: (name) => (seasonName.value = name) })
const activeGroup = computed({
  get: () => (groupsInSeason.value.some((g) => g.name === group.value) ? group.value : ''),
  set: (name) => (group.value = name),
})
const shown = computed(() => (activeGroup.value ? sessions.value.filter((s) => s.groups.includes(activeGroup.value)) : sessions.value))

// Only days that have sessions get a column.
const days = computed(() =>
  [1, 2, 3, 4, 5, 6, 7].map((day) => ({ day, sessions: shown.value.filter((s) => s.day === day) })).filter((d) => d.sessions.length),
)
const legend = computed(() => {
  const names = new Set(shown.value.flatMap((s) => s.groups))
  return state.groups.filter((g) => names.has(g.name))
})

// Text size from the busiest day and the number of columns: larger when there is room, one step
// smaller when a day is crowded or the columns are narrow. A rough guess, no measuring.
const busiest = computed(() => Math.max(0, ...days.value.map((d) => d.sessions.length)))
const size = computed(() => {
  if (busiest.value > 3 || days.value.length >= 7) return 'dense'
  return busiest.value <= 2 && days.value.length <= 5 ? 'roomy' : ''
})

const qrTo = computed(() => ({ name: 'schedule', query: activeGroup.value ? { grupp: activeGroup.value } : {} }))
</script>

<template>
  <PosterToolbar>
    <template v-if="season">
      <label v-if="visibleSeasons.length > 1">
        {{ t('poster.seasonLabel') }}
        <select v-model="chosenSeason">
          <option v-for="s in visibleSeasons" :key="s.name" :value="s.name">{{ localized(s.name, s.nameEn) }}</option>
        </select>
      </label>
      <label v-if="groupsInSeason.length > 1">
        {{ t('poster.groupLabel') }}
        <select v-model="activeGroup">
          <option value="">{{ t('schedule.allGroups') }}</option>
          <option v-for="g in groupsInSeason" :key="g.name" :value="g.name">{{ groupName(g.name) }}</option>
        </select>
      </label>
      <label class="check"><input v-model="showCoaches" type="checkbox" /> {{ t('poster.coachesLabel') }}</label>
    </template>
  </PosterToolbar>

  <PosterFrame orientation="landscape" :qr-to="season ? qrTo : null" :qr-caption="t('poster.scheduleQr')">
    <template #title>{{ t('poster.scheduleTitle') }}</template>
    <template v-if="season" #subtitle>
      <strong>{{ localized(season.name, season.nameEn) }}</strong> ·
      {{ t('schedule.validFrom', { from: formatDate(season.from), to: formatDate(season.to) }) }}
    </template>

    <p v-if="state.status === 'loading' && !hasData" class="empty">{{ t('common.loading') }}</p>
    <p v-else-if="!season" class="empty">{{ state.status === 'error' ? t('poster.loadError') : t('schedule.empty') }}</p>

    <div v-else :class="['sheet', size]">
      <div class="week" :style="{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }">
        <section v-for="d in days" :key="d.day" class="day">
          <h2>{{ t('days')[d.day - 1] }}</h2>
          <div v-for="(s, i) in d.sessions" :key="i" class="session" :style="groupStyle(s.groups[0])">
            <p class="time">{{ timeRange(s) }}</p>
            <p class="chips">
              <span v-for="(g, j) in s.groups" :key="j" class="chip" :style="groupStyle(g)">{{ groupName(g) }}</span>
            </p>
            <p v-if="showCoaches && s.coach" class="meta">{{ t('common.coach') }}: {{ s.coach }}</p>
            <p v-if="s.note" class="meta note">{{ localized(s.note, s.noteEn) }}</p>
          </div>
        </section>
      </div>

      <div class="lower">
        <ul class="legend" :aria-label="t('poster.legend')">
          <li v-for="g in legend" :key="g.name">
            <span class="chip" :style="groupStyle(g.name)">{{ groupName(g.name) }}</span>
            <template v-if="g.ages">{{ t('common.age') }} {{ g.ages }}</template>
          </li>
        </ul>
        <aside class="note-box trial">
          <strong>{{ t('poster.trialTitle') }}</strong>
          {{ t('poster.trialText') }}
        </aside>
      </div>
    </div>
  </PosterFrame>
</template>

<style scoped>
/* Controls sit on the toolbar's dark background. */
label {
  display: flex;
  align-items: center;
  gap: 8px;
}

select {
  font: inherit;
  padding: 6px 8px;
  border-radius: 6px;
  max-width: 100%;
}

.check input {
  width: 18px;
  height: 18px;
}

.empty {
  font-size: 14pt;
}

.sheet {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  gap: 5mm;
  --time-size: 19pt;
  --chip-size: 11pt;
  --meta-size: 10pt;
  --card-max: 40mm;
}

.sheet.roomy {
  --time-size: 22pt;
  --chip-size: 12pt;
  --meta-size: 11pt;
  --card-max: 75mm;
}

.sheet.dense {
  --time-size: 13pt;
  --chip-size: 9pt;
  --meta-size: 8pt;
  --card-max: 30mm;
}

p {
  margin: 0;
}

/* Columns stretch to the footer and the cards share the height, so a quiet week fills the page. */
.week {
  flex: 1 0 auto;
  display: grid;
  gap: 3mm;
}

.day {
  display: flex;
  flex-direction: column;
  gap: 2.5mm;
  min-width: 0;
}

.day h2 {
  margin: 0;
  padding: 1mm 0;
  border-radius: 1.5mm;
  background: var(--ink);
  color: #fff;
  font-size: 16pt;
  text-align: center;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.session {
  /* Grows towards --card-max while there is room; an explicit min-height beats max-height, so a
     card with more text than the cap grows instead of spilling over the next one. */
  flex: 1 1 auto;
  max-height: var(--card-max);
  min-height: min-content;
  display: flex;
  flex-direction: column;
  gap: 1.5mm;
  break-inside: avoid;
  padding: 2mm 3mm;
  border-left: 2mm solid var(--group-color);
  border-radius: 1.5mm;
  background: color-mix(in srgb, var(--group-color) 14%, #fff);
  overflow-wrap: break-word;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.time {
  font-family: var(--font-display);
  font-size: var(--time-size);
  font-weight: 700;
  line-height: 1.1;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 1mm;
}

.meta {
  font-size: var(--meta-size);
}

.note {
  font-style: italic;
}

.lower {
  display: flex;
  align-items: stretch;
  gap: 6mm;
  break-inside: avoid;
}

.legend {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  gap: 2mm 6mm;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 11pt;
}

.legend li {
  display: flex;
  align-items: center;
  gap: 2mm;
}

.legend .chip {
  font-size: 11pt;
}

.trial {
  flex: none;
  width: 140mm;
  font-size: 10.5pt;
}
</style>
