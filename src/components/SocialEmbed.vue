<script setup>
import { computed, nextTick, watch } from 'vue'
import { consent, giveConsent } from '../data/consent.js'
import { useI18n } from '../i18n/index.js'
import { state } from '../data/store.js'

// Facebook and Instagram set tracking cookies, so nothing is loaded from them
// until the visitor clicks "show" (GDPR). The choice is remembered on the device.
const props = defineProps({
  service: { type: String, required: true }, // 'facebook' | 'instagram'
})

const { t, locale } = useI18n()
const facebookUrl = computed(() => state.club.facebookUrl ?? '')
const instagramHandle = computed(() => state.club.instagramHandle ?? '')
const beholdFeedId = computed(() => state.club.beholdFeedId ?? '')
const name = computed(() => t(`social.${props.service}`))

const profileUrl = computed(() =>
  props.service === 'facebook'
    ? facebookUrl.value
    : instagramHandle.value && `https://www.instagram.com/${instagramHandle.value}/`,
)

// Facebook can only embed Pages, not groups (the plugin renders an empty frame for a group),
// so a group gets a plain "join" link instead.
const isFacebookGroup = computed(() => props.service === 'facebook' && /facebook\.com\/groups\//.test(facebookUrl.value))

// Facebook Pages have an embeddable feed; Instagram only via a Behold widget.
const embeddable = computed(() =>
  props.service === 'facebook' ? Boolean(facebookUrl.value) && !isFacebookGroup.value : Boolean(beholdFeedId.value),
)

const facebookSrc = computed(() => {
  const params = new URLSearchParams({
    href: facebookUrl.value,
    tabs: 'timeline',
    width: '500',
    height: '600',
    small_header: 'false',
    adapt_container_width: 'true',
    hide_cover: 'false',
    show_facepile: 'false',
    locale: locale.value === 'en' ? 'en_GB' : 'sv_SE',
  })
  return `https://www.facebook.com/plugins/page.php?${params}`
})

function loadBehold() {
  if (document.querySelector('script[data-behold]')) return
  const script = document.createElement('script')
  script.type = 'module'
  script.src = 'https://w.behold.so/widget.js'
  script.dataset.behold = ''
  document.head.append(script)
}

watch(
  () => props.service === 'instagram' && beholdFeedId.value && consent[props.service],
  (load) => load && nextTick(loadBehold),
  { immediate: true },
)
</script>

<template>
  <div class="social card">
    <h3>{{ name }}</h3>

    <p v-if="!profileUrl" class="muted">{{ t('common.comingSoon') }}</p>

    <div v-else-if="isFacebookGroup" class="group">
      <p>{{ t('social.groupText') }}</p>
      <a :href="profileUrl" target="_blank" rel="noopener" class="btn btn-primary">{{ t('social.groupButton') }} ↗</a>
    </div>

    <template v-else-if="embeddable && consent[service]">
      <iframe
        v-if="service === 'facebook'"
        :src="facebookSrc"
        :title="name"
        width="500"
        height="600"
        loading="lazy"
        allow="encrypted-media"
      ></iframe>
      <behold-widget v-else :feed-id="beholdFeedId"></behold-widget>
    </template>

    <div v-else-if="embeddable" class="consent">
      <p class="muted">{{ t('social.consentText', { service: name }) }}</p>
      <button type="button" class="btn btn-primary" @click="giveConsent(service)">
        {{ t('social.consentButton', { service: name }) }}
      </button>
      <RouterLink to="/integritet" class="small">{{ t('social.privacy') }}</RouterLink>
    </div>

    <p v-if="profileUrl && !isFacebookGroup">
      <a :href="profileUrl" target="_blank" rel="noopener">{{ t('social.openOn', { service: name }) }} ↗</a>
    </p>
  </div>
</template>

<style scoped>
.social {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social p {
  margin: 0;
}

iframe {
  width: 100%;
  max-width: 500px;
  border: 0;
  border-radius: 8px;
  background: var(--paper);
}

.group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.consent {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  border: 1px dashed var(--line);
  border-radius: 8px;
}

.small {
  font-size: 0.85rem;
}
</style>
