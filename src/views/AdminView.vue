<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '../i18n/index.js'
import config from '../config.js'
import { load, save, remove } from '../data/storage.js'

// The sheet's edit ID is never in the code (the repo is public). Editors get a link like
// …/#/admin?k=<sheet-id>; the ID is stored on their device and removed from the address bar.
const STORAGE_KEY = 'rbt-admin-key'
const VALID_KEY = /^[A-Za-z0-9_-]{20,}$/

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const key = ref(load(STORAGE_KEY) ?? '')
const fromLink = String(route.query.k ?? '')
if (VALID_KEY.test(fromLink)) {
  key.value = fromLink
  save(STORAGE_KEY, fromLink)
  router.replace({ name: 'admin' })
}

const hasAccess = computed(() => VALID_KEY.test(key.value))

// A tab without a gid is not in the sheet yet, so it is left out of the list.
const tabs = ['schedule', 'groups', 'coaches', 'seasons', 'notices', 'club', 'trial', 'faq'].filter(
  (tab) => config.sheet.gids[tab],
)
const activeTab = ref('schedule')

function sheetUrl(minimal) {
  const gid = config.sheet.gids[activeTab.value]
  const base = `https://docs.google.com/spreadsheets/d/${key.value}/edit`
  return `${base}${minimal ? '?rm=minimal' : ''}${gid !== '' ? `#gid=${gid}` : ''}`
}

const embedUrl = computed(() => sheetUrl(true))
const fullUrl = computed(() => sheetUrl(false))

function forget() {
  if (!window.confirm(t('admin.forgetConfirm'))) return
  remove(STORAGE_KEY)
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
        <h1>{{ t('admin.title') }}</h1>
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
      </div>

      <!-- :key forces a reload when switching tab, so the sheet jumps to it. -->
      <iframe :key="embedUrl" :src="embedUrl" :title="t('admin.title')" class="sheet"></iframe>

      <div class="container links">
        <a :href="fullUrl" target="_blank" rel="noopener">{{ t('admin.openInSheets') }} ↗</a>
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

.toolbar h1 {
  font-size: 1.6rem;
  margin-bottom: 12px;
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
