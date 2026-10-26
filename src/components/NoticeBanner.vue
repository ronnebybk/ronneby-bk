<script setup>
import { computed, ref } from 'vue'
import { activeNotices } from '../data/store.js'
import { linkParts } from '../data/parse.js'
import { useI18n } from '../i18n/index.js'

// Dismissals are remembered per message text in this browser. Storage can be blocked, so the
// in-memory list still hides them until the page is reloaded.
const STORAGE_KEY = 'rbt-dismissed-notices'

const { t, localized } = useI18n()

function readDismissed() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(stored) ? stored.filter((text) => typeof text === 'string') : []
  } catch {
    return []
  }
}

const dismissed = ref(readDismissed())

const visible = computed(() =>
  activeNotices.value.filter((notice) => !dismissed.value.includes(notice.message)),
)

function dismissAll() {
  // Remember every active message, not just the visible ones, so the rest doesn't reappear.
  dismissed.value = [...new Set(activeNotices.value.map((notice) => notice.message))]
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed.value))
  } catch {}
}
</script>

<template>
  <section v-if="visible.length" class="notices" :aria-label="t('notices.label')">
    <div class="container row">
      <ul class="list">
        <li v-for="(notice, noticeIndex) in visible" :key="`${notice.message}-${noticeIndex}`" class="notice-banner">
          <p>
            <template v-for="(part, index) in linkParts(localized(notice.message, notice.messageEn))" :key="index">
              <a v-if="part.href" :href="part.href" target="_blank" rel="noopener">{{ part.text }}</a>
              <template v-else>{{ part.text }}</template>
            </template>
          </p>
        </li>
      </ul>
      <button type="button" class="close" :aria-label="t('notices.closeAll')" @click="dismissAll">✕</button>
    </div>
  </section>
</template>

<style scoped>
.notices {
  background: var(--red-strong);
  color: #fff;
  padding: 12px 0;
}

.row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.list {
  flex: 1;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.notice-banner p {
  margin: 0;
  overflow-wrap: anywhere;
}

.notice-banner a {
  color: #fff;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.notice-banner a:hover {
  text-decoration-thickness: 2px;
}

.close {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-top: -4px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #fff;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
}

.close:hover {
  background: rgb(255 255 255 / 0.16);
}

.notices :focus-visible {
  outline-color: #fff;
}
</style>
