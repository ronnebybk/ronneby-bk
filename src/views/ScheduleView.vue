<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { firstQuery } from '../router.js'
import SessionItem from '../components/SessionItem.vue'
import DataNotice from '../components/DataNotice.vue'
import { state, hasData, currentSeason, visibleSeasons, useSeasonSchedule, scheduleQuery, weekday, todayIso, exceptionFor, groupStyle, groupName, groupNames, upcomingExceptions } from '../data/store.js'
import { buildCalendar, fileName, hasEvents } from '../data/ics.js'
import { useI18n } from '../i18n/index.js'

const { t, localized, formatDate, formatWeekday } = useI18n()
const route = useRoute()
const router = useRouter()

const selectedName = ref(null)
const chosenGroup = ref('')

// The season the visitor picked, else ?sasong=, else the current one.
const { season, sessions, groupsInSeason } = useSeasonSchedule(selectedName)

// A filter whose group is no longer in the season (renamed in the sheet, or another season picked)
// shows all groups, so the visitor is never stuck on an empty week.
const groupFilter = computed(() => (groupsInSeason.value.some((g) => g.name === chosenGroup.value) ? chosenGroup.value : ''))

// The poster's QR code links here with ?sasong= and ?grupp=. The cached copy may predate the group,
// so its name waits for the live data.
let wanted = null
function applyWanted() {
  if (!wanted) return
  if (groupsInSeason.value.some((g) => g.name === wanted)) {
    chosenGroup.value = wanted
    wanted = null
  } else if (state.status !== 'loading') {
    wanted = null
  }
}
function readQuery() {
  selectedName.value = firstQuery(route.query, 'sasong')
  chosenGroup.value = ''
  wanted = firstQuery(route.query, 'grupp')
  applyWanted()
}
readQuery()
watch([() => route.query.sasong, () => route.query.grupp], readQuery)
watch([groupsInSeason, () => state.status], applyWanted)

function pickGroup(name) {
  wanted = null
  chosenGroup.value = name
}

const filtered = computed(() =>
  groupFilter.value ? sessions.value.filter((s) => s.groups.includes(groupFilter.value)) : sessions.value,
)

const isCurrent = computed(() => season.value === currentSeason.value)

// The calendar button follows the group filter (D1/D2): a group's file holds only that
// group's sessions, "All groups" holds every session in the shown season.
const calendarVisible = computed(() => hasEvents(season.value, filtered.value, todayIso()))

