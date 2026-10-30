<script setup>
import { reactive } from 'vue'
import DataNotice from '../components/DataNotice.vue'
import { state, hasData, groupName } from '../data/store.js'
import { telHref } from '../data/parse.js'
import { useI18n } from '../i18n/index.js'

const { t, localized } = useI18n()

// URLs that failed to load, so the image hides and initials show. Reactive so that when live
// data replaces a broken cached URL, the new URL starts as not-failed and the photo reappears.
const failedImages = reactive(new Set())

function initials(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
</script>

<template>
  <div class="container page">
    <h1>{{ t('coaches.title') }}</h1>
    <p class="page-intro">{{ t('coaches.intro') }}</p>
    <DataNotice />

    <p v-if="state.status === 'loading' && !hasData" class="muted">{{ t('common.loading') }}</p>
    <p v-else-if="!state.coaches.length" class="muted">{{ t('coaches.empty') }}</p>

    <div v-else class="grid">
      <article v-for="(coach, i) in state.coaches" :key="i" class="card coach">
        <div class="photo">
          <img v-if="coach.image && !failedImages.has(coach.image)" :src="coach.image" :alt="coach.name" loading="lazy" referrerpolicy="no-referrer" @error="failedImages.add(coach.image)" />
          <span v-else class="initials" aria-hidden="true">{{ initials(coach.name) }}</span>
        </div>
        <div class="body">
          <h2>{{ coach.name }}</h2>
          <p v-if="coach.role" class="role">{{ localized(coach.role, coach.roleEn) }}</p>
          <p v-if="coach.groups.length" class="groups">
            <span class="visually-hidden">{{ t('coaches.groups') }}:</span>
            <span v-for="g in coach.groups" :key="g" class="tag">{{ groupName(g) }}</span>
          </p>
          <div v-if="coach.phone || coach.email" class="contact">
            <a v-if="coach.phone" :href="telHref(coach.phone)" class="btn btn-primary">
              {{ t('coaches.call') }}
            </a>
            <a v-if="coach.email" :href="`mailto:${coach.email}`" class="btn btn-outline">{{ t('coaches.mail') }}</a>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.coach {
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.photo {
  aspect-ratio: 4 / 3;
  background: var(--ink);
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
}

.photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.initials {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--red);
}

.body {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.body h2 {
  font-size: 1.4rem;
  margin: 0;
}

.body p {
  margin: 0;
}

.role {
  color: var(--muted);
  font-weight: 600;
}

.groups {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.contact {
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 8px;
}

.contact .btn {
  padding: 8px 18px;
  font-size: 0.95rem;
}
</style>
