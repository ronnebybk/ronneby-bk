<script setup>
import { computed, ref } from 'vue'
import PosterToolbar from '../components/PosterToolbar.vue'
import PosterFrame from '../components/PosterFrame.vue'
import { useI18n } from '../i18n/index.js'
import { state, currentSeason, visibleSeasons, sessionsFor, groupColorIndex, groupName, groupNames, timeRange } from '../data/store.js'

const { t, localized, formatDate } = useI18n()

const seasonName = ref(null)
const group = ref('')
const showCoaches = ref(true)

// Same seasons as the schedule page; the current one until the editor picks another.
const season = computed(() => visibleSeasons.value.find((s) => s.name === seasonName.value) ?? currentSeason.value)
const sessions = computed(() => sessionsFor(season.value))
const groupsInSeason = computed(() => {
  const names = new Set(sessions.value.flatMap((s) => s.groups))
  return state.groups.filter((g) => names.has(g.name))
})
// A group chosen for another season falls back to all groups.
const activeGroup = computed(() => (groupsInSeason.value.some((g) => g.name === group.value) ? group.value : ''))
const shown = computed(() => (activeGroup.value ? sessions.value.filter((s) => s.groups.includes(activeGroup.value)) : sessions.value))

// Only days that have sessions get a column.
const days = computed(() =>
  [1, 2, 3, 4, 5, 6, 7].map((day) => ({ day, sessions: shown.value.filter((s) => s.day === day) })).filter((d) => d.sessions.length),
)
const legend = computed(() => {
  const names = new Set(shown.value.flatMap((s) => s.groups))
  return state.groups.filter((g) => names.has(g.name))
})

// One step smaller text when a day is crowded, so a busy week still fits one page.
const DENSE_FROM = 3
const dense = computed(() => Math.max(0, ...days.value.map((d) => d.sessions.length)) > DENSE_FROM)

const qrTo = computed(() => ({ name: 'schedule', query: activeGroup.value ? { grupp: activeGroup.value } : {} }))
const colorOf = (name) => ({ '--group-color': `var(--group-${groupColorIndex(name)})` })
</script>

<template>
  <PosterToolbar>
    <template v-if="season">
      <label v-if="visibleSeasons.length > 1">
        {{ t('poster.seasonLabel') }}
        <select v-model="seasonName">
          <option v-for="s in visibleSeasons" :key="s.name" :value="s.name">{{ localized(s.name, s.nameEn) }}</option>
        </select>
      </label>
      <label v-if="groupsInSeason.length > 1">
        {{ t('poster.groupLabel') }}
        <select v-model="group">
          <option value="">{{ t('schedule.allGroups') }}</option>
          <option v-for="g in groupsInSeason" :key="g.name" :value="g.name">{{ groupName(g.name) }}</option>
        </select>
      </label>
      <label class="check"><input v-model="showCoaches" type="checkbox" /> {{ t('poster.coachesLabel') }}</label>
    </template>
  </PosterToolbar>

  <PosterFrame orientation="landscape" :qr-to="season ? qrTo : null" :qr-caption="t('poster.scheduleQr')">
    <template #title>
      {{ t('poster.scheduleTitle') }}<template v-if="season">: {{ localized(season.name, season.nameEn) }}</template>
    </template>

    <p v-if="!season" class="empty">{{ t('schedule.empty') }}</p>

    <div v-else :class="['sheet', { dense }]">
      <p class="valid">{{ t('schedule.validFrom', { from: formatDate(season.from), to: formatDate(season.to) }) }}</p>

      <div class="week" :style="{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }">
        <section v-for="d in days" :key="d.day" class="day">
          <h2>{{ t('days')[d.day - 1] }}</h2>
          <div v-for="(s, i) in d.sessions" :key="i" class="session" :style="colorOf(s.groups[0])">
            <p class="time">{{ timeRange(s) }}</p>
            <p class="group">{{ groupNames(s.groups) }}</p>
            <p v-if="showCoaches && s.coach" class="meta">{{ t('common.coach') }}: {{ s.coach }}</p>
            <p v-if="s.note" class="meta note">{{ localized(s.note, s.noteEn) }}</p>
          </div>
        </section>
      </div>

      <div class="lower">
        <ul class="legend" :aria-label="t('poster.legend')">
          <li v-for="g in legend" :key="g.name" :style="colorOf(g.name)">
            <span class="swatch"></span>
            <strong>{{ groupName(g.name) }}</strong>
            <template v-if="g.ages"> · {{ t('common.age') }} {{ g.ages }}</template>
          </li>
        </ul>
        <aside class="trial">
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
  display: flex;
  flex-direction: column;
  gap: 4mm;
  min-height: 100%;
  --time-size: 17pt;
  --group-size: 12pt;
  --meta-size: 10pt;
  --session-gap: 2.5mm;
}

.sheet.dense {
  --time-size: 11pt;
  --group-size: 9.5pt;
  --meta-size: 8pt;
  --session-gap: 1.5mm;
}

p {
  margin: 0;
}

.valid {
  font-size: 11pt;
  color: var(--muted);
}

.week {
  display: grid;
  gap: 3mm;
  align-items: start;
  flex: 1;
}

.day h2 {
  margin: 0 0 2mm;
  padding-bottom: 1mm;
  border-bottom: 0.5mm solid #000;
  font-size: 16pt;
}

.session {
  break-inside: avoid;
  margin-bottom: var(--session-gap);
  padding-left: 2.5mm;
  border-left: 2mm solid var(--group-color);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.time {
  font-family: var(--font-display);
  font-size: var(--time-size);
  font-weight: 700;
  line-height: 1.15;
}

.group {
  font-size: var(--group-size);
  font-weight: 700;
}

.meta {
  font-size: var(--meta-size);
  color: var(--muted);
}

.note {
  font-style: italic;
}

.lower {
  display: flex;
  align-items: stretch;
  gap: 6mm;
}

.legend {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  gap: 1mm 6mm;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 10pt;
}

.swatch {
  display: inline-block;
  width: 4mm;
  height: 4mm;
  vertical-align: -0.8mm;
  margin-right: 1mm;
  background: var(--group-color);
  border: 0.3mm solid #000;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.trial {
  flex: none;
  width: 110mm;
  padding: 2mm 3mm;
  border: 0.6mm solid #000;
  border-radius: 2mm;
  font-size: 10pt;
}

.trial strong {
  display: block;
  font-family: var(--font-display);
  font-size: 13pt;
  text-transform: uppercase;
}
</style>
