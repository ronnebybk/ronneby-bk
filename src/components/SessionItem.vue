<script setup>
import { computed } from 'vue'
import { findGroup, groupColorIndex } from '../data/store.js'
import { useI18n } from '../i18n/index.js'

const props = defineProps({
  session: { type: Object, required: true },
  showDay: { type: Boolean, default: false },
})

const { t, localized } = useI18n()
const group = computed(() => findGroup(props.session.group))
const groupName = computed(() => localized(props.session.group, group.value?.nameEn))
</script>

<template>
  <div class="session" :style="{ '--group-color': `var(--group-${groupColorIndex(session.group)})` }">
    <div class="time">
      <span v-if="showDay" class="day">{{ t('days')[session.day - 1] }}</span>
      {{ session.start }}<template v-if="session.end">–{{ session.end }}</template>
    </div>
    <div class="group">{{ groupName }}</div>
    <div v-if="session.coach" class="meta">{{ t('common.coach') }}: {{ session.coach }}</div>
    <div v-if="session.note" class="note">{{ localized(session.note, session.noteEn) }}</div>
  </div>
</template>

<style scoped>
.session {
  border-left: 4px solid var(--group-color);
  background: var(--surface);
  border-radius: 0 8px 8px 0;
  padding: 8px 12px;
  min-width: 0;
  /* Long Swedish group names (Motionsboxning) must fit narrow schedule columns. */
  hyphens: auto;
  overflow-wrap: anywhere;
}

.time {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
}

.day {
  margin-right: 4px;
}

.group {
  font-weight: 600;
}

.meta,
.note {
  font-size: 0.85rem;
  color: var(--muted);
}

.note {
  font-style: italic;
}
</style>
