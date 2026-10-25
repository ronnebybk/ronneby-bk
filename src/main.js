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
createApp(App).use(router).mount('#app')
