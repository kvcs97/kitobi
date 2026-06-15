<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'jp'
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <span
    :class="[
      'inline-flex items-center font-sans font-medium rounded-sm tracking-wide uppercase',
      size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5',
      variant === 'success'  ? 'bg-success/10 text-success'
      : variant === 'warning' ? 'bg-warning/10 text-warning'
      : variant === 'danger'  ? 'bg-danger/10 text-danger'
      : variant === 'jp'      ? 'bg-jp/10 text-jp font-jp text-sm normal-case tracking-normal'
      :                         'bg-border text-text-muted',
    ]"
  >
    <slot />
  </span>
</template>
