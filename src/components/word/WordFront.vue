<script setup lang="ts">
import KBadge from '@/components/ui/KBadge.vue'

defineProps<{
  kanji: string
  hiragana: string
  level: string
}>()
</script>

<template>
  <div
    class="absolute inset-0 bg-surface rounded-2xl border border-border flex flex-col items-center justify-center gap-2 p-6"
    style="backface-visibility: hidden; -webkit-backface-visibility: hidden"
  >
    <KBadge variant="jp" size="sm">{{ level }}</KBadge>
    <p lang="ja" class="font-jp text-[4.5rem] leading-none text-jp mt-1">{{ kanji }}</p>
    <p lang="ja" class="font-jp text-xl text-text-muted">{{ hiragana }}</p>
    <p class="font-sans text-xs text-text-muted/40 mt-4">Tippen zum Umdrehen</p>
  </div>
</template>
