<script setup>
import { ref, computed, nextTick } from 'vue'

import { useI18n } from '../i18n/index.js'

const props = defineProps({
  images: { type: Array, required: true },
  title: { type: String, required: true },
})

const { t } = useI18n()

const scroller = ref(null)
const index = ref(0)

// Reduced motion makes the movement instant (AC6).
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const behavior = () => (reducedMotion.matches ? 'auto' : 'smooth')

const multiple = computed(() => props.images.length > 1)

// Wraps around: past the last image goes back to the first, before the first to the last.
function goTo(i) {
  const el = scroller.value
  if (!el) return
  const n = props.images.length
  index.value = ((i % n) + n) % n
  el.scrollTo({ left: index.value * el.clientWidth, behavior: behavior() })
}

function onScroll() {
  const el = scroller.value
  if (!el || !el.clientWidth) return
  index.value = Math.max(0, Math.min(props.images.length - 1, Math.round(el.scrollLeft / el.clientWidth)))
}

function onKeydown(event) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    goTo(index.value - 1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    goTo(index.value + 1)
  } else {
    return
  }
  // Arrow keys pressed on a slide button scroll the track but leave focus on the old
  // (now off-screen) button; move focus to the current slide's button.
  if (event.target.classList?.contains('slide-zoom')) {
    scroller.value?.querySelectorAll('.slide-zoom')[index.value]?.focus({ preventScroll: true })
  }
}

// Full-screen view of one image (the lightbox). A native <dialog> gives Esc, backdrop and
// focus return to the slide button for free; it nests inside the event dialog's top layer.
const lightbox = ref(null)
const lightboxIndex = ref(0)

function openLightbox(i) {
  lightboxIndex.value = i
  lightbox.value?.showModal()
}

function closeLightbox() {
  lightbox.value?.close()
}

function stepLightbox(dir) {
  const n = props.images.length
  lightboxIndex.value = ((lightboxIndex.value + dir) % n + n) % n
}

function onLightboxClick(event) {
  if (event.target === lightbox.value) closeLightbox()
}

// The browser returns focus to the slide button that opened the lightbox on close; if the
// visitor paged to another image there, sync the slideshow to it so they keep their place.
async function onLightboxClose() {
  if (lightboxIndex.value === index.value) return
  goTo(lightboxIndex.value)
  await nextTick()
  scroller.value?.querySelectorAll('.slide-zoom')[index.value]?.focus({ preventScroll: true })
}

function onLightboxKeydown(event) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    stepLightbox(-1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    stepLightbox(1)
  }
}
</script>

<template>
  <div class="slideshow">
    <ul
      ref="scroller"
      class="track"
      role="region"
      :aria-roledescription="t('events.slideshow')"
      :aria-label="t('events.slideshow')"
      :tabindex="multiple ? 0 : -1"
      @scroll.passive="onScroll"
      @keydown="onKeydown"
    >
      <li v-for="(img, i) in images" :key="i" class="slide">
        <button
          type="button"
          class="slide-zoom"
          :aria-label="t('events.enlarge', { n: i + 1, total: images.length })"
          @click="openLightbox(i)"
        >
          <img
            :src="img.image"
            :alt="`${title}, ${t('events.imageOf', { n: i + 1, total: images.length })}`"
            :loading="i === 0 ? 'eager' : 'lazy'"
          />
        </button>
      </li>
    </ul>

    <template v-if="multiple">
      <button type="button" class="arrow prev" :aria-label="t('events.previous')" @click="goTo(index - 1)">‹</button>
      <button type="button" class="arrow next" :aria-label="t('events.next')" @click="goTo(index + 1)">›</button>
      <div class="dots">
        <button
          v-for="(img, i) in images"
          :key="i"
          type="button"
          class="dot"
          :class="{ current: i === index }"
          :aria-label="t('events.goToSlide', { n: i + 1, total: images.length })"
          :aria-current="i === index"
          @click="goTo(i)"
        ></button>
      </div>
    </template>

    <dialog
      ref="lightbox"
      class="lightbox"
      :aria-label="t('events.slideshow')"
      @click="onLightboxClick"
      @keydown="onLightboxKeydown"
      @close="onLightboxClose"
    >
      <img
        v-if="images[lightboxIndex]"
        :src="images[lightboxIndex].image"
        :alt="`${title}, ${t('events.imageOf', { n: lightboxIndex + 1, total: images.length })}`"
      />
      <button type="button" class="lightbox-close" :aria-label="t('events.close')" @click="closeLightbox">×</button>
      <template v-if="multiple">
        <button type="button" class="arrow prev" :aria-label="t('events.previous')" @click="stepLightbox(-1)">‹</button>
        <button type="button" class="arrow next" :aria-label="t('events.next')" @click="stepLightbox(1)">›</button>
        <p class="counter" aria-hidden="true">{{ lightboxIndex + 1 }} / {{ images.length }}</p>
      </template>
    </dialog>
  </div>
</template>

<style scoped>
.slideshow {
  position: relative;
  margin-top: 12px;
}

.track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  border-radius: var(--radius);
  margin: 0;
  padding: 0;
  list-style: none;
}

.track::-webkit-scrollbar {
  display: none;
}

.slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
}

.slide-zoom {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;
}

.slide img {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 2;
  /* Show the whole image in the pop-up; cover would crop the top of posters. */
  object-fit: contain;
  background: var(--ink);
  border-radius: var(--radius);
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}

.arrow.prev {
  left: 8px;
}

.arrow.next {
  right: 8px;
}

.dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 10px 0 4px;
}

.dot {
  width: 12px;
  height: 12px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid var(--muted);
  background: transparent;
  cursor: pointer;
}

.dot.current {
  background: var(--red-strong);
  border-color: var(--red-strong);
}

@media (prefers-reduced-motion: reduce) {
  .track {
    scroll-behavior: auto;
  }
}

/* Full-screen lightbox for one image, shown over the event dialog. */
.lightbox {
  width: 100vw;
  height: 100dvh;
  max-width: 100vw;
  max-height: 100dvh;
  margin: 0;
  padding: 0;
  border: none;
  background: rgba(0, 0, 0, 0.92);
}

.lightbox:not([open]) {
  display: none;
}

/* Flex centers the image, so clicks on the letterbox area hit the dialog backdrop. */
.lightbox[open] {
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox::backdrop {
  background: rgba(0, 0, 0, 0.92);
}

.lightbox img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.lightbox .arrow {
  position: fixed;
  z-index: 1;
}

.lightbox-close {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 1;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

.counter {
  position: fixed;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--surface);
  color: var(--text);
  font-weight: 600;
}
</style>
