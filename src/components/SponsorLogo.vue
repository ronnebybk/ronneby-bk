<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  sponsor: { type: Object, required: true },
  height: { type: Number, default: 40 },
  // The home page shows the name as text when the logo is missing/broken; the sponsors page has
  // the name below the tile, so it passes false to avoid showing it twice.
  fallbackText: { type: Boolean, default: true },
})

// URLs that failed to load, so the image hides and the fallback shows instead. The parent hears
// about it via the error event, so it can hide a wrapper (e.g. the white tile) as well.
const emit = defineEmits(['error'])
const failedImages = reactive(new Set())
watch(() => props.sponsor.logo, () => {
  if (props.sponsor.logo) failedImages.delete(props.sponsor.logo)
})

function onError() {
  failedImages.add(props.sponsor.logo)
  emit('error', props.sponsor.logo)
}

// Wide logos (e.g. 2.4:1) need room; cap at 3× the height so they don't dominate the row.
const imgStyle = { height: props.height + 'px', maxWidth: props.height * 3 + 'px' }
</script>

<template>
  <img
    v-if="sponsor.logo && !failedImages.has(sponsor.logo)"
    :src="sponsor.logo"
    :alt="sponsor.name"
    loading="lazy"
    referrerpolicy="no-referrer"
    :style="imgStyle"
    @error="onError"
  />
  <span v-else-if="fallbackText" class="sponsor-name" :style="{ maxWidth: height * 3 + 'px' }">{{ sponsor.name }}</span>
</template>

<style scoped>
img {
  object-fit: contain;
  /* A white background baked into a logo takes the tile's colour instead of showing as a box. */
  mix-blend-mode: multiply;
}

.sponsor-name {
  /* Long names wrap to two lines rather than being cut off mid-word. */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: center;
  font-weight: 600;
}
</style>
