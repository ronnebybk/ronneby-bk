<script setup>
import { computed, nextTick, ref } from 'vue'
import { useI18n } from '../i18n/index.js'
import { parseHelp, renderMarkdown, searchHelp, slugOf } from '../data/help.js'

const { t, locale } = useI18n()

const dialog = ref(null)
const searchInput = ref(null)
const entries = ref([])
const loadError = ref(false)
const loading = ref(false)
const query = ref('')
const activeTab = ref('')

// Chips come from the entries' own `flikar`, so tabs not in the sheet yet still work.
const tabs = computed(() => [...new Set(entries.value.flatMap((e) => e.tabs))].filter((tab) => tab !== 'alla'))
// AC3: the two key rules stay at the top whatever the search or filter is.
const pinned = computed(() => entries.value.filter((e) => e.pinned))
const results = computed(() => searchHelp(entries.value, query.value, activeTab.value || null).filter((e) => !e.pinned))

// D7: the help text is fetched the first time the dialog opens, via a lazy ?raw import,
// so it lands in its own chunk — never in the visitor bundle (AC11).
async function ensureLoaded() {
  if (entries.value.length > 0 || loading.value) return
  loading.value = true
  loadError.value = false
  try {
    const mod = await import('../../docs/editor-help.md?raw')
    entries.value = parseHelp(mod.default).map((e) => ({ ...e, html: renderMarkdown(e.text) }))
  } catch {
    loadError.value = true
  } finally {
    loading.value = false
  }
}

// open(entryId?) — called from the Hjälp button (no id) and from warning links (D4, with id).
async function open(entryId) {
  await ensureLoaded()
  if (loadError.value) {
    dialog.value.showModal()
    return
  }
  query.value = ''
  activeTab.value = ''
  dialog.value.showModal()
  await nextTick()
  searchInput.value?.focus()
  if (entryId) scrollToEntry(entryId)
}

function close() {
  dialog.value.close()
}

// Clicking the dimmed backdrop means the click target is the <dialog> itself.
function onDialogClick(event) {
  if (event.target === dialog.value) close()
}

function toggleTab(tab) {
  activeTab.value = activeTab.value === tab ? '' : tab
}

function scrollToEntry(id) {
  const el = dialog.value?.querySelector(`details[data-entry="${id}"]`)
  if (!el) return
  el.open = true
  el.scrollIntoView({ block: 'start' })
}

// In-text links to other entries (#slug) jump to that entry instead of changing the URL (D8).
function onContentClick(event) {
  const link = event.target.closest('a.help-entry-link')
  if (!link) return
  event.preventDefault()
  const slug = link.dataset.slug
  const entry = entries.value.find((e) => e.id === slug || slugOf(e.title) === slug)
  if (entry) scrollToEntry(entry.id)
}

defineExpose({ open })
</script>

<template>
  <dialog ref="dialog" class="help-dialog" @click="onDialogClick">
    <div class="help-head">
      <h2>{{ t('admin.helpDialog.title') }}</h2>
      <button type="button" class="close" :aria-label="t('admin.helpDialog.close')" @click="close">×</button>
    </div>

    <template v-if="loadError">
      <p class="help-error">{{ t('admin.helpDialog.loadError') }}</p>
      <button type="button" class="btn btn-primary" :disabled="loading" @click="ensureLoaded()">
        {{ t('admin.helpDialog.retry') }}
      </button>
    </template>

    <template v-else>
      <p v-if="t('admin.helpDialog.swedishNote')" class="swedish-note">{{ t('admin.helpDialog.swedishNote') }}</p>
      <input
        ref="searchInput"
        v-model="query"
        type="search"
        class="help-search"
        :placeholder="t('admin.helpDialog.search')"
        :aria-label="t('admin.helpDialog.search')"
      />
      <div class="help-chips">
        <button
          type="button"
          :class="{ active: activeTab === '' }"
          @click="activeTab = ''"
        >
          {{ t('admin.helpDialog.all') }}
        </button>
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          :class="{ active: activeTab === tab }"
          @click="toggleTab(tab)"
        >
          {{ tab }}
        </button>
      </div>

      <div class="help-pinned">
        <details v-for="e in pinned" :key="e.id" :data-entry="e.id" class="entry pinned">
          <summary>{{ e.title }}</summary>
          <div class="entry-body" v-html="e.html" @click="onContentClick"></div>
        </details>
      </div>

      <p v-if="results.length === 0" class="help-empty">{{ t('admin.helpDialog.noMatches') }}</p>
      <details v-for="e in results" :key="e.id" :data-entry="e.id" class="entry">
        <summary>{{ e.title }}</summary>
        <div class="entry-body" v-html="e.html" @click="onContentClick"></div>
      </details>
    </template>
  </dialog>
</template>

<style scoped>
.help-dialog {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 20px;
  width: min(94vw, 720px);
  max-height: 85vh;
  overflow: auto;
  background: var(--paper);
  color: var(--text);
}

.help-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: sticky;
  top: -20px;
  background: var(--paper);
  padding: 20px 0 12px;
  margin: -20px 0 0;
}

.help-head h2 {
  font-size: 1.3rem;
  margin: 0;
}

.close {
  background: none;
  border: 0;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  color: var(--muted);
}

.swedish-note {
  font-size: 0.85rem;
  color: var(--muted);
  margin: 0 0 10px;
}

.help-search {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font-size: 1rem;
}

.help-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.help-chips button {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
}

.help-chips button.active {
  background: var(--red-strong);
  border-color: var(--red-strong);
  color: #fff;
}

.help-pinned .entry {
  border-color: var(--red-strong);
}

.entry {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 8px;
  background: var(--surface);
}

.entry summary {
  font-weight: 700;
  cursor: pointer;
}

.entry-body {
  margin-top: 8px;
  overflow-wrap: break-word;
}

/* AC9: help tables must fit 390 px without horizontal scrolling. */
.entry-body :deep(table) {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
}

.entry-body :deep(th),
.entry-body :deep(td) {
  border: 1px solid var(--line);
  padding: 6px 8px;
  text-align: left;
  overflow-wrap: break-word;
  vertical-align: top;
}

.entry-body :deep(ul),
.entry-body :deep(ol) {
  padding-left: 20px;
  margin: 8px 0;
}

.help-empty {
  color: var(--muted);
}
</style>
