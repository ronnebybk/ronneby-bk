import { reactive } from 'vue'
import { loadJson, saveJson } from './storage.js'

const STORAGE_KEY = 'rbt-consent'

// { facebook: true, instagram: true } once the visitor has chosen to show a feed.
export const consent = reactive({ facebook: false, instagram: false, ...loadJson(STORAGE_KEY) })

function save() {
  saveJson(STORAGE_KEY, consent)
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
