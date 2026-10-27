<script setup>
import { computed, ref, watch } from 'vue'
import SessionItem from '../components/SessionItem.vue'
import DataNotice from '../components/DataNotice.vue'
import { state, hasData, currentSeason, visibleSeasons, sessionsFor, weekday, groupColorIndex } from '../data/store.js'
import { useI18n } from '../i18n/index.js'

const { t, localized, formatDate } = useI18n()

const selectedName = ref(null)
const groupFilter = ref('')

// Follow the current season until the visitor picks another one.
const season = computed(
  () => visibleSeasons.value.find((s) => s.name === selectedName.value) ?? currentSeason.value,
)
watch(season, () => (groupFilter.value = ''))

const sessions = computed(() => sessionsFor(season.value))
const groupsInSeason = computed(() => {
  const names = new Set(sessions.value.flatMap((s) => s.groups))
  return state.groups.filter((g) => names.has(g.name))
})
const filtered = computed(() =>
  groupFilter.value ? sessions.value.filter((s) => s.groups.includes(groupFilter.value)) : sessions.value,
)

const today = weekday()
const isCurrent = computed(() => season.value === currentSeason.value)

const days = computed(() =>
  [1, 2, 3, 4, 5, 6, 7].map((day) => ({
    day,
    sessions: filtered.value.filter((s) => s.day === day),
    isToday: isCurrent.value && day === today,
  })),
)
</script>

<template>
  <div class="container page wide">
    <h1>{{ t('schedule.title') }}</h1>
    <DataNotice />

    <p v-if="state.status === 'loading' && !hasData" class="muted">{{ t('common.loading') }}</p>
    <p v-else-if="!season" class="muted">{{ t('schedule.empty') }}</p>

    <template v-else>
      <div class="season-bar">
        <div v-if="visibleSeasons.length > 1" class="seasons" role="tablist" :aria-label="t('schedule.season')">
          <button
            v-for="s in visibleSeasons"
            :key="s.name"
            type="button"
            role="tab"
            :aria-selected="s === season"
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

      <div v-if="groupsInSeason.length > 1" class="filters" :aria-label="t('schedule.filter')" role="group">
        <button type="button" :class="{ active: !groupFilter }" @click="groupFilter = ''">
          {{ t('schedule.allGroups') }}
        </button>
        <button
          v-for="group in groupsInSeason"
          :key="group.name"
          type="button"
          :class="{ active: groupFilter === group.name }"
          :style="{ '--group-color': `var(--group-${groupColorIndex(group.name)})` }"
          @click="groupFilter = groupFilter === group.name ? '' : group.name"
        >
          <span class="dot"></span>{{ localized(group.name, group.nameEn) }}
        </button>
      </div>

      <div class="week">
        <section v-for="d in days" :key="d.day" class="day" :class="{ today: d.isToday, empty: !d.sessions.length }">
          <h3>
            {{ t('days')[d.day - 1] }}
            <span v-if="d.isToday" class="today-badge">{{ t('common.today') }}</span>
          </h3>
          <div class="list">
            <SessionItem v-for="(session, i) in d.sessions" :key="i" :session="session" />
            <p v-if="!d.sessions.length" class="none">{{ t('schedule.noSessions') }}</p>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Seven day columns need more room than the other pages. */
.wide {
  max-width: 1360px;
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

.day h3 {
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

  .day.empty h3 {
    margin: 0;
  }
}
</style>
