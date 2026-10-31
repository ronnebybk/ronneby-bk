// Pure event logic (no Vue), so it can be exercised with plain node.

// Deep-link slug from the title: lowercase, diacritics folded, non-alphanumerics to dashes.
export function eventSlug(title) {
  return (
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'evenemang'
  )
}

// Stable deep-link ids: slug(title) + '-<year>' when dated, with -2, -3 … on collisions in sheet order.
function assignIds(cards) {
  const used = new Map()
  for (const card of cards) {
    const base = card.date ? `${eventSlug(card.title)}-${card.date.slice(0, 4)}` : eventSlug(card.title)
    const n = used.get(base) ?? 0
    used.set(base, n + 1)
    card.id = n === 0 ? base : `${base}-${n + 1}`
  }
}

// One card per event, with results attached (D2): a result goes to the event whose Rubrik equals
// its Tävling in the result's year, otherwise to the first undated event with that title.
// Results matching no event build a fallback competition card per Tävling + year, so no result
// disappears. Undated events are always upcoming; a dated event is past once its end (or start)
// day is before today.
export function buildEvents(events, results, today) {
  const cards = events.map((event) => ({
    ...event,
    upcoming: event.date ? (event.end ?? event.date) >= today : true,
    year: event.date ? event.date.slice(0, 4) : null,
    results: [],
    medals: { gold: 0, silver: 0, bronze: 0 },
    fromResults: false,
  }))
  const fallback = new Map()
  for (const result of results) {
    const year = result.date.slice(0, 4)
    let card = cards.find((c) => c.title === result.competition && c.year === year)
    if (!card) card = cards.find((c) => c.title === result.competition && !c.date)
    if (card) {
      card.results.push(result)
      continue
    }
    const key = `${result.competition} ${year}`
    let fb = fallback.get(key)
    if (!fb) {
      fb = {
        type: 'competition',
        title: result.competition,
        titleEn: result.competitionEn,
        date: result.date,
        end: null,
        dateText: result.date,
        time: '',
        timeEn: '',
        place: result.place,
        placeEn: '',
        description: '',
        descriptionEn: '',
        images: [],
        link: '',
        problems: [],
        fromResults: true,
        upcoming: false,
        year,
        results: [],
        medals: { gold: 0, silver: 0, bronze: 0 },
      }
      fallback.set(key, fb)
    }
    fb.results.push(result)
    if (result.date < fb.date) fb.date = result.date
    fb.place ||= result.place
  }
  const all = [...cards, ...fallback.values()]
  assignIds(all)
  for (const card of all) {
    for (const result of card.results) {
      if (result.medal) card.medals[result.medal]++
    }
  }
  return all
}

// Upcoming first (dated soonest first, undated last in sheet order), then past newest first
// grouped by year. The sorts are stable, so equal keys keep their sheet order.
export function splitEvents(cards) {
  const upcoming = []
  const past = []
  for (const card of cards) (card.upcoming ? upcoming : past).push(card)
  upcoming.sort((a, b) => (a.date ?? '9999-12-31').localeCompare(b.date ?? '9999-12-31'))
  past.sort((a, b) => (b.end ?? b.date).localeCompare(a.end ?? a.date))
  const byYear = new Map()
  for (const card of past) {
    const year = card.date.slice(0, 4)
    if (!byYear.has(year)) byYear.set(year, [])
    byYear.get(year).push(card)
  }
  return { upcoming, pastByYear: [...byYear.entries()].map(([year, cards]) => ({ year, cards })) }
}
