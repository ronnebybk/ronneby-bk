// Turns raw sheet rows (header → text) into clean objects.
// Editors type into the sheet by hand, so everything here is forgiving:
// rows that can't be understood are skipped instead of breaking the page.

import { linkTargets } from '../nav.js'

const DAY_NAMES = {
  måndag: 1, mån: 1, monday: 1, mon: 1,
  tisdag: 2, tis: 2, tuesday: 2, tue: 2,
  onsdag: 3, ons: 3, wednesday: 3, wed: 3,
  torsdag: 4, tor: 4, thursday: 4, thu: 4,
  fredag: 5, fre: 5, friday: 5, fri: 5,
  lördag: 6, lör: 6, saturday: 6, sat: 6,
  söndag: 7, sön: 7, sunday: 7, sun: 7,
}

const PERIODS = ['termin', 'år', 'månad', 'gång']

const clean = (value) => (value == null ? '' : String(value).trim())

// Header names are matched case-insensitively and ignoring extra spaces.
function normalizeRow(row) {
  const out = {}
  for (const [key, value] of Object.entries(row)) {
    out[key.trim().toLowerCase().replace(/\s+/g, ' ')] = clean(value)
  }
  return out
}

function field(row, name) {
  return row[name.toLowerCase()] ?? ''
}

// Sheet row number (header = row 1); demo data falls back to index + 2.
// normalizeRow stringifies every cell, so _row comes back as a string — coerce it.
const rowOf = (row, i) => Number(row._row ?? i + 2)

function parseDay(value) {
  const text = clean(value).toLowerCase()
  if (/^[1-7]$/.test(text)) return Number(text)
  return DAY_NAMES[text] ?? null
}

