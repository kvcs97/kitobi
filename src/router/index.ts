import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // Public: Auth
    {
      path: '/auth/login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/auth/register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { public: true },
    },
    {
      path: '/auth/forgot',
      component: () => import('@/views/auth/ForgotView.vue'),
      meta: { public: true },
    },
    {
      path: '/auth/callback',
      component: () => import('@/views/auth/CallbackView.vue'),
      meta: { public: true },
    },
    // Geschützt
    { path: '/', component: () => import('@/views/LernpfadView.vue') },
    { path: '/modul/:id', component: () => import('@/views/ModulView.vue') },
    { path: '/lernen/flashcard/:modul', component: () => import('@/views/FlashcardView.vue') },
    { path: '/lernen/woerter', component: () => import('@/views/WordListView.vue') },
    { path: '/lernen/woerter/session', component: () => import('@/views/WordSessionView.vue') },
    { path: '/lernen/stroke/:zeichen', component: () => import('@/views/StrokeView.vue') },
    { path: '/lernen/schreiben/:zeichen', component: () => import('@/views/SchreibView.vue') },
    { path: '/quiz/:modul', component: () => import('@/views/QuizView.vue') },
    { path: '/lesen/:id', component: () => import('@/views/LeseView.vue') },
    { path: '/fortschritt', component: () => import('@/views/FortschrittView.vue') },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.init()

  if (!to.meta.public && !auth.user) {
    return '/auth/login'
  }
  if (to.meta.public && auth.user && to.path.startsWith('/auth')) {
    return '/'
  }
})

export default router
