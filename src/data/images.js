// Test-loads each item's image in the browser, so the admin page can point out the ones that
// don't work. Kept out of parse.js because it touches the network.
// Works for anything with { name, image, imageValue } — coaches and sponsors alike.

const TIMEOUT_MS = 15000

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.referrerPolicy = 'no-referrer'
    const timer = setTimeout(() => {
      img.src = '' // don't leave a hanging request behind
      resolve(false)
    }, TIMEOUT_MS)
    img.onload = () => {
      clearTimeout(timer)
      resolve(img.naturalWidth > 0)
    }
    img.onerror = () => {
      clearTimeout(timer)
      resolve(false)
    }
    img.src = url
  })
}

// Resolves to the items whose image cell gave no image ({ reason: 'unrecognised' }) or whose
// image failed to load ({ reason: 'failed' }). Each entry carries `kind` so the admin page can
// label it, e.g. "(sponsor)".
export async function checkImages(items) {
  const checks = items
    .filter((item) => item.imageValue)
    .map(async (item) => {
      if (!item.image) return { ...item, reason: 'unrecognised' }
      return (await loadImage(item.image)) ? null : { ...item, reason: 'failed' }
    })
  const results = await Promise.all(checks)
  return results.filter(Boolean)
}
