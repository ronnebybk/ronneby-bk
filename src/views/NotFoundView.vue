<script setup>
import { useI18n } from '../i18n/index.js'

const { t } = useI18n()
</script>

<template>
  <div class="container page">
    <h1>{{ t('notFound.title') }}</h1>
    <RouterLink to="/" class="btn btn-primary">{{ t('notFound.back') }}</RouterLink>
  </div>
</template>
