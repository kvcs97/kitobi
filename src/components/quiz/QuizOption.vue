<script setup lang="ts">
defineProps<{
  text: string
  state: 'idle' | 'correct' | 'wrong'
}>()

defineEmits<{ select: [] }>()
</script>

<template>
  <button
    @click="state === 'idle' && $emit('select')"
    :disabled="state !== 'idle'"
    class="w-full py-3 px-4 rounded-xl font-mono text-lg font-semibold transition-all active:scale-[0.98]"
    :class="{
      'bg-surface border-2 border-border text-text hover:border-primary hover:bg-bg': state === 'idle',
      'bg-success/15 border-2 border-success text-success': state === 'correct',
      'bg-danger/15 border-2 border-danger text-danger': state === 'wrong',
    }"
  >
    {{ text }}
  </button>
</template>
