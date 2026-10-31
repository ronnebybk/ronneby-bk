<script setup>
import { computed } from 'vue'
import { state } from '../data/store.js'
import { useI18n } from '../i18n/index.js'
import SponsorLogo from '../components/SponsorLogo.vue'

const { t, localized } = useI18n()

// Sponsors in sheet order; the description falls back to Swedish when the English cell is empty.
const sponsors = computed(() =>
  state.sponsors.map((s) => ({
    ...s,
    description: localized(s.description, s.descriptionEn),
  })),
)
</script>

<template>
  <div class="container page">
    <h1>{{ t('sponsors.title') }}</h1>

    <ul v-if="sponsors.length" class="grid">
      <li v-for="sponsor in sponsors" :key="sponsor.name" class="card">
        <a v-if="sponsor.url" :href="sponsor.url" target="_blank" rel="noopener noreferrer" class="card-link">
          <span v-if="sponsor.logo" class="sponsor-tile">
            <SponsorLogo :sponsor="sponsor" :height="64" :fallback-text="false" />
          </span>
          <span class="name">{{ sponsor.name }}</span>
          <span v-if="sponsor.description" class="description">{{ sponsor.description }}</span>
        </a>
        <template v-else>
          <span v-if="sponsor.logo" class="sponsor-tile">
            <SponsorLogo :sponsor="sponsor" :height="64" :fallback-text="false" />
          </span>
          <span class="name">{{ sponsor.name }}</span>
          <span v-if="sponsor.description" class="description">{{ sponsor.description }}</span>
        </template>
      </li>
    </ul>

    <p v-if="state.club.email" class="become">
      {{ t('sponsors.become') }}
      <a :href="`mailto:${state.club.email}`">{{ state.club.email }}</a>
    </p>
  </div>
</template>

<style scoped>
.grid {
  list-style: none;
  padding: 0;
  margin: 24px 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
  gap: 16px;
}

.card {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}

.card-link {
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sponsor-tile {
  min-width: 100px;
}

.name {
  font-weight: 600;
}

.description {
  font-size: 0.9rem;
  color: var(--muted);
  /* Editors sometimes paste long multi-line text; clamp it so cards stay compact. */
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.become {
  margin-top: 8px;
}
</style>
