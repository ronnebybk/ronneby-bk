<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  sponsor: { type: Object, required: true },
  height: { type: Number, default: 40 },
})

// URLs that failed to load, so the image hides and the name shows as text instead.
const failedImages = reactive(new Set())
watch(() => props.sponsor.logo, () => {
  if (props.sponsor.logo) failedImages.delete(props.sponsor.logo)
})
</script>

<template>
  <img
    v-if="sponsor.logo && !failedImages.has(sponsor.logo)"
    :src="sponsor.logo"
    :alt="sponsor.name"
    loading="lazy"
    referrerpolicy="no-referrer"
    :style="{ height: height + 'px' }"
    @error="failedImages.add(sponsor.logo)"
  />
  <span v-else class="sponsor-name" :style="{ lineHeight: height + 'px' }">{{ sponsor.name }}</span>
</template>

<style scoped>
img {
  max-width: 140px;
  object-fit: contain;
}

.sponsor-name {
  display: inline-block;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}
</style>
