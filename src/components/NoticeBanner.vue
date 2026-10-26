<script setup>
import { computed, ref } from 'vue'
import { activeNotices } from '../data/store.js'
import { linkParts } from '../data/parse.js'
import { useI18n } from '../i18n/index.js'

// Dismissals are remembered per message text in this browser. Storage can be blocked, so the
// in-memory list still hides the notice until the page is reloaded.
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

function dismiss(notice) {
  // Keep only active messages, so the list doesn't grow with old notices.
  const active = activeNotices.value.map((item) => item.message)
  dismissed.value = dismissed.value.filter((text) => active.includes(text))
  if (!dismissed.value.includes(notice.message)) dismissed.value.push(notice.message)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissed.value))
  } catch {}
}
</script>

<template>
  <section v-if="visible.length" class="notices" :aria-label="t('notices.label')">
    <div class="container">
      <ul class="list">
        <li v-for="notice in visible" :key="notice.message" class="notice-banner">
          <p>
            <template v-for="(part, index) in linkParts(localized(notice.message, notice.messageEn))" :key="index">
              <a v-if="part.href" :href="part.href" target="_blank" rel="noopener">{{ part.text }}</a>
              <template v-else>{{ part.text }}</template>
            </template>
          </p>
          <button type="button" class="close" :aria-label="t('notices.close')" @click="dismiss(notice)">✕</button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.notices {
  background: var(--red-strong);
  color: #fff;
  padding: 12px 0;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.notice-banner {
  display: flex;
  align-items: flex-start;
  gap: 16px;
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
  margin: -4px -6px -4px 0;
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
