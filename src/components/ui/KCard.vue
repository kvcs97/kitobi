<script setup lang="ts">
defineProps<{
  clickable?: boolean
  padding?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <div
    :class="[
      'bg-surface border border-border rounded-lg shadow-sm',
      padding === 'sm'  ? 'p-3'
      : padding === 'lg' ? 'p-6'
      :                    'p-4',
      clickable ? 'cursor-pointer hover:border-primary hover:shadow-md transition-all duration-150 active:scale-[0.99]' : '',
    ]"
  >
    <slot />
  </div>
</template>
