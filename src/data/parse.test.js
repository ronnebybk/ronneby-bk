import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  parseSeasons, parseGroups, parseSessions, parseExceptions, parseNotices, isNoticeActive,
  parseClub, parseTrial, parseFaq, parseDocuments, parseResults, parseSponsors, parseCoaches,
  parseEvents, pickCurrentSeason, imageUrl, telHref, linkParts, textBlocks,
} from './parse.js'

describe('parseSeasons', () => {
  it('parses a valid row and sorts by start date', () => {
    const problems = []
    const seasons = parseSeasons([
      { Säsong: 'VT 2026', 'Från': '2026-01-12', 'Till': '2026-06-14' },
      { Säsong: 'HT 2025', 'Från': '2025-08-18', 'Till': '2025-12-21', 'Säsong (EN)': 'Fall 2025' },
    ], problems)
    expect(problems).toEqual([])
    expect(seasons.map((s) => s.name)).toEqual(['HT 2025', 'VT 2026'])
    expect(seasons[1]).toMatchObject({ nameEn: '', from: '2026-01-12', to: '2026-06-14' })
    expect(seasons[0].nameEn).toBe('Fall 2025')
  })

  it('skips a row with an unreadable date and reports it', () => {
    const problems = []
    const seasons = parseSeasons([{ Säsong: 'HT 2026', 'Från': 'snart', 'Till': '2026-12-20' }], problems)
    expect(seasons).toEqual([])
    expect(problems).toEqual([{ tab: 'Säsonger', row: 2, reason: 'unreadable', column: 'Från', value: 'snart' }])
  })

  it('skips a row with no name and reports missing Från/Till', () => {
    const problems = []
    expect(parseSeasons([{}], problems)).toEqual([])
    expect(problems).toEqual([
      { tab: 'Säsonger', row: 2, reason: 'missing', column: 'Säsong' },
      { tab: 'Säsonger', row: 2, reason: 'missing', column: 'Från' },
      { tab: 'Säsonger', row: 2, reason: 'missing', column: 'Till' },
    ])
  })

  it('reports from-after-to but still keeps the row', () => {
    const problems = []
    const seasons = parseSeasons([{ Säsong: 'X', 'Från': '2026-06-01', 'Till': '2026-01-01' }], problems)
    expect(seasons).toHaveLength(1)
    expect(problems).toEqual([{ tab: 'Säsonger', row: 2, reason: 'from-after-to' }])
  })
})

describe('pickCurrentSeason', () => {
  const seasons = [
    { name: 'HT 2025', from: '2025-08-18', to: '2025-12-21' },
    { name: 'VT 2026', from: '2026-01-12', to: '2026-06-14' },
    { name: 'HT 2026', from: '2026-08-17', to: '2026-12-20' },
  ]

  it('picks the season covering today', () => {
    expect(pickCurrentSeason(seasons, '2026-03-01').name).toBe('VT 2026')
    expect(pickCurrentSeason(seasons, '2026-01-12').name).toBe('VT 2026')
    expect(pickCurrentSeason(seasons, '2026-06-14').name).toBe('VT 2026')
  })

  it('picks the next season to start during a gap', () => {
    expect(pickCurrentSeason(seasons, '2026-07-01').name).toBe('HT 2026')
  })

  it('picks the most recent season after the last one ended', () => {
    expect(pickCurrentSeason(seasons, '2027-01-01').name).toBe('HT 2026')
  })

  it('returns null with no seasons', () => {
    expect(pickCurrentSeason([], '2026-01-01')).toBeNull()
  })
})

