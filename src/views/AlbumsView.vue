<script setup>
import { computed } from 'vue'

import DataNotice from '../components/DataNotice.vue'

import { state } from '../data/store.js'
import { resizeImage } from '../data/parse.js'
import { useI18n } from '../i18n/index.js'

const { t, localized, formatDate } = useI18n()

const albums = computed(() => state.albums)

// D5/AC5: an album without a title is "Album N", where N is its position in the shown list.
const nameOf = (album) => localized(album.title, album.titleEn) || t('albums.untitled', { n: album.n })
const dateOf = (album) => (album.date ? formatDate(album.date) : '')
const countOf = (album) =>
  album.images.length === 1 ? t('albums.countOne') : t('albums.count', { n: album.images.length })
</script>

<template>
  <div class="container page">
    <h1>{{ t('albums.title') }}</h1>
    <DataNotice />

    <p v-if="state.status === 'loading' && !albums.length" class="muted">{{ t('common.loading') }}</p>
    <p v-else-if="!albums.length" class="muted">
      {{ state.status === 'error' ? t('common.loadError') : t('albums.empty') }}
    </p>

    <ul v-else class="cards">
      <li v-for="(album, i) in albums" :key="album.slug">
        <RouterLink :to="`/bilder/${album.slug}`" class="card card-hover">
          <span class="stack">
            <img
              v-if="album.images[2]"
              :src="resizeImage(album.images[2], 400)"
              alt=""
              class="behind behind-2"
              loading="lazy"
              width="400"
              height="267"
            />
            <img
              v-if="album.images[1]"
              :src="resizeImage(album.images[1], 400)"
              alt=""
              class="behind behind-1"
              loading="lazy"
              width="400"
              height="267"
            />
            <img
              :src="resizeImage(album.images[0], 800)"
              :alt="nameOf(album)"
              class="cover"
              :loading="i < 2 ? 'eager' : 'lazy'"
              width="800"
              height="533"
            />
          </span>
          <span class="card-text">
            <strong class="card-title">{{ nameOf(album) }}</strong>
            <span v-if="dateOf(album)" class="muted">{{ dateOf(album) }}</span>
            <span class="muted">{{ countOf(album) }}</span>
          </span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  /* One column at 390 px, two or three wider. */
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 24px 20px;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;
  color: var(--text);
}

/* Stacked-photos look: up to two more photos peeking out behind the cover. */
.stack {
  position: relative;
  display: block;
}

.behind {
  position: absolute;
  inset: 0;
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: var(--surface);
}

.behind-1 {
  transform: rotate(-2.5deg) translate(-4px, 2px);
}

.behind-2 {
  transform: rotate(2deg) translate(4px, 4px);
}

.cover {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  background: var(--surface);
}

/* Image-level hover feedback to match the card lift; same guards as .card-hover:hover. */
.cover,
.behind {
  transition: transform 0.15s ease;
}

@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .card-hover:hover .cover {
    transform: scale(1.03);
  }

  .card-hover:hover .behind-1 {
    transform: rotate(-2.5deg) translate(-4px, 2px) scale(1.03);
  }

  .card-hover:hover .behind-2 {
    transform: rotate(2deg) translate(4px, 4px) scale(1.03);
  }
}

.card-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-title {
  font-size: 1.05rem;
}

@media (prefers-reduced-motion: reduce) {
  .behind-1,
  .behind-2 {
    transform: none;
  }
}
</style>
