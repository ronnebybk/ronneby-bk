import { reactive, computed } from 'vue'
import Papa from 'papaparse'
import config from '../config.js'
import * as demo from './demo.js'
import { loadJson, saveJson } from './storage.js'
import { localized } from '../i18n/index.js'
import { parseSeasons, parseGroups, parseSessions, parseCoaches, parseNotices, isNoticeActive, parseClub } from './parse.js'

const CACHE_KEY = 'rbt-data-v1'
// A stalled request must not keep the whole site — or an optional tab — loading forever.
const FETCH_TIMEOUT_MS = 10000
const TABS = ['seasons', 'groups', 'schedule', 'coaches']

export const state = reactive({
  seasons: [],
  groups: [],
  sessions: [],
  coaches: [],
  notices: [],
  // Contact details, venue and social links from the Klubbinfo tab; a missing setting is absent.
  club: {},
  // 'loading' | 'demo' | 'live' | 'cache' | 'error'
  status: 'loading',
})

export const hasData = computed(() => state.seasons.length > 0 || state.groups.length > 0)

const isConfigured = Boolean(config.sheet.publishedId)

function apply(raw) {
  state.seasons = parseSeasons(raw.seasons)
  state.groups = parseGroups(raw.groups)
  state.sessions = parseSessions(raw.schedule)
  state.coaches = parseCoaches(raw.coaches)
  // A cache written before these optional tabs existed has no such fields.
  state.notices = parseNotices(raw.notices ?? [])
  state.club = parseClub(raw.club ?? [])
}

// Accepts the bare ID or a whole pasted "Publish to web" link.
const publishedId = config.sheet.publishedId.match(/2PACX-[\w-]+/)?.[0] ?? config.sheet.publishedId

function csvUrl(tab) {
  return `https://docs.google.com/spreadsheets/d/e/${publishedId}/pub?gid=${config.sheet.gids[tab]}&single=true&output=csv`
}

async function fetchTab(tab) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const response = await fetch(csvUrl(tab), { cache: 'no-store', signal: controller.signal })
    if (!response.ok) throw new Error(`${tab}: HTTP ${response.status}`)
    const text = await response.text()
    // A sheet that isn't published returns an HTML login page instead of CSV.
    if (text.trimStart().startsWith('<')) throw new Error(`${tab}: not published as CSV`)
    return Papa.parse(text, { header: true, skipEmptyLines: 'greedy' }).data
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error(`${tab}: timed out after ${FETCH_TIMEOUT_MS / 1000}s`)
    throw error
  } finally {
    clearTimeout(timer)
  }
}

// The notices and Klubbinfo tabs are optional: if one is missing, unpublished or broken, the rest
// of the site must still load. Fall back to the cached copy so "cancelled tonight" survives a
// Google hiccup.
async function fetchOptional(tab, cached) {
  if (!config.sheet.gids[tab]) return []
  try {
    return await fetchTab(tab)
  } catch (error) {
    console.error(`Could not load ${tab}`, error)
    return cached?.[tab] ?? []
  }
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
  const cached = loadJson(CACHE_KEY)
  if (cached) apply(cached)

  loading = Promise.all([...TABS.map(fetchTab), fetchOptional('notices', cached), fetchOptional('club', cached)])
    .then(([seasons, groups, schedule, coaches, notices, club]) => {
      const raw = { seasons, groups, schedule, coaches, notices, club }
      apply(raw)
      saveJson(CACHE_KEY, raw)
      state.status = 'live'
    })
    .catch((error) => {
      console.error('Could not load sheet data', error)
      state.status = cached ? 'cache' : 'error'
    })
  return loading
}

// --- Dates -------------------------------------------------------------------

function todayIso(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Monday = 1 … Sunday = 7
export function weekday(date = new Date()) {
  return ((date.getDay() + 6) % 7) + 1
}

// --- Derived data ------------------------------------------------------------

// Banner notices that should be shown today, in sheet order.
export const activeNotices = computed(() => {
  const today = todayIso()
  return state.notices.filter((notice) => notice.type === 'notice' && isNoticeActive(notice, today))
})

// News that should be shown today: newest first, undated ones last in sheet order (sort is stable).
export const activeNews = computed(() => {
  const today = todayIso()
  return state.notices
    .filter((item) => item.type === 'news' && isNoticeActive(item, today))
    .sort((a, b) => (b.from ?? '').localeCompare(a.from ?? ''))
})

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

// The group's English name when the site is in English and the sheet has one.
export function groupName(name) {
  return localized(name, findGroup(name)?.nameEn)
}

export function groupNames(names) {
  return names.map(groupName).join(', ')
}

export function timeRange(session) {
  return session.end ? `${session.start}–${session.end}` : session.start
}

function seasonOn(iso) {
  return state.seasons.find((s) => s.from <= iso && iso <= s.to) ?? null
}

// Today's sessions, plus the next session once nothing is left today. Walks real dates rather
// than weekdays, so breaks between seasons and season changes are respected.
export const todayInfo = computed(() => {
  const now = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const todaySeason = seasonOn(todayIso(now))
  const today = sessionsFor(todaySeason).filter((s) => s.day === weekday(now))
  if (today.some((s) => s.start > time)) return { today, next: null }

  const lastDay = state.seasons.reduce((max, s) => (s.to > max ? s.to : max), '')
  for (let offset = 1; ; offset++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
    const iso = todayIso(date)
    if (iso > lastDay) break
    const session = sessionsFor(seasonOn(iso)).find((s) => s.day === weekday(date))
    if (session) return { today, next: { session, date: iso, offset } }
  }
  return { today, next: null }
})

// A stable colour per group, in sheet order.
export function groupColorIndex(name) {
  const index = state.groups.findIndex((g) => g.name === name)
  return index === -1 ? 0 : index % 6
}
