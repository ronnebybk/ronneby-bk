import { ref, watchEffect } from 'vue'
import sv from './sv.js'
import en from './en.js'

const messages = { sv, en }
const STORAGE_KEY = 'rbt-locale'

function readStoredLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored in messages) return stored
  } catch {}
  return 'sv'
}

export const locale = ref(readStoredLocale())

watchEffect(() => {
  document.documentElement.lang = locale.value
})

export function setLocale(value) {
  if (!(value in messages)) return
  locale.value = value
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {}
}

function lookup(dict, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), dict)
}

// t('home.title') or t('schedule.count', { n: 3 }) → '{n}' is replaced.
export function t(key, params) {
  let text = lookup(messages[locale.value], key) ?? lookup(messages.sv, key) ?? key
  if (params && typeof text === 'string') {
    text = text.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '')
  }
  return text
}

// Picks the English value from the sheet when available, otherwise the Swedish one.
export function localized(svValue, enValue) {
  return locale.value === 'en' && enValue ? enValue : svValue
}

// '2026-08-17' → '17 augusti 2026' / '17 August 2026'
export function formatDate(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(locale.value === 'en' ? 'en-GB' : 'sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function useI18n() {
  return { t, locale, setLocale, localized, formatDate }
}
