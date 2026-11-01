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
