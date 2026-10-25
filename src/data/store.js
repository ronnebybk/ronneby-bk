import { reactive, computed } from 'vue'
import Papa from 'papaparse'
import config from '../config.js'
import * as demo from './demo.js'
import { parseSeasons, parseGroups, parseSessions, parseCoaches } from './parse.js'

const CACHE_KEY = 'rbt-data-v1'
const TABS = ['seasons', 'groups', 'schedule', 'coaches']

export const state = reactive({
  seasons: [],
  groups: [],
  sessions: [],
  coaches: [],
  // 'loading' | 'demo' | 'live' | 'cache' | 'error'
  status: 'loading',
})

export const hasData = computed(() => state.seasons.length > 0 || state.groups.length > 0)

export const isConfigured = Boolean(config.sheet.publishedId)

function apply(raw) {
  state.seasons = parseSeasons(raw.seasons)
  state.groups = parseGroups(raw.groups)
  state.sessions = parseSessions(raw.schedule)
  state.coaches = parseCoaches(raw.coaches)
}

function csvUrl(tab) {
  const { publishedId, gids } = config.sheet
  return `https://docs.google.com/spreadsheets/d/e/${publishedId}/pub?gid=${gids[tab]}&single=true&output=csv`
}

async function fetchTab(tab) {
  const response = await fetch(csvUrl(tab), { cache: 'no-store' })
  if (!response.ok) throw new Error(`${tab}: HTTP ${response.status}`)
  const text = await response.text()
  // A sheet that isn't published returns an HTML login page instead of CSV.
  if (text.trimStart().startsWith('<')) throw new Error(`${tab}: not published as CSV`)
  return Papa.parse(text, { header: true, skipEmptyLines: 'greedy' }).data
}

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY))
  } catch {
    return null
  }
}

function writeCache(raw) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(raw))
  } catch {}
}

let loading = null

// Shows the cached copy immediately (if any), then replaces it with fresh data from the sheet.
export function loadData() {
  if (loading) return loading

  if (!isConfigured) {
    apply(demo)
    state.status = 'demo'
    return (loading = Promise.resolve())
  }

  // Status stays 'loading' while the cached copy is shown; 'cache' means the refresh failed.
  const cached = readCache()
  if (cached) apply(cached)

  loading = Promise.all(TABS.map(fetchTab))
    .then(([seasons, groups, schedule, coaches]) => {
      const raw = { seasons, groups, schedule, coaches }
      apply(raw)
      writeCache(raw)
      state.status = 'live'
    })
    .catch((error) => {
      console.error('Could not load sheet data', error)
      state.status = cached ? 'cache' : 'error'
    })
  return loading
}

// --- Dates -------------------------------------------------------------------

export function todayIso(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Monday = 1 … Sunday = 7
export function weekday(date = new Date()) {
  return ((date.getDay() + 6) % 7) + 1
}

// --- Derived data ------------------------------------------------------------

// The season covering today; otherwise the next one to start; otherwise the most recent.
export const currentSeason = computed(() => {
  const today = todayIso()
  const { seasons } = state
  return (
    seasons.find((s) => s.from <= today && today <= s.to) ??
    seasons.find((s) => s.from > today) ??
    seasons[seasons.length - 1] ??
    null
  )
})

// Seasons that are current or still to come, for the schedule page's season picker.
export const visibleSeasons = computed(() => {
  const today = todayIso()
  return state.seasons.filter((s) => s.to >= today || s === currentSeason.value)
})

export function sessionsFor(season) {
  if (!season) return []
  return state.sessions.filter((s) => s.season === season.name)
}

export function findGroup(name) {
  return state.groups.find((g) => g.name === name)
}

// Today's sessions, plus the next session after now when there's nothing left today.
export const todayInfo = computed(() => {
  const sessions = sessionsFor(currentSeason.value)
  const now = new Date()
  const day = weekday(now)
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const today = sessions.filter((s) => s.day === day)
  let next = null
  if (sessions.length) {
    for (let offset = 0; offset < 8 && !next; offset++) {
      const d = ((day - 1 + offset) % 7) + 1
      next = sessions.find((s) => s.day === d && (offset > 0 || s.start > time)) ?? null
    }
  }
  return { today, next }
})

// A stable colour per group, in sheet order.
export function groupColorIndex(name) {
  const index = state.groups.findIndex((g) => g.name === name)
  return index === -1 ? 0 : index % 6
}