// Accepts 17:30, 17.30, 17:30:00 and 1730.
function parseTime(value) {
  const match = clean(value).match(/^(\d{1,2})[:.]?(\d{2})/)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

// Returns YYYY-MM-DD. Accepts 2026-08-17 (Swedish sheet locale), 17.8.2026 and 8/17/2026 (US locale).
function parseDate(value) {
  const text = clean(value)
  let match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (match) return toIso(match[1], match[2], match[3])
  match = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
  if (match) return toIso(match[3], match[2], match[1])
  match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (match) return toIso(match[3], match[1], match[2])
  return null
}

function toIso(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function parseSeasons(rows, problems = []) {
  return rows
    .map(normalizeRow)
    .map((row, i) => {
      const name = field(row, 'Säsong')
      const fromText = field(row, 'Från')
      const toText = field(row, 'Till')
      const from = parseDate(fromText)
      const to = parseDate(toText)
      const rowNum = rowOf(row, i)
      if (!name) problems.push({ tab: 'Säsonger', row: rowNum, reason: 'missing', column: 'Säsong' })
      if (!fromText) problems.push({ tab: 'Säsonger', row: rowNum, reason: 'missing', column: 'Från' })
      else if (!from) problems.push({ tab: 'Säsonger', row: rowNum, reason: 'unreadable', column: 'Från', value: fromText })
      if (!toText) problems.push({ tab: 'Säsonger', row: rowNum, reason: 'missing', column: 'Till' })
      else if (!to) problems.push({ tab: 'Säsonger', row: rowNum, reason: 'unreadable', column: 'Till', value: toText })
      if (from && to && from > to) problems.push({ tab: 'Säsonger', row: rowNum, reason: 'from-after-to' })
      return { name, nameEn: field(row, 'Säsong (EN)'), from, to }
    })
    .filter((season) => season.name && season.from && season.to)
    .sort((a, b) => a.from.localeCompare(b.from))
}

// The season covering today; otherwise the next one to start (seasons arrive sorted by `from`);
// otherwise the most recent; null when there are none. Pure, so tests never read the clock.
export function pickCurrentSeason(seasons, today) {
  return (
    seasons.find((s) => s.from <= today && today <= s.to) ??
    seasons.find((s) => s.from > today) ??
    seasons[seasons.length - 1] ??
    null
  )
}

const GROUP_FIELDS = { nameEn: 'Grupp (EN)', ages: 'Ålder', description: 'Beskrivning', descriptionEn: 'Beskrivning (EN)' }

// "1 100,00 kr" → 1100. Only a 1–2 digit ending counts as decimals, so "1,100" stays 1100.
function parsePrice(text) {
  const digits = text.replace(/[.,]\d{1,2}(?=\D*$)/, '').replace(/[^\d]/g, '')
  return digits === '' ? null : Number(digits)
}

// Rows with the same group name are one group with several ways to pay (e.g. per term and per
// year). Each detail comes from the first row that has it, like in Klubbinfo; each row adds its price.
export function parseGroups(rows, problems = []) {
  const byName = new Map()
  const rowsByName = new Map()
  rows.map(normalizeRow).forEach((row, i) => {
    const rowNum = rowOf(row, i)
    const name = field(row, 'Grupp')
    const priceText = field(row, 'Pris (kr)')
    const periodText = field(row, 'Prisperiod')
    // D4: a row with no group name but other cells filled is skipped and worth a warning.
    if (!name) {
      if (priceText || periodText || Object.values(GROUP_FIELDS).some((col) => field(row, col))) {
        problems.push({ tab: 'Grupper', row: rowNum, reason: 'missing', column: 'Grupp' })
      }
      return
    }
    if (!rowsByName.has(name)) rowsByName.set(name, [])
    rowsByName.get(name).push(rowNum)
    if (!byName.has(name)) byName.set(name, { name, nameEn: '', ages: '', description: '', descriptionEn: '', prices: [] })
    const group = byName.get(name)
    for (const [key, column] of Object.entries(GROUP_FIELDS)) group[key] ||= field(row, column)

    const price = parsePrice(priceText)
    const period = periodText.toLowerCase()
    if (price !== null && period && !PERIODS.includes(period)) {
      problems.push({ tab: 'Grupper', row: rowNum, reason: 'unknown-period', column: 'Prisperiod', value: periodText })
    }
    if (!priceText && period) {
      problems.push({ tab: 'Grupper', row: rowNum, reason: 'price-no-amount', column: 'Prisperiod', value: periodText })
    }
    // D7: after removing kr and :- the cell still has a non-digit between digits → extra digits.
    const extraDigits = priceText && /\d[^\d]*[^\d\s.,][^\d]*\d/.test(priceText.replace(/kr|:-/gi, ''))
    if (extraDigits) {
      problems.push({ tab: 'Grupper', row: rowNum, reason: 'price-extra-digits', column: 'Pris (kr)', value: priceText })
    }
    // A price cell with no digits at all (e.g. "gratis") drops the price — warn so it's not silent.
    if (priceText && price === null) {
      problems.push({ tab: 'Grupper', row: rowNum, reason: 'unreadable', column: 'Pris (kr)', value: priceText })
    }
    if (price === null) return
    const option = { price, period: PERIODS.includes(period) ? period : 'termin' }
    // A pasted copy of the same row shouldn't list the same price twice, and free is free whatever the period.
    if (!group.prices.some((p) => p.price === price && (price === 0 || p.period === option.period))) {
      group.prices.push(option)
    }
  })
  // "Gratis · 800 kr / termin" contradicts itself, so a free row only counts when nothing costs money.
  for (const group of byName.values()) {
    if (group.prices.some((p) => p.price > 0)) group.prices = group.prices.filter((p) => p.price > 0)
    // Sheet rows that carry this group's name, for admin warnings (AC5).
    group.rows = rowsByName.get(group.name)
  }
  return [...byName.values()]
}

export function parseSessions(rows, problems = []) {
  return rows
    .map(normalizeRow)
    .map((row, i) => {
      const rowNum = rowOf(row, i)
      const season = field(row, 'Säsong')
      const dayText = field(row, 'Dag')
      const startText = field(row, 'Start')
      const endText = field(row, 'Slut')
      const groupsText = field(row, 'Grupp')
      // Several groups can share a session, comma-separated like Grupper in the Tränare tab.
      const groups = groupsText.split(',').map(clean).filter(Boolean)
      const day = parseDay(dayText)
      const start = parseTime(startText)
      const end = parseTime(endText)
      if (!season) problems.push({ tab: 'Schema', row: rowNum, reason: 'missing', column: 'Säsong' })
      if (!dayText) problems.push({ tab: 'Schema', row: rowNum, reason: 'missing', column: 'Dag' })
      else if (!day) problems.push({ tab: 'Schema', row: rowNum, reason: 'unreadable', column: 'Dag', value: dayText })
      if (!startText) problems.push({ tab: 'Schema', row: rowNum, reason: 'missing', column: 'Start' })
      else if (!start) problems.push({ tab: 'Schema', row: rowNum, reason: 'unreadable', column: 'Start', value: startText })
      if (!groups.length) problems.push({ tab: 'Schema', row: rowNum, reason: 'missing', column: 'Grupp' })
      // D3: an unreadable Slut drops only the end time, the row still shows. On a row the site
      // skips anyway, the row-level warnings already say the row is hidden.
      if (season && day && start && groups.length && endText && !end) {
        problems.push({ tab: 'Schema', row: rowNum, reason: 'unreadable', column: 'Slut', value: endText })
      }
      return {
        // Sheet row number for admin warnings.
        row: rowNum,
        season,
        day,
        start,
        end,
        groups,
        coach: field(row, 'Tränare'),
        note: field(row, 'Notering'),
        noteEn: field(row, 'Notering (EN)'),
      }
    })
    .filter((session) => session.season && session.day && session.start && session.groups.length)
    .sort((a, b) => a.day - b.day || a.start.localeCompare(b.start))
}

// The Undantag tab: one row per cancelled date (holiday, competition weekend, …). Datum and
// Meddelande are required; an empty Grupp cancels every group, otherwise the comma-separated
// list names the groups it cancels (same matching as Schema's Grupp).
export function parseExceptions(rows, problems = []) {
  return rows
    .map(normalizeRow)
    .map((row, i) => {
      const rowNum = rowOf(row, i)
      const dateText = field(row, 'Datum')
      const date = parseDate(dateText)
      const message = field(row, 'Meddelande')
      if (!dateText) problems.push({ tab: 'Undantag', row: rowNum, reason: 'missing', column: 'Datum' })
      else if (!date) problems.push({ tab: 'Undantag', row: rowNum, reason: 'unreadable', column: 'Datum', value: dateText })
      if (!message) problems.push({ tab: 'Undantag', row: rowNum, reason: 'missing', column: 'Meddelande' })
      return {
        // Sheet row number for admin warnings.
        row: rowNum,
        date,
        dateText,
        groups: field(row, 'Grupp').split(',').map(clean).filter(Boolean),
        message,
        messageEn: field(row, 'Meddelande (EN)'),
      }
    })
    .filter((exception) => exception.date && exception.message)
    .sort((a, b) => a.date.localeCompare(b.date))
}

// An empty Typ means a notice, so rows from before the column existed keep working.
const NOTICE_TYPES = { '': 'notice', anslag: 'notice', nyhet: 'news' }

// The Anslag tab holds both banner notices and news; each item says which it is.
export function parseNotices(rows, problems = []) {
  const notices = []
  for (const [i, row] of rows.map(normalizeRow).entries()) {
    const rowNum = rowOf(row, i)
    // An unknown type is skipped rather than guessed, so a typo never becomes a red banner.
    const typeText = field(row, 'Typ')
    const type = NOTICE_TYPES[typeText.toLowerCase()]
    if (!type) {
      problems.push({ tab: 'Anslag', row: rowNum, reason: 'unknown-type', column: 'Typ', value: typeText })
      continue
    }
    const message = field(row, 'Meddelande')
    const title = type === 'news' ? field(row, 'Rubrik') : ''
    if (!message && !title) {
      problems.push({ tab: 'Anslag', row: rowNum, reason: 'missing', column: type === 'news' ? 'Rubrik' : 'Meddelande' })
      continue
    }
    const fromText = field(row, 'Visa från')
    const toText = field(row, 'Visa till')
    const from = parseDate(fromText)
    const to = parseDate(toText)
    // A date cell that is filled in but can't be read makes the row unsafe to show.
    if (fromText && !from) problems.push({ tab: 'Anslag', row: rowNum, reason: 'unreadable', column: 'Visa från', value: fromText })
    if (toText && !to) problems.push({ tab: 'Anslag', row: rowNum, reason: 'unreadable', column: 'Visa till', value: toText })
    if ((fromText && !from) || (toText && !to)) continue
    notices.push({
      type,
      title,
      titleEn: type === 'news' ? field(row, 'Rubrik (EN)') : '',
      message,
      messageEn: field(row, 'Meddelande (EN)'),
      from,
      to,
    })
  }
  return notices
}

// An empty date limit means no limit; both limits are inclusive.
export function isNoticeActive(notice, today) {
  return (!notice.from || notice.from <= today) && (!notice.to || today <= notice.to)
}

// Keeps only what a phone dialer understands, so "070-123 45 67" and "+46 70…" both work.
export function telHref(phone) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

const siteBase = (url) => url.replace(/index\.html$/, '').replace(/\/$/, '')

// A pasted URL only counts as one of our pages when it points at the site the visitor is on, so
// another site's "#/kontakt" stays an external link. Compared at runtime, so it works on any domain.
function ownRoute(url) {
  const hash = url.indexOf('#')
  const here = globalThis.location
  if (hash < 0 || !here) return undefined
  if (siteBase(url.slice(0, hash)) !== siteBase(here.origin + here.pathname)) return undefined
  return url.slice(hash).match(/^#(\/[\w-]*)$/)?.[1]
}

// Splits a message into plain-text, external-link and in-app-link parts, so the banner can render
// links without v-html. A hash route that matches one of our pages becomes an in-app link, whether
// the editor wrote "#/grupper" or pasted a whole URL from the address bar.
export function linkParts(value) {
  const text = clean(value)
  const parts = []
  let last = 0
  for (const match of text.matchAll(/https?:\/\/[^\s<>"]+|#\/[\w-]*/g)) {
    if (match.index > last) parts.push({ text: text.slice(last, match.index) })
    const token = match[0]
    // Trailing punctuation usually belongs to the sentence, not the address.
    const url = token.startsWith('#') ? token : token.replace(/[.,;:!?)]+$/, '')
    const route = url.startsWith('#') ? url.slice(1) : ownRoute(url)
    const page = route ? linkTargets.find((link) => link.to === route) : undefined
    if (page) parts.push({ to: page.to, navKey: page.key })
    else if (token.startsWith('#')) parts.push({ text: token })
    else parts.push({ text: url, href: url })
    last = match.index + url.length
  }
  if (last < text.length) parts.push({ text: text.slice(last) })
  return parts
}

// Klubbinfo has one row per setting. Values end up in links, so each one that becomes an href is
// checked; anything that doesn't look right is dropped rather than linked.
const CLUB_FIELDS = {
  lokal: 'venue',
  gatuadress: 'street',
  ort: 'city',
  'e-post': 'email',
  telefon: 'phone',
  'bli medlem': 'join',
  facebook: 'facebookUrl',
  instagram: 'instagramUrl',
  behold: 'beholdFeedId',
  // Poster texts (/#/affisch/…): the badge and the Prova på box. No built-in fallback, so a poster
  // never promises anything about trying out that the sheet doesn't say.
  'affisch märke': 'posterBadge',
  'affisch prova på': 'posterTrial',
}

// Only these are shown as text a visitor reads; the rest are addresses, numbers and links.
const CLUB_TRANSLATED = ['venue', 'join', 'posterBadge', 'posterTrial']

const INSTAGRAM_RESERVED = ['explore', 'p', 'reel', 'reels', 'stories', 'tv', 'accounts', 'direct']

const CLUB_CHECKS = {
  email: (value) => (/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(value) ? value : ''),
  phone: (value) => (/\d/.test(value) ? value : ''),
  facebookUrl: (value) => (/^https:\/\/(www\.|m\.)?facebook\.com\/[^\s<>"]+$/.test(value) ? value : ''),
  // Accepts the handle with or without @, or a pasted profile link.
  // Only a profile counts: a location, post or Explore link has more path, or a reserved first part.
  instagramUrl: (value) => {
    const handle = value
      .replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
      .replace(/^@/, '')
      .replace(/[?#].*$/, '')
      .replace(/\/$/, '')
    const valid = /^[\w.]+$/.test(handle) && !INSTAGRAM_RESERVED.includes(handle.toLowerCase())
    return valid ? `https://www.instagram.com/${handle}/` : ''
  },
  beholdFeedId: (value) => (/^[\w-]+$/.test(value) ? value : ''),
}

export function parseClub(rows, problems = []) {
  const club = {}
  const usedRow = {} // key → row number of the row whose value was used
  for (const [i, row] of rows.map(normalizeRow).entries()) {
    const rowNum = rowOf(row, i)
    const fieldText = field(row, 'Fält')
    const key = CLUB_FIELDS[fieldText.toLowerCase()]
    if (!key) {
      if (fieldText) problems.push({ tab: 'Klubbinfo', row: rowNum, reason: 'unknown-field', column: 'Fält', value: fieldText })
      else if (field(row, 'Värde') || field(row, 'Värde (EN)')) problems.push({ tab: 'Klubbinfo', row: rowNum, reason: 'missing', column: 'Fält' })
      continue
    }
    // The first filled-in row for a setting wins, so a stray duplicate further down changes nothing.
    if (club[key]) {
      // D5: a later duplicate of a field whose earlier value was actually used.
      if (usedRow[key] && field(row, 'Värde')) problems.push({ tab: 'Klubbinfo', row: rowNum, reason: 'club-duplicate', column: fieldText, value: usedRow[key] })
      continue
    }
    const check = CLUB_CHECKS[key]
    const rawValue = field(row, 'Värde')
    const value = check ? check(rawValue) : rawValue
    // An empty Värde stays quiet; a filled-in one that fails its check warns.
    if (!value) {
      if (rawValue) problems.push({ tab: 'Klubbinfo', row: rowNum, reason: 'club-invalid', column: fieldText, value: rawValue })
      continue
    }
    club[key] = value
    usedRow[key] = rowNum
    if (CLUB_TRANSLATED.includes(key)) club[`${key}En`] = field(row, 'Värde (EN)')
  }
  return club
}

// The Prova på tab: free-form sections, one row each, kept in sheet order. A row counts when it
// has Swedish text; a heading or a body on its own is fine, a row with only English is skipped.
export function parseTrial(rows, problems = []) {
  return rows
    .map(normalizeRow)
    .map((row, i) => {
      const rowNum = rowOf(row, i)
      const title = field(row, 'Rubrik')
      const text = field(row, 'Text')
      if (!title && !text) {
        // A row with only English content is skipped, so it warns with both reasons (D2).
        problems.push({ tab: 'Prova på', row: rowNum, reason: 'missing', column: 'Rubrik' })
        problems.push({ tab: 'Prova på', row: rowNum, reason: 'missing', column: 'Text' })
      }
      return { title, titleEn: field(row, 'Rubrik (EN)'), text, textEn: field(row, 'Text (EN)') }
    })
    .filter((section) => section.title || section.text)
}

// A line break inside a cell starts a new paragraph, and consecutive lines starting with "-", "–" or
// "•" become one bullet list, so editors can format with Alt+Enter inside a sheet cell.
export function textBlocks(value) {
  const blocks = []
  let list = []
  const flush = () => {
    if (list.length) blocks.push({ list })
    list = []
  }
  for (const line of clean(value).split(/\r?\n/).map(clean)) {
    if (!line) {
      flush()
      continue
    }
    if (/^[-–•]/.test(line)) {
      const item = clean(line.replace(/^[-–•]\s*/, ''))
      if (item) list.push(item)
      continue
    }
    flush()
    blocks.push({ paragraph: line })
  }
  flush()
  return blocks
}

// The Frågor tab: one row per question, kept in sheet order. A row needs a Swedish question and
// answer to be shown; the English cells are optional and fall back per cell.
export function parseFaq(rows, problems = []) {
  return rows
    .map(normalizeRow)
    .map((row, i) => {
      const rowNum = rowOf(row, i)
      const question = field(row, 'Fråga')
      const answer = field(row, 'Svar')
      // D2: an English-only row gets both reasons.
      if (!question) problems.push({ tab: 'Frågor', row: rowNum, reason: 'missing', column: 'Fråga' })
      if (!answer) problems.push({ tab: 'Frågor', row: rowNum, reason: 'missing', column: 'Svar' })
      return { question, questionEn: field(row, 'Fråga (EN)'), answer, answerEn: field(row, 'Svar (EN)') }
    })
    .filter((item) => item.question && item.answer)
}

const DRIVE_HOSTS = ['drive.google.com', 'docs.google.com', 'drive.usercontent.google.com']

// Turns an image cell into an image address, or '' for no image. Editors paste a Drive share link,
// which points at Drive's viewer page rather than the image, so it becomes Google's scaled-down
// thumbnail instead. That endpoint is not an official API: if Google changes it, only this needs
// updating, and until then a failed image falls back like any other.
// A bare filename refers to public/<folder>/; any other https link is used as-is.
export function imageUrl(value, folder) {
  const text = clean(value)
  if (/^https:\/\//.test(text)) {
    let url
    try {
      url = new URL(text)
    } catch {
      return ''
    }
    if (!DRIVE_HOSTS.includes(url.hostname)) return text
    // A folder link is never an image, whichever parameter carries the ID.
    if (url.pathname.includes('/folders/')) return ''
    // On docs.google.com only the uc?id= download form is an image; anything else there
    // (spreadsheets, documents, …) must never end up in an <img src> on the public page —
    // e.g. the club sheet's own edit link, if pasted by mistake.
    if (url.hostname === 'docs.google.com' && !url.pathname.startsWith('/uc')) return ''
    // /d/ as a whole path segment, so only a real file path yields an ID.
    const id = url.pathname.match(/\/d\/([\w-]{10,})/)?.[1] ?? url.searchParams.get('id')
    if (!id || !/^[\w-]{10,}$/.test(id)) return ''
    // Files covered by Google's 2021 link-sharing update also need resourcekey in the URL.
    const resourcekey = url.searchParams.get('resourcekey')
    return `https://drive.google.com/thumbnail?id=${id}&sz=w800${resourcekey ? `&resourcekey=${encodeURIComponent(resourcekey)}` : ''}`
  }
  // Only something that looks like a filename, so "foto kommer" means no image rather than a broken one.
  return /^[^\s/\\:]+\.\w+$/.test(text) ? `./${folder}/${text}` : ''
}

// Classifies a Länk cell: an http:// address is a web link the site won't use, anything else that
// fails the parser's own accept pattern is not a link at all.
const linkProblem = (link, pattern) => (/^http:\/\//i.test(link) ? 'not-https' : pattern.test(link) ? null : 'not-link')

// The Sponsorer tab: one sponsor per row, shown in row order. Rows without a name are skipped.
export function parseSponsors(rows, problems = []) {
  return rows
    .map(normalizeRow)
    .map((row, i) => {
      const rowNum = rowOf(row, i)
      const logoValue = field(row, 'Logga')
      const link = field(row, 'Länk')
      const name = field(row, 'Namn')
      if (!name) problems.push({ tab: 'Sponsorer', row: rowNum, reason: 'missing', column: 'Namn' })
      // D3: a link that isn't https is dropped, the sponsor still shows. Rows without a name are
      // hidden anyway, so don't warn about their link. An http:// link gets its own reason —
      // it is a web address, just not one the site accepts.
      if (name && link) {
        const problem = linkProblem(link, /^https:\/\//)
        if (problem) problems.push({ tab: 'Sponsorer', row: rowNum, reason: problem, column: 'Länk', value: link })
      }
      return {
        name,
        logo: imageUrl(logoValue, 'sponsors'),
        logoValue,
        url: /^https:\/\//.test(link) ? link : '',
        description: field(row, 'Beskrivning'),
        descriptionEn: field(row, 'Beskrivning (EN)'),
      }
    })
    .filter((sponsor) => sponsor.name)
}

export function parseCoaches(rows, problems = []) {
  return rows
    .map(normalizeRow)
    .map((row, i) => {
      const rowNum = rowOf(row, i)
      const bild = field(row, 'Bild')
      const name = field(row, 'Namn')
      if (!name) problems.push({ tab: 'Tränare', row: rowNum, reason: 'missing', column: 'Namn' })
      return {
        row: rowNum,
        name,
        role: field(row, 'Roll'),
        roleEn: field(row, 'Roll (EN)'),
        groups: field(row, 'Grupper').split(',').map(clean).filter(Boolean),
        phone: field(row, 'Telefon'),
        email: field(row, 'E-post'),
        image: imageUrl(bild, 'coaches'),
        // The cell as typed, so the admin page can point out a value that gave no image.
        imageValue: bild,
      }
    })
    .filter((coach) => coach.name)
}

// The Dokument tab: rows grouped by category, in the order each category first appears.
// Rows without a title or with a link that isn't https:// are skipped (D2); an unreadable
// date drops only the date, not the row (D5). Empty category comes last as "Övrigt" (D4).
// Categories match ignoring case and extra spaces; the heading uses the first row's spelling (D9).
// Each category carries its normalized `key` so the view can use it as a stable, unique :key.

export function parseDocuments(rows, problems = []) {
  const categories = []
  const byKey = new Map()
  for (const [i, row] of rows.map(normalizeRow).entries()) {
    const rowNum = rowOf(row, i)
    const title = field(row, 'Titel')
    const url = field(row, 'Länk')
    if (!title) problems.push({ tab: 'Dokument', row: rowNum, reason: 'missing', column: 'Titel' })
    if (!url) problems.push({ tab: 'Dokument', row: rowNum, reason: 'missing', column: 'Länk' })
    else if (/^http:\/\//i.test(url)) problems.push({ tab: 'Dokument', row: rowNum, reason: 'not-https-row', column: 'Länk', value: url })
    else if (!/^https:\/\//i.test(url)) problems.push({ tab: 'Dokument', row: rowNum, reason: 'not-link-row', column: 'Länk', value: url })
    if (!title || !/^https:\/\//i.test(url)) continue
    // D3: an unreadable Datum drops only the date, the row still shows.
    const dateText = field(row, 'Datum')
    if (dateText && !parseDate(dateText)) {
      problems.push({ tab: 'Dokument', row: rowNum, reason: 'unreadable', column: 'Datum', value: dateText })
    }
    const categoryRaw = field(row, 'Kategori')
    // An explicit "Övrigt" and an empty category are the same section, so both end up under one heading.
    let key = categoryRaw.toLowerCase().replace(/\s+/g, ' ').trim()
    if (key === 'övrigt') key = ''
    let category = byKey.get(key)
    if (!category) {
      // The empty category always shows the translated "Övrigt"/"Other", never the raw cell text.
      category = key === ''
        ? { key, name: '', nameEn: '', items: [] }
        : { key, name: categoryRaw, nameEn: field(row, 'Kategori (EN)'), items: [] }
      byKey.set(key, category)
      categories.push(category)
    }
    // The English heading comes from the first row in that category with Kategori (EN).
    if (key && !category.nameEn && field(row, 'Kategori (EN)')) category.nameEn = field(row, 'Kategori (EN)')
    category.items.push({
      title,
      titleEn: field(row, 'Titel (EN)'),
      description: field(row, 'Beskrivning'),
      descriptionEn: field(row, 'Beskrivning (EN)'),
      date: parseDate(dateText),
      url,
    })
  }
  // Empty category ("Övrigt" / "Other") goes last.
  const empty = byKey.get('')
  if (empty) {
    categories.splice(categories.indexOf(empty), 1)
    categories.push(empty)
  }
  return categories
}

// The Resultat tab: one row per result. A row missing a required value or with an unreadable date
// is skipped, so a typo never breaks the page.

const MEDALS = {
  guld: 'gold', gold: 'gold', '1': 'gold',
  silver: 'silver', '2': 'silver',
  brons: 'bronze', bronze: 'bronze', '3': 'bronze',
}

// "GULD", "1:a", "2.", "3rd" all count; anything else is shown as typed, not as a medal.
function medalOf(placement) {
  const key = clean(placement).toLowerCase().replace(/\.$/, '').replace(/:(a|st|nd|rd)$/, '').replace(/^([123])(st|nd|rd)$/, '$1')
  return MEDALS[key] ?? null
}

// Only a Senior row may show more than the first name, so a junior is never shown in full even when
// the editor types the whole name by mistake. Done here, so the full name never reaches the view.
function resultName(name, juniorSenior) {
  const full = name.replace(/\s+/g, ' ')
  return juniorSenior.toLowerCase() === 'senior' ? full : full.split(' ')[0]
}

export function parseResults(rows, problems = []) {
  return rows
    .map(normalizeRow)
    .map((row, i) => {
      const rowNum = rowOf(row, i)
      const dateText = field(row, 'Datum')
      const date = parseDate(dateText)
      const placement = field(row, 'Placering')
      const link = field(row, 'Länk')
      const competition = field(row, 'Tävling')
      const name = field(row, 'Namn')
      if (!dateText) problems.push({ tab: 'Resultat', row: rowNum, reason: 'missing', column: 'Datum' })
      else if (!date) problems.push({ tab: 'Resultat', row: rowNum, reason: 'unreadable', column: 'Datum', value: dateText })
      if (!competition) problems.push({ tab: 'Resultat', row: rowNum, reason: 'missing', column: 'Tävling' })
      if (!name) problems.push({ tab: 'Resultat', row: rowNum, reason: 'missing', column: 'Namn' })
      if (!placement) problems.push({ tab: 'Resultat', row: rowNum, reason: 'missing', column: 'Placering' })
      // A link cell that isn't a web address is dropped, but the row still shows. Rows that are
      // hidden anyway (missing date/competition/name/placement) get no link warning.
      const shown = date && competition && name && placement
      if (shown && link && !/^https?:\/\/\S+$/.test(link)) {
        problems.push({ tab: 'Resultat', row: rowNum, reason: 'not-link', column: 'Länk', value: link })
      }
      return {
        date,
        competition,
        competitionEn: field(row, 'Tävling (EN)'),
        place: field(row, 'Ort'),
        name: resultName(name, field(row, 'Junior/Senior')),
        class: field(row, 'Klass'),
        classEn: field(row, 'Klass (EN)'),
        medal: medalOf(placement),
        placement,
        placementEn: field(row, 'Placering (EN)'),
        link: /^https?:\/\/\S+$/.test(link) ? link : '',
      }
    })
    .filter((result) => result.date && result.competition && result.name && result.placement)
    // Stable sort, so results on the same date keep their sheet order.
    .sort((a, b) => b.date.localeCompare(a.date))
}

// The Evenemang tab: one row per event. A row without a Rubrik is skipped. A date never hides an
// event (D9): an unreadable Datum makes the event undated with its text kept, and an unreadable
// Slutdatum, or one before Datum, is ignored. The problems list feeds the admin page's warnings.

const EVENT_TYPES = {
  tävling: 'competition',
  lager: 'camp',
  läger: 'camp',
  gala: 'gala',
}

export function parseEvents(rows, problems = []) {
  return rows
    .map(normalizeRow)
    .map((row, i) => {
      const rowNum = rowOf(row, i)
      const title = field(row, 'Rubrik')
      if (!title) {
        problems.push({ tab: 'Evenemang', row: rowNum, reason: 'missing', column: 'Rubrik' })
        return null
      }
      const dateText = field(row, 'Datum')
      const endText = field(row, 'Slutdatum')
      const date = parseDate(dateText)
      const end = parseDate(endText)
      const eventProblems = []
      if (!dateText) eventProblems.push('undated')
      else if (!date) eventProblems.push('date-unreadable')
      if (endText && !end) eventProblems.push('end-unreadable')
      else if (date && end && end < date) eventProblems.push('end-before')
      const link = field(row, 'Länk')
      // D3: a link that isn't https is dropped, the event still shows. An http:// link gets its
      // own reason — it is a web address, just not one the site accepts.
      if (link) {
        const problem = linkProblem(link, /^https:\/\/\S+$/)
        if (problem) problems.push({ tab: 'Evenemang', row: rowNum, reason: problem, column: 'Länk', value: link })
      }
      // One image per line in Bild; each line keeps its raw text so the admin page can warn about it.
      const images = field(row, 'Bild')
        .split(/\r?\n/)
        .map((line) => {
          const imageValue = clean(line)
          return { image: imageUrl(imageValue, 'events'), imageValue }
        })
        .filter((img) => img.imageValue)
      return {
        type: EVENT_TYPES[clean(field(row, 'Typ')).toLowerCase()] ?? 'other',
        // Sheet row for admin warnings (D8: event warnings name the row).
        row: rowNum,
        title,
        titleEn: field(row, 'Rubrik (EN)'),
        date,
        end: date && end && end >= date ? end : null,
        dateText,
        time: field(row, 'Tid'),
        timeEn: field(row, 'Tid (EN)'),
        place: field(row, 'Plats'),
        placeEn: field(row, 'Plats (EN)'),
        description: field(row, 'Beskrivning'),
        descriptionEn: field(row, 'Beskrivning (EN)'),
        images,
        // A link cell that isn't a web address gives no button.
        link: /^https:\/\/\S+$/.test(link) ? link : '',
        problems: eventProblems,
      }
    })
    .filter(Boolean)
}

// The Album tab (Bilder page): one row per album, Drive share links one per line in Bild.
// A row with no valid image is skipped; each invalid line warns, and an unreadable Datum drops
// only the date (AC4). Slugs (D4): from the title, else album-N, duplicates get -2, -3 in row order.

function slugify(title) {
  return clean(title)
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Changes the size of a Drive thumbnail URL (imageUrl builds sz=w800); any other URL has no
// size knob and is returned unchanged.
export function resizeImage(url, width) {
  if (!url.includes('drive.google.com/thumbnail')) return url
  return url.replace(/sz=w\d+/, `sz=w${width}`)
}

export function parseAlbums(rows, problems = []) {
  const albums = []
  const usedSlugs = new Set()
  for (const [i, row] of rows.map(normalizeRow).entries()) {
    const rowNum = rowOf(row, i)
    const title = field(row, 'Rubrik')
    const dateText = field(row, 'Datum')
    const date = parseDate(dateText)
    // An unreadable Datum drops only the date, the album still shows.
    if (dateText && !date) problems.push({ tab: 'Album', row: rowNum, reason: 'unreadable', column: 'Datum', value: dateText })
    const lines = field(row, 'Bild').split(/\r?\n/).map(clean).filter(Boolean)
    const parsedLines = lines.map((value) => ({ image: imageUrl(value, 'albums'), value }))
    for (const line of parsedLines) {
      if (!line.image) problems.push({ tab: 'Album', row: rowNum, reason: 'not-image', column: 'Bild', value: line.value })
    }
    const valid = parsedLines.filter((line) => line.image)
    if (!lines.length) problems.push({ tab: 'Album', row: rowNum, reason: 'missing', column: 'Bild' })
    else if (!valid.length) problems.push({ tab: 'Album', row: rowNum, reason: 'no-image', column: 'Bild' })
    if (!valid.length) continue
    // D5: n is the position among the shown albums, after skipped rows.
    const n = albums.length + 1
    const base = slugify(title) || `album-${n}`
    let slug = base
    for (let k = 2; usedSlugs.has(slug); k++) slug = `${base}-${k}`
    usedSlugs.add(slug)
    albums.push({
      row: rowNum,
      n,
      slug,
      title,
      titleEn: field(row, 'Rubrik (EN)'),
      date,
      description: field(row, 'Beskrivning'),
      descriptionEn: field(row, 'Beskrivning (EN)'),
      images: valid.map((line) => line.image),
      // The cover line as typed, so the admin page's image check can point at it.
      coverValue: valid[0].value,
    })
  }
  return albums
}