describe('parseGroups', () => {
  it('groups rows by name and parses prices with periods', () => {
    const problems = []
    const groups = parseGroups([
      { Grupp: 'Nybörjare', 'Pris (kr)': '800', 'Prisperiod': 'termin', Ålder: '7–10' },
      { Grupp: 'Nybörjare', 'Pris (kr)': '1 100,00 kr', 'Prisperiod': 'år' },
    ], problems)
    expect(problems).toEqual([])
    expect(groups).toHaveLength(1)
    expect(groups[0].prices).toEqual([
      { price: 800, period: 'termin' },
      { price: 1100, period: 'år' },
    ])
    expect(groups[0].ages).toBe('7–10')
    expect(groups[0].rows).toEqual([2, 3])
  })

  it('skips a filled row with no group name and warns', () => {
    const problems = []
    expect(parseGroups([{ 'Pris (kr)': '100', Prisperiod: 'termin' }], problems)).toEqual([])
    expect(problems).toEqual([{ tab: 'Grupper', row: 2, reason: 'missing', column: 'Grupp' }])
  })

  it('warns on an unknown period and on an unreadable price', () => {
    const problems = []
    const groups = parseGroups([
      { Grupp: 'A', 'Pris (kr)': '100', Prisperiod: 'vecka' },
      { Grupp: 'B', 'Pris (kr)': 'gratis', Prisperiod: 'termin' },
    ], problems)
    expect(groups[0].prices).toEqual([{ price: 100, period: 'termin' }])
    expect(groups[1].prices).toEqual([])
    expect(problems).toContainEqual({ tab: 'Grupper', row: 2, reason: 'unknown-period', column: 'Prisperiod', value: 'vecka' })
    expect(problems).toContainEqual({ tab: 'Grupper', row: 3, reason: 'unreadable', column: 'Pris (kr)', value: 'gratis' })
  })
})

describe('parseSessions', () => {
  it('parses a valid row with comma-separated groups and sorts by day/start', () => {
    const problems = []
    const sessions = parseSessions([
      { Säsong: 'VT 2026', Dag: 'Torsdag', Start: '17.30', Slut: '18:30', Grupp: 'A, B', Tränare: 'Anna' },
      { Säsong: 'VT 2026', Dag: '1', Start: '16:00', Grupp: 'A' },
    ], problems)
    expect(problems).toEqual([])
    expect(sessions.map((s) => s.day)).toEqual([1, 4])
    expect(sessions[0]).toMatchObject({ start: '16:00', end: null, groups: ['A'], coach: '' })
    expect(sessions[1]).toMatchObject({ start: '17:30', end: '18:30', groups: ['A', 'B'], coach: 'Anna' })
  })

  it('skips a row with unreadable day and reports each missing field', () => {
    const problems = []
    expect(parseSessions([{ Säsong: '', Dag: 'fredagx', Start: '', Grupp: '' }], problems)).toEqual([])
    expect(problems).toEqual([
      { tab: 'Schema', row: 2, reason: 'missing', column: 'Säsong' },
      { tab: 'Schema', row: 2, reason: 'unreadable', column: 'Dag', value: 'fredagx' },
      { tab: 'Schema', row: 2, reason: 'missing', column: 'Start' },
      { tab: 'Schema', row: 2, reason: 'missing', column: 'Grupp' },
    ])
  })
})

describe('parseExceptions', () => {
  it('parses a valid cancellation and sorts by date', () => {
    const problems = []
    const exceptions = parseExceptions([
      { Datum: '2026-12-24', Meddelande: 'Jul', Grupp: '' },
      { Datum: '2026-05-01', Meddelande: 'Maj', Grupp: 'A, B' },
    ], problems)
    expect(problems).toEqual([])
    expect(exceptions.map((e) => e.date)).toEqual(['2026-05-01', '2026-12-24'])
    expect(exceptions[1].groups).toEqual([])
    expect(exceptions[0].groups).toEqual(['A', 'B'])
  })

  it('skips a row without a message and reports it', () => {
    const problems = []
    expect(parseExceptions([{ Datum: '2026-12-24' }], problems)).toEqual([])
    expect(problems).toEqual([{ tab: 'Undantag', row: 2, reason: 'missing', column: 'Meddelande' }])
  })
})

