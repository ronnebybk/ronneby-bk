<script setup>
import PosterToolbar from '../components/PosterToolbar.vue'
import PosterFrame from '../components/PosterFrame.vue'
import TextBlocks from '../components/TextBlocks.vue'
import { useI18n } from '../i18n/index.js'
import { state, hasData, joinText, groupColorIndex, priceText } from '../data/store.js'

const { t, localized } = useI18n()
</script>

<template>
  <PosterToolbar />
  <PosterFrame
    orientation="portrait"
    :qr-to="{ name: 'groups' }"
    :qr-caption="t('poster.groupsQr')"
  >
    <template #title>{{ t('poster.groupsTitle') }}</template>

    <p v-if="state.status === 'loading' && !hasData" class="empty">{{ t('common.loading') }}</p>
    <p v-else-if="!state.groups.length" class="empty">{{ state.status === 'error' ? t('poster.loadError') : t('groups.empty') }}</p>

    <div v-else class="sheet">
      <div class="groups">
        <article
          v-for="group in state.groups"
          :key="group.name"
          class="group"
          :style="{ '--group-color': `var(--group-${groupColorIndex(group.name)})` }"
        >
          <header>
            <h2>{{ localized(group.name, group.nameEn) }}</h2>
            <span v-if="group.ages" class="age">{{ t('common.age') }} {{ group.ages }}</span>
          </header>
          <p v-if="group.description" class="desc">{{ localized(group.description, group.descriptionEn) }}</p>
          <p v-if="group.prices.length" class="price">{{ priceText(group) }}</p>
        </article>
      </div>

      <div class="info">
        <aside class="box">
          <strong>{{ t('poster.trialTitle') }}</strong>
          {{ t('poster.trialText') }}
        </aside>
        <section class="join">
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
  display: flex;
  flex-direction: column;
  gap: 6mm;
}

p {
  margin: 0;
}

.groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 5mm;
}

/* The colour bar is decoration: the name next to it carries the meaning in greyscale. */
.group {
  display: flex;
  flex-direction: column;
  gap: 1.5mm;
  break-inside: avoid;
  padding: 2mm 0 2mm 4mm;
  border-left: 2.5mm solid var(--group-color);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 1mm 3mm;
}

h2 {
  margin: 0;
  font-size: 18pt;
}

.age {
  font-weight: 700;
  font-size: 11pt;
}

.desc {
  font-size: 11pt;
}

.price {
  margin-top: auto;
  font-family: var(--font-display);
  font-size: 15pt;
  font-weight: 700;
}

.info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5mm;
  align-items: start;
  break-inside: avoid;
}

.box,
.join {
  padding: 3mm 4mm;
  border: 0.6mm solid #000;
  border-radius: 2mm;
  font-size: 11pt;
}

.box strong {
  display: block;
  font-family: var(--font-display);
  font-size: 14pt;
  text-transform: uppercase;
}

.join h2 {
  font-size: 14pt;
}
</style>
