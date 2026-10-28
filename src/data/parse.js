// Turns raw sheet rows (header → text) into clean objects.
// Editors type into the sheet by hand, so everything here is forgiving:
// rows that can't be understood are skipped instead of breaking the page.

import { navLinks } from '../nav.js'

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

export function parseSeasons(rows) {
  return rows
    .map(normalizeRow)
    .map((row) => ({
      name: field(row, 'Säsong'),
      nameEn: field(row, 'Säsong (EN)'),
      from: parseDate(field(row, 'Från')),
      to: parseDate(field(row, 'Till')),
    }))
    .filter((season) => season.name && season.from && season.to)
    .sort((a, b) => a.from.localeCompare(b.from))
}

const GROUP_FIELDS = { nameEn: 'Grupp (EN)', ages: 'Ålder', description: 'Beskrivning', descriptionEn: 'Beskrivning (EN)' }

// "1 100,00 kr" → 1100. Only a 1–2 digit ending counts as decimals, so "1,100" stays 1100.
function parsePrice(text) {
  const digits = text.replace(/[.,]\d{1,2}(?=\D*$)/, '').replace(/[^\d]/g, '')
  return digits === '' ? null : Number(digits)
}

// Rows with the same group name are one group with several ways to pay (e.g. per term and per
// year). Each detail comes from the first row that has it, like in Klubbinfo; each row adds its price.
export function parseGroups(rows) {
  const byName = new Map()
  for (const row of rows.map(normalizeRow)) {
    const name = field(row, 'Grupp')
    if (!name) continue
    if (!byName.has(name)) byName.set(name, { name, nameEn: '', ages: '', description: '', descriptionEn: '', prices: [] })
    const group = byName.get(name)
    for (const [key, column] of Object.entries(GROUP_FIELDS)) group[key] ||= field(row, column)

    const price = parsePrice(field(row, 'Pris (kr)'))
    if (price === null) continue
    const period = field(row, 'Prisperiod').toLowerCase()
    const option = { price, period: PERIODS.includes(period) ? period : 'termin' }
    // A pasted copy of the same row shouldn't list the same price twice, and free is free whatever the period.
    if (!group.prices.some((p) => p.price === price && (price === 0 || p.period === option.period))) {
      group.prices.push(option)
    }
  }
  // "Gratis · 800 kr / termin" contradicts itself, so a free row only counts when nothing costs money.
  for (const group of byName.values()) {
    if (group.prices.some((p) => p.price > 0)) group.prices = group.prices.filter((p) => p.price > 0)
  }
  return [...byName.values()]
}

export function parseSessions(rows) {
  return rows
    .map(normalizeRow)
    .map((row) => ({
      season: field(row, 'Säsong'),
      day: parseDay(field(row, 'Dag')),
      start: parseTime(field(row, 'Start')),
      end: parseTime(field(row, 'Slut')),
      // Several groups can share a session, comma-separated like Grupper in the Tränare tab.
      groups: field(row, 'Grupp').split(',').map(clean).filter(Boolean),
      coach: field(row, 'Tränare'),
      note: field(row, 'Notering'),
      noteEn: field(row, 'Notering (EN)'),
    }))
    .filter((session) => session.season && session.day && session.start && session.groups.length)
    .sort((a, b) => a.day - b.day || a.start.localeCompare(b.start))
}

// An empty Typ means a notice, so rows from before the column existed keep working.
const NOTICE_TYPES = { '': 'notice', anslag: 'notice', nyhet: 'news' }

// The Anslag tab holds both banner notices and news; each item says which it is.
export function parseNotices(rows) {
  const notices = []
  for (const row of rows.map(normalizeRow)) {
    // An unknown type is skipped rather than guessed, so a typo never becomes a red banner.
    const type = NOTICE_TYPES[field(row, 'Typ').toLowerCase()]
    if (!type) continue
    const message = field(row, 'Meddelande')
    const title = type === 'news' ? field(row, 'Rubrik') : ''
    if (!message && !title) continue
    const fromText = field(row, 'Visa från')
    const toText = field(row, 'Visa till')
    const from = parseDate(fromText)
    const to = parseDate(toText)
    // A date cell that is filled in but can't be read makes the row unsafe to show.
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
    const page = route ? navLinks.find((link) => link.to === route) : undefined
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
}

// Only these are shown as text a visitor reads; the rest are addresses, numbers and links.
const CLUB_TRANSLATED = ['venue', 'join']

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

export function parseClub(rows) {
  const club = {}
  for (const row of rows.map(normalizeRow)) {
    const key = CLUB_FIELDS[field(row, 'Fält').toLowerCase()]
    // The first filled-in row for a setting wins, so a stray duplicate further down changes nothing.
    if (!key || club[key]) continue
    const check = CLUB_CHECKS[key]
    const value = check ? check(field(row, 'Värde')) : field(row, 'Värde')
    if (!value) continue
    club[key] = value
    if (CLUB_TRANSLATED.includes(key)) club[`${key}En`] = field(row, 'Värde (EN)')
  }
  return club
}

// The Prova på tab: free-form sections, one row each, kept in sheet order. A row counts when it
// has Swedish text; a heading or a body on its own is fine, a row with only English is skipped.
export function parseTrial(rows) {
  return rows
    .map(normalizeRow)
    .map((row) => ({
      title: field(row, 'Rubrik'),
      titleEn: field(row, 'Rubrik (EN)'),
      text: field(row, 'Text'),
      textEn: field(row, 'Text (EN)'),
    }))
    .filter((section) => section.title || section.text)
}

// A line break inside a cell starts a new paragraph, and consecutive lines starting with "-" become
// one bullet list, so editors can format with Alt+Enter inside a sheet cell.
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
    if (line.startsWith('-')) {
      const item = clean(line.replace(/^-\s*/, ''))
      if (item) list.push(item)
      continue
    }
    flush()
    blocks.push({ paragraph: line })
  }
  flush()
  return blocks
}

export function parseCoaches(rows) {
  return rows
    .map(normalizeRow)
    .map((row) => {
      const image = field(row, 'Bild')
      return {
        name: field(row, 'Namn'),
        role: field(row, 'Roll'),
        roleEn: field(row, 'Roll (EN)'),
        groups: field(row, 'Grupper').split(',').map(clean).filter(Boolean),
        phone: field(row, 'Telefon'),
        email: field(row, 'E-post'),
        // A bare filename refers to public/coaches/; a full https link is used as-is.
        image: !image ? '' : /^https:\/\//.test(image) ? image : `./coaches/${image}`,
      }
    })
    .filter((coach) => coach.name)
}
