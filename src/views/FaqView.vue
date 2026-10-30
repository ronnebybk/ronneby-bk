<script setup>
import { computed } from 'vue'
import TextBlocks from '../components/TextBlocks.vue'
import { state } from '../data/store.js'
import { useI18n } from '../i18n/index.js'

const { t, localized } = useI18n()

// One block per question, with each cell falling back to Swedish on its own. The key is the
// Swedish question, which is stable across languages and cache → live; a counter keeps duplicate
// questions (shown as written) from sharing a key.
const questions = computed(() => {
  const seen = new Map()
  return state.faq.map((item) => {
    const count = (seen.get(item.question) ?? 0) + 1
    seen.set(item.question, count)
    return {
      id: count === 1 ? item.question : `${item.question}|${count}`,
      question: localized(item.question, item.questionEn),
      answer: localized(item.answer, item.answerEn),
    }
  })
})
</script>

<template>
  <div class="container page">
    <h1>{{ t('faq.title') }}</h1>

    <p v-if="state.status === 'loading' && !questions.length" class="muted">{{ t('common.loading') }}</p>
    <p v-else-if="!questions.length" class="muted">
      <template v-if="state.status === 'error'">{{ t('common.loadError') }}</template>
      <template v-else>
        {{ t('faq.empty') }}
        <RouterLink to="/kontakt">{{ t('faq.emptyLink') }}</RouterLink>
      </template>
    </p>

    <!-- Native details/summary: keyboard and screen readers work without extra JavaScript. -->
    <div v-else class="list">
      <details v-for="item in questions" :key="item.id" class="item">
        <summary><span class="question">{{ item.question }}</span></summary>
        <div class="answer"><TextBlocks :text="item.answer" /></div>
      </details>
    </div>
  </div>
</template>

<style scoped>
.list {
  max-width: 70ch;
  border-top: 1px solid var(--line);
}

.item {
  border-bottom: 1px solid var(--line);
}

summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-height: 44px;
  padding: 14px 0;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}

/* Replace the default triangle with the same +/− in every browser. */
summary::-webkit-details-marker {
  display: none;
}

summary::after {
  content: '+';
  flex: none;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.1;
  color: var(--red);
}

details[open] summary::after {
  content: '−';
}

.question {
  min-width: 0;
  overflow-wrap: anywhere;
}

.answer {
  max-width: 60ch;
  padding: 0 0 18px;
}
</style>
