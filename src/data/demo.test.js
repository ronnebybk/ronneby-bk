import { describe, it, expect } from 'vitest'
import * as demo from './demo.js'
import {
  parseSeasons, parseGroups, parseSessions, parseExceptions, parseCoaches, parseNotices,
  parseClub, parseTrial, parseFaq, parseDocuments, parseResults, parseEvents, parseSponsors,
} from './parse.js'

// Parses every demo tab exactly as store.js apply() does, into one shared problems array (AC7).
describe('demo data', () => {
  const problems = []
  const seasons = parseSeasons(demo.seasons, problems)
  const groups = parseGroups(demo.groups, problems)
  const sessions = parseSessions(demo.schedule, problems)
  const exceptions = parseExceptions(demo.exceptions ?? [], problems)
  const coaches = parseCoaches(demo.coaches, problems)
  const notices = parseNotices(demo.notices ?? [], problems)
  parseClub(demo.club ?? [], problems)
  parseTrial(demo.trial ?? [], problems)
  const faq = parseFaq(demo.faq ?? [], problems)
  parseDocuments(demo.documents ?? [], problems)
  const results = parseResults(demo.results ?? [], problems)
  const events = parseEvents(demo.events ?? [], problems)
  const sponsors = parseSponsors(demo.sponsors ?? [], problems)

  it('parses with no problems on any tab', () => {
    expect(problems).toEqual([])
  })

  it('loses no rows on the one-row-per-item tabs', () => {
    expect(seasons.length).toBe(demo.seasons.length)
    expect(sessions.length).toBe(demo.schedule.length)
    expect(exceptions.length).toBe(demo.exceptions.length)
    expect(coaches.length).toBe(demo.coaches.length)
    expect(faq.length).toBe(demo.faq.length)
    expect(results.length).toBe(demo.results.length)
    expect(events.length).toBe(demo.events.length)
    expect(sponsors.length).toBe(demo.sponsors.length)
    // Groups merge rows sharing a name, so they may be fewer than the raw rows.
    expect(groups.length).toBeGreaterThan(0)
    expect(notices.length).toBeGreaterThan(0)
  })
})
