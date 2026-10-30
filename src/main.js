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
// the new one; the flag stops a loop when the network itself is down.
window.addEventListener('vite:preloadError', (event) => {
  if (sessionStorage.getItem('chunkReload')) return
  sessionStorage.setItem('chunkReload', '1')
  event.preventDefault()
  location.reload()
})
router.isReady().then(() => sessionStorage.removeItem('chunkReload'), () => {})

loadData()
// Wait for the first route, so a poster page never flashes the site header and footer. Mount anyway
// if that route fails or hangs on a slow connection: a page with the site header beats a blank one,
// and the route still renders when it arrives.
const app = createApp(App).use(router)
const timeout = new Promise((resolve) => setTimeout(resolve, 3000))
Promise.race([router.isReady(), timeout])
  .catch((error) => console.error('First route failed to load', error))
  .finally(() => app.mount('#app'))
