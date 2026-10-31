<script setup>
import { useI18n } from '../i18n/index.js'

const { t } = useI18n()
</script>

<template>
  <span class="visually-hidden"> ({{ t('common.newTab') }})</span>
</template>