describe('parseNotices + isNoticeActive', () => {
  it('parses a notice and a news item; unknown types are skipped', () => {
    const problems = []
    const notices = parseNotices([
      { Typ: '', Meddelande: 'Inställt på måndag', 'Visa från': '2026-01-01', 'Visa till': '2026-01-31' },
      { Typ: 'nyhet', Rubrik: 'Ny lokal', Meddelande: 'Vi flyttar' },
      { Typ: 'fel', Meddelande: 'okänt' },
    ], problems)
    expect(notices).toHaveLength(2)
    expect(notices[0]).toMatchObject({ type: 'notice', message: 'Inställt på måndag', from: '2026-01-01', to: '2026-01-31' })
    expect(notices[1]).toMatchObject({ type: 'news', title: 'Ny lokal' })
    expect(problems).toEqual([{ tab: 'Anslag', row: 4, reason: 'unknown-type', column: 'Typ', value: 'fel' }])
  })

  it('skips a row with neither message nor title', () => {
    const problems = []
    expect(parseNotices([{ Typ: 'anslag' }], problems)).toEqual([])
    expect(problems).toEqual([{ tab: 'Anslag', row: 2, reason: 'missing', column: 'Meddelande' }])
  })

  it('isNoticeActive honours inclusive limits and open ends', () => {
    const notice = { from: '2026-01-10', to: '2026-01-20' }
    expect(isNoticeActive(notice, '2026-01-09')).toBe(false)
    expect(isNoticeActive(notice, '2026-01-10')).toBe(true)
    expect(isNoticeActive(notice, '2026-01-20')).toBe(true)
    expect(isNoticeActive(notice, '2026-01-21')).toBe(false)
    expect(isNoticeActive({ from: null, to: null }, '2026-01-01')).toBe(true)
    expect(isNoticeActive({ from: '2026-02-01', to: null }, '2026-01-01')).toBe(false)
  })
})

describe('parseClub', () => {
  it('maps fields to keys, first filled row wins, checks values', () => {
    const problems = []
    const club = parseClub([
      { Fält: 'E-post', 'Värde': 'info@example.se' },
      { Fält: 'E-post', 'Värde': 'second@example.se' },
      { Fält: 'Telefon', 'Värde': '070-123 45 67' },
      { Fält: 'Lokal', 'Värde': 'Sporthallen', 'Värde (EN)': 'The Sports Hall' },
      { Fält: 'Facebook', 'Värde': 'http://facebook.com/x' },
      { Fält: 'okänt', 'Värde': 'x' },
    ], problems)
    expect(club.email).toBe('info@example.se')
    expect(club.phone).toBe('070-123 45 67')
    expect(club.venue).toBe('Sporthallen')
    expect(club.venueEn).toBe('The Sports Hall')
    expect(club.facebookUrl).toBeUndefined()
    expect(problems).toContainEqual({ tab: 'Klubbinfo', row: 3, reason: 'club-duplicate', column: 'E-post', value: 2 })
    expect(problems).toContainEqual({ tab: 'Klubbinfo', row: 6, reason: 'club-invalid', column: 'Facebook', value: 'http://facebook.com/x' })
    expect(problems).toContainEqual({ tab: 'Klubbinfo', row: 7, reason: 'unknown-field', column: 'Fält', value: 'okänt' })
  })
})

describe('parseTrial', () => {
  it('keeps rows with title or text and skips empty rows with both warnings', () => {
    const problems = []
    const sections = parseTrial([
      { Rubrik: 'Rubrik', Text: 'Text' },
      { 'Rubrik (EN)': 'Title EN', 'Text (EN)': 'Text EN' },
    ], problems)
    expect(sections).toHaveLength(1)
    expect(problems).toEqual([
      { tab: 'Prova på', row: 3, reason: 'missing', column: 'Rubrik' },
      { tab: 'Prova på', row: 3, reason: 'missing', column: 'Text' },
    ])
  })
})

describe('parseFaq', () => {
  it('keeps rows with question and answer in sheet order', () => {
    const problems = []
    const faq = parseFaq([
      { Fråga: 'Q1', Svar: 'A1' },
      { Fråga: 'Q2' },
    ], problems)
    expect(faq).toEqual([{ question: 'Q1', questionEn: '', answer: 'A1', answerEn: '' }])
    expect(problems).toEqual([{ tab: 'Frågor', row: 3, reason: 'missing', column: 'Svar' }])
  })
})

