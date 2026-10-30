<script setup>
import { computed } from 'vue'

import { state } from '../data/store.js'

import { useI18n } from '../i18n/index.js'

const { t, localized, formatDate } = useI18n()

// Categories in sheet order, each with its documents. Per-cell fallback to Swedish when
// an English cell is empty. The empty category ("Övrigt" / "Other") comes last from the parser.
const categories = computed(() =>
  state.documents.map((category) => ({
    name: localized(category.name, category.nameEn) || t('documents.other'),
    items: category.items.map((item) => ({
      title: localized(item.title, item.titleEn),
      description: localized(item.description, item.descriptionEn),
      dateIso: item.date,
      date: item.date ? formatDate(item.date) : null,
      url: item.url,
    })),
  })),
)
</script>

<template>
  <div class="container page">
    <h1>{{ t('documents.title') }}</h1>

    <p v-if="state.status === 'loading' && !categories.length" class="muted">{{ t('common.loading') }}</p>
    <p v-else-if="!categories.length" class="muted">
      {{ t('documents.empty') }}
      <RouterLink to="/kontakt">{{ t('documents.emptyLink') }}</RouterLink>
    </p>

    <div v-else>
      <section v-for="category in categories" :key="category.name" class="category">
        <h2>{{ category.name }}</h2>
        <ul class="list">
          <li v-for="item in category.items" :key="item.url" class="item">
            <div class="meta">
              <span class="title">{{ item.title }}</span>
              <time v-if="item.date" :datetime="item.dateIso" class="date muted">{{ item.date }}</time>
            </div>
            <p v-if="item.description" class="description">{{ item.description }}</p>
            <a :href="item.url" target="_blank" rel="noopener" class="pdf-link">
              {{ t('documents.pdf') }}
              <span class="sr-only">{{ t('documents.opensNewTab') }}</span>
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.category {
  margin-bottom: 32px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 70ch;
  border-top: 1px solid var(--line);
}

.item {
  border-bottom: 1px solid var(--line);
  padding: 14px 0;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 16px;
}

.title {
  font-weight: 600;
  overflow-wrap: anywhere;
}

.date {
  font-size: 0.9rem;
}

.description {
  max-width: 60ch;
  margin: 6px 0 0;
}

.pdf-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-top: 8px;
  color: var(--red);
  font-weight: 600;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
</style>
