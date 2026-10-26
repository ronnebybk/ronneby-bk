<script setup>
import { computed } from 'vue'
import SocialEmbed from '../components/SocialEmbed.vue'
import { useI18n } from '../i18n/index.js'
import { state } from '../data/store.js'
import { linkParts } from '../data/parse.js'

const { t, localized } = useI18n()
const club = computed(() => state.club)

const hasAddress = computed(() => Boolean(club.value.venue || club.value.street))
// A plain link instead of an embedded map: no Google cookies unless the visitor clicks.
const mapUrl = computed(() => {
  const { venue, street, city } = club.value
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([venue, street, city].filter(Boolean).join(', '))}`
})
const joinText = computed(() => localized(club.value.join, club.value.joinEn) || t('contact.joinText'))
</script>

<template>
  <div class="container page">
    <h1>{{ t('contact.title') }}</h1>

    <div class="grid">
      <section class="card">
        <h2>{{ t('contact.whereTitle') }}</h2>
        <template v-if="hasAddress">
          <address>
            <strong v-if="club.venue">{{ localized(club.venue, club.venueEn) }}</strong><br v-if="club.venue" />
            <template v-if="club.street">{{ club.street }}<br /></template>
            {{ club.city }}
          </address>
          <a :href="mapUrl" target="_blank" rel="noopener">{{ t('contact.openMap') }} ↗</a>
        </template>
        <p v-else class="muted">{{ t('contact.missing') }}</p>
      </section>

      <section class="card">
        <h2>{{ t('contact.reachTitle') }}</h2>
        <ul v-if="club.email || club.phone" class="reach">
          <li v-if="club.email"><a :href="`mailto:${club.email}`">{{ club.email }}</a></li>
          <li v-if="club.phone"><a :href="`tel:${club.phone.replace(/[^\d+]/g, '')}`">{{ club.phone }}</a></li>
        </ul>
        <p v-else class="muted">{{ t('contact.missing') }}</p>
        <p>
          <RouterLink to="/tranare">{{ t('home.exploreCoaches') }} →</RouterLink>
        </p>
      </section>

      <section class="card join">
        <h2>{{ t('contact.joinTitle') }}</h2>
        <p class="join-text">
          <template v-for="(part, index) in linkParts(joinText)" :key="index">
            <a v-if="part.href" :href="part.href" target="_blank" rel="noopener">{{ part.text }}</a>
            <template v-else>{{ part.text }}</template>
          </template>
        </p>
        <RouterLink to="/grupper" class="btn btn-primary">{{ t('nav.groups') }}</RouterLink>
      </section>
    </div>

    <h2 class="section-title">{{ t('contact.socialTitle') }}</h2>
    <div class="grid social-grid">
      <SocialEmbed service="facebook" />
      <SocialEmbed service="instagram" />
    </div>
  </div>
</template>

<style scoped>
.card h2 {
  font-size: 1.4rem;
}

address {
  font-style: normal;
  margin-bottom: 12px;
}

.reach {
  list-style: none;
  padding: 0;
  margin: 0 0 12px;
  display: grid;
  gap: 6px;
}

.join {
  border-top: 4px solid var(--red);
}

.join-text {
  overflow-wrap: anywhere;
}

.section-title {
  margin-top: 48px;
}

.social-grid {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  align-items: start;
}
</style>
