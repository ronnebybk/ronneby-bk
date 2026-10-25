<script setup>
import { useI18n } from '../i18n/index.js'

const { t, locale, setLocale } = useI18n()
</script>

<template>
  <div class="lang" role="group" :aria-label="t('lang.label')">
    <button
      type="button"
      :class="{ active: locale === 'sv' }"
      :aria-pressed="locale === 'sv'"
      :title="t('lang.sv')"
      @click="setLocale('sv')"
    >
      <!-- Sweden -->
      <svg viewBox="0 0 16 10" aria-hidden="true">
        <rect width="16" height="10" fill="#006aa7" />
        <rect x="5" width="2" height="10" fill="#fecc02" />
        <rect y="4" width="16" height="2" fill="#fecc02" />
      </svg>
      <span class="visually-hidden">{{ t('lang.sv') }}</span>
    </button>
    <button
      type="button"
      :class="{ active: locale === 'en' }"
      :aria-pressed="locale === 'en'"
      :title="t('lang.en')"
      @click="setLocale('en')"
    >
      <!-- United Kingdom -->
      <svg viewBox="0 0 60 30" aria-hidden="true">
        <clipPath id="uk-flag-clip">
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#uk-flag-clip)" stroke="#c8102e" stroke-width="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" stroke-width="6" />
      </svg>
      <span class="visually-hidden">{{ t('lang.en') }}</span>
    </button>
  </div>
</template>

<style scoped>
.lang {
  display: flex;
  gap: 6px;
}

button {
  display: grid;
  place-items: center;
  width: 46px;
  height: 34px;
  padding: 4px;
  border: 2px solid transparent;
  border-radius: 6px;
  background: none;
  cursor: pointer;
  opacity: 0.55;
  transition: opacity 0.15s, border-color 0.15s;
}

button:hover {
  opacity: 0.9;
}

button.active {
  opacity: 1;
  border-color: var(--on-ink-muted);
}

/* Height only: each flag keeps its own proportions (Sweden 16:10, UK 2:1). */
svg {
  height: 18px;
  width: auto;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgb(255 255 255 / 0.2);
}
</style>
