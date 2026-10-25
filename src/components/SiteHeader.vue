<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LangToggle from './LangToggle.vue'
import { useI18n } from '../i18n/index.js'
import config from '../config.js'
import logo from '../assets/logo.webp'

const { t } = useI18n()
const route = useRoute()
const open = ref(false)

watch(() => route.fullPath, () => (open.value = false))

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/schema', key: 'nav.schedule' },
  { to: '/grupper', key: 'nav.groups' },
  { to: '/tranare', key: 'nav.coaches' },
  { to: '/kontakt', key: 'nav.contact' },
]
</script>

<template>
  <header class="header">
    <div class="container bar">
      <RouterLink to="/" class="brand">
        <img :src="logo" :alt="config.clubName" width="800" height="527" />
      </RouterLink>

      <nav :class="{ open }" :aria-label="t('nav.menu')">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to">{{ t(link.key) }}</RouterLink>
      </nav>

      <div class="actions">
        <LangToggle />
        <button
          type="button"
          class="menu-btn"
          :aria-expanded="open"
          :aria-label="open ? t('nav.close') : t('nav.menu')"
          @click="open = !open"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: var(--ink);
  color: var(--on-ink);
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 3px solid var(--red);
}

.bar {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 72px;
}

.brand img {
  height: 56px;
  width: auto;
}

nav {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

nav a {
  color: var(--on-ink);
  text-decoration: none;
  font-family: var(--font-display);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 8px 12px;
  border-radius: 6px;
}

nav a:hover {
  background: var(--ink-2);
}

nav a.router-link-exact-active {
  color: var(--red);
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 10px;
  background: none;
  border: 0;
  cursor: pointer;
}

.menu-btn span {
  display: block;
  height: 2px;
  background: var(--on-ink);
  border-radius: 2px;
}

@media (max-width: 860px) {
  .actions {
    margin-left: auto;
  }

  .menu-btn {
    display: flex;
  }

  nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--ink);
    padding: 8px 16px 16px;
    border-bottom: 3px solid var(--red);
  }

  nav.open {
    display: flex;
  }

  nav a {
    padding: 12px;
    font-size: 1.1rem;
  }
}
</style>
