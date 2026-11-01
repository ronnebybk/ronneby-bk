<script setup>
import { computed, ref, watch } from 'vue'

import { state, eventWarnings, dataWarnings } from '../data/store.js'
import { TAB_SHEET_KEY } from '../data/warnings.js'
import config from '../config.js'

import { checkImages } from '../data/images.js'

import { useI18n } from '../i18n/index.js'

const { t, localized, formatDate } = useI18n()

const emit = defineEmits(['open-tab', 'open-help'])

const failing = ref([])

// Coaches, sponsors and every event image share one list, each labelled with its kind.
const items = () => [
  ...state.coaches.map((c) => ({ ...c, kind: 'coach' })),
  ...state.sponsors.map((s) => ({ ...s, kind: 'sponsor', image: s.logo, imageValue: s.logoValue })),
  ...state.events.flatMap((e) => e.images.map((img) => ({ name: e.title, kind: 'event', image: img.image, imageValue: img.imageValue }))),
]

// Re-check when the data changes (cached copy → live copy), keyed by name and raw value so a
// re-render doesn't trigger a new round of image requests. onCleanup guards against a slow,
// stale check overwriting the result of a newer one.
watch(
  () => items().map((c) => `${c.kind} ${c.name} ${c.imageValue}`).join('|'),
  async (_, __, onCleanup) => {
    let stale = false
    onCleanup(() => (stale = true))
    const result = await checkImages(items())
    if (!stale) failing.value = result
  },
  { immediate: true },
)

// Sheet tab names stay Swedish in English too — editors see Swedish tab names in the sheet.
const where = (tab, rows) =>
  t(rows.length === 1 ? 'admin.warnings.rowOne' : 'admin.warnings.rowMany', { tab, rows: rows.join(', ') })

// A warning renders as { tab, rows, text } so the tab name can be a jump button (D9).
// Tabs without a gid render as plain text.
const sheetKeyOf = (tab) => TAB_SHEET_KEY[tab]
const canJump = (tab) => Boolean(config.sheet.gids[sheetKeyOf(tab)])

// Event rows with date problems and results that match no event, in the same box (AC10).
// D8: each event warning names its Evenemang row.
const warnings = computed(() =>
  eventWarnings.value.map((w) =>
    w.kind === 'unmatched-result'
      ? { tab: null, rows: null, text: t('admin.warnings.unmatchedResult', { competition: localized(w.competition, w.competitionEn) }), help: helpFor(w) }
      : { tab: 'Evenemang', rows: [w.row], text: t(`admin.warnings.${w.problem}`, { where: where('Evenemang', [w.row]), title: localized(w.title, w.titleEn) }), help: helpFor(w) },
  ),
)

// #40: a skipped row or dropped value. unreadable on these tab+column pairs drops only the value
// (D3) — Resultat also has a Datum column, but there the whole row is hidden.
const ROW_DROPPED_COLUMNS = new Set(['Schema|Slut', 'Dokument|Datum', 'Grupper|Pris (kr)'])

// parse.js emits kebab-case reasons; the keys under admin.warnings.row are camelCase.
const ROW_KEYS = {
  missing: 'missing',
  unreadable: 'unreadable',
  'not-link': 'notLink',
  'not-link-row': 'notLinkSkipped',
  'not-https': 'notHttps',
  'not-https-row': 'notHttpsSkipped',
  'unknown-type': 'unknownType',
  'unknown-period': 'unknownPeriod',
  'price-no-amount': 'priceNoAmount',
  'price-extra-digits': 'priceExtraDigits',
  'unknown-field': 'unknownField',
  'club-invalid': 'clubInvalid',
  'club-duplicate': 'clubDuplicate',
  'from-after-to': 'fromAfterTo',
}

function rowText(w) {
  const key = w.reason === 'unreadable' && ROW_DROPPED_COLUMNS.has(`${w.tab}|${w.column}`) ? 'unreadableDropped' : ROW_KEYS[w.reason]
  return t(`admin.warnings.row.${key}`, { where: where(w.tab, w.rows), column: w.column, value: w.value })
}

// D4: the help entry each warning links to ("Hur fixar jag det?"). An id missing from
// docs/editor-help.md only opens the dialog without jumping, so a renamed entry can't break this.
const TAB_MAIN_ENTRY = {
  Schema: 'lagga-till-ett-pass',
  Säsonger: 'sommarschema',
  Grupper: 'andra-pris',
  Tränare: 'lagga-till-tranare',
  Anslag: 'anslag',
  Klubbinfo: 'klubbinfo',
  'Prova på': 'prova-pa-text',
  Frågor: 'fraga',
  Dokument: 'dokument',
  Evenemang: 'evenemang',
  Resultat: 'lagga-till-resultat',
  Sponsorer: 'sponsor',
}