describe('parseDocuments', () => {
  it('groups by category in first-appearance order, empty category last', () => {
    const problems = []
    const categories = parseDocuments([
      { Titel: 'Stadgar', Länk: 'https://example.se/stadgar.pdf', Kategori: 'Regler' },
      { Titel: 'Protokoll', Länk: 'https://example.se/p.pdf' },
      { Titel: 'Blankett', Länk: 'https://example.se/b.pdf', Kategori: 'Övrigt' },
      { Titel: 'Trasig', Länk: 'http://example.se/x.pdf', Kategori: 'Regler' },
    ], problems)
    expect(categories.map((c) => c.key)).toEqual(['regler', ''])
    expect(categories[0].items.map((i) => i.title)).toEqual(['Stadgar'])
    expect(categories[1].items.map((i) => i.title)).toEqual(['Protokoll', 'Blankett'])
    expect(problems).toContainEqual({ tab: 'Dokument', row: 5, reason: 'not-https-row', column: 'Länk', value: 'http://example.se/x.pdf' })
  })
})

describe('parseResults', () => {
  it('parses a valid result, maps medals, trims junior names, sorts newest first', () => {
    const problems = []
    const results = parseResults([
      { Datum: '2026-05-02', Tävling: 'SM', Namn: 'Anna Andersson', Placering: 'GULD', 'Junior/Senior': 'junior' },
      { Datum: '2026-06-01', Tävling: 'DM', Namn: 'Bo B', Placering: '2:a', 'Junior/Senior': 'senior', Ort: 'Malmö' },
      { Datum: 'inte ett datum', Tävling: 'X', Namn: 'C C', Placering: '5' },
    ], problems)
    expect(results.map((r) => r.date)).toEqual(['2026-06-01', '2026-05-02'])
    expect(results[1]).toMatchObject({ name: 'Anna', medal: 'gold', link: '' })
    expect(results[0]).toMatchObject({ name: 'Bo B', medal: 'silver', place: 'Malmö' })
    expect(problems).toContainEqual({ tab: 'Resultat', row: 4, reason: 'unreadable', column: 'Datum', value: 'inte ett datum' })
  })
})

describe('parseSponsors', () => {
  it('keeps named rows, drops non-https links with a warning', () => {
    const problems = []
    const sponsors = parseSponsors([
      { Namn: 'Sponsor AB', Länk: 'https://sponsor.se', Logga: 'logo.png' },
      { Namn: 'Ingen länk', Länk: 'http://x.se' },
      { Länk: 'https://y.se' },
    ], problems)
    expect(sponsors).toHaveLength(2)
    expect(sponsors[0]).toMatchObject({ url: 'https://sponsor.se', logo: './sponsors/logo.png' })
    expect(sponsors[1].url).toBe('')
    expect(problems).toContainEqual({ tab: 'Sponsorer', row: 3, reason: 'not-https', column: 'Länk', value: 'http://x.se' })
    expect(problems).toContainEqual({ tab: 'Sponsorer', row: 4, reason: 'missing', column: 'Namn' })
  })
})

describe('parseCoaches', () => {
  it('parses a valid coach and skips nameless rows', () => {
    const problems = []
    const coaches = parseCoaches([
      { Namn: 'Anna', Roll: 'Tränare', Grupper: 'A, B', Telefon: '070-111 22 33', 'E-post': 'a@b.se' },
      { Roll: 'Inget namn' },
    ], problems)
    expect(coaches).toHaveLength(1)
    expect(coaches[0]).toMatchObject({ name: 'Anna', groups: ['A', 'B'], phone: '070-111 22 33', image: '' })
    expect(problems).toEqual([{ tab: 'Tränare', row: 3, reason: 'missing', column: 'Namn' }])
  })
})

