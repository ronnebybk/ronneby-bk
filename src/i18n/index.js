import { ref, watchEffect } from 'vue'
import sv from './sv.js'
import en from './en.js'
import { load, save } from '../data/storage.js'

const messages = { sv, en }
const STORAGE_KEY = 'rbt-locale'

function readStoredLocale() {
  const stored = load(STORAGE_KEY)
  return stored in messages ? stored : 'sv'
}

export const locale = ref(readStoredLocale())

watchEffect(() => {
  document.documentElement.lang = locale.value
})

export function setLocale(value) {
  if (!(value in messages)) return
  locale.value = value
  save(STORAGE_KEY, value)
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

// '2026-11-03' → 'tisdag' / 'Tuesday', or with the date: 'tisdag 3 november' / 'Tuesday 3 November'
export function formatWeekday(iso, withDate = false) {
  const [year, month, day] = iso.split('-').map(Number)
  const options = withDate ? { weekday: 'long', day: 'numeric', month: 'long' } : { weekday: 'long' }
  return new Date(year, month - 1, day).toLocaleDateString(locale.value === 'en' ? 'en-GB' : 'sv-SE', options)
}

export function useI18n() {
  return { t, locale, setLocale, localized, formatDate, formatWeekday }
}
