<script setup lang="ts">
import { ref, watch } from 'vue'
import CardFront from './CardFront.vue'
import CardBack from './CardBack.vue'

const props = defineProps<{
  char: string
  romaji: string
  meaning?: string
  type: string
}>()

const emit = defineEmits<{ flip: [] }>()

const flipped = ref(false)

watch(() => props.char, () => {
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
    class="w-full max-w-xs mx-auto h-72 cursor-pointer"
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
      <CardFront :char="char" />
      <CardBack :char="char" :romaji="romaji" :meaning="meaning" :type="type" />
    </div>
  </div>
</template>
