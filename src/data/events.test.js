import { describe, it, expect } from 'vitest'
import { eventSlug, buildEvents, splitEvents } from './events.js'

function makeEvent(overrides = {}) {
  return {
    type: 'event',
    title: 'Gala',
    titleEn: 'Gala',
    date: '2026-05-01',
    end: null,
    dateText: '2026-05-01',
    time: '18:00',
    timeEn: '',
    place: 'Ronneby',
    placeEn: '',
    description: '',
    descriptionEn: '',
    images: [],
    link: '',
    problems: [],
    ...overrides,
  }
}

function makeResult(overrides = {}) {
  return {
    competition: 'Gala',
    competitionEn: '',
    date: '2026-05-01',
    place: 'Ronneby',
    medal: '',
    ...overrides,
  }
}

describe('eventSlug', () => {
  it('folds å/ä/ö and lowercases', () => {
    expect(eventSlug('SM i Åre 2026')).toBe('sm-i-are-2026')
    expect(eventSlug('Tävling för Ölänningar')).toBe('tavling-for-olanningar')
  })

  it('collapses non-alphanumerics to single dashes and trims them', () => {
    expect(eventSlug('  Karlskrona  —  Cup! ')).toBe('karlskrona-cup')
  })

  it('falls back to a default for titles with no alphanumerics', () => {
    expect(eventSlug('!!!')).toBe('evenemang')
  })
})

describe('buildEvents', () => {
  it('matches a result to the dated event with the same Rubrik and year', () => {
    const events = [makeEvent({ title: 'Gala', date: '2026-05-01' })]
    const results = [makeResult({ competition: 'Gala', date: '2026-05-02', medal: 'gold' })]
    const [card] = buildEvents(events, results, '2026-01-01')
    expect(card.results).toHaveLength(1)
    expect(card.medals).toEqual({ gold: 1, silver: 0, bronze: 0 })
    expect(card.upcoming).toBe(true)
  })

  it('does not match a result from a different year to a dated event', () => {
    const events = [makeEvent({ title: 'Gala', date: '2026-05-01' })]
    const results = [makeResult({ competition: 'Gala', date: '2025-05-02' })]
    const cards = buildEvents(events, results, '2026-01-01')
    expect(cards).toHaveLength(2)
    expect(cards.find((c) => c.fromResults)).toBeTruthy()
  })

  it('matches a result to the first undated event with the same title', () => {
    const events = [makeEvent({ title: 'Gala', date: null })]
    const results = [makeResult({ competition: 'Gala', date: '2025-03-01' })]
    const [card] = buildEvents(events, results, '2026-01-01')
    expect(card.results).toHaveLength(1)
    expect(card.upcoming).toBe(true)
  })

  it('builds a fallback competition card for a result with no matching event', () => {
    const cards = buildEvents([], [makeResult({ competition: 'DM', date: '2026-02-10', place: 'Malmö' })], '2026-01-01')
    expect(cards).toHaveLength(1)
    const [card] = cards
    expect(card.fromResults).toBe(true)
    expect(card.title).toBe('DM')
    expect(card.year).toBe('2026')
    expect(card.upcoming).toBe(false)
    expect(card.results).toHaveLength(1)
  })

  it('marks a dated event past once its end day is before today', () => {
    const events = [makeEvent({ title: 'Gala', date: '2026-05-01', end: '2026-05-03' })]
    const [card] = buildEvents(events, [], '2026-05-04')
    expect(card.upcoming).toBe(false)
  })

  it('assigns stable ids with -2, -3 on collisions', () => {
    const events = [
      makeEvent({ title: 'Gala', date: '2026-05-01' }),
      makeEvent({ title: 'Gala', date: '2026-06-01' }),
      makeEvent({ title: 'Gala', date: null }),
    ]
    const cards = buildEvents(events, [], '2026-01-01')
    expect(cards.map((c) => c.id)).toEqual(['gala-2026', 'gala-2026-2', 'gala'])
  })
})

describe('splitEvents', () => {
  it('puts upcoming first (dated soonest, undated last) and past newest first grouped by year', () => {
    const cards = buildEvents(
      [
        makeEvent({ title: 'Old', date: '2025-01-10' }),
        makeEvent({ title: 'Later', date: '2026-09-01' }),
        makeEvent({ title: 'Undated', date: null }),
        makeEvent({ title: 'Soon', date: '2026-06-01' }),
        makeEvent({ title: 'Newer old', date: '2025-11-20' }),
      ],
      [],
      '2026-01-01',
    )
    const { upcoming, pastByYear } = splitEvents(cards)
    expect(upcoming.map((c) => c.title)).toEqual(['Soon', 'Later', 'Undated'])
    expect(pastByYear.map((g) => g.year)).toEqual(['2025'])
    expect(pastByYear[0].cards.map((c) => c.title)).toEqual(['Newer old', 'Old'])
  })
})
