<script setup>
import { linkParts } from '../data/parse.js'

// Renders links in sheet text without v-html, so an editor can never inject markup.
defineProps({
  text: { type: String, default: '' },
})
</script>

<template>
  <template v-for="(part, index) in linkParts(text)" :key="index">
    <a v-if="part.href" :href="part.href" target="_blank" rel="noopener">{{ part.text }}</a>
    <template v-else>{{ part.text }}</template>
  </template>
</template>
