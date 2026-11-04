<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ImageLightbox from '../components/ImageLightbox.vue'
import TextBlocks from '../components/TextBlocks.vue'
import DataNotice from '../components/DataNotice.vue'

import { state } from '../data/store.js'
import { resizeImage } from '../data/parse.js'
import { useI18n } from '../i18n/index.js'
import { firstQuery } from '../router.js'

const route = useRoute()
const router = useRouter()
const { t, localized, formatDate } = useI18n()

const album = computed(() => state.albums.find((a) => a.slug === route.params.album) ?? null)

// D9: the heading is the title, else the date, else "Album N".
const heading = computed(() => {
  if (!album.value) return ''
  return (
    localized(album.value.title, album.value.titleEn) ||
    (album.value.date ? formatDate(album.value.date) : t('albums.untitled', { n: album.value.n }))
  )
})
const dateText = computed(() => (album.value?.date ? formatDate(album.value.date) : ''))
const description = computed(() => (album.value ? localized(album.value.description, album.value.descriptionEn) : ''))
const gridImages = computed(() => album.value?.images.map((url) => resizeImage(url, 400)) ?? [])
// D8: the lightbox loads the shown photo at w1600; ImageLightbox renders only that one (D12).
const lightboxImages = computed(() => album.value?.images.map((url) => resizeImage(url, 1600)) ?? [])

// Unknown slug → the album list, but only once data has loaded (AC3): while the first load is
// still in flight there are no albums yet, and redirecting then would bounce a valid deep link.
watch(
  [() => route.params.album, () => state.status, () => state.albums],
  () => {
    if (state.status === 'loading' && !state.albums.length) return
    if (!album.value) router.replace('/bilder')
  },
  { immediate: true },
)

// --- Lightbox history (D2) -----------------------------------------------------
// ?bild=<n> is 1-based. Opening from the grid pushes (one history entry, so back closes the
// lightbox); paging replaces; a deep link opens without pushing, so closing must not leave the
// site — it replaces the query instead.
const lightbox = ref(null)
const lightboxIndex = ref(0)
// True when the current history entry was added by opening the lightbox from the grid.
const pushed = ref(false)

const bild = computed(() => {
  const n = Number(firstQuery(route.query, 'bild'))
  if (!Number.isInteger(n) || !album.value || n < 1 || n > album.value.images.length) return null
  return n
})

watch(bild, (n) => {
  if (n === null) {
    // The URL lost ?bild (browser back): close the dialog if it is still open. Its close event
    // then finds no bild in the URL and doesn't navigate again.
    if (lightbox.value?.isOpen()) lightbox.value.close()
    return
  }
  lightboxIndex.value = n - 1
  if (!lightbox.value?.isOpen()) lightbox.value?.open()
})

function openLightbox(i) {
  pushed.value = true
  router.push({ query: { ...route.query, bild: i + 1 } })
}

function onLightboxIndex(i) {
  router.replace({ query: { ...route.query, bild: i + 1 } })
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

async function onLightboxClose() {
  // Esc, backdrop or ×: the dialog is closed but the URL may still carry ?bild.
  if (firstQuery(route.query, 'bild') != null) {
    if (pushed.value) {
      pushed.value = false
      router.back()
    } else {
      const query = { ...route.query }
      delete query.bild
      router.replace({ query })
    }
  }
  // D3: focus returns to the thumbnail of the photo last shown, scrolled into view.
  await nextTick()
  const el = document.querySelector(`[data-thumb="${lightboxIndex.value}"]`)
  el?.scrollIntoView({ block: 'center', behavior: reducedMotion.matches ? 'auto' : 'smooth' })
  el?.focus({ preventScroll: true })
}
</script>

<template>
  <div class="container page">
    <DataNotice />

    <template v-if="album">
      <p class="back">
        <RouterLink to="/bilder">‹ {{ t('albums.back') }}</RouterLink>
      </p>
      <h1>{{ heading }}</h1>
      <p v-if="dateText && heading !== dateText" class="muted">{{ dateText }}</p>

      <TextBlocks v-if="description" :text="description" />

      <ul class="grid">
        <li v-for="(url, i) in gridImages" :key="url">
          <button
            type="button"
            class="thumb"
            :data-thumb="i"
            :aria-label="t('gallery.enlarge', { n: i + 1, total: gridImages.length })"
            @click="openLightbox(i)"
          >
            <img
              :src="url"
              :alt="`${heading}, ${t('gallery.imageOf', { n: i + 1, total: gridImages.length })}`"
              loading="lazy"
              decoding="async"
              width="400"
              height="267"
            />
          </button>
        </li>
      </ul>

      <ImageLightbox
        ref="lightbox"
        :images="lightboxImages"
        :title="heading"
        :index="lightboxIndex"
        @update:index="onLightboxIndex"
        @close="onLightboxClose"
      />
    </template>
  </div>
</template>

<style scoped>
.back {
  margin: 0 0 8px;
}

.back a {
  color: var(--link);
  text-decoration: none;
  font-weight: 600;
}

.grid {
  list-style: none;
  margin: 20px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 160px), 1fr));
  gap: 12px;
}

.thumb {
  display: block;
  width: 100%;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface);
  cursor: zoom-in;
}

.thumb img {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
}
</style>
