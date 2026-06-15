<script setup lang="ts">
defineProps<{ char: string }>()
</script>

<template>
  <div
    class="absolute inset-0 bg-surface rounded-xl shadow-md flex flex-col items-center justify-center gap-6 select-none"
    style="backface-visibility: hidden; -webkit-backface-visibility: hidden"
  >
    <p lang="ja" class="font-jp text-[7rem] leading-none text-jp">{{ char }}</p>
    <p class="font-sans text-xs tracking-[0.2em] uppercase text-text-muted">Tippen zum Umdrehen</p>
  </div>
</template>
