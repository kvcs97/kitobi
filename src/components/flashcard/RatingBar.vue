<script setup lang="ts">
import type { SRSRating } from '@/types/srs.types'

defineEmits<{ rate: [rating: SRSRating] }>()
</script>

<template>
  <div class="w-full flex gap-3">
    <button
      @click="$emit('rate', 'wieder')"
      class="flex-1 flex flex-col items-center gap-1 py-3 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 active:scale-[0.97] transition-all"
    >
      <span class="font-sans font-semibold text-sm">Wieder</span>
      <span class="font-mono text-[10px] opacity-60">&lt; 1d</span>
    </button>

    <button
      @click="$emit('rate', 'gut')"
      class="flex-1 flex flex-col items-center gap-1 py-3 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 active:scale-[0.97] transition-all"
    >
      <span class="font-sans font-semibold text-sm">Gut</span>
      <span class="font-mono text-[10px] opacity-60">~3d</span>
    </button>

    <button
      @click="$emit('rate', 'perfekt')"
      class="flex-1 flex flex-col items-center gap-1 py-3 rounded-lg bg-success/10 text-success hover:bg-success/20 active:scale-[0.97] transition-all"
    >
      <span class="font-sans font-semibold text-sm">Perfekt</span>
      <span class="font-mono text-[10px] opacity-60">~7d</span>
    </button>
  </div>
</template>
