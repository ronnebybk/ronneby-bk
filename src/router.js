import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'

// Hash URLs (/#/schema) work on GitHub Pages without any server configuration.
const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/schema', name: 'schedule', component: () => import('./views/ScheduleView.vue') },
  { path: '/grupper', name: 'groups', component: () => import('./views/GroupsView.vue') },
  { path: '/tranare', name: 'coaches', component: () => import('./views/CoachesView.vue') },
  { path: '/fragor', name: 'faq', component: () => import('./views/FaqView.vue') },
  { path: '/kontakt', name: 'contact', component: () => import('./views/ContactView.vue') },
  { path: '/integritet', name: 'privacy', component: () => import('./views/PrivacyView.vue') },
  { path: '/admin', name: 'admin', component: () => import('./views/AdminView.vue') },
  { path: '/:pathMatch(.*)*', name: 'notFound', component: () => import('./views/NotFoundView.vue') },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
