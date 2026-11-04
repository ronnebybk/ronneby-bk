import { reactive, computed } from 'vue'
import Papa from 'papaparse'
import config from '../config.js'
import * as demo from './demo.js'
import { loadJson, saveJson } from './storage.js'
import { localized, t } from '../i18n/index.js'
import { parseSeasons, parseGroups, parseSessions, parseExceptions, parseCoaches, parseNotices, isNoticeActive, parseClub, parseTrial, parseFaq, parseDocuments, parseResults, parseSponsors, parseEvents, parseAlbums, pickCurrentSeason } from './parse.js'
import { buildEvents, splitEvents } from './events.js'
import { nameWarnings, seasonWarnings, rowWarnings } from './warnings.js'
import { preview, isPreviewOn, setPreviewFlag, setPreviewTab, adminKey } from './preview.js'
import { toIso, weekday } from './dates.js'

const CACHE_KEY = 'rbt-data-v1'
// A stalled request must not keep the whole site — or an optional tab — loading forever.
const FETCH_TIMEOUT_MS = 10000
const TABS = ['seasons', 'groups', 'schedule', 'coaches']

export const state = reactive({
  seasons: [],
  groups: [],
  sessions: [],
  // Cancelled dates from the Undantag tab; empty until the tab exists in the sheet.
  exceptions: [],
  coaches: [],
  faq: [],
  // Official documents grouped by category from the Dokument tab.
  documents: [],
  // Results from the Resultat tab; empty hides the page's nav link.
  results: [],
  // Events from the Evenemang tab; empty until the tab exists in the sheet.
  events: [],
  // Photo albums from the Album tab; empty hides the Bilder page's nav link.
  albums: [],
  notices: [],
  // Contact details, venue and social links from the Klubbinfo tab; a missing setting is absent.
  club: {},
  // Sections for the Prova på page; empty means the page's built-in text.
  trial: [],
  // Sponsors from the Sponsorer tab; empty hides the home page section and the footer link.
  sponsors: [],
  // Rows the parsers skipped or values they dropped, for the admin page's warnings box (#40).
  rowProblems: [],
  // 'loading' | 'demo' | 'live' | 'cache' | 'error'
  status: 'loading',
})

export const hasData = computed(() => state.seasons.length > 0 || state.groups.length > 0)

const isConfigured = Boolean(config.sheet.publishedId)

function apply(raw) {
  const problems = []
  state.seasons = parseSeasons(raw.seasons, problems)
  state.groups = parseGroups(raw.groups, problems)
  state.sessions = parseSessions(raw.schedule, problems)
  state.exceptions = parseExceptions(raw.exceptions ?? [], problems)
  state.coaches = parseCoaches(raw.coaches, problems)
  // A cache written before these optional tabs existed has no such fields.
  state.notices = parseNotices(raw.notices ?? [], problems)
  state.club = parseClub(raw.club ?? [], problems)
  state.trial = parseTrial(raw.trial ?? [], problems)
  state.faq = parseFaq(raw.faq ?? [], problems)
  state.documents = parseDocuments(raw.documents ?? [], problems)
  state.results = parseResults(raw.results ?? [], problems)
  state.events = parseEvents(raw.events ?? [], problems)
  state.albums = parseAlbums(raw.albums ?? [], problems)
  state.sponsors = parseSponsors(raw.sponsors ?? [], problems)
  state.rowProblems = problems
}

// Accepts the bare ID or a whole pasted "Publish to web" link.
const publishedId = config.sheet.publishedId.match(/2PACX-[\w-]+/)?.[0] ?? config.sheet.publishedId

function csvUrl(tab) {
  return `https://docs.google.com/spreadsheets/d/e/${publishedId}/pub?gid=${config.sheet.gids[tab]}&single=true&output=csv`
}

// The edit-ID variant reads the sheet's current, unpublished content (same plain CSV format).
function exportUrl(tab) {
  return `https://docs.google.com/spreadsheets/d/${adminKey()}/export?format=csv&gid=${config.sheet.gids[tab]}`
}

