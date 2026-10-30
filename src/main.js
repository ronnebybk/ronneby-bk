import { createApp } from 'vue'
import '@fontsource/oswald/500.css'
import '@fontsource/oswald/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import './style.css'
import App from './App.vue'
import router from './router.js'
import { loadData } from './data/store.js'

// An index.html cached from before a deploy asks for chunks that no longer exist. Reload once to get
// the new one; the flag stops a loop when the network itself is down. sessionStorage throws when site
// data is blocked, and then the flag can't work, so don't reload at all.
function claimChunkReload() {
  try {
    if (sessionStorage.getItem('chunkReload')) return false
    sessionStorage.setItem('chunkReload', '1')
    return true
  } catch {
    return false
  }
}

let staleChunk = false
window.addEventListener('vite:preloadError', () => {
  staleChunk = true
})
router.onError((error, to) => {
  if (!staleChunk || !claimChunkReload()) return
  // The URL still shows the page the visitor was leaving, so point it at the one they asked for.
  history.replaceState(null, '', router.resolve(to).href)
  location.reload()
})
router.isReady().then(() => {
  try {
    sessionStorage.removeItem('chunkReload')
  } catch {}
}, () => {})

loadData()
// Wait for the first route, so a poster page never flashes the site header and footer. Mount anyway
// if that route fails or hangs on a slow connection: a page with the site header beats a blank one,
// and the route still renders when it arrives.
const app = createApp(App).use(router)
const timeout = new Promise((resolve) => setTimeout(resolve, 3000))
Promise.race([router.isReady(), timeout])
  .catch((error) => console.error('First route failed to load', error))
  .finally(() => app.mount('#app'))
