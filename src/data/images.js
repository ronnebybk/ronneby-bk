// Test-loads each coach's image in the browser, so the admin page can point out the ones that
// don't work. Kept out of parse.js because it touches the network.

const TIMEOUT_MS = 15000

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.referrerPolicy = 'no-referrer'
    const timer = setTimeout(() => resolve(false), TIMEOUT_MS)
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

// Resolves to the coaches whose Bild value gave no image, or whose image failed to load.
export async function checkImages(coaches) {
  const checks = coaches
    .filter((coach) => coach.imageValue)
    .map(async (coach) => ({ coach, ok: coach.image ? await loadImage(coach.image) : false }))
  const results = await Promise.all(checks)
  return results.filter((r) => !r.ok).map((r) => r.coach)
}