async function fetchTab(tab, url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const response = await fetch(url ?? csvUrl(tab), { cache: 'no-store', signal: controller.signal })
    if (!response.ok) throw new Error(`${tab}: HTTP ${response.status}`)
    const text = await response.text()
    // A sheet that isn't published returns an HTML login page instead of CSV.
    if (text.trimStart().startsWith('<')) throw new Error(`${tab}: not published as CSV`)
    // Tag every row with its sheet row number (header = row 1) before dropping blank rows,
    // so warnings can point at the real row even when blank rows shift the indices.
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: false }).data
    return parsed
      .map((row, i) => ({ ...row, _row: i + 2 }))
      .filter((row) => Object.entries(row).some(([key, value]) => key !== '_row' && String(value ?? '').trim() !== ''))
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error(`${tab}: timed out after ${FETCH_TIMEOUT_MS / 1000}s`)
    throw error
  } finally {
    clearTimeout(timer)
  }
}

// These tabs are optional: if one is missing, unpublished or broken, the rest of the site must
// still load. Fall back to the cached copy so "cancelled tonight" survives a Google hiccup.
async function fetchOptional(tab, cached, url) {
  if (!config.sheet.gids[tab]) return []
  try {
    return await fetchTab(tab, url)
  } catch (error) {
    console.error(`Could not load ${tab}`, error)
    return cached?.[tab] ?? []
  }
}

let loading = null
// Bumped on every preview start/refresh/end; a load that finishes after a newer one started is dropped.
let generation = 0
// The last preview that loaded successfully, so a tab that fails on refresh falls back to the
// editor's unpublished rows instead of jumping back to older published content.
let lastPreviewRaw = null

// Published load, shared by loadData() and the preview fallback so the two can't drift apart.
// The generation guard drops the result when a newer load started while this one was in flight.
// Shows the cached copy immediately, then replaces it with fresh data from the sheet.
function loadPublished(gen) {
  const cached = loadJson(CACHE_KEY)
  if (cached) apply(cached)
  return Promise.all([
    ...TABS.map((tab) => fetchTab(tab)),
    fetchOptional('notices', cached),
    fetchOptional('club', cached),
    fetchOptional('trial', cached),
    fetchOptional('faq', cached),
    fetchOptional('documents', cached),
    fetchOptional('results', cached),
    fetchOptional('events', cached),
    fetchOptional('albums', cached),
    fetchOptional('sponsors', cached),
    fetchOptional('exceptions', cached),
  ])
    .then(([seasons, groups, schedule, coaches, notices, club, trial, faq, documents, results, events, albums, sponsors, exceptions]) => {
      if (gen !== generation) return
      const raw = { seasons, groups, schedule, coaches, notices, club, trial, faq, documents, results, events, albums, sponsors, exceptions }
      apply(raw)
      saveJson(CACHE_KEY, raw)
      state.status = 'live'
    })
    .catch((error) => {
      if (gen !== generation) return
      console.error('Could not load sheet data', error)
      state.status = cached ? 'cache' : 'error'
    })
}

// Preview load: reads every tab from the unpublished export URL. Never writes to the visitor cache.
async function loadPreview() {
  const gen = ++generation
  preview.loading = true
  const cached = loadJson(CACHE_KEY)
  preview.error = false
  preview.failedTabs = []
  preview.fallback = false

  const required = TABS.map((tab) => fetchTab(tab, exportUrl(tab)))
  const optional = ['notices', 'club', 'trial', 'faq', 'documents', 'results', 'events', 'albums', 'sponsors', 'exceptions']
    .filter((tab) => config.sheet.gids[tab])
    .map((tab) => {
      const promise = fetchTab(tab, exportUrl(tab))
      // Awaited below; the no-op keeps an early bail-out (failed required tab, superseded load)
      // from surfacing an unhandled rejection.
      promise.catch(() => {})
      return { tab, promise }
    })

  try {
    const requiredResults = await Promise.all(required)
    if (gen !== generation) return

    const optionalResults = await Promise.all(
      optional.map(async ({ tab, promise }) => {
        try {
          return { tab, rows: await promise }
        } catch (error) {
          console.error(`Preview: could not load ${tab}`, error)
          if (gen !== generation) return null
          preview.failedTabs.push(tab)
          // Fall back to the last preview's rows for this tab, else the published cache.
          return { tab, rows: lastPreviewRaw?.[tab] ?? cached?.[tab] ?? [] }
        }
      }),
    )
    if (gen !== generation) return

    const [seasons, groups, schedule, coaches] = requiredResults
    const raw = { seasons, groups, schedule, coaches }
    for (const r of optionalResults) {
      if (r) raw[r.tab] = r.rows
    }
    apply(raw)
    state.status = 'preview'
    lastPreviewRaw = raw
    preview.loadedAt = new Date()
  } catch (error) {
    if (gen !== generation) return
    console.error('Preview load failed', error)
    preview.error = true
    if (!preview.loadedAt) {
      // No preview has loaded yet: fall back to the published path so the page isn't empty.
      preview.fallback = true
      loading = loadPublished(gen)
    }
  } finally {
    // A superseded load leaves the flag to the newer one.
    if (gen === generation) preview.loading = false
  }
}

