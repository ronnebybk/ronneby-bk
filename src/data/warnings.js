// Pure warning checks for the admin page: which names in one tab don't exist in another.
// No Vue, no imports from app code, so it runs in plain node for evidence scripts.
// Row numbers are the sheet's own (header = row 1), carried through by the parsers.

// Names equal ignoring capitals and extra spaces — the "did you mean" key (D7) and AC5 grouping.
const keyOf = (name) => name.toLowerCase().replace(/\s+/g, ' ')

// First known name that matches `name` on the key but isn't spelled the same, or null.
function suggestionFor(name, knownNames) {
  const key = keyOf(name)
  return knownNames.find((known) => keyOf(known) === key && known !== name) ?? null
}

function addRow(map, name, row) {
  if (!map.has(name)) map.set(name, new Set())
  map.get(name).add(row)
}

// One warning per (kind, tab, name), rows sorted ascending without duplicates (D4).
function warningsFrom(map, kind, tab, knownNames) {
  return [...map.entries()].map(([name, rows]) => ({
    kind,
    tab,
    rows: [...rows].sort((a, b) => a - b),
    name,
    suggestion: suggestionFor(name, knownNames),
  }))
}

// AC1–AC5. `today` is an ISO date string; only sessions in a season that covers today or ends
// later are name-checked (D3), so old rows full of retired names stay quiet.
export function nameWarnings({ seasons, groups, sessions, coaches }, today) {
  const groupNames = groups.map((g) => g.name)
  const coachNames = coaches.map((c) => c.name)
  const seasonByName = new Map(seasons.map((s) => [s.name, s]))

  const schemaGroups = new Map()
  const schemaSeasons = new Map()
  const schemaCoaches = new Map()
  const coachGroups = new Map()

  for (const session of sessions) {
    const season = seasonByName.get(session.season)
    // AC2: unknown season warns only when Säsonger isn't empty (D6); such rows get no name checks.
    if (!season) {
      if (seasons.length > 0) addRow(schemaSeasons, session.season, session.row)
      continue
    }
    if (season.to < today) continue
    for (const group of session.groups) {
      if (!groupNames.includes(group)) addRow(schemaGroups, group, session.row)
    }
    // D1: Tränare is a comma list; every name must be a coach, free text included.
    for (const coach of session.coach.split(',').map((c) => c.trim()).filter(Boolean)) {
      if (!coachNames.includes(coach)) addRow(schemaCoaches, coach, session.row)
    }
  }

  // AC4: a coach's Grupper list may name groups that don't exist.
  for (const coach of coaches) {
    for (const group of coach.groups) {
      if (!groupNames.includes(group)) addRow(coachGroups, group, coach.row)
    }
  }

  // AC5: group names spelled differently only in capitals/spaces become separate groups.
  const byKey = new Map()
  for (const group of groups) {
    const key = keyOf(group.name)
    if (!byKey.has(key)) byKey.set(key, [])
    byKey.get(key).push(group)
  }
  const groupCase = []
  for (const sameKey of byKey.values()) {
    const spellings = [...new Set(sameKey.map((g) => g.name))]
    if (spellings.length < 2) continue
    groupCase.push({
      kind: 'group-case',
      spellings: spellings.map((name) => ({
        name,
        rows: sameKey.filter((g) => g.name === name).flatMap((g) => g.rows),
      })),
    })
  }

  // Order: Schema, then Tränare, then Grupper.
  return [
    ...warningsFrom(schemaGroups, 'unknown-group', 'Schema', groupNames),
    ...warningsFrom(schemaSeasons, 'unknown-season', 'Schema', seasons.map((s) => s.name)),
    ...warningsFrom(schemaCoaches, 'unknown-coach', 'Schema', coachNames),
    ...warningsFrom(coachGroups, 'unknown-group', 'Tränare', groupNames),
    ...groupCase,
  ]
}

// --- Skipped-row warnings (#40) -------------------------------------------------

// Sheet tab order for sorting row warnings (D10): new warnings first, in this order, then by row.
const TAB_ORDER = ['Schema', 'Säsonger', 'Grupper', 'Tränare', 'Anslag', 'Klubbinfo', 'Prova på', 'Frågor', 'Dokument', 'Evenemang', 'Resultat', 'Sponsorer']

// Swedish tab name → sheet key (config.gids key), for the admin page's jump-to-tab (D9).
export const TAB_SHEET_KEY = {
  Schema: 'schedule',
  Säsonger: 'seasons',
  Grupper: 'groups',
  Tränare: 'coaches',
  Anslag: 'notices',
  Klubbinfo: 'club',
  'Prova på': 'trial',
  Frågor: 'faq',
  Dokument: 'documents',
  Evenemang: 'events',
  Resultat: 'results',
  Sponsorer: 'sponsors',
}

// D1: group problems by tab + reason + column + value → one warning with all rows, sorted unique.
// D10: order by sheet tab order, then first row.
export function rowWarnings(problems) {
  const groups = new Map()
  for (const p of problems) {
    const key = `${p.tab}|${p.reason}|${p.column ?? ''}|${String(p.value ?? '')}`
    if (!groups.has(key)) groups.set(key, { tab: p.tab, reason: p.reason, column: p.column, value: p.value, rows: new Set() })
    groups.get(key).rows.add(p.row)
  }
  return [...groups.values()]
    .map((g) => ({ kind: 'row', tab: g.tab, reason: g.reason, column: g.column, value: g.value, rows: [...g.rows].sort((a, b) => a - b) }))
    .sort((a, b) => {
      const ta = TAB_ORDER.indexOf(a.tab)
      const tb = TAB_ORDER.indexOf(b.tab)
      if (ta !== tb) return (ta === -1 ? 99 : ta) - (tb === -1 ? 99 : tb)
      return a.rows[0] - b.rows[0]
    })
}

// --- Season status -----------------------------------------------------------

const DAY_MS = 24 * 60 * 60 * 1000

// ISO strings parsed as UTC, so DST can't shift the day count.
function daysBetween(fromIso, toIso) {
  const [fy, fm, fd] = fromIso.split('-').map(Number)
  const [ty, tm, td] = toIso.split('-').map(Number)
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / DAY_MS)
}

// AC6 (D2) and AC7 (D8). `today` is an ISO date string.
export function seasonWarnings(seasons, today) {
  const current = seasons.find((s) => s.from <= today && today <= s.to) ?? null
  const warnings = []
  // AC6: nothing covers today and no season starts after today — but a later season during a
  // break is fine (D2), so this only fires when there is no current and no upcoming season.
  if (!current && !seasons.some((s) => s.from > today)) {
    warnings.push({ kind: 'no-season' })
  }
  // AC7 (D8): the current season ends within 21 days and no season starts after it.
  if (current && daysBetween(today, current.to) <= 21 && !seasons.some((s) => s.from > current.from)) {
    warnings.push({ kind: 'season-ending', name: current.name, nameEn: current.nameEn, to: current.to })
  }
  return warnings
}
