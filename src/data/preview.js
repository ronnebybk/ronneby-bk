import { reactive } from 'vue'
import { load } from './storage.js'
import config from '../config.js'

// The sheet's edit ID is never in the code (the repo is public). Editors get a link like
// …/#/admin?k=<sheet-id>; the ID is stored on their device and removed from the address bar.
export const ADMIN_KEY_STORAGE = 'rbt-admin-key'
export const VALID_KEY = /^[A-Za-z0-9_-]{20,}$/

const PREVIEW_FLAG = 'rbt-preview'

export function adminKey() {
  return load(ADMIN_KEY_STORAGE) ?? ''
}

export function hasValidKey() {
  return VALID_KEY.test(adminKey())
}

// Preview is only meaningful when a sheet is configured (not demo mode) and a valid key exists.
export function isPreviewOn() {
  if (!config.sheet.publishedId) return false
  if (!hasValidKey()) return false
  try {
    return sessionStorage.getItem(PREVIEW_FLAG) === '1'
  } catch {
    return false
  }
}

export function setPreviewFlag(on) {
  try {
    if (on) sessionStorage.setItem(PREVIEW_FLAG, '1')
    else sessionStorage.removeItem(PREVIEW_FLAG)
  } catch {}
}

// Reactive preview state, read by the bar and App.vue for the frame/title prefix.
export const preview = reactive({
  on: isPreviewOn(),
  loadedAt: null,
  loading: false,
  error: false,
  failedTabs: [],
  fallback: false,
})
