<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  sponsor: { type: Object, required: true },
  height: { type: Number, default: 40 },
  // Footer shows the name as text when the logo is missing/broken; the sponsors page has the
  // name below the tile, so it passes false to avoid showing it twice.
  fallbackText: { type: Boolean, default: true },
})

// URLs that failed to load, so the image hides and the fallback shows instead.
const failedImages = reactive(new Set())
watch(() => props.sponsor.logo, () => {
  if (props.sponsor.logo) failedImages.delete(props.sponsor.logo)
})

// Wide logos (e.g. 2.4:1) need room; cap at 3× the height so footer logos stay small.
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
    @error="failedImages.add(sponsor.logo)"
  />
  <span v-else-if="fallbackText" class="sponsor-name" :style="{ lineHeight: height + 'px', maxWidth: height * 3 + 'px' }">{{ sponsor.name }}</span>
</template>

<style scoped>
img {
  object-fit: contain;
}

.sponsor-name {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}
</style>
