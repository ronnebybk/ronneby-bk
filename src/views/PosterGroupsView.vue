<script setup>
import PosterToolbar from '../components/PosterToolbar.vue'
import PosterFrame from '../components/PosterFrame.vue'
import TextBlocks from '../components/TextBlocks.vue'
import { computed } from 'vue'
import { useI18n } from '../i18n/index.js'
import { state, hasData, joinText, groupStyle, priceText } from '../data/store.js'

const { t, localized } = useI18n()

// Six groups fill the page at full size; more get one step smaller text so they still fit. No measuring.
const DENSE_FROM = 7
const dense = computed(() => state.groups.length >= DENSE_FROM)
</script>

<template>
  <PosterToolbar />
  <PosterFrame orientation="portrait" :qr-to="{ name: 'groups' }" :qr-caption="t('poster.groupsQr')">
    <template #title>{{ t('poster.groupsTitle') }}</template>

    <p v-if="state.status === 'loading' && !hasData" class="empty">{{ t('common.loading') }}</p>
    <p v-else-if="!state.groups.length" class="empty">{{ state.status === 'error' ? t('poster.loadError') : t('groups.empty') }}</p>

    <div v-else :class="['sheet', { dense }]">
      <div class="groups">
        <article v-for="group in state.groups" :key="group.name" class="group" :style="groupStyle(group.name)">
          <header>
            <h2>{{ localized(group.name, group.nameEn) }}</h2>
            <span v-if="group.ages" class="chip">{{ t('common.age') }} {{ group.ages }}</span>
          </header>
          <p v-if="group.description" class="desc">{{ localized(group.description, group.descriptionEn) }}</p>
          <p v-if="group.prices.length" class="price">{{ priceText(group) }}</p>
        </article>
      </div>

      <div class="info">
        <aside class="note-box">
          <strong>{{ t('poster.trialTitle') }}</strong>
          {{ t('poster.trialText') }}
        </aside>
        <section class="note-box ink">
          <h2>{{ t('contact.joinTitle') }}</h2>
          <TextBlocks :text="joinText" />
        </section>
      </div>
    </div>
  </PosterFrame>
</template>

<style scoped>
.empty {
  font-size: 14pt;
}

.sheet {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  gap: 5mm;
  --name-size: 20pt;
  --text-size: 11pt;
  --price-size: 17pt;
  --group-pad: 3mm 4mm;
}

.sheet.dense {
  gap: 3mm;
  --name-size: 15pt;
  --text-size: 9.5pt;
  --price-size: 13pt;
  --group-pad: 2mm 3mm;
}

p {
  margin: 0;
}

/* Rows share the free height, so a short list still fills the page. */
.groups {
  flex: 1 0 auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: minmax(min-content, 1fr);
  gap: 4mm;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 2mm;
  break-inside: avoid;
  padding: var(--group-pad);
  border-left: 2.5mm solid var(--group-color);
  border-radius: 1.5mm;
  background: color-mix(in srgb, var(--group-color) 14%, #fff);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1mm 3mm;
}

h2 {
  margin: 0;
  font-size: var(--name-size);
}

.desc {
  font-size: var(--text-size);
}

.price {
  margin-top: auto;
  font-family: var(--font-display);
  font-size: var(--price-size);
  font-weight: 700;
}

.info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4mm;
  align-items: stretch;
  break-inside: avoid;
  font-size: var(--text-size);
}
</style>
