<script setup>
import { computed } from 'vue'
import QrCode from './QrCode.vue'
import { useRouter } from 'vue-router'
import { useI18n } from '../i18n/index.js'
import { state, todayIso } from '../data/store.js'
import config from '../config.js'
import logo from '../assets/logo.svg'

const props = defineProps({
  // 'landscape' is the schedule, 'portrait' the groups & prices poster; both are A4.
  orientation: { type: String, default: 'portrait' },
  // Route of the live page (it becomes an absolute address) and the sentence printed next to its QR.
  qrTo: { type: Object, default: null },
  qrCaption: { type: String, default: '' },
})

const { t, localized, formatDate } = useI18n()
const router = useRouter()

// Built from where the poster is opened, so the code follows the site if it moves.
const qrUrl = computed(() => (props.qrTo ? location.origin + location.pathname + router.resolve(props.qrTo).href : ''))

const venue = computed(() => localized(state.club.venue, state.club.venueEn))
const contact = computed(() => {
  const { street, city, email, phone } = state.club
  const address = [street, city].filter(Boolean).join(', ')
  return [venue.value, address, email, phone].filter(Boolean)
})
</script>

<template>
  <div class="stage">
    <article :class="['poster', props.orientation]">
      <header class="head">
        <img :src="logo" :alt="config.clubName" width="697" height="545" />
        <div class="titles">
          <p class="club">{{ config.clubName }}</p>
          <h1><slot name="title" /></h1>
          <p v-if="$slots.subtitle" class="subtitle"><slot name="subtitle" /></p>
        </div>
        <p class="badge">
          <span>{{ t('poster.badgeTop') }}</span>
          <strong>{{ t('poster.badgeMain') }}</strong>
        </p>
      </header>

      <div class="body"><slot /></div>

      <footer class="foot">
        <div class="contact">
          <p v-if="contact.length">
            <span v-for="(item, i) in contact" :key="i" :class="{ venue: i === 0 && venue }">{{ item }}</span>
          </p>
          <p class="printed">{{ t('poster.printed', { date: formatDate(todayIso()) }) }}</p>
        </div>
        <div v-if="qrUrl" class="qr">
          <QrCode :value="qrUrl" />
          <div>
            <p class="scan">{{ t('poster.scan') }}</p>
            <p v-if="qrCaption">{{ qrCaption }}</p>
          </div>
        </div>
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
  --highlight: #fde8e8;
  --ink-tint: #eeeae7;
  color-scheme: light;
  display: flex;
  flex-direction: column;
  gap: 5mm;
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
  min-height: 210mm;
  page: poster-landscape;
}

.poster.portrait {
  width: 210mm;
  min-height: 297mm;
  page: poster-portrait;
}

p {
  margin: 0;
}

/* The black band is what makes it a club poster; it costs toner, which the club accepted. */
.head {
  display: flex;
  align-items: center;
  gap: 7mm;
  padding: 3mm 6mm;
  /* Square bottom corners keep the red stripe straight to its ends. */
  border-radius: 3mm 3mm 0 0;
  border-bottom: 2mm solid var(--red);
  background: var(--ink);
  color: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.head img {
  flex: none;
  height: 22mm;
  width: auto;
}

.titles {
  flex: 1;
  min-width: 0;
}

.club {
  font-family: var(--font-display);
  font-size: 13pt;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #fff;
  font-size: 36pt;
  line-height: 1.05;
}

.subtitle {
  margin-top: 1mm;
  font-size: 12pt;
}

/* Tilted so it reads as a sticker; still legible in greyscale (white on dark grey). */
.badge {
  flex: none;
  display: grid;
  place-content: center;
  width: 27mm;
  height: 27mm;
  border: 0.8mm solid #fff;
  border-radius: 50%;
  background: var(--red-strong);
  color: #fff;
  font-family: var(--font-display);
  text-align: center;
  text-transform: uppercase;
  line-height: 1.05;
  transform: rotate(-8deg);
}

.badge span {
  font-size: 8.5pt;
}

.badge strong {
  font-size: 18pt;
}

/* Growing from its content size (basis auto, not 0): with basis 0, Chrome lays the footer over
   the content when a full poster spills onto a second printed page. */
.body {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}

.foot {
  display: flex;
  align-items: center;
  gap: 8mm;
  padding-top: 2mm;
  border-top: 0.8mm solid #000;
}

.contact {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2mm;
  font-size: 12pt;
}

.contact span:not(:last-child)::after {
  content: ' · ';
}

.venue {
  font-weight: 700;
}

.printed {
  font-size: 8pt;
  color: var(--muted);
}

.qr {
  display: flex;
  align-items: center;
  gap: 4mm;
  max-width: 105mm;
  font-size: 10pt;
  line-height: 1.25;
}

.qr svg {
  flex: none;
  width: 26mm;
  height: 26mm;
}

.scan {
  margin-bottom: 1mm;
  font-family: var(--font-display);
  font-size: 22pt;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--red-strong);
}

/* The sheet is the page, and its padding is the margin (@page has none). Slightly under the page
   height so rounding never adds an empty second page. */
@media print {
  .stage {
    padding: 0;
    background: none;
    overflow: visible;
  }

  .poster {
    margin: 0;
    box-shadow: none;
  }

  .poster.landscape {
    min-height: 209mm;
  }

  .poster.portrait {
    min-height: 296mm;
  }
}
</style>

<!-- Shared by both posters' bodies. Unscoped, but every rule is under .poster. -->
<style>
/* A group's name on its colour: a black-and-white printout loses nothing. */
.poster .chip {
  display: inline-block;
  padding: 0.3mm 2.5mm;
  border-radius: 999px;
  background: var(--group-color);
  color: var(--group-ink);
  font-size: var(--chip-size, 11pt);
  font-weight: 700;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* "Prova på" and "Bli medlem" boxes. */
.poster .note-box {
  padding: 2.5mm 4mm;
  border-left: 2mm solid var(--red);
  border-radius: 1.5mm;
  background: var(--highlight);
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.poster .note-box.ink {
  border-left-color: var(--ink);
  background: var(--ink-tint);
}

.poster .note-box > strong,
.poster .note-box > h2 {
  display: block;
  margin: 0 0 1mm;
  font-family: var(--font-display);
  font-size: 14pt;
  text-transform: uppercase;
}
</style>
