// localStorage can throw (private mode, blocked site data), and nothing stored there is essential,
// so every read falls back to null and every write may silently do nothing.

export function load(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {}
}

export function remove(key) {
  try {
    localStorage.removeItem(key)
  } catch {}
}

export function loadJson(key) {
  try {
    return JSON.parse(load(key))
  } catch {
    return null
  }
}

export function saveJson(key, value) {
  save(key, JSON.stringify(value))
}
