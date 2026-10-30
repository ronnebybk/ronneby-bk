<script setup>
import { ref, watch } from 'vue'

import { state } from '../data/store.js'
import { checkImages } from '../data/images.js'
import { useI18n } from '../i18n/index.js'

const { t } = useI18n()

const failing = ref([])
const checking = ref(false)

// Re-check when the data changes (cached copy → live copy), keyed by the URLs so a re-render
// doesn't trigger a new round of image requests.
watch(
  () => state.coaches.map((c) => c.image).join('|'),
  async () => {
    const coaches = state.coaches.filter((c) => c.imageValue)
    if (!coaches.length) {
      failing.value = []
      return
    }
    checking.value = true
    failing.value = await checkImages(coaches)
    checking.value = false
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="failing.length" class="image-warnings" role="status">
    <p class="title">{{ t('admin.imageWarnings.title') }}</p>
    <ul>
      <li v-for="coach in failing" :key="coach.name">
        <strong>{{ coach.name }}</strong> — {{ t('admin.imageWarnings.reason') }}
      </li>
    </ul>
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
