<script setup lang="ts">
import type { VocabWord } from '@/lib/daily'
import KBadge from '@/components/ui/KBadge.vue'

defineProps<{
  word: VocabWord
  done: boolean
}>()
</script>

<template>
  <div class="flex items-center gap-3 py-3 border-b border-border last:border-0">
    <div
      class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors"
      :class="done ? 'bg-success text-white' : 'border-2 border-border bg-surface'"
    >
      <span v-if="done" class="text-[10px] font-bold leading-none">✓</span>
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-baseline gap-2">
        <p lang="ja" class="font-jp text-xl text-jp leading-tight">{{ word.kanji }}</p>
        <p lang="ja" class="font-jp text-sm text-text-muted">{{ word.hiragana }}</p>
      </div>
      <p class="font-sans text-sm text-text truncate">{{ word.meaning }}</p>
    </div>

    <KBadge variant="default" size="sm">{{ word.pos }}</KBadge>
  </div>
</template>
