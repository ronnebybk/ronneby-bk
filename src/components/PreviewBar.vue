<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '../i18n/index.js'
import { preview, previewTab } from '../data/preview.js'
import { refreshPreview, endPreview } from '../data/store.js'

const { t } = useI18n()
const router = useRouter()

function formatTime(date) {
  if (!date) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const loadedAtText = computed(() => (preview.loadedAt ? t('preview.loadedAt', { time: formatTime(preview.loadedAt) }) : ''))

const errorText = computed(() => {
  if (!preview.error) return ''
  if (preview.fallback || !preview.loadedAt) return t('preview.errorFirst')
  return t('preview.error', { time: formatTime(preview.loadedAt) })
})

const failedTabsText = computed(() => {
  if (!preview.failedTabs.length) return ''
  const names = preview.failedTabs.map((tab) => t(`admin.tabs.${tab}`))
  return t('preview.failedTabs', { tabs: names.join(', ') })
})

function update() {
  refreshPreview()
}

function toAdmin() {
  const tab = previewTab()
  router.push(tab ? { path: '/admin', query: { tab } } : '/admin')
}

function end() {
  endPreview()
}
</script>

<template>
  <div class="preview-bar" role="status">
    <div class="container bar-inner">
      <span class="badge">{{ t('preview.label') }}</span>
      <span class="text">{{ t('preview.text') }}</span>
      <span v-if="loadedAtText" class="time">{{ loadedAtText }}</span>
      <span v-if="errorText" class="warning">{{ errorText }}</span>
      <span v-if="failedTabsText" class="warning">{{ failedTabsText }}</span>
      <div class="actions">
        <button type="button" class="bar-btn" :disabled="preview.loading" :aria-busy="preview.loading" @click="update">
          <span v-if="preview.loading" class="spinner" aria-hidden="true"></span>{{ preview.loading ? t('preview.loading') : t('preview.update') }}
        </button>
        <button type="button" class="bar-btn" @click="toAdmin">{{ t('preview.toAdmin') }}</button>
        <button type="button" class="bar-btn end" @click="end">{{ t('preview.end') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-bar {
  background: var(--preview);
  color: var(--preview-ink);
  padding: 8px 0;
  font-size: 0.9rem;
}

.bar-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 14px;
}

.badge {
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 10px;
  border-radius: 4px;
  background: var(--preview-ink);
  color: var(--preview);
  flex: none;
}

.text {
  flex: 1 1 200px;
}

.time {
  flex: none;
  font-variant-numeric: tabular-nums;
}

.warning {
  flex: 1 1 100%;
  font-weight: 600;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: none;
}

.bar-btn {
  background: transparent;
  border: 1.5px solid var(--preview-ink);
  color: var(--preview-ink);
  border-radius: 999px;
  padding: 4px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.bar-btn:hover {
  background: rgb(0 0 0 / 0.1);
}

.bar-btn:disabled {
  cursor: default;
  opacity: 0.75;
}

.bar-btn:disabled:hover {
  background: transparent;
}

.spinner {
  display: inline-block;
  width: 0.85em;
  height: 0.85em;
  margin-right: 6px;
  vertical-align: -0.1em;
  border: 2px solid var(--preview-ink);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.bar-btn.end {
  background: var(--preview-ink);
  color: var(--preview);
}

.bar-btn.end:hover {
  background: var(--preview-ink);
  opacity: 0.85;
}

@media print {
  .preview-bar {
    display: none;
  }
}
</style>
