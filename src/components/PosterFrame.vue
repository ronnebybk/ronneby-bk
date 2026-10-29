<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/index.js'
import { state, todayIso } from '../data/store.js'
import config from '../config.js'
import logo from '../assets/logo.svg'

const props = defineProps({
  // 'landscape' is the schedule, 'portrait' the groups & prices poster; both are A4.
  orientation: { type: String, default: 'portrait' },
})

const { t, localized, formatDate } = useI18n()

const contact = computed(() => {
  const { venue, venueEn, street, city, email, phone } = state.club
  const address = [street, city].filter(Boolean).join(', ')
  return [localized(venue, venueEn), address, email, phone].filter(Boolean)
})
</script>

<template>
  <div class="stage">
    <article :class="['poster', props.orientation]">
      <header class="head">
        <img :src="logo" :alt="config.clubName" width="697" height="545" />
        <div>
          <p class="club">{{ config.clubName }}</p>
          <h1><slot name="title" /></h1>
        </div>
      </header>

      <div class="body"><slot /></div>

      <footer class="foot">
        <ul v-if="contact.length" class="contact">
          <li v-for="item in contact" :key="item">{{ item }}</li>
        </ul>
        <div class="qr"><slot name="qr" /></div>
        <p class="printed">{{ t('poster.printed', { date: formatDate(todayIso()) }) }}</p>
      </footer>
    </article>
  </div>
</template>

<style scoped>
/* The grey surround and the sheet's shadow exist only on screen. */
.stage {
  background: #d9d5d2;
  padding: 24px 16px;
  overflow-x: auto;
}

/* A fixed A4 sheet, so what is on screen is what comes out of the printer. Inside, sizes use
   pt and mm. The light palette keeps it white and black when the visitor's system is dark. */
.poster {
  --text: #000;
  --muted: #3d3836;
  --surface: #fff;
  --line: #8a8381;
  --paper: #fff;
  color-scheme: light;
  display: flex;
  flex-direction: column;
  gap: 4mm;
  box-sizing: border-box;
  width: max-content;
  margin: 0 auto;
  padding: 10mm;
  background: #fff;
  color: #000;
  box-shadow: 0 2px 12px rgb(0 0 0 / 0.3);
  font-size: 11pt;
  line-height: 1.3;
}

.poster.landscape {
  width: 297mm;
  height: 210mm;
  page: poster-landscape;
}

.poster.portrait {
  width: 210mm;
  height: 297mm;
  page: poster-portrait;
}

.head {
  display: flex;
  align-items: center;
  gap: 6mm;
  padding-bottom: 3mm;
  border-bottom: 1.5mm solid #000;
}

/* The logo's white outlines need the dark background it was drawn for. */
.head img {
  height: 20mm;
  width: auto;
  box-sizing: content-box;
  padding: 2mm 4mm;
  border-radius: 2mm;
  background: #1e1d1c;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.club {
  margin: 0;
  font-family: var(--font-display);
  font-size: 12pt;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-size: 30pt;
}

.body {
  flex: 1;
  min-height: 0;
}

.foot {
  display: flex;
  align-items: flex-end;
  gap: 6mm;
  padding-top: 3mm;
  border-top: 0.5mm solid #000;
  font-size: 10pt;
}

.contact {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 1mm 6mm;
  list-style: none;
  margin: 0;
  padding: 0;
}

.printed {
  margin: 0;
  font-size: 8pt;
  color: var(--muted);
  align-self: flex-end;
}

.qr:empty {
  display: none;
}

/* The sheet is the page: the @page margin replaces its on-screen padding. Slightly under the page
   size so rounding never adds an empty second page. */
@media print {
  .stage {
    padding: 0;
    background: none;
    overflow: visible;
  }

  .poster {
    padding: 0;
    margin: 0;
    box-shadow: none;
  }

  .poster.landscape {
    width: 277mm;
    height: 189mm;
  }

  .poster.portrait {
    width: 190mm;
    height: 276mm;
  }
}
</style>
