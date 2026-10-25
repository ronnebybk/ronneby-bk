<script setup>
import { useI18n } from '../i18n/index.js'
import config from '../config.js'

const { t } = useI18n()
const { facebookUrl, instagramHandle } = config.social
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container row">
      <p>© {{ year }} {{ config.clubName }}</p>
      <nav>
        <a v-if="facebookUrl" :href="facebookUrl" target="_blank" rel="noopener">Facebook</a>
        <a v-if="instagramHandle" :href="`https://www.instagram.com/${instagramHandle}/`" target="_blank" rel="noopener">
          Instagram
        </a>
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
  gap: 20px;
}

a {
  color: var(--on-ink);
}
</style>
