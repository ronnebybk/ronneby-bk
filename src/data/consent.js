import { reactive } from 'vue'

const STORAGE_KEY = 'rbt-consent'

function read() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

// { facebook: true, instagram: true } once the visitor has chosen to show a feed.
export const consent = reactive({ facebook: false, instagram: false, ...read() })

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
  } catch {}
}

export function giveConsent(service) {
  consent[service] = true
  save()
}

export function revokeConsent() {
  consent.facebook = false
  consent.instagram = false
  save()
}
