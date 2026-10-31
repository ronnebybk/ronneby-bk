<script setup>
import { ref, watch } from 'vue'
import { state } from '../data/store.js'
import { checkImages } from '../data/images.js'
import { useI18n } from '../i18n/index.js'

const { t } = useI18n()

const failing = ref([])

// Coaches and sponsors share one list, each labelled with its kind (C1).
const items = () => [
  ...state.coaches.map((c) => ({ ...c, kind: 'coach' })),
  ...state.sponsors.map((s) => ({ ...s, kind: 'sponsor', image: s.logo, imageValue: s.logoValue })),
]

// Re-check when the data changes (cached copy → live copy), keyed by name and raw value so a
// re-render doesn't trigger a new round of image requests. onCleanup guards against a slow,
// stale check overwriting the result of a newer one.
watch(
  () => items().map((c) => `${c.kind}\u0000${c.name}\u0000${c.imageValue}`).join('|'),
  async (_, __, onCleanup) => {
    let stale = false
    onCleanup(() => (stale = true))
    const result = await checkImages(items())
    if (!stale) failing.value = result
  },
  { immediate: true },
)
</script>

<template>
  <!-- Always rendered so the live region exists before its content arrives. -->
  <div role="status" :class="{ 'image-warnings': failing.length }">
    <template v-if="failing.length">
      <p class="title">{{ t('admin.imageWarnings.title') }}</p>
      <ul>
        <li v-for="(item, i) in failing" :key="i">
          <strong>{{ item.name }}</strong> ({{ t(`admin.imageWarnings.kinds.${item.kind}`) }}) — {{ t(`admin.imageWarnings.${item.reason}`) }}
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.image-warnings {
  margin-top: 12px;
  padding: 12px 16px;
  border: 1px solid var(--red-strong);
  border-radius: 8px;
  background: var(--surface);
  font-size: 0.9rem;
}

.title {
  margin: 0 0 6px;
  font-weight: 600;
  color: var(--red-strong);
}

ul {
  margin: 0;
  padding-left: 20px;
}

li {
  margin: 2px 0;
}
</style>
