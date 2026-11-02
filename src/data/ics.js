// Builds a group's weekly sessions as an .ics calendar file, entirely in the browser.
// Pure functions with no Vue or store imports, so the format rules can be checked in Node.

const TZID = 'Europe/Stockholm'

// Hand-written VTIMEZONE for Europe/Stockholm (EU rule: last Sunday of March/October).
// RFC 5545 requires one per TZID used, and Outlook and some older apps need it.
const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  `TZID:${TZID}`,
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
]

// Escapes a text value per RFC 5545: backslash, semicolon, comma, newline.
function escapeText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

// Folds a line at 75 octets (UTF-8 bytes), so å/ä/ö don't break the limit.
function fold(line) {
  const bytes = Buffer.byteLength(line, 'utf8')
  if (bytes <= 75) return line
  const out = []
  let rest = line
  let first = true
  while (Buffer.byteLength(rest, 'utf8') > (first ? 75 : 74)) {
    const limit = first ? 75 : 74
    // Walk back to a character whose byte length fits the limit.
    let cut = rest.length
    while (Buffer.byteLength(rest.slice(0, cut), 'utf8') > limit) cut--
    out.push((first ? '' : ' ') + rest.slice(0, cut))
    rest = rest.slice(cut)
    first = false
  }
  out.push((first ? '' : ' ') + rest)
  return out.join('\r\n')
}

const pad = (n) => String(n).padStart(2, '0')

// YYYY-MM-DD → Date at midnight local (the site's dates are local calendar dates).
function parseIso(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Date → YYYY-MM-DD
function toIso(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Monday = 1 … Sunday = 7
function weekdayOf(date) {
  return ((date.getDay() + 6) % 7) + 1
}

// Europe/Stockholm is UTC+1 (CET) in winter and UTC+2 (CEST) in summer. The EU rule:
// summer from the last Sunday of March 02:00 local, winter from the last Sunday of October 03:00.
// Computed from UTC fields only, so the result doesn't depend on the system's timezone.
function stockholmOffsetMinutes(year, monthIndex, day) {
  const lastSundayUtc = (m) => {
    const d = new Date(Date.UTC(year, m + 1, 0)) // last day of month
    return d.getUTCDate() - ((d.getUTCDay() + 6) % 7)
  }
  // 02:00 local in March = 01:00 UTC; 03:00 local in October (still CEST) = 01:00 UTC.
  const summerStart = Date.UTC(year, 2, lastSundayUtc(2), 1, 0, 0)
  const winterStart = Date.UTC(year, 9, lastSundayUtc(9), 1, 0, 0)
  // Noon UTC is safely away from both 01:00 UTC transitions.
  const dateUtc = Date.UTC(year, monthIndex, day, 12, 0, 0)
  return dateUtc >= summerStart && dateUtc < winterStart ? 120 : 60
}

// Converts a Stockholm local date+time to a UTC stamp, e.g. for UNTIL.
function stockholmToUtcStamp(date, hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const offset = stockholmOffsetMinutes(date.getFullYear(), date.getMonth(), date.getDate())
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0) - offset * 60000)
  return `${utc.getUTCFullYear()}${pad(utc.getUTCMonth() + 1)}${pad(utc.getUTCDate())}T${pad(utc.getUTCHours())}${pad(utc.getUTCMinutes())}${pad(utc.getUTCSeconds())}Z`
}

// The current instant as a UTC stamp, for DTSTAMP.
function utcStamp(now) {
  return `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`
}

// The first date with the session's weekday on or after `fromIso`.
function firstOccurrence(day, fromIso) {
  const from = parseIso(fromIso)
  const offset = (day - weekdayOf(from) + 7) % 7
  const d = new Date(from)
  d.setDate(d.getDate() + offset)
  return d
}

// The last date with the session's weekday on or before `toIso`.
function lastOccurrence(day, toIso) {
  const to = parseIso(toIso)
  const offset = (weekdayOf(to) - day + 7) % 7
  const d = new Date(to)
  d.setDate(d.getDate() - offset)
  return d
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// `ronnebyboxing-<group>.ics` — always from the Swedish group name, so the name doesn't
// change with the site's language.
export function fileName(name) {
  return `ronnebyboxing-${slug(name)}.ics`
}

// Builds the calendar text.
// - season: { name, from, to } (ISO dates)
// - sessions: the sessions to include (already filtered to the group, or all of them)
// - isCancelled(iso, session): the page's rule, passed in so it's enforced in one place
// - today: YYYY-MM-DD, now: Date (for DTSTAMP)
// - summary(session), description(session): localized texts; location: a string
export function buildCalendar({ season, sessions, isCancelled, today, now, summary, location, description }) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ronneby Boxing Team//Schema//SV',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...VTIMEZONE,
  ]

  const rangeStart = season.from > today ? season.from : today

  for (const session of sessions) {
    const first = firstOccurrence(session.day, rangeStart)
    const last = lastOccurrence(session.day, season.to)
    if (toIso(first) > toIso(last)) continue

    const startStamp = `${toIso(first).replace(/-/g, '')}T${session.start.replace(':', '')}00`
    const uid = `${slug(season.name)}-${session.day}-${session.start.replace(':', '')}-${slug(session.groups.join('-'))}@ronnebybk.github.io`
    const dtstamp = utcStamp(now)

    const event = [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;TZID=${TZID}:${startStamp}`,
    ]
    if (session.end) {
      event.push(`DTEND;TZID=${TZID}:${toIso(first).replace(/-/g, '')}T${session.end.replace(':', '')}00`)
    }
    event.push(`RRULE:FREQ=WEEKLY;UNTIL=${stockholmToUtcStamp(last, session.start)}`)

    // EXDATE: every cancelled occurrence within the range.
    const exdates = []
    for (let d = new Date(first); toIso(d) <= toIso(last); d.setDate(d.getDate() + 7)) {
      const iso = toIso(d)
      if (isCancelled(iso, session)) {
        exdates.push(`${iso.replace(/-/g, '')}T${session.start.replace(':', '')}00`)
      }
    }
    if (exdates.length) event.push(`EXDATE;TZID=${TZID}:${exdates.join(',')}`)

    event.push(`SUMMARY:${escapeText(summary(session))}`)
    if (location) event.push(`LOCATION:${escapeText(location)}`)
    const desc = description(session)
    if (desc) event.push(`DESCRIPTION:${escapeText(desc)}`)
    event.push('END:VEVENT')
    lines.push(...event)
  }

  lines.push('END:VCALENDAR')
  return lines.map(fold).join('\r\n') + '\r\n'
}
