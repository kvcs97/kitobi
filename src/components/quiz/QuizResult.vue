<script setup lang="ts">
defineProps<{
  correct: boolean
  correctAnswer: string
}>()

defineEmits<{ next: [] }>()
</script>

<template>
  <div class="flex flex-col items-center gap-4 pt-2">
    <div
      class="flex items-center gap-2 text-base font-sans font-semibold"
      :class="correct ? 'text-success' : 'text-danger'"
    >
      <span class="text-xl">{{ correct ? '✓' : '✗' }}</span>
      <span>{{ correct ? 'Richtig!' : 'Leider falsch.' }}</span>
    </div>

    <p v-if="!correct" class="font-sans text-sm text-text-muted">
      Richtige Antwort: <span class="font-mono font-semibold text-text">{{ correctAnswer }}</span>
    </p>

    <button
      @click="$emit('next')"
      class="mt-1 px-6 py-2.5 bg-primary text-white font-serif font-semibold rounded-md hover:bg-primary-dark transition-colors"
    >
      Weiter →
    </button>
  </div>
</template>
