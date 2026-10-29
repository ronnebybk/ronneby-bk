<script setup>
import PosterToolbar from '../components/PosterToolbar.vue'
import PosterFrame from '../components/PosterFrame.vue'
import { useI18n } from '../i18n/index.js'

const { t } = useI18n()
</script>

<template>
  <PosterToolbar />
  <PosterFrame
    orientation="portrait"
    :qr-to="{ name: 'groups' }"
    :qr-caption="t('poster.groupsQr')"
  >
    <template #title>{{ t('poster.groupsTitle') }}</template>
  </PosterFrame>
</template>
