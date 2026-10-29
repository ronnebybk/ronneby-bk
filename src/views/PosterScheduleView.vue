<script setup>
import PosterToolbar from '../components/PosterToolbar.vue'
import PosterFrame from '../components/PosterFrame.vue'
import { useI18n } from '../i18n/index.js'

const { t } = useI18n()
</script>

<template>
  <PosterToolbar />
  <PosterFrame
    orientation="landscape"
    :qr-to="{ name: 'schedule' }"
    :qr-caption="t('poster.scheduleQr')"
  >
    <template #title>{{ t('poster.scheduleTitle') }}</template>
  </PosterFrame>
</template>