export function startPreview() {
  if (!isPreviewOn()) {
    setPreviewFlag(true)
    preview.on = true
  }
  preview.loadedAt = null
  preview.error = false
  preview.failedTabs = []
  preview.fallback = false
  lastPreviewRaw = null
  loading = null
  loadPreview()
}

export function refreshPreview() {
  if (!preview.on) return
  loading = null
  loadPreview()
}

export function endPreview() {
  generation++
  setPreviewFlag(false)
  setPreviewTab('')
  preview.on = false
  preview.loadedAt = null
  preview.loading = false
  preview.error = false
  preview.failedTabs = []
  preview.fallback = false
  lastPreviewRaw = null
  loading = null
  loadData()
}

// Shows the cached copy immediately (if any), then replaces it with fresh data from the sheet.
export function loadData() {
  if (loading) return loading

  if (!isConfigured) {
    apply(demo)
    state.status = 'demo'
    return (loading = Promise.resolve())
  }

  // Preview mode: load from the unpublished export URL instead of the published one.
  if (isPreviewOn()) {
    preview.on = true
    loading = loadPreview()
    return loading
  }

  // Status stays 'loading' while the cached copy is shown; 'cache' means the refresh failed.
  // The generation guard drops this load if a preview started while it was in flight.
  loading = loadPublished(generation)
  return loading
}

// --- Dates -------------------------------------------------------------------

// Re-exported so the views that import them from store.js don't change.
export { toIso as todayIso, weekday }

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

// Event cards with results attached; undated events are always upcoming (D9).
export const eventCards = computed(() => buildEvents(state.events, state.results, todayIso()))

// Kommande (dated soonest first, undated last) and Tidigare grouped by year.
export const eventSplit = computed(() => splitEvents(eventCards.value))

// The next dated upcoming event for the home page; undated events are never used (AC9).
export const nextEvent = computed(() => eventSplit.value.upcoming.find((card) => card.date) ?? null)

// Admin warnings (AC10): event rows with date problems, and results whose Tävling matches no event.
// D8: each event warning carries the event's sheet row.
export const eventWarnings = computed(() => {
  const warnings = []
  for (const event of state.events) {
    for (const problem of event.problems) {
      warnings.push({ kind: 'event', problem, title: event.title, titleEn: event.titleEn, row: event.row })
    }
  }
  const matched = new Set(state.events.map((event) => event.title))
  const seen = new Set()
  for (const result of state.results) {
    if (matched.has(result.competition) || seen.has(result.competition)) continue
    seen.add(result.competition)
    warnings.push({ kind: 'unmatched-result', competition: result.competition, competitionEn: result.competitionEn })
  }
  return warnings
})

// Name mismatches between tabs and season status problems, for the admin page's warnings box.
// D10: skipped-row warnings come first, then #15's name/season warnings.
export const dataWarnings = computed(() => [
  ...rowWarnings(state.rowProblems),
  ...nameWarnings({ seasons: state.seasons, groups: state.groups, sessions: state.sessions, coaches: state.coaches, exceptions: state.exceptions }, todayIso()),
  ...seasonWarnings(state.seasons, todayIso()),
])

// Medal counts for the current year, for the summary at the top of the results page.
// The year rides along so the view and the count can't disagree about "current".
export const medalCount = computed(() => {
  const year = todayIso().slice(0, 4)
  const count = { year, gold: 0, silver: 0, bronze: 0 }
  for (const result of state.results) {
    if (result.date.startsWith(year) && result.medal) count[result.medal]++
  }
  return count
})

// The season covering today; otherwise the next one to start; otherwise the most recent.
export const currentSeason = computed(() => pickCurrentSeason(state.seasons, todayIso()))

// Seasons that are current or still to come, for the schedule page's season picker.
export const visibleSeasons = computed(() => {
  const today = todayIso()
  return state.seasons.filter((s) => s.to >= today || s === currentSeason.value)
})

