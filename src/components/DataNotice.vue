<script setup>
import { state } from '../data/store.js'
import { useI18n } from '../i18n/index.js'

const { t } = useI18n()
const messages = { demo: 'common.demoData', cache: 'common.offline', error: 'common.loadError' }
</script>

<template>
  <p v-if="messages[state.status]" class="notice" role="status">{{ t(messages[state.status]) }}</p>
</template>
