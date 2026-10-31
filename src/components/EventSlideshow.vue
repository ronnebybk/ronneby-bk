<script setup>
import { ref, computed } from 'vue'

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

function goTo(i) {
  const el = scroller.value
  if (!el) return
  index.value = Math.max(0, Math.min(props.images.length - 1, i))
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
        <img
          :src="img.image"
          :alt="`${title}, ${t('events.imageOf', { n: i + 1, total: images.length })}`"
          :loading="i === 0 ? 'eager' : 'lazy'"
        />
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

.slide img {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
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
</style>
