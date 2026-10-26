// Turns raw sheet rows (header → text) into clean objects.
// Editors type into the sheet by hand, so everything here is forgiving:
// rows that can't be understood are skipped instead of breaking the page.

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

export function parseDay(value) {
  const text = clean(value).toLowerCase()
  if (/^[1-7]$/.test(text)) return Number(text)
  return DAY_NAMES[text] ?? null
}

// Accepts 17:30, 17.30, 17:30:00 and 1730.
export function parseTime(value) {
  const match = clean(value).match(/^(\d{1,2})[:.]?(\d{2})/)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

// Returns YYYY-MM-DD. Accepts 2026-08-17 (Swedish sheet locale), 17.8.2026 and 8/17/2026 (US locale).
export function parseDate(value) {
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

export function parseGroups(rows) {
  return rows
    .map(normalizeRow)
    .map((row) => {
      const price = field(row, 'Pris (kr)').replace(/[^\d]/g, '')
      const period = field(row, 'Prisperiod').toLowerCase()
      return {
        name: field(row, 'Grupp'),
        nameEn: field(row, 'Grupp (EN)'),
        ages: field(row, 'Ålder'),
        description: field(row, 'Beskrivning'),
        descriptionEn: field(row, 'Beskrivning (EN)'),
        price: price === '' ? null : Number(price),
        period: PERIODS.includes(period) ? period : 'termin',
      }
    })
    .filter((group) => group.name)
}

export function parseSessions(rows) {
  return rows
    .map(normalizeRow)
    .map((row) => ({
      season: field(row, 'Säsong'),
      day: parseDay(field(row, 'Dag')),
      start: parseTime(field(row, 'Start')),
      end: parseTime(field(row, 'Slut')),
      group: field(row, 'Grupp'),
      coach: field(row, 'Tränare'),
      note: field(row, 'Notering'),
      noteEn: field(row, 'Notering (EN)'),
    }))
    .filter((session) => session.season && session.day && session.start && session.group)
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

// Splits a message into plain-text and link parts, so the banner can render links without v-html.
export function linkParts(value) {
  const text = clean(value)
  const parts = []
  let last = 0
  for (const match of text.matchAll(/https?:\/\/[^\s<>"]+/g)) {
    // Trailing punctuation usually belongs to the sentence, not the address.
    const url = match[0].replace(/[.,;:!?)]+$/, '')
    if (match.index > last) parts.push({ text: text.slice(last, match.index) })
    parts.push({ text: url, href: url })
    last = match.index + url.length
  }
  if (last < text.length) parts.push({ text: text.slice(last) })
  return parts
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
