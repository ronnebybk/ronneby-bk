<script setup>
import { computed } from 'vue'
import SessionItem from '../components/SessionItem.vue'
import SocialSection from '../components/SocialSection.vue'
import DataNotice from '../components/DataNotice.vue'
import NoticeBanner from '../components/NoticeBanner.vue'
import NewsList from '../components/NewsList.vue'
import { state, hasData, todayInfo, groupNames } from '../data/store.js'
import { useI18n } from '../i18n/index.js'
import config from '../config.js'
import logo from '../assets/logo.svg'

const { t, formatWeekday } = useI18n()

const nextText = computed(() => {
  const next = todayInfo.value.next
  if (!next) return ''
  const { session, date, offset } = next
  // A bare weekday is only unambiguous within the coming week.
  const when = offset === 1 ? t('home.tomorrow') : formatWeekday(date, offset > 6)
  return t('home.nextSession', {
    when,
    time: session.start,
    group: groupNames(session.groups),
  })
})

const explore = [
  { to: '/grupper', title: 'home.exploreGroups', text: 'home.exploreGroupsText' },
  { to: '/tranare', title: 'home.exploreCoaches', text: 'home.exploreCoachesText' },
  { to: '/kontakt', title: 'home.exploreContact', text: 'home.exploreContactText' },
]
</script>

<template>
  <NoticeBanner />

  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-text">
        <h1>{{ config.clubName }}</h1>
        <p class="tagline">{{ t('home.tagline') }}</p>
        <div class="cta">
          <RouterLink to="/schema" class="btn btn-primary">{{ t('home.ctaSchedule') }}</RouterLink>
          <RouterLink to="/prova-pa" class="btn btn-outline">{{ t('home.ctaTry') }}</RouterLink>
        </div>
      </div>
      <img class="hero-logo" :src="logo" alt="" width="697" height="545" />
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

    <NewsList />

    <h2 class="section-title">{{ t('home.exploreTitle') }}</h2>
    <div class="grid">
      <RouterLink v-for="item in explore" :key="item.to" :to="item.to" class="card explore">
        <h3>{{ t(item.title) }}</h3>
        <p class="muted">{{ t(item.text) }}</p>
      </RouterLink>
    </div>

    <SocialSection :title="t('home.followTitle')" />
  </section>
</template>

<style scoped>
.hero {
  background:
    radial-gradient(circle at 80% 40%, rgb(237 45 48 / 0.22), transparent 55%),
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
</style>
