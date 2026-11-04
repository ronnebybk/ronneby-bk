import { describe, it, expect } from 'vitest'
import { hasEvents, buildCalendar, fileName } from './ics.js'

const NOW = new Date(Date.UTC(2026, 0, 15, 10, 30, 0)) // 2026-01-15 10:30:00 UTC

function calendar(overrides = {}) {
  return buildCalendar({
    season: { name: 'VT 2026', from: '2026-03-26', to: '2026-04-02' },
    sessions: [{ day: 4, start: '18:00', end: '19:00', groups: ['Nybörjare'] }],
    isCancelled: () => false,
    today: '2026-03-26',
    now: NOW,
    summary: (s) => `Boxning ${s.groups.join(', ')}`,
    location: 'Sporthallen, Ronneby',
    description: () => '',
    ...overrides,
  })
}

describe('buildCalendar', () => {
  it('uses CRLF line endings throughout', () => {
    const text = calendar()
    expect(text).toContain('\r\n')
    // No bare LF anywhere.
    expect(/(?<!\r)\n/.test(text)).toBe(false)
    expect(text.endsWith('END:VCALENDAR\r\n')).toBe(true)
  })

  it('emits a UTC DTSTAMP from the fixed now', () => {
    expect(calendar()).toContain('DTSTAMP:20260115T103000Z')
  })

  it('keeps local 18:00 on both sides of the March DST change and converts UNTIL to UTC', () => {
    // Thursdays 2026-03-26 (CET) and 2026-04-02 (CEST, change was 2026-03-29).
    const text = calendar()
    expect(text).toContain('DTSTART;TZID=Europe/Stockholm:20260326T180000')
    expect(text).toContain('DTEND;TZID=Europe/Stockholm:20260326T190000')
    // Last occurrence 2026-04-02 18:00 CEST = 16:00 UTC.
    expect(text).toContain('RRULE:FREQ=WEEKLY;UNTIL=20260402T160000Z')
  })

  it('keeps local 18:00 on both sides of the October DST change', () => {
    // Thursdays 2026-10-22 (CEST) and 2026-10-29 (CET, change was 2026-10-25).
    const text = calendar({
      season: { name: 'HT 2026', from: '2026-10-22', to: '2026-10-29' },
      today: '2026-10-22',
    })
    expect(text).toContain('DTSTART;TZID=Europe/Stockholm:20261022T180000')
    // Last occurrence 2026-10-29 18:00 CET = 17:00 UTC.
    expect(text).toContain('RRULE:FREQ=WEEKLY;UNTIL=20261029T170000Z')
  })

  it('lists a cancelled date in EXDATE and no others', () => {
    const text = calendar({
      season: { name: 'VT 2026', from: '2026-03-26', to: '2026-04-09' },
      isCancelled: (iso) => iso === '2026-04-02',
    })
    expect(text).toContain('EXDATE;TZID=Europe/Stockholm:20260402T180000')
    expect(text).not.toContain('20260326T180000\r\nEXDATE')
    expect(text.match(/EXDATE/g)).toHaveLength(1)
  })

  it('escapes commas and semicolons in SUMMARY and LOCATION', () => {
    const text = calendar({ summary: () => 'Träning, åäö; x', location: '' })
    expect(text).toContain('SUMMARY:Träning\\, åäö\\; x')
  })

  it('skips a session whose whole range is already past', () => {
    const text = calendar({
      season: { name: 'HT 2025', from: '2025-08-18', to: '2025-12-18' },
      today: '2026-03-26',
    })
    expect(text).not.toContain('BEGIN:VEVENT')
    expect(text).toContain('END:VCALENDAR')
  })
})

describe('hasEvents', () => {
  const season = { name: 'VT 2026', from: '2026-03-26', to: '2026-04-02' }
  const sessions = [{ day: 4, start: '18:00', groups: ['A'] }]

  it('is true while the season still has occurrences', () => {
    expect(hasEvents(season, sessions, '2026-03-26')).toBe(true)
    expect(hasEvents(season, sessions, '2026-04-02')).toBe(true)
  })

  it('is false once today is past the season end', () => {
    expect(hasEvents(season, sessions, '2026-04-03')).toBe(false)
  })

  it('is false for a season with no sessions', () => {
    expect(hasEvents(season, [], '2026-03-26')).toBe(false)
  })
})

describe('fileName', () => {
  it('slugs the Swedish group name', () => {
    expect(fileName('Nybörjare 7–10')).toBe('ronnebyboxing-nyborjare-7-10.ics')
  })
})
