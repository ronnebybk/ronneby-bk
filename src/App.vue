<script setup>
import { watchEffect, nextTick } from 'vue'
import { useRoute, START_LOCATION } from 'vue-router'
import router from './router.js'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import PreviewBar from './components/PreviewBar.vue'
import { t } from './i18n/index.js'
import config from './config.js'
import { preview } from './data/preview.js'

const route = useRoute()

// A plain href="#main" would be read as a route by the hash router (and show the 404 page),
// so the click focuses #main directly.
function skipToContent() {
  document.getElementById('main')?.focus()
}

const titleKeys = {
  schedule: 'nav.schedule',
  groups: 'nav.groups',
  coaches: 'nav.coaches',
  contact: 'nav.contact',
  trial: 'trial.title',
  faq: 'faq.title',
  events: 'events.title',
  privacy: 'privacy.title',
  documents: 'documents.title',
  sponsors: 'sponsors.title',
  admin: 'admin.title',
  posterSchedule: 'poster.scheduleTitle',
  posterGroups: 'poster.groupsTitle',
}

// A4: the bar is not shown on the admin page itself.
const showPreviewBar = () => preview.on && route.name !== 'admin'

watchEffect(() => {
  const key = titleKeys[route.name]
  const base = key ? `${t(key)} – ${config.clubName}` : config.clubName
  document.title = preview.on ? `${t('preview.titlePrefix')}${base}` : base
})

// Announce the new page to screen readers via its heading. Skipped on first load and on
// query/hash-only changes (same path), so e.g. the admin key stripping never steals focus.
router.afterEach(async (to, from) => {
  if (from === START_LOCATION || to.path === from.path) return
  await nextTick()
  const heading = document.querySelector('main h1') ?? document.getElementById('main')
  heading?.setAttribute('tabindex', '-1')
  heading?.focus({ preventScroll: true })
})
</script>

<template>
  <a v-if="!route.meta.bare" href="#main" class="skip-link" @click.prevent="skipToContent">{{ t('common.skipToContent') }}</a>
  <PreviewBar v-if="showPreviewBar()" />
  <SiteHeader v-if="!route.meta.bare" />
  <main id="main" tabindex="-1">
    <RouterView />
  </main>
  <SiteFooter v-if="route.name !== 'admin' && !route.meta.bare" />
  <div v-if="showPreviewBar()" class="preview-frame" aria-hidden="true"></div>
</template>