const ROW_HELP = {
  'price-no-amount': 'andra-pris',
  'price-extra-digits': 'andra-pris',
  'unknown-period': 'andra-pris',
  'from-after-to': 'anslag-period',
  'unknown-type': 'anslag-eller-nyhet',
  'unknown-field': 'klubbinfo',
  'club-invalid': 'klubbinfo',
  'club-duplicate': 'klubbinfo',
}

function rowHelp(w) {
  if (w.tab === 'Schema' && w.reason === 'unreadable') return w.column === 'Dag' ? 'pass-saknas' : 'andra-en-tid'
  if (w.tab === 'Anslag' && w.reason === 'unreadable') return 'anslag-period'
  return ROW_HELP[w.reason] ?? TAB_MAIN_ENTRY[w.tab] ?? null
}

function helpFor(w) {
  if (w.kind === 'event') return 'evenemang-info'
  if (w.kind === 'unmatched-result') return 'koppla-resultat'
  switch (w.kind) {
    case 'unknown-group':
    case 'unknown-season':
    case 'unknown-coach':
    case 'group-case':
      return 'byta-namn'
    case 'no-season':
      return 'sommarschema'
    case 'season-ending':
      return 'nasta-sasong'
    case 'row':
      return rowHelp(w)
  }
  return null
}

const dataTexts = computed(() =>
  dataWarnings.value.map((w) => {
    if (w.kind === 'row') return { tab: w.tab, rows: w.rows, text: rowText(w), help: helpFor(w) }
    switch (w.kind) {
      case 'unknown-group':
      case 'unknown-season':
      case 'unknown-coach': {
        const key = { 'unknown-group': 'unknownGroup', 'unknown-season': 'unknownSeason', 'unknown-coach': 'unknownCoach' }[w.kind]
        const text = t(`admin.warnings.${key}`, { where: where(w.tab, w.rows), name: w.name })
        return { tab: w.tab, rows: w.rows, text: w.suggestion ? text + t('admin.warnings.didYouMean', { name: w.suggestion }) : text, help: helpFor(w) }
      }
      case 'group-case':
        return { tab: null, rows: null, text: t('admin.warnings.groupCase', { list: w.spellings.map((s) => `"${s.name}" (${where('Grupper', s.rows)})`).join(', ') }), help: helpFor(w) }
      case 'no-season':
        return { tab: null, rows: null, text: t('admin.warnings.noSeason'), help: helpFor(w) }
      case 'season-ending':
        return { tab: null, rows: null, text: t('admin.warnings.seasonEnding', { name: localized(w.name, w.nameEn), date: formatDate(w.to) }), help: helpFor(w) }
    }
  }),
)

// lead is the "Tab rad N" prefix, computed once here so the template can split it off without
// calling where() again.
const allWarnings = computed(() =>
  [...dataTexts.value, ...warnings.value].map((w) => (w.tab ? { ...w, lead: where(w.tab, w.rows) } : w)),
)
const any = computed(() => failing.value.length + allWarnings.value.length)
</script>

<template>
  <!-- Always rendered so the live region exists before its content arrives. -->
  <div role="status" :class="{ 'admin-warnings': any }">
    <template v-if="any">
      <p class="title">{{ t('admin.warnings.title') }}</p>
      <ul>
        <li v-for="(w, i) in allWarnings" :key="`d-${i}`">
          <template v-if="w.tab && canJump(w.tab)">
            <button type="button" class="tab-link" @click="emit('open-tab', sheetKeyOf(w.tab))">{{ w.lead }}</button>{{ w.text.slice(w.lead.length) }}
          </template>
          <template v-else>{{ w.text }}</template>
          <button v-if="w.help" type="button" class="help-link" @click="emit('open-help', w.help)">{{ t('admin.warnings.howToFix') }}</button>
        </li>
        <li v-for="(item, i) in failing" :key="`i-${i}`">
          <strong>{{ item.name }}</strong> ({{ t(`admin.imageWarnings.kinds.${item.kind}`) }}) — {{ t(`admin.imageWarnings.${item.reason}`) }}
          <button type="button" class="help-link" @click="emit('open-help', 'bilder')">{{ t('admin.warnings.howToFix') }}</button>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.admin-warnings {
  margin-top: 12px;
  padding: 12px 16px;
  border: 1px solid var(--red-strong);
  border-radius: 8px;
  background: var(--surface);
  font-size: 0.9rem;
}

.title {
  margin: 0 0 6px;
  font-weight: 600;
  color: var(--red-strong);
}

ul {
  margin: 0;
  padding-left: 20px;
}

li {
  margin: 2px 0;
}

.tab-link {
  background: none;
  border: 0;
  padding: 0;
  color: var(--link);
  font: inherit;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

.help-link {
  background: none;
  border: 0;
  padding: 0 0 0 6px;
  color: var(--link);
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}
</style>