function downloadCalendar() {
  const group = groupFilter.value
  const text = buildCalendar({
    season: season.value,
    sessions: filtered.value,
    isCancelled: (iso, session) => Boolean(exceptionFor(iso, session.groups)),
    today: todayIso(),
    now: new Date(),
    summary: (session) => (group ? groupName(group) : groupNames(session.groups)),
    location: localized(state.club.venue, state.club.venueEn),
    description: (session) => {
      const lines = []
      if (session.coach) lines.push(`${t('common.coach')}: ${session.coach}`)
      const note = localized(session.note, session.noteEn)
      if (note) lines.push(note)
      const href = router.resolve({ name: 'schedule', query: scheduleQuery(season.value, group || undefined) }).href
      lines.push(new URL(href, window.location.href).href)
      return lines.join('\n')
    },
  })
  const blob = new Blob([text], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  // The file name always uses the Swedish name (A2), so it doesn't change with the site's language.
  a.download = fileName(group || 'Alla grupper')
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Revoke after a generous delay: iOS opens the blob in a share sheet / new tab after the
  // click handler returns, and a 0 ms timer can fire before that read starts.
  setTimeout(() => URL.revokeObjectURL(url), 40_000)
}

// In the current season each session is tagged with the exception on its next occurrence within
// the coming 7 days, so a cancelled day is visible in the week itself. Other seasons stay raw.
const days = computed(() => {
  const baseDate = new Date()
  // Weekday of the base date, not the setup-time `today`: if the page stays open past midnight,
  // the offset below must still match the date it is added to.
  const base = weekday(baseDate)
  return [1, 2, 3, 4, 5, 6, 7].map((day) => ({
    day,
    sessions: filtered.value.filter((s) => s.day === day).map((s) => {
      if (!isCurrent.value) return s
      const date = new Date(baseDate)
      date.setDate(date.getDate() + ((day - base + 7) % 7))
      const iso = todayIso(date)
      // A date outside the season can't be cancelled — it's the next season's or a break's date.
      if (iso < season.value.from || iso > season.value.to) return s
      const exception = exceptionFor(iso, s.groups)
      return exception ? { ...s, exception } : s
    }),
    isToday: isCurrent.value && day === base,
  }))
})
</script>

<template>
  <div class="container page wide">
    <h1>{{ t('schedule.title') }}</h1>
    <DataNotice />

    <p v-if="state.status === 'loading' && !hasData" class="muted">{{ t('common.loading') }}</p>
    <p v-else-if="!season" class="muted">{{ t('schedule.empty') }}</p>

    <template v-else>
      <div class="season-bar">
        <div v-if="visibleSeasons.length > 1" class="seasons" role="group" :aria-label="t('schedule.season')">
          <button
            v-for="s in visibleSeasons"
            :key="s.name"
            type="button"
            :aria-pressed="s === season"
            :class="{ active: s === season }"
            @click="selectedName = s.name"
          >
            {{ localized(s.name, s.nameEn) }}
            <span v-if="s !== currentSeason" class="upcoming">{{ t('schedule.upcoming') }}</span>
          </button>
        </div>
        <h2 v-else class="season-name">{{ localized(season.name, season.nameEn) }}</h2>
        <p class="muted valid">
          {{ t('schedule.validFrom', { from: formatDate(season.from), to: formatDate(season.to) }) }}
        </p>
      </div>

      <div v-if="upcomingExceptions.length" class="exceptions">
        <h2>{{ t('schedule.exceptionsTitle') }}</h2>
        <ul>
          <li v-for="e in upcomingExceptions" :key="e.row">
            <strong>{{ formatWeekday(e.date, true) }}</strong> · <span class="muted">{{ e.groups.length ? groupNames(e.groups) : t('schedule.allGroups') }}</span>
            <div>{{ localized(e.message, e.messageEn) }}</div>
          </li>
        </ul>
      </div>

      <div v-if="groupsInSeason.length > 1" class="filters" :aria-label="t('schedule.filter')" role="group">
        <button type="button" :aria-pressed="!groupFilter" :class="{ active: !groupFilter }" @click="pickGroup('')">
          {{ t('schedule.allGroups') }}
        </button>
        <button
          v-for="group in groupsInSeason"
          :key="group.name"
          type="button"
          :aria-pressed="groupFilter === group.name"
          :class="{ active: groupFilter === group.name }"
          :style="groupStyle(group.name)"
          @click="pickGroup(groupFilter === group.name ? '' : group.name)"
        >
          <span class="dot"></span>{{ localized(group.name, group.nameEn) }}
        </button>
      </div>

      <div class="week">
        <section v-for="d in days" :key="d.day" class="day" :class="{ today: d.isToday, empty: !d.sessions.length }">
          <h2>
            {{ t('days')[d.day - 1] }}
            <span v-if="d.isToday" class="today-badge">{{ t('common.today') }}</span>
          </h2>
          <div class="list">
            <SessionItem v-for="(session, i) in d.sessions" :key="i" :session="session" compact />
            <p v-if="!d.sessions.length" class="none">{{ t('schedule.noSessions') }}</p>
          </div>
        </section>
      </div>

      <div class="page-actions">
        <RouterLink :to="{ name: 'posterSchedule', query: scheduleQuery(season, groupFilter) }" class="action-button">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          {{ t('poster.link') }}
        </RouterLink>
        <button v-if="calendarVisible" type="button" class="action-button" @click="downloadCalendar">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {{ t('schedule.addToCalendar') }}
        </button>
      </div>
      <p v-if="calendarVisible" class="calendar-note">{{ t('schedule.calendarNote') }}</p>
    </template>
  </div>
</template>

<style scoped>
/* Seven day columns need more room than the other pages. */
.wide {
  max-width: 1360px;
}

.page-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 24px;
  margin-top: 24px;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
}

.action-button:hover,
.action-button:focus-visible {
  border-color: var(--red);
  color: var(--link);
}

.calendar-note {
  margin: 6px 0 0;
  font-size: 0.85rem;
  color: var(--muted);
}

.season-bar {
  margin-bottom: 20px;
}

.season-name {
  margin-bottom: 4px;
}

.valid {
  margin: 8px 0 0;
}

.seasons,
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.seasons button,
.filters button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-weight: 600;
}

.seasons button.active {
  background: var(--text);
  border-color: var(--text);
  color: var(--paper);
}

.upcoming {
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.8;
}

.exceptions {
  margin-bottom: 24px;
  padding: 12px 16px;
  border: 1px solid var(--red);
  border-left: 4px solid var(--red);
  border-radius: 0 8px 8px 0;
  background: var(--surface);
}

.exceptions h2 {
  font-size: 1rem;
  margin: 0 0 6px;
}

.exceptions ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.filters {
  margin-bottom: 24px;
}

.filters button.active {
  border-color: var(--group-color, var(--text));
  box-shadow: inset 0 0 0 1px var(--group-color, var(--text));
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--group-color);
}

.week {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
}

.day {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 8px;
  min-width: 0;
}

.day :deep(.group) {
  font-size: 0.95rem;
}

.day h2 {
  font-size: 1rem;
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.day.today {
  background: var(--highlight);
  border-color: var(--red);
}

.today-badge {
  font-family: var(--font-body);
  font-size: 0.7rem;
  text-transform: uppercase;
  background: var(--red-strong);
  color: #fff;
  padding: 1px 8px;
  border-radius: 999px;
}

.list {
  display: grid;
  gap: 8px;
}

.none {
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted);
}

/* Below full width: day cards in one or two columns; empty days collapse to one line. */
@media (max-width: 1199px) {
  .week {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
    align-items: start;
  }

  .day.empty {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 8px 12px;
  }

  .day.empty h2 {
    margin: 0;
  }
}
</style>
