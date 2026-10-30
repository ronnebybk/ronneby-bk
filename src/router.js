import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'

// Hash URLs (/#/schema) work on GitHub Pages without any server configuration.
const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/schema', name: 'schedule', component: () => import('./views/ScheduleView.vue') },
  { path: '/grupper', name: 'groups', component: () => import('./views/GroupsView.vue') },
  { path: '/prova-pa', name: 'trial', component: () => import('./views/TrialView.vue') },
  { path: '/tranare', name: 'coaches', component: () => import('./views/CoachesView.vue') },
  { path: '/fragor', name: 'faq', component: () => import('./views/FaqView.vue') },
  { path: '/kontakt', name: 'contact', component: () => import('./views/ContactView.vue') },
  { path: '/integritet', name: 'privacy', component: () => import('./views/PrivacyView.vue') },
  // Print posters: no site header or footer around them.
  { path: '/affisch/schema', name: 'posterSchedule', component: () => import('./views/PosterScheduleView.vue'), meta: { bare: true } },
  { path: '/affisch/grupper', name: 'posterGroups', component: () => import('./views/PosterGroupsView.vue'), meta: { bare: true } },
  { path: '/admin', name: 'admin', component: () => import('./views/AdminView.vue') },
  { path: '/:pathMatch(.*)*', name: 'notFound', component: () => import('./views/NotFoundView.vue') },
]

// A repeated query parameter arrives as an array: the first one counts.
export const firstQuery = (query, key) => [query[key]].flat()[0] ?? null

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
