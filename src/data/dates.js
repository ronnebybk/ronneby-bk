// Shared local-time date helpers (F6). Pure, no imports, so they can be unit-tested in Node.

export const pad = (n) => String(n).padStart(2, '0')

// Date → YYYY-MM-DD
export function toIso(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Monday = 1 … Sunday = 7
export function weekday(date = new Date()) {
  return ((date.getDay() + 6) % 7) + 1
}
