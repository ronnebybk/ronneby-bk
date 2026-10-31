<script setup>
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import { t } from './i18n/index.js'
import config from './config.js'

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
  results: 'results.title',
  privacy: 'privacy.title',
  documents: 'documents.title',
  sponsors: 'sponsors.title',
  admin: 'admin.title',
  posterSchedule: 'poster.scheduleTitle',
  posterGroups: 'poster.groupsTitle',
}

watchEffect(() => {
  const key = titleKeys[route.name]
  document.title = key ? `${t(key)} – ${config.clubName}` : config.clubName
})
</script>

<template>
  <a v-if="!route.meta.bare" href="#main" class="skip-link" @click.prevent="skipToContent">{{ t('common.skipToContent') }}</a>
  <SiteHeader v-if="!route.meta.bare" />
  <main id="main" tabindex="-1">
    <RouterView />
  </main>
  <SiteFooter v-if="route.name !== 'admin' && !route.meta.bare" />
</template>
