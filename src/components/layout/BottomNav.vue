<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const links = [
  { to: '/',            label: 'Pfad',       icon: '道' },
  { to: '/lernen/woerter', label: 'Wörter',  icon: '語' },
  { to: '/fortschritt', label: 'Fortschritt', icon: '歩' },
]

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}
</script>

<template>
  <nav class="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-surface border-t border-border safe-area-bottom">
    <div class="flex items-stretch justify-around h-16">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors"
        :class="isActive(link.to) ? 'text-primary' : 'text-text-muted hover:text-text'"
      >
        <span lang="ja" class="font-jp text-lg leading-none">{{ link.icon }}</span>
        <span class="font-sans text-[10px] tracking-wide">{{ link.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
