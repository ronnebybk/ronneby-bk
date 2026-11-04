import { describe, it, expect } from 'vitest'
import { nameWarnings, rowWarnings, seasonWarnings } from './warnings.js'

const TODAY = '2026-03-01'

const clean = {
  seasons: [{ name: 'VT 2026', from: '2026-01-12', to: '2026-06-14' }],
  groups: [{ name: 'Nybörjare', rows: [2] }],
  sessions: [{ season: 'VT 2026', row: 2, groups: ['Nybörjare'], coach: 'Anna' }],
  coaches: [{ name: 'Anna', row: 2, groups: ['Nybörjare'] }],
  exceptions: [],
}

describe('nameWarnings', () => {
  it('is quiet for clean data', () => {
    expect(nameWarnings(clean, TODAY)).toEqual([])
  })

  it('warns on an unknown group in the current season, with a spelling suggestion', () => {
    const warnings = nameWarnings({
      ...clean,
      groups: [{ name: 'Nybörjare', rows: [2] }],
      sessions: [{ season: 'VT 2026', row: 5, groups: ['nybörjare'], coach: 'Anna' }],
    }, TODAY)
    const unknown = warnings.find((w) => w.kind === 'unknown-group' && w.tab === 'Schema')
    expect(unknown).toMatchObject({ name: 'nybörjare', rows: [5], suggestion: 'Nybörjare' })
  })

  it('warns on an unknown coach named in a session, splitting the comma list', () => {
    const warnings = nameWarnings({
      ...clean,
      sessions: [{ season: 'VT 2026', row: 3, groups: ['Nybörjare'], coach: 'Anna, Bosse' }],
    }, TODAY)
    expect(warnings).toContainEqual(expect.objectContaining({ kind: 'unknown-coach', name: 'Bosse', rows: [3] }))
  })

  it('warns on an unknown season only when the season list is non-empty', () => {
    const withSeasons = nameWarnings({ ...clean, sessions: [{ season: 'VT 2099', row: 9, groups: [], coach: '' }] }, TODAY)
    expect(withSeasons).toContainEqual(expect.objectContaining({ kind: 'unknown-season', name: 'VT 2099', rows: [9] }))
    const noSeasons = nameWarnings({ ...clean, seasons: [], sessions: [{ season: 'VT 2099', row: 9, groups: [], coach: '' }] }, TODAY)
    expect(noSeasons).toEqual([])
  })

  it('stays quiet for sessions in seasons that ended before today', () => {
    const warnings = nameWarnings({
      ...clean,
      seasons: [...clean.seasons, { name: 'HT 2025', from: '2025-08-18', to: '2025-12-21' }],
      sessions: [{ season: 'HT 2025', row: 4, groups: ['Gammal grupp'], coach: 'Borta' }],
    }, TODAY)
    expect(warnings).toEqual([])
  })

  it('warns when a coach or a future exception names an unknown group', () => {
    const warnings = nameWarnings({
      ...clean,
      coaches: [{ name: 'Anna', row: 2, groups: ['Försvunnen'] }],
      exceptions: [
        { date: '2026-05-01', groups: ['Också borta'], row: 7 },
        { date: '2025-05-01', groups: ['Gammal'], row: 8 },
      ],
    }, TODAY)
    expect(warnings).toContainEqual(expect.objectContaining({ kind: 'unknown-group', tab: 'Tränare', name: 'Försvunnen', rows: [2] }))
    expect(warnings).toContainEqual(expect.objectContaining({ kind: 'unknown-group', tab: 'Undantag', name: 'Också borta', rows: [7] }))
    expect(warnings.find((w) => w.name === 'Gammal')).toBeUndefined()
  })

  it('warns when group names differ only in capitals or spaces', () => {
    const warnings = nameWarnings({
      ...clean,
      groups: [{ name: 'Nybörjare', rows: [2] }, { name: 'NYBÖRJARE', rows: [3] }],
      sessions: [],
    }, TODAY)
    const groupCase = warnings.find((w) => w.kind === 'group-case')
    expect(groupCase.spellings).toEqual([
      { name: 'Nybörjare', rows: [2] },
      { name: 'NYBÖRJARE', rows: [3] },
    ])
  })
})

describe('rowWarnings', () => {
  it('groups problems by tab/reason/column/value with sorted unique rows, in sheet tab order', () => {
    const warnings = rowWarnings([
      { tab: 'Tränare', row: 5, reason: 'missing', column: 'Namn' },
      { tab: 'Schema', row: 9, reason: 'unreadable', column: 'Dag', value: 'x' },
      { tab: 'Tränare', row: 3, reason: 'missing', column: 'Namn' },
      { tab: 'Schema', row: 4, reason: 'unreadable', column: 'Dag', value: 'x' },
    ])
    expect(warnings).toEqual([
      { kind: 'row', tab: 'Schema', reason: 'unreadable', column: 'Dag', value: 'x', rows: [4, 9] },
      { kind: 'row', tab: 'Tränare', reason: 'missing', column: 'Namn', value: undefined, rows: [3, 5] },
    ])
  })

  it('returns an empty list for no problems', () => {
    expect(rowWarnings([])).toEqual([])
  })
})

describe('seasonWarnings', () => {
  const vt = { name: 'VT 2026', nameEn: '', from: '2026-01-12', to: '2026-06-14' }

  it('is quiet when a season covers today and a later one exists', () => {
    const ht = { name: 'HT 2026', nameEn: '', from: '2026-08-17', to: '2026-12-20' }
    expect(seasonWarnings([vt, ht], TODAY)).toEqual([])
  })

  it('warns no-season when nothing covers today and nothing starts later', () => {
    // A gap is fine while a later season exists.
    const ht = { name: 'HT 2026', nameEn: '', from: '2026-08-17', to: '2026-12-20' }
    expect(seasonWarnings([vt, ht], '2026-07-01')).toEqual([])
    expect(seasonWarnings([vt], '2027-01-01')).toEqual([{ kind: 'no-season' }])
  })

  it('warns season-ending when the current season ends within 21 days and nothing follows', () => {
    expect(seasonWarnings([vt], '2026-06-01')).toEqual([{ kind: 'season-ending', name: 'VT 2026', nameEn: '', to: '2026-06-14' }])
    // More than 21 days left → quiet.
    expect(seasonWarnings([vt], '2026-05-01')).toEqual([])
  })
})
