<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import hiraganaData from '@/data/hiragana.json'
import katakanaData from '@/data/katakana.json'
import type { Character } from '@/types/character.types'
import ScreenHeader from '@/components/layout/ScreenHeader.vue'
import QuizOption from '@/components/quiz/QuizOption.vue'
import QuizResult from '@/components/quiz/QuizResult.vue'

interface QuizQuestion {
  char: Character
  options: string[]
  correct: string
}

const route = useRoute()
const router = useRouter()

const modul = route.params.modul as string
const TOTAL = 10

const questions = ref<QuizQuestion[]>([])
const currentIdx = ref(0)
const selected = ref<string | null>(null)
const score = ref(0)
const phase = ref<'quiz' | 'result' | 'done'>('quiz')

const allChars = computed<Character[]>(() =>
  (modul === 'katakana' ? katakanaData : hiraganaData) as Character[]
)

const current = computed(() => questions.value[currentIdx.value])

const optionState = (opt: string): 'idle' | 'correct' | 'wrong' => {
  if (!selected.value) return 'idle'
  if (opt === current.value.correct) return 'correct'
  if (opt === selected.value) return 'wrong'
  return 'idle'
}

function buildQuestions() {
  const chars = [...allChars.value].sort(() => Math.random() - 0.5).slice(0, TOTAL)
  questions.value = chars.map(char => {
    const distractors = allChars.value
      .filter(c => c.romaji !== char.romaji)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.romaji)
    const options = [char.romaji, ...distractors].sort(() => Math.random() - 0.5)
    return { char, options, correct: char.romaji }
  })
}

function select(opt: string) {
  if (selected.value) return
  selected.value = opt
  if (opt === current.value.correct) score.value++
  phase.value = 'result'
}

function next() {
  selected.value = null
  if (currentIdx.value + 1 >= TOTAL) {
    phase.value = 'done'
  } else {
    currentIdx.value++
    phase.value = 'quiz'
  }
}

function restart() {
  score.value = 0
  currentIdx.value = 0
  selected.value = null
  phase.value = 'quiz'
  buildQuestions()
}

const modulLabel = computed(() =>
  modul === 'katakana' ? 'Katakana-Quiz' : 'Hiragana-Quiz'
)

onMounted(buildQuestions)
</script>

<template>
  <div class="min-h-dvh bg-bg flex flex-col">
    <ScreenHeader :title="modulLabel" :back="true">
      <template #right>
        <span v-if="phase !== 'done'" class="font-mono text-sm text-text-muted">
          {{ currentIdx + 1 }} / {{ TOTAL }}
        </span>
      </template>
    </ScreenHeader>

    <!-- Progress bar -->
    <div class="h-0.5 bg-border">
      <div
        class="h-full bg-primary transition-all duration-300"
        :style="{ width: `${(currentIdx / TOTAL) * 100}%` }"
      />
    </div>

    <div class="flex-1 flex flex-col items-center p-6 gap-8 max-w-sm mx-auto w-full">

      <!-- Aktive Frage -->
      <template v-if="phase !== 'done' && current">
        <div class="flex flex-col items-center gap-2 pt-4">
          <p lang="ja" class="font-jp text-[6rem] leading-none text-jp">{{ current.char.char }}</p>
          <p class="font-sans text-sm text-text-muted">Welches Romaji ist korrekt?</p>
        </div>

        <div class="w-full grid grid-cols-2 gap-3">
          <QuizOption
            v-for="opt in current.options"
            :key="opt"
            :text="opt"
            :state="optionState(opt)"
            @select="select(opt)"
          />
        </div>

        <Transition name="slide-up">
          <QuizResult
            v-if="phase === 'result'"
            :correct="selected === current.correct"
            :correct-answer="current.correct"
            @next="next"
          />
        </Transition>
      </template>

      <!-- Abschluss -->
      <template v-else-if="phase === 'done'">
        <div class="flex flex-col items-center gap-6 text-center w-full pt-6">
          <p lang="ja" class="font-jp text-6xl text-primary">完了</p>
          <h2 class="font-serif text-2xl font-semibold text-text">Quiz abgeschlossen</h2>

          <div class="bg-surface rounded-xl border border-border p-6 w-full flex flex-col items-center gap-2">
            <p class="font-mono text-5xl font-bold text-primary">{{ score }}<span class="text-2xl text-text-muted"> / {{ TOTAL }}</span></p>
            <p class="font-sans text-sm text-text-muted">
              {{ score >= 9 ? 'Ausgezeichnet!' : score >= 7 ? 'Sehr gut!' : score >= 5 ? 'Gut gemacht!' : 'Weiter üben!' }}
            </p>
          </div>

          <div class="flex gap-3 w-full">
            <button
              @click="restart"
              class="flex-1 py-3 rounded-lg bg-surface border border-border font-serif font-semibold text-text hover:border-primary transition-colors"
            >
              Nochmal
            </button>
            <button
              @click="router.back()"
              class="flex-1 py-3 rounded-lg bg-primary text-white font-serif font-semibold hover:bg-primary-dark transition-colors"
            >
              Zurück
            </button>
          </div>
        </div>
      </template>

    </div>

    <div class="h-20 lg:h-0 shrink-0" />
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
