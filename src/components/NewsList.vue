<script setup>
import { activeNews } from '../data/store.js'
import LinkedText from './LinkedText.vue'
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
          <p v-if="item.message"><LinkedText :text="localized(item.message, item.messageEn)" /></p>
        </article>
      </li>
    </ul>
  </section>
</template>

<style scoped>
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
