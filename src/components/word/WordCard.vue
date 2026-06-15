<script setup lang="ts">
import { ref, watch } from 'vue'
import WordFront from './WordFront.vue'
import WordBack from './WordBack.vue'
import type { VocabWord } from '@/lib/daily'

const props = defineProps<{ word: VocabWord }>()
const emit = defineEmits<{ flip: [] }>()

const flipped = ref(false)

watch(() => props.word.id, () => {
  flipped.value = false
})

function flip() {
  if (flipped.value) return
  flipped.value = true
  emit('flip')
}
</script>

<template>
  <div
    class="w-full max-w-xs mx-auto h-80 cursor-pointer"
    style="perspective: 1200px"
    @click="flip"
    role="button"
    :aria-label="flipped ? 'Karte umgedreht' : 'Karte umdrehen'"
  >
    <div
      class="relative w-full h-full"
      style="transform-style: preserve-3d; transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)"
      :style="{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }"
    >
      <WordFront
        :kanji="word.kanji"
        :hiragana="word.hiragana"
        :level="word.level"
      />
      <WordBack
        :kanji="word.kanji"
        :hiragana="word.hiragana"
        :romaji="word.romaji"
        :meaning="word.meaning"
        :pos="word.pos"
        :level="word.level"
        :example_jp="word.example_jp"
        :example_romaji="word.example_romaji"
        :example_de="word.example_de"
      />
    </div>
  </div>
</template>
