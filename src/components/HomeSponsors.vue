<script setup>
import { computed } from 'vue'
import { state } from '../data/store.js'
import { useI18n } from '../i18n/index.js'
import SponsorLogo from './SponsorLogo.vue'

// Kept low on purpose so sponsors don't take over the home page; the rest are on /sponsorer.
const HOME_LIMIT = 4

const { t } = useI18n()
const shown = computed(() => state.sponsors.slice(0, HOME_LIMIT))
const hasMore = computed(() => state.sponsors.length > HOME_LIMIT)
</script>

<template>
  <section v-if="shown.length">
    <h2 class="section-title">{{ t('home.sponsorsTitle') }}</h2>
    <ul class="sponsors">
      <li v-for="(sponsor, i) in shown" :key="i">
        <a v-if="sponsor.url" :href="sponsor.url" target="_blank" rel="noopener noreferrer" class="sponsor-tile">
          <SponsorLogo :sponsor="sponsor" :height="44" />
        </a>
        <span v-else class="sponsor-tile">
          <SponsorLogo :sponsor="sponsor" :height="44" />
        </span>
      </li>
    </ul>
    <p v-if="hasMore" class="all">
      <RouterLink to="/sponsorer">{{ t('home.sponsorsAll') }} →</RouterLink>
    </p>
  </section>
</template>

<style scoped>
.sponsors {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 12px;
}

/* 4 per row on desktop, 2 × 2 on phones; left-aligned so the tiles start under the heading. */
li {
  flex: 0 1 calc(25% - 9px);
  display: flex;
}

@media (max-width: 600px) {
  li {
    flex-basis: calc(50% - 6px);
  }
}

.sponsor-tile {
  width: 100%;
  min-height: 72px;
  text-decoration: none;
}

.all {
  text-align: center;
  margin: 16px 0 0;
}
</style>
