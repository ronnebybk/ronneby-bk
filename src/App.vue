<script setup>
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import { t } from './i18n/index.js'
import config from './config.js'

const route = useRoute()

const titleKeys = {
  schedule: 'nav.schedule',
  groups: 'nav.groups',
  coaches: 'nav.coaches',
  contact: 'nav.contact',
  privacy: 'privacy.title',
  admin: 'admin.title',
}

watchEffect(() => {
  const key = titleKeys[route.name]
  document.title = key ? `${t(key)} – ${config.clubName}` : config.clubName
})
</script>

<template>
  <SiteHeader />
  <main id="main">
    <RouterView />
  </main>
  <SiteFooter v-if="route.name !== 'admin'" />
</template>
