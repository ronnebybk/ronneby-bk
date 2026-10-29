<script setup>
import LangToggle from './LangToggle.vue'
import DataNotice from './DataNotice.vue'
import { state } from '../data/store.js'
import { useI18n } from '../i18n/index.js'

const { t } = useI18n()
const print = () => window.print()
</script>

<template>
  <div class="poster-toolbar">
    <div class="controls">
      <LangToggle />
      <slot />
      <button type="button" class="btn btn-primary" @click="print">{{ t('poster.print') }}</button>
    </div>
    <p v-if="state.status === 'loading'" class="status" role="status">{{ t('common.loading') }}</p>
    <DataNotice />
  </div>
</template>

<style scoped>
.poster-toolbar {
  background: var(--ink);
  color: var(--on-ink);
  padding: 12px 16px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.btn {
  margin-left: auto;
  padding: 8px 20px;
}

.status {
  margin: 8px 0 0;
  color: var(--on-ink-muted);
}

.poster-toolbar :deep(.notice) {
  max-width: 1100px;
  margin: 10px auto 0;
  color: var(--text);
}

@media print {
  .poster-toolbar {
    display: none;
  }
}
</style>
