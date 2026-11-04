<script setup>
import { ref, computed } from 'vue'

import { useI18n } from '../i18n/index.js'

// Controlled full-screen lightbox shared by the events slideshow and the albums page: the
// parent owns the index and listens to update:index / close. Only the current image is
// rendered, so no neighbouring photo is preloaded (D12).
const props = defineProps({
  images: { type: Array, required: true },
  title: { type: String, required: true },
  index: { type: Number, required: true },
})

const emit = defineEmits(['update:index', 'close'])

const { t } = useI18n()

const dialog = ref(null)

const multiple = computed(() => props.images.length > 1)

function open() {
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

defineExpose({ open, close, isOpen: () => dialog.value?.open ?? false })

function step(dir) {
  const n = props.images.length
  emit('update:index', ((props.index + dir) % n + n) % n)
}

function onKeydown(event) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    step(-1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    step(1)
  }
}

// Swipe: pointer events cover mouse and touch; a horizontal move of 40 px or more changes
// the photo (2a). pan-y lets the browser keep vertical scrolling while we take horizontal.
let swipeStartX = null
function onPointerDown(event) {
  swipeStartX = event.clientX
}

function onPointerUp(event) {
  if (swipeStartX === null) return
  const dx = event.clientX - swipeStartX
  swipeStartX = null
  if (Math.abs(dx) >= 40) step(dx < 0 ? 1 : -1)
}

// Clicking the dimmed letterbox area means the click target is the <dialog> itself.
function onClick(event) {
  if (event.target === dialog.value) close()
}
</script>

<template>
  <dialog
    ref="dialog"
    class="lightbox"
    :aria-label="t('gallery.slideshow')"
    @click="onClick"
    @keydown="onKeydown"
    @close="emit('close')"
  >
    <img
      v-if="images[index]"
      :src="images[index]"
      :alt="`${title}, ${t('gallery.imageOf', { n: index + 1, total: images.length })}`"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
    />
    <button type="button" class="lightbox-close" :aria-label="t('gallery.close')" @click="close">×</button>
    <template v-if="multiple">
      <button type="button" class="arrow prev" :aria-label="t('gallery.previous')" @click="step(-1)">‹</button>
      <button type="button" class="arrow next" :aria-label="t('gallery.next')" @click="step(1)">›</button>
      <p class="counter" aria-hidden="true">{{ index + 1 }} / {{ images.length }}</p>
    </template>
  </dialog>
</template>

<style scoped>
/* Full-screen lightbox for one image. */
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
  touch-action: pan-y;
}

.arrow {
  position: fixed;
  z-index: 1;
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
