<script setup>
// 'gold' | 'silver' | 'bronze'; the fill comes from the --gold/--silver/--bronze variables.
defineProps({ medal: { type: String, required: true } })
</script>

<template>
  <!-- Decorative only: the text label next to the icon carries the meaning, so colour is never
       the only cue. -->
  <svg class="medal" :class="medal" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
    <path d="M7 1h4l-1.6 8H5.4z" />
    <path d="M13 1h4l1.6 8h-4z" />
    <circle cx="12" cy="15.5" r="6.5" />
  </svg>
</template>

<style scoped>
.medal {
  flex: none;
  fill: var(--muted);
  stroke: var(--ink);
  stroke-width: 1;
}

.medal.gold {
  fill: var(--gold);
}

.medal.silver {
  fill: var(--silver);
}

.medal.bronze {
  fill: var(--bronze);
}
</style>
