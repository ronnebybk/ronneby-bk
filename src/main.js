import { createApp } from 'vue'
import '@fontsource/oswald/500.css'
import '@fontsource/oswald/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import './style.css'
import App from './App.vue'
import router from './router.js'
import { loadData } from './data/store.js'

loadData()
// Wait for the first route, so a poster page never flashes the site header and footer. Mount even if
// that route fails to load (flaky network, old chunk after a deploy): a page with the site header
// beats a blank one.
const app = createApp(App).use(router)
router
  .isReady()
  .catch((error) => console.error('First route failed to load', error))
  .finally(() => app.mount('#app'))
