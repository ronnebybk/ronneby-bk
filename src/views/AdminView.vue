<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminWarnings from '../components/AdminWarnings.vue'
import HelpDialog from '../components/HelpDialog.vue'
import { useI18n } from '../i18n/index.js'
import config from '../config.js'
import { load, save, remove } from '../data/storage.js'
import { ADMIN_KEY_STORAGE, VALID_KEY, hasValidKey, setPreviewTab } from '../data/preview.js'
import { startPreview, endPreview } from '../data/store.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const key = ref(load(ADMIN_KEY_STORAGE) ?? '')
const fromLink = String(route.query.k ?? '')
if (VALID_KEY.test(fromLink)) {
  key.value = fromLink
  save(ADMIN_KEY_STORAGE, fromLink)
  router.replace({ name: 'admin' })
}

const hasAccess = computed(() => VALID_KEY.test(key.value))

const helpDialog = ref(null)
function openHelp(entryId) {
  helpDialog.value?.open(entryId)
}

// Tab → site route, so Preview opens the page matching the tab the editor is looking at.
const tabRoutes = {
  schedule: '/schema',
  seasons: '/schema',
  groups: '/grupper',
  coaches: '/tranare',
  notices: '/',
  club: '/kontakt',
  trial: '/prova-pa',
  faq: '/fragor',
  documents: '/dokument',
  events: '/evenemang',
  results: '/evenemang?typ=tavlingar',
  albums: '/bilder',
  sponsors: '/sponsorer',
  exceptions: '/schema',
}

function preview() {
  setPreviewTab(activeTab.value)
  startPreview()
  router.push(tabRoutes[activeTab.value] ?? '/')
}

// A tab without a gid is not in the sheet yet, so it is left out of the list.
const tabs = ['schedule', 'groups', 'coaches', 'seasons', 'notices', 'exceptions', 'club', 'trial', 'faq', 'documents', 'results', 'events', 'albums', 'sponsors'].filter(
  (tab) => config.sheet.gids[tab],
)
// "To admin" from the preview passes the tab as ?tab=; anything unknown starts on the default.
const fromQuery = String(route.query.tab ?? '')
const activeTab = ref(tabs.includes(fromQuery) ? fromQuery : 'schedule')
if (route.query.tab) router.replace({ name: 'admin' })

function sheetUrl(minimal) {
  const gid = config.sheet.gids[activeTab.value]
  const base = `https://docs.google.com/spreadsheets/d/${key.value}/edit`
  return `${base}${minimal ? '?rm=minimal' : ''}${gid !== '' ? `#gid=${gid}` : ''}`
}

const embedUrl = computed(() => sheetUrl(true))
const fullUrl = computed(() => sheetUrl(false))

function forget() {
  if (!window.confirm(t('admin.forgetConfirm'))) return
  endPreview()
  remove(ADMIN_KEY_STORAGE)
  key.value = ''
}
</script>

<template>
  <div class="admin">
    <div v-if="!hasAccess" class="container page">
      <h1>{{ t('admin.noAccessTitle') }}</h1>
      <p>{{ t('admin.noAccessText') }}</p>
      <RouterLink to="/" class="btn btn-primary">{{ t('notFound.back') }}</RouterLink>
    </div>

    <template v-else>
      <div class="container toolbar">
        <div class="toolbar-top">
          <h1>{{ t('admin.title') }}</h1>
          <div class="toolbar-actions">
            <button v-if="config.sheet.publishedId" type="button" class="preview-btn" @click="preview">{{ t('admin.preview') }}</button>
            <button type="button" class="help-btn" @click="openHelp()">{{ t('admin.helpDialog.button') }}</button>
          </div>
        </div>
        <div class="tabs" role="tablist">
          <button
            v-for="tab in tabs"
            :key="tab"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab"
            :class="{ active: activeTab === tab }"
            @click="activeTab = tab"
          >
            {{ t(`admin.tabs.${tab}`) }}
          </button>
        </div>
        <p class="help">ℹ️ {{ t('admin.help') }}</p>
        <AdminWarnings @open-tab="activeTab = $event" @open-help="openHelp" />
      </div>

      <HelpDialog ref="helpDialog" />

      <!-- :key forces a reload when switching tab, so the sheet jumps to it. -->
      <iframe :key="embedUrl" :src="embedUrl" :title="t('admin.title')" class="sheet"></iframe>

      <div class="container links">
        <a :href="fullUrl" target="_blank" rel="noopener noreferrer">{{ t('admin.openInSheets') }} ↗</a>
        <RouterLink to="/">{{ t('admin.viewSite') }}</RouterLink>
        <RouterLink to="/affisch/schema">{{ t('poster.link') }}: {{ t('nav.schedule') }}</RouterLink>
        <RouterLink to="/affisch/grupper">{{ t('poster.link') }}: {{ t('nav.groups') }}</RouterLink>
        <button type="button" class="link-btn" @click="forget">{{ t('admin.forget') }}</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.toolbar {
  padding-top: 20px;
  padding-bottom: 12px;
}

.toolbar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: 12px;
}

.toolbar h1 {
  font-size: 1.6rem;
}

/* Same colours as the preview frame, so the button signals "this opens the preview". */
.preview-btn {
  background: var(--preview);
  color: var(--preview-ink);
  border: 0;
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.preview-btn:hover {
  filter: brightness(0.93);
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.help-btn {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.help-btn:hover {
  filter: brightness(0.96);
}

.help-btn:active {
  filter: brightness(0.88);
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tabs button {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
}

.tabs button.active {
  background: var(--red-strong);
  border-color: var(--red-strong);
  color: #fff;
}

.help {
  font-size: 0.9rem;
  color: var(--muted);
  margin: 12px 0 0;
}

.sheet {
  display: block;
  width: 100%;
  height: calc(100vh - 260px);
  min-height: 420px;
  border: 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: #fff;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding-top: 14px;
  padding-bottom: 24px;
  font-size: 0.95rem;
}

.link-btn {
  background: none;
  border: 0;
  padding: 0;
  color: var(--muted);
  text-decoration: underline;
  cursor: pointer;
}
</style>
