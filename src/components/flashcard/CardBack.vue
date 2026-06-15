<script setup lang="ts">
defineProps<{
  char: string
  romaji: string
  meaning?: string
  type: string
}>()
</script>

<template>
  <div
    class="absolute inset-0 bg-surface rounded-xl shadow-md flex flex-col items-center justify-center gap-4 select-none"
    style="backface-visibility: hidden; -webkit-backface-visibility: hidden; transform: rotateY(180deg)"
  >
    <p lang="ja" class="font-jp text-5xl text-jp">{{ char }}</p>

    <div class="flex flex-col items-center gap-1">
      <p class="font-mono text-3xl font-medium text-primary tracking-wide">{{ romaji }}</p>
      <p v-if="meaning" class="font-sans text-sm text-text-muted">{{ meaning }}</p>
    </div>

    <span class="font-sans text-[10px] uppercase tracking-widest text-border bg-bg px-2 py-0.5 rounded-sm">
      {{ type === 'hiragana' ? 'ひらがな' : 'カタカナ' }}
    </span>
  </div>
</template>
