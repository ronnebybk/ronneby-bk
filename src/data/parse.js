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
