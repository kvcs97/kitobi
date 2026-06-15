<script setup lang="ts">
defineProps<{
  value: number      // 0–100
  label?: string
  showPercent?: boolean
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <div v-if="label || showPercent" class="flex justify-between items-center">
      <span v-if="label" class="text-xs font-sans text-text-muted">{{ label }}</span>
      <span v-if="showPercent" class="text-xs font-mono text-text-muted ml-auto">{{ Math.round(value) }}%</span>
    </div>
    <div
      :class="[
        'w-full bg-border rounded-full overflow-hidden',
        size === 'sm' ? 'h-1' : 'h-2',
      ]"
    >
      <div
        class="h-full bg-primary rounded-full transition-all duration-500 ease-out"
        :style="{ width: `${Math.min(100, Math.max(0, value))}%` }"
      />
    </div>
  </div>
</template>
