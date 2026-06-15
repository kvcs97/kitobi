<script setup lang="ts">
import { useRouter } from 'vue-router'
import KLogo from '@/components/ui/KLogo.vue'

defineProps<{
  title: string
  back?: boolean
  logo?: boolean
}>()

const router = useRouter()
</script>

<template>
  <header class="sticky top-0 z-40 bg-surface/90 backdrop-blur-sm border-b border-border">
    <div class="flex items-center h-14 px-4 gap-3 max-w-2xl mx-auto">

      <!-- Zurück-Button -->
      <button
        v-if="back"
        @click="router.back()"
        class="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text transition-colors shrink-0"
        aria-label="Zurück"
      >
        ←
      </button>

      <!-- Logo-Marke (nur auf Startseite, ohne Back-Button) -->
      <KLogo v-else-if="logo" size="sm" class="shrink-0" />

      <h1 class="font-serif text-lg font-semibold text-text flex-1 min-w-0 truncate">{{ title }}</h1>
      <slot name="right" />
    </div>
  </header>
</template>
