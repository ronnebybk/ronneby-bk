<script setup>
import { linkParts } from '../data/parse.js'
import { useI18n } from '../i18n/index.js'

// Renders links in sheet text without v-html, so an editor can never inject markup. A link to one
// of our own pages becomes a normal in-app navigation with the page name as its label.
defineProps({
  text: { type: String, default: '' },
})

const { t } = useI18n()
</script>

<template>
  <template v-for="(part, index) in linkParts(text)" :key="index">
    <RouterLink v-if="part.to" :to="part.to">{{ t(part.navKey) }}</RouterLink>
    <a v-else-if="part.href" :href="part.href" target="_blank" rel="noopener noreferrer">{{ part.text }}</a>
    <template v-else>{{ part.text }}</template>
  </template>
</template>
