<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  type?: 'button' | 'submit'
  disabled?: boolean
  loading?: boolean
  full?: boolean
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 px-5 py-2.5 font-serif font-semibold text-base rounded-md transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed',
      full ? 'w-full' : '',
      variant === 'secondary'
        ? 'bg-surface border border-border text-text hover:border-primary'
        : variant === 'ghost'
          ? 'bg-transparent text-text-muted hover:text-text'
          : 'bg-primary text-white hover:bg-primary-dark',
    ]"
  >
    <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    <slot />
  </button>
</template>
