<script setup>
import { groupStyle, groupNames, timeRange } from '../data/store.js'
import { useI18n } from '../i18n/index.js'

defineProps({
  session: { type: Object, required: true },
  showDay: { type: Boolean, default: false },
})

const { t, localized } = useI18n()
</script>

<template>
  <div class="session" :style="groupStyle(session.groups[0])">
    <div class="time">
      <span v-if="showDay" class="day">{{ t('days')[session.day - 1] }}</span>
      {{ timeRange(session) }}
    </div>
    <div class="group">{{ groupNames(session.groups) }}</div>
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
  /* Safety net only: long names should never overflow their column. */
  overflow-wrap: break-word;
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