describe('parseEvents', () => {
  it('parses a dated event; unreadable dates keep the event undated', () => {
    const problems = []
    const events = parseEvents([
      { Rubrik: 'Gala', Datum: '2026-05-01', Slutdatum: '2026-05-03', Typ: 'gala', Bild: 'foto.jpg\nhttps://drive.google.com/file/d/abcdefghijklmnop/view' },
      { Rubrik: 'Läger', Datum: 'inte-datum' },
      { Datum: '2026-01-01' },
    ], problems)
    expect(events).toHaveLength(2)
    expect(events[0]).toMatchObject({ type: 'gala', date: '2026-05-01', end: '2026-05-03', problems: [] })
    expect(events[0].images[0]).toMatchObject({ image: './events/foto.jpg', imageValue: 'foto.jpg' })
    expect(events[0].images[1].image).toContain('drive.google.com/thumbnail?id=abcdefghijklmnop')
    expect(events[1]).toMatchObject({ date: null, end: null, problems: ['date-unreadable'] })
    expect(problems).toEqual([{ tab: 'Evenemang', row: 4, reason: 'missing', column: 'Rubrik' }])
  })
})

describe('imageUrl', () => {
  it('turns a Drive share link into a thumbnail URL', () => {
    expect(imageUrl('https://drive.google.com/file/d/abcdefghijklmnop/view?usp=sharing', 'coaches'))
      .toBe('https://drive.google.com/thumbnail?id=abcdefghijklmnop&sz=w800')
  })

  it('keeps the resourcekey when present', () => {
    expect(imageUrl('https://drive.google.com/file/d/abcdefghijklmnop/view?resourcekey=abc-123', 'coaches'))
      .toBe('https://drive.google.com/thumbnail?id=abcdefghijklmnop&sz=w800&resourcekey=abc-123')
  })

  it('returns plain https links as-is and bare filenames under the folder', () => {
    expect(imageUrl('https://example.se/bild.jpg', 'coaches')).toBe('https://example.se/bild.jpg')
    expect(imageUrl('foto.jpg', 'coaches')).toBe('./coaches/foto.jpg')
  })

  it('rejects folder links, non-image docs links and non-filenames', () => {
    expect(imageUrl('https://drive.google.com/drive/folders/abcdefghijklmnop', 'coaches')).toBe('')
    expect(imageUrl('https://docs.google.com/spreadsheets/d/abcdefghijklmnop/edit', 'coaches')).toBe('')
    expect(imageUrl('foto kommer', 'coaches')).toBe('')
    expect(imageUrl('', 'coaches')).toBe('')
  })
})

describe('telHref', () => {
  it('keeps only digits and +', () => {
    expect(telHref('070-123 45 67')).toBe('tel:0701234567')
    expect(telHref('+46 70 123 45 67')).toBe('tel:+46701234567')
  })
})

describe('linkParts', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('splits text, in-app hash links and external links', () => {
    const parts = linkParts('Se #/schema och https://example.se/x, tack!')
    expect(parts).toEqual([
      { text: 'Se ' },
      { to: '/schema', navKey: 'nav.schedule' },
      { text: ' och ' },
      { text: 'https://example.se/x', href: 'https://example.se/x' },
      { text: ', tack!' },
    ])
  })

  it('treats a full own-site URL as an in-app link', () => {
    vi.stubGlobal('location', { origin: 'https://ronnebybk.github.io', pathname: '/ronneby-bk/' })
    const parts = linkParts('Läs mer på https://ronnebybk.github.io/ronneby-bk/#/kontakt här')
    expect(parts).toEqual([
      { text: 'Läs mer på ' },
      { to: '/kontakt', navKey: 'nav.contact' },
      { text: ' här' },
    ])
  })

  it('keeps a hash route that matches no page as plain text', () => {
    expect(linkParts('se #/finns-inte')).toEqual([{ text: 'se ' }, { text: '#/finns-inte' }])
  })
})

describe('textBlocks', () => {
  it('splits paragraphs on blank lines and collects bullet runs', () => {
    expect(textBlocks('Första.\n\n- ett\n- två\n\nAndra stycket.')).toEqual([
      { paragraph: 'Första.' },
      { list: ['ett', 'två'] },
      { paragraph: 'Andra stycket.' },
    ])
  })

  it('returns no blocks for empty text', () => {
    expect(textBlocks('  ')).toEqual([])
  })
})
