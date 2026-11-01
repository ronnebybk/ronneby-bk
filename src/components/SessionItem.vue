<script setup>
import { groupStyle, groupNames, timeRange } from '../data/store.js'
import { useI18n } from '../i18n/index.js'

defineProps({
  session: { type: Object, required: true },
  showDay: { type: Boolean, default: false },
  // Weekly schedule only: the struck time and group plus the badge mark the cancellation; the
  // red box above carries the date and reason, so the message stays hidden here.
  compact: { type: Boolean, default: false },
})

const { t, localized } = useI18n()
</script>

<template>
  <div class="session" :class="{ cancelled: session.exception }" :style="groupStyle(session.groups[0])">
    <div class="time">
      <span v-if="showDay" class="day">{{ t('days')[session.day - 1] }}</span>
      <span class="range">{{ timeRange(session) }}</span>
      <span v-if="session.exception" class="badge">{{ t('common.cancelled') }}</span>
    </div>
    <div class="group">{{ groupNames(session.groups) }}</div>
    <div v-if="session.coach" class="meta">{{ t('common.coach') }}: {{ session.coach }}</div>
    <div v-if="session.exception && !compact" class="note">{{ localized(session.exception.message, session.exception.messageEn) }}</div>
    <div v-else-if="session.note" class="note">{{ localized(session.note, session.noteEn) }}</div>
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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.session.cancelled {
  opacity: 0.75;
}

.session.cancelled .group,
.session.cancelled .range {
  text-decoration: line-through;
}

.badge {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  background: var(--red-strong);
  color: #fff;
  padding: 1px 8px;
  border-radius: 999px;
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
