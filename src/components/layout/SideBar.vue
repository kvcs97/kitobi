<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import KLogo from '@/components/ui/KLogo.vue'

const route = useRoute()
const auth = useAuthStore()

const links = [
  { to: '/',               label: 'Lernpfad',    icon: '道' },
  { to: '/lernen/woerter', label: 'Tagesvokabular', icon: '語' },
  { to: '/fortschritt',    label: 'Fortschritt',  icon: '歩' },
]

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <aside class="hidden lg:flex flex-col w-56 shrink-0 h-screen sticky top-0 bg-surface border-r border-border">
    <div class="flex items-center gap-3 px-4 h-16 border-b border-border">
      <KLogo size="md" class="shrink-0" />
      <div class="flex flex-col leading-tight">
        <span class="font-serif text-sm font-semibold tracking-[0.12em] text-text">KITOBI</span>
        <span lang="ja" class="font-jp text-xs text-text-muted">記飛</span>
      </div>
    </div>

    <nav class="flex flex-col gap-1 p-3 flex-1">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 px-3 py-2 rounded-md font-sans text-sm transition-colors"
        :class="isActive(link.to)
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-text-muted hover:text-text hover:bg-bg'"
      >
        <span lang="ja" class="font-jp text-base w-5 text-center">{{ link.icon }}</span>
        {{ link.label }}
      </RouterLink>
    </nav>

    <div class="p-3 border-t border-border">
      <button
        @click="auth.logout()"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-md font-sans text-sm text-text-muted hover:text-danger hover:bg-danger/5 transition-colors"
      >
        <span class="w-5 text-center">→</span>
        Abmelden
      </button>
    </div>
  </aside>
</template>
