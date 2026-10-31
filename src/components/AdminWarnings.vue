<script setup>
import { computed, ref, watch } from 'vue'

import { state, eventWarnings } from '../data/store.js'

import { checkImages } from '../data/images.js'

import { useI18n } from '../i18n/index.js'

const { t, localized } = useI18n()

const failing = ref([])

// Coaches, sponsors and every event image share one list, each labelled with its kind.
const items = () => [
  ...state.coaches.map((c) => ({ ...c, kind: 'coach' })),
  ...state.sponsors.map((s) => ({ ...s, kind: 'sponsor', image: s.logo, imageValue: s.logoValue })),
  ...state.events.flatMap((e) => e.images.map((img) => ({ name: e.title, kind: 'event', image: img.image, imageValue: img.imageValue }))),
]

// Re-check when the data changes (cached copy → live copy), keyed by name and raw value so a
// re-render doesn't trigger a new round of image requests. onCleanup guards against a slow,
// stale check overwriting the result of a newer one.
watch(
  () => items().map((c) => `${c.kind} ${c.name} ${c.imageValue}`).join('|'),
  async (_, __, onCleanup) => {
    let stale = false
    onCleanup(() => (stale = true))
    const result = await checkImages(items())
    if (!stale) failing.value = result
  },
  { immediate: true },
)

// Event rows with date problems and results that match no event, in the same box (AC10).
const warnings = computed(() =>
  eventWarnings.value.map((w) =>
    w.kind === 'unmatched-result'
      ? t('admin.warnings.unmatchedResult', { competition: localized(w.competition, w.competitionEn) })
      : t(`admin.warnings.${w.problem}`, { title: localized(w.title, w.titleEn) }),
  ),
)

const any = computed(() => failing.value.length + warnings.value.length)
</script>

<template>
  <!-- Always rendered so the live region exists before its content arrives. -->
  <div role="status" :class="{ 'admin-warnings': any }">
    <template v-if="any">
      <p class="title">{{ t('admin.warnings.title') }}</p>
      <ul>
        <li v-for="(warning, i) in warnings" :key="`w-${i}`">{{ warning }}</li>
        <li v-for="(item, i) in failing" :key="`i-${i}`">
          <strong>{{ item.name }}</strong> ({{ t(`admin.imageWarnings.kinds.${item.kind}`) }}) — {{ t(`admin.imageWarnings.${item.reason}`) }}
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.admin-warnings {
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
