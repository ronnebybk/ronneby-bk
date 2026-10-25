<script setup>
import { computed } from 'vue'
import SocialEmbed from '../components/SocialEmbed.vue'
import { useI18n } from '../i18n/index.js'
import config from '../config.js'

const { t } = useI18n()
const { venue, street, city, email, phone } = config.contact

const hasAddress = Boolean(venue || street)
// A plain link instead of an embedded map: no Google cookies unless the visitor clicks.
const mapUrl = computed(
  () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([venue, street, city].filter(Boolean).join(', '))}`,
)
</script>

<template>
  <div class="container page">
    <h1>{{ t('contact.title') }}</h1>

    <div class="grid">
      <section class="card">
        <h2>{{ t('contact.whereTitle') }}</h2>
        <template v-if="hasAddress">
          <address>
            <strong v-if="venue">{{ venue }}</strong><br v-if="venue" />
            <template v-if="street">{{ street }}<br /></template>
            {{ city }}
          </address>
          <a :href="mapUrl" target="_blank" rel="noopener">{{ t('contact.openMap') }} ↗</a>
        </template>
        <p v-else class="muted">{{ t('contact.missing') }}</p>
      </section>

      <section class="card">
        <h2>{{ t('contact.reachTitle') }}</h2>
        <ul v-if="email || phone" class="reach">
          <li v-if="email"><a :href="`mailto:${email}`">{{ email }}</a></li>
          <li v-if="phone"><a :href="`tel:${phone.replace(/[^\d+]/g, '')}`">{{ phone }}</a></li>
        </ul>
        <p v-else class="muted">{{ t('contact.missing') }}</p>
        <p>
          <RouterLink to="/tranare">{{ t('home.exploreCoaches') }} →</RouterLink>
        </p>
      </section>

      <section class="card join">
        <h2>{{ t('contact.joinTitle') }}</h2>
        <p>{{ t('contact.joinText') }}</p>
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

.section-title {
  margin-top: 48px;
}

.social-grid {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  align-items: start;
}
</style>