export function sessionsFor(season) {
  if (!season) return []
  return state.sessions.filter((s) => s.season === season.name)
}

// The chosen season (the current one until `nameRef` names another visible season), its sessions
// and the groups that have sessions in it; shared by the schedule page and its poster.
export function useSeasonSchedule(nameRef) {
  const season = computed(() => visibleSeasons.value.find((s) => s.name === nameRef.value) ?? currentSeason.value)
  const sessions = computed(() => sessionsFor(season.value))
  const groupsInSeason = computed(() => {
    const names = new Set(sessions.value.flatMap((s) => s.groups))
    return state.groups.filter((g) => names.has(g.name))
  })
  return { season, sessions, groupsInSeason }
}

// The posters' Prova på box (Klubbinfo "Affisch prova på"); empty means no box.
export const posterTrial = computed(() => localized(state.club.posterTrial, state.club.posterTrialEn))

// The "how to join" text from Klubbinfo, or the built-in one; shared by the contact page and the groups poster.
export const joinText = computed(() => localized(state.club.join, state.club.joinEn) || t('contact.joinText'))

// Query for a link to the schedule page or its poster: the season only when it isn't the current one,
// so a link stays right when the seasons roll over. Between seasons the next one counts as current, so
// a poster printed then may open another season if the sheet later adds one that starts earlier.
export function scheduleQuery(season, group) {
  const query = {}
  if (season && season.name !== currentSeason.value?.name) query.sasong = season.name
  if (group) query.grupp = group
  return query
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

// "600 kr / termin · 2 000 kr / år", or "Gratis"; shared by the groups page and its poster.
export function priceText(group) {
  return group.prices
    .map(({ price, period }) =>
      price === 0
        ? t('common.free')
        : t('groups.perPeriod', { price: price.toLocaleString('sv-SE'), period: t(`periods.${period}`) }),
    )
    .join(' · ')
}

export function timeRange(session) {
  return session.end ? `${session.start}–${session.end}` : session.start
}

function seasonOn(iso) {
  return state.seasons.find((s) => s.from <= iso && iso <= s.to) ?? null
}

// Exceptions for one date (YYYY-MM-DD), earliest first.
export function exceptionsOn(iso) {
  return state.exceptions.filter((e) => e.date === iso)
}

// The exception cancelling a session on a date: an empty Grupp list cancels every group.
export function exceptionFor(iso, groups) {
  return exceptionsOn(iso).find((e) => !e.groups.length || e.groups.some((g) => groups.includes(g))) ?? null
}

// Exceptions from today onward, for the schedule page's cancellation list.
export const upcomingExceptions = computed(() => {
  const today = todayIso()
  return state.exceptions.filter((e) => e.date >= today)
})

// Today's sessions (each carrying its cancelling exception, if any), plus the next real session
// once nothing real is left today — cancelled sessions are shown on their own card, never as
// "next". Walks real dates rather than weekdays, so breaks between seasons and season changes are
// respected.
export const todayInfo = computed(() => {
  const now = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const todayIsoNow = todayIso(now)
  const todaySeason = seasonOn(todayIsoNow)
  const today = sessionsFor(todaySeason)
    .filter((s) => s.day === weekday(now))
    .map((s) => {
      const exception = exceptionFor(todayIsoNow, s.groups)
      return exception ? { ...s, exception } : s
    })
  if (today.some((s) => !s.exception && s.start > time)) return { today, next: null }

  const lastDay = state.seasons.reduce((max, s) => (s.to > max ? s.to : max), '')
  for (let offset = 1; ; offset++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
    const iso = todayIso(date)
    if (iso > lastDay) break
    const session = sessionsFor(seasonOn(iso)).find((s) => s.day === weekday(date))
    // A cancelled session is not "the next one" — keep walking to the first real session.
    if (session && !exceptionFor(iso, session.groups)) return { today, next: { session, date: iso, offset } }
  }
  return { today, next: null }
})

// A stable colour per group, in sheet order.
export function groupColorIndex(name) {
  const index = state.groups.findIndex((g) => g.name === name)
  return index === -1 ? 0 : index % 6
}

// The group's colour and the text colour that reads on it, as CSS variables for filled labels.
export function groupStyle(name) {
  const index = groupColorIndex(name)
  return { '--group-color': `var(--group-${index})`, '--group-ink': `var(--group-${index}-ink)` }
}
