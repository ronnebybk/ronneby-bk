<script setup>
import SocialEmbed from './SocialEmbed.vue'

defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <h2 class="section-title">{{ title }}</h2>
  <div class="grid social-grid">
    <SocialEmbed service="facebook" />
    <SocialEmbed service="instagram" />
  </div>
</template>

<style scoped>
.social-grid {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  align-items: start;
}
</style>
