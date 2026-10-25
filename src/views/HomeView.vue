<script setup>
import { computed } from 'vue'
import SessionItem from '../components/SessionItem.vue'
import SocialEmbed from '../components/SocialEmbed.vue'
import DataNotice from '../components/DataNotice.vue'
import { state, hasData, todayInfo, findGroup } from '../data/store.js'
import { useI18n } from '../i18n/index.js'
import config from '../config.js'
import logo from '../assets/logo.webp'

const { t, localized } = useI18n()

const nextText = computed(() => {
  const next = todayInfo.value.next
  if (!next) return ''
  return t('home.nextSession', {
    day: t('days')[next.day - 1],
    time: next.start,
    group: localized(next.group, findGroup(next.group)?.nameEn),
  })
})

const explore = [
  { to: '/grupper', title: 'home.exploreGroups', text: 'home.exploreGroupsText' },
  { to: '/tranare', title: 'home.exploreCoaches', text: 'home.exploreCoachesText' },
  { to: '/kontakt', title: 'home.exploreContact', text: 'home.exploreContactText' },
]
</script>

<template>
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-text">
        <h1>{{ config.clubName }}</h1>
        <p class="tagline">{{ t('home.tagline') }}</p>
        <div class="cta">
          <RouterLink to="/schema" class="btn btn-primary">{{ t('home.ctaSchedule') }}</RouterLink>
          <RouterLink to="/kontakt" class="btn btn-outline">{{ t('home.ctaTry') }}</RouterLink>
        </div>
      </div>
      <img class="hero-logo" :src="logo" alt="" width="800" height="527" />
    </div>
  </section>

  <section class="container page">
    <DataNotice />

    <div class="today card">
      <h2>{{ t('home.todayTitle') }}</h2>
      <p v-if="state.status === 'loading' && !hasData" class="muted">{{ t('common.loading') }}</p>
      <template v-else>
        <div v-if="todayInfo.today.length" class="today-list">
          <SessionItem v-for="(session, i) in todayInfo.today" :key="i" :session="session" />
        </div>
        <p v-else class="muted">{{ t('home.noneToday') }}</p>
        <p v-if="nextText" class="next">{{ nextText }}</p>
      </template>
      <RouterLink to="/schema">{{ t('home.ctaSchedule') }} →</RouterLink>
    </div>

    <h2 class="section-title">{{ t('home.exploreTitle') }}</h2>
    <div class="grid">
      <RouterLink v-for="item in explore" :key="item.to" :to="item.to" class="card explore">
        <h3>{{ t(item.title) }}</h3>
        <p class="muted">{{ t(item.text) }}</p>
      </RouterLink>
    </div>

    <h2 class="section-title">{{ t('home.followTitle') }}</h2>
    <div class="grid social-grid">
      <SocialEmbed service="facebook" />
      <SocialEmbed service="instagram" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  background:
    radial-gradient(circle at 80% 40%, rgb(210 75 54 / 0.25), transparent 55%),
    var(--ink);
  color: var(--on-ink);
}

.hero-inner {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: 32px;
  padding-top: 56px;
  padding-bottom: 56px;
}

.tagline {
  font-size: 1.15rem;
  color: var(--on-ink-muted);
  max-width: 40ch;
}

.cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.hero-logo {
  width: 100%;
  max-width: 460px;
  height: auto;
  justify-self: center;
  /* The logo's dark background disappears into the hero gradient. */
  mix-blend-mode: lighten;
}

@media (max-width: 760px) {
  .hero-inner {
    grid-template-columns: 1fr;
    padding-top: 32px;
    padding-bottom: 40px;
  }

  .hero-logo {
    order: -1;
    max-width: 280px;
  }
}

.today {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 4px solid var(--red);
}

.today h2,
.today p {
  margin: 0;
}

.today-list {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
}

.today-list :deep(.session) {
  background: var(--paper);
}

.next {
  font-weight: 600;
}

.section-title {
  margin-top: 48px;
}

.explore {
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s, border-color 0.15s;
}

.explore:hover {
  transform: translateY(-2px);
  border-color: var(--red);
}

.explore h3 {
  color: var(--link);
}

.explore p {
  margin: 0;
}

.social-grid {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  align-items: start;
}
</style>
