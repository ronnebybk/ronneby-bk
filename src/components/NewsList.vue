<script setup>
import { activeNews } from '../data/store.js'
import { linkParts } from '../data/parse.js'
import { useI18n } from '../i18n/index.js'

const { t, localized, formatDate } = useI18n()
</script>

<template>
  <section v-if="activeNews.length" class="news" aria-labelledby="news-title">
    <h2 id="news-title" class="section-title">{{ t('news.title') }}</h2>
    <ul class="list">
      <li v-for="(item, index) in activeNews" :key="index">
        <article class="card item">
          <time v-if="item.from" :datetime="item.from" class="date">{{ formatDate(item.from) }}</time>
          <h3 v-if="item.title">{{ localized(item.title, item.titleEn) }}</h3>
          <p v-if="item.message">
            <template v-for="(part, partIndex) in linkParts(localized(item.message, item.messageEn))" :key="partIndex">
              <a v-if="part.href" :href="part.href" target="_blank" rel="noopener">{{ part.text }}</a>
              <template v-else>{{ part.text }}</template>
            </template>
          </p>
        </article>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.section-title {
  margin-top: 48px;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 16px;
}

.item {
  border-left: 4px solid var(--red);
}

.date {
  display: block;
  margin-bottom: 4px;
  color: var(--muted);
  font-size: 0.9rem;
}

.item h3 {
  margin-bottom: 0.3em;
}

.item p {
  margin: 0;
  overflow-wrap: anywhere;
}
</style>
