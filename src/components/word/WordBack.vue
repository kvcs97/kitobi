<script setup lang="ts">
import KBadge from '@/components/ui/KBadge.vue'

defineProps<{
  kanji: string
  hiragana: string
  romaji: string
  meaning: string
  pos: string
  level: string
  example_jp: string
  example_romaji: string
  example_de: string
}>()
</script>

<template>
  <div
    class="absolute inset-0 bg-surface rounded-2xl border border-primary/30 flex flex-col justify-center gap-3 p-5 overflow-hidden"
    style="backface-visibility: hidden; -webkit-backface-visibility: hidden; transform: rotateY(180deg)"
  >
    <!-- Zeichen + Lesung -->
    <div class="flex items-baseline gap-2">
      <p lang="ja" class="font-jp text-3xl text-jp leading-none">{{ kanji }}</p>
      <p lang="ja" class="font-jp text-base text-text-muted">{{ hiragana }}</p>
    </div>

    <!-- Bedeutung + Romaji -->
    <div>
      <p class="font-sans text-2xl font-semibold text-text leading-tight">{{ meaning }}</p>
      <p class="font-mono text-xs text-text-muted mt-0.5">{{ romaji }}</p>
    </div>

    <KBadge variant="default" size="sm">{{ pos }}</KBadge>

    <!-- Beispielsatz -->
    <div class="bg-bg rounded-lg p-3 mt-1">
      <p lang="ja" class="font-jp text-sm text-jp leading-relaxed">{{ example_jp }}</p>
      <p class="font-mono text-xs text-text-muted mt-1 leading-relaxed">{{ example_romaji }}</p>
      <p class="font-sans text-xs text-text-muted/60 mt-0.5 italic">{{ example_de }}</p>
    </div>
  </div>
</template>
