<script setup>
import { useI18n } from '../i18n/index.js'
import { state } from '../data/store.js'
import config from '../config.js'
import SponsorLogo from './SponsorLogo.vue'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <ul v-if="state.sponsors.length" class="sponsor-strip" :aria-label="t('footer.sponsors')">
      <li v-for="sponsor in state.sponsors" :key="sponsor.name">
        <a v-if="sponsor.url" :href="sponsor.url" target="_blank" rel="noopener noreferrer" class="sponsor-tile">
          <SponsorLogo :sponsor="sponsor" :height="28" />
        </a>
        <span v-else class="sponsor-tile">
          <SponsorLogo :sponsor="sponsor" :height="28" />
        </span>
      </li>
    </ul>
    <div class="container row">
      <p>© {{ year }} {{ config.clubName }}</p>
      <nav>
        <a v-if="state.club.facebookUrl" :href="state.club.facebookUrl" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a v-if="state.club.instagramUrl" :href="state.club.instagramUrl" target="_blank" rel="noopener noreferrer">Instagram</a>
        <RouterLink v-if="state.sponsors.length" to="/sponsorer">{{ t('footer.sponsorsLink') }}</RouterLink>
        <RouterLink to="/dokument">{{ t('footer.documents') }}</RouterLink>
        <RouterLink to="/integritet">{{ t('footer.privacy') }}</RouterLink>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--ink);
  color: var(--on-ink-muted);
  border-top: 3px solid var(--red);
  font-size: 0.9rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-top: 24px;
  padding-bottom: 24px;
}

p {
  margin: 0;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
}

a {
  color: var(--on-ink);
}

.sponsor-strip {
  list-style: none;
  margin: 0;
  padding: 16px 16px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.sponsor-tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 6px;
  padding: 6px 12px;
  min-height: 44px;
  color: var(--ink);
  font-size: 0.85rem;
}
</style>
