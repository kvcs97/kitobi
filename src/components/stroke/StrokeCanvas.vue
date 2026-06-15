<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  strokes: string[]
  tips?: string[]
}>()

const emit = defineEmits<{ done: [] }>()

const activeIndex = ref(0)
const isDone = ref(false)

// Reset when strokes change (new character)
watch(() => props.strokes, () => {
  activeIndex.value = 0
  isDone.value = false
})

function next() {
  if (activeIndex.value < props.strokes.length - 1) {
    activeIndex.value++
  } else {
    isDone.value = true
    emit('done')
  }
}

function prev() {
  if (isDone.value) {
    isDone.value = false
    return
  }
  if (activeIndex.value > 0) activeIndex.value--
}

function reset() {
  activeIndex.value = 0
  isDone.value = false
}

defineExpose({ reset })
</script>

<template>
  <div class="flex flex-col items-center gap-5 w-full">

    <!-- SVG Canvas -->
    <div class="relative w-64 h-64 bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
      <svg
        viewBox="0 0 109 109"
        class="w-full h-full p-3"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Ghost: alle Striche sehr hell als Vorlage -->
        <path
          v-for="(d, i) in strokes"
          :key="`ghost-${i}`"
          :d="d"
          fill="none"
          stroke="var(--color-border)"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Fertige Striche: gedämpftes Dunkelgrau -->
        <path
          v-for="(d, i) in strokes.slice(0, isDone ? strokes.length : activeIndex)"
          :key="`done-${i}`"
          :d="d"
          fill="none"
          stroke="var(--color-text-muted)"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Aktiver Strich: Sakura-Pink, Zeichenanimation via dashoffset -->
        <path
          v-if="!isDone && strokes[activeIndex]"
          :key="`active-${activeIndex}`"
          :d="strokes[activeIndex]"
          fill="none"
          stroke="var(--color-primary)"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="600"
          stroke-dashoffset="600"
          class="draw-stroke"
        />

        <!-- Abschluss: alle Striche in Pink -->
        <template v-if="isDone">
          <path
            v-for="(d, i) in strokes"
            :key="`done-all-${i}`"
            :d="d"
            fill="none"
            stroke="var(--color-primary)"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="opacity: 0.75"
          />
        </template>
      </svg>
    </div>

    <!-- Tipp-Text -->
    <p
      v-if="tips && tips[activeIndex] && !isDone"
      class="font-sans text-sm text-text-muted text-center leading-relaxed px-2 min-h-[2.5rem]"
    >
      {{ tips[activeIndex] }}
    </p>
    <p
      v-else-if="isDone"
      class="font-sans text-sm text-success text-center font-medium min-h-[2.5rem]"
    >
      Alle Striche gezeichnet ✓
    </p>
    <div v-else class="min-h-[2.5rem]" />

    <!-- Controls -->
    <div class="flex items-center gap-4">
      <button
        @click="prev"
        :disabled="activeIndex === 0 && !isDone"
        class="w-11 h-11 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted hover:border-primary hover:text-primary disabled:opacity-25 transition-colors text-lg"
        aria-label="Vorheriger Strich"
      >←</button>

      <span class="font-mono text-base text-text-muted w-20 text-center select-none">
        {{ isDone ? '完了' : `${activeIndex + 1} / ${strokes.length}` }}
      </span>

      <button
        @click="isDone ? reset() : next()"
        class="w-11 h-11 rounded-full flex items-center justify-center text-lg transition-colors"
        :class="isDone
          ? 'bg-primary/10 text-primary border border-primary/40 hover:bg-primary/20'
          : 'bg-surface border border-border text-text-muted hover:border-primary hover:text-primary'"
        :aria-label="isDone ? 'Zurücksetzen' : 'Nächster Strich'"
      >
        <span>{{ isDone ? '↺' : '→' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.draw-stroke {
  animation: draw-stroke 0.75s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes draw-stroke {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
