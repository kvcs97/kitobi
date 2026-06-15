<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useSRS } from '@/composables/useSRS'
import { useSessionStore } from '@/stores/session.store'
import FlashCard from '@/components/flashcard/FlashCard.vue'
import RatingBar from '@/components/flashcard/RatingBar.vue'
import ScreenHeader from '@/components/layout/ScreenHeader.vue'
import KButton from '@/components/ui/KButton.vue'
import type { SRSRating } from '@/types/srs.types'
import type { Character } from '@/types/character.types'
import hiraganaData from '@/data/hiragana.json'
import katakanaData from '@/data/katakana.json'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const srs = useSRS()
const session = useSessionStore()

const modul = route.params.modul as string
const isFlipped = ref(false)
const loading = ref(true)
const requeuedIds = new Set<string>()

const allChars = (modul === 'hiragana' ? hiraganaData : katakanaData) as Character[]

const currentChar = computed<Character | undefined>(() => {
  const id = session.current()
  return id ? allChars.find(c => c.id === id) : undefined
})

const progress = computed(() => {
  const total = session.queue.length
  return total > 0 ? (session.currentIndex / total) * 100 : 0
})

const modulLabel = computed(() =>
  modul === 'hiragana' ? 'Hiragana üben' : 'Katakana üben'
)

onMounted(async () => {
  await srs.load()

  const knownIds = new Set(
    srs.items.value
      .filter(i => i.type === 'character')
      .map(i => i.item_id)
  )

  // New characters for this modul (max 10 per session)
  const newChars = allChars.filter(c => !knownIds.has(c.id)).slice(0, 10)
  for (const char of newChars) {
    await srs.addItem(char.id, 'character')
  }

  // Due items that belong to this modul
  const dueItems = srs.getItemsDueToday('character')
    .filter(i => allChars.some(c => c.id === i.item_id))

  const ids = [
    ...newChars.map(c => c.id),
    ...dueItems.map(i => i.item_id),
  ]

  session.startSession(ids)
  loading.value = false
})

function onFlip() {
  isFlipped.value = true
}

async function onRate(rating: SRSRating) {
  const itemId = session.current()
  if (!itemId) return

  session.recordRating(rating)
  await srs.rateItem(itemId, rating)

  if (rating === 'wieder' && !requeuedIds.has(itemId)) {
    requeuedIds.add(itemId)
    session.addToEnd(itemId)
  }

  session.next()
  isFlipped.value = false
}

async function finish() {
  await session.saveSession(auth.user?.id ?? '', 'flashcard', modul)
  router.push('/')
}
</script>

<template>
  <div class="min-h-dvh bg-bg flex flex-col">
    <ScreenHeader :title="modulLabel" :back="true">
      <template #right>
        <span class="font-mono text-sm text-text-muted">
          {{ Math.min(session.currentIndex + 1, session.queue.length) }}
          /
          {{ session.queue.length }}
        </span>
      </template>
    </ScreenHeader>

    <!-- Progress -->
    <div class="h-0.5 bg-border">
      <div
        class="h-full bg-primary transition-all duration-300"
        :style="{ width: progress + '%' }"
      />
    </div>

    <div class="flex-1 flex flex-col items-center justify-center p-6 gap-8 w-full max-w-sm mx-auto">

      <!-- Loading -->
      <template v-if="loading">
        <p lang="ja" class="font-jp text-6xl text-jp animate-pulse">記飛</p>
      </template>

      <!-- Kein Inhalt fällig -->
      <template v-else-if="session.queue.length === 0">
        <div class="flex flex-col items-center gap-4 text-center">
          <p lang="ja" class="font-jp text-5xl text-success">完了</p>
          <p class="font-serif text-xl font-semibold text-text">Heute nichts fällig</p>
          <p class="font-sans text-sm text-text-muted leading-relaxed">
            Du hast alle Karten für heute gelernt. Morgen gibt es neue Wiederholungen.
          </p>
          <KButton variant="secondary" @click="router.push('/')">Zurück zum Lernpfad</KButton>
        </div>
      </template>

      <!-- Session abgeschlossen -->
      <template v-else-if="session.isDone()">
        <div class="flex flex-col items-center gap-6 text-center w-full">
          <p lang="ja" class="font-jp text-6xl text-primary">完了</p>
          <h2 class="font-serif text-2xl font-semibold text-text">Session abgeschlossen</h2>

          <div class="flex gap-3 w-full">
            <div class="flex-1 bg-success/10 rounded-lg p-4 text-center">
              <p class="font-mono text-3xl font-bold text-success">{{ session.stats.perfekt }}</p>
              <p class="font-sans text-xs text-text-muted mt-1 uppercase tracking-wide">Perfekt</p>
            </div>
            <div class="flex-1 bg-warning/10 rounded-lg p-4 text-center">
              <p class="font-mono text-3xl font-bold text-warning">{{ session.stats.gut }}</p>
              <p class="font-sans text-xs text-text-muted mt-1 uppercase tracking-wide">Gut</p>
            </div>
            <div class="flex-1 bg-danger/10 rounded-lg p-4 text-center">
              <p class="font-mono text-3xl font-bold text-danger">{{ session.stats.wieder }}</p>
              <p class="font-sans text-xs text-text-muted mt-1 uppercase tracking-wide">Wieder</p>
            </div>
          </div>

          <KButton :full="true" @click="finish">Zurück zum Lernpfad</KButton>
        </div>
      </template>

      <!-- Aktive Karte -->
      <template v-else-if="currentChar">
        <FlashCard
          :char="currentChar.char"
          :romaji="currentChar.romaji"
          :meaning="currentChar.meaning"
          :type="currentChar.type"
          @flip="onFlip"
        />

        <Transition name="slide-up">
          <RatingBar v-if="isFlipped" @rate="onRate" class="w-full" />
        </Transition>
      </template>

    </div>

    <!-- Spacer für BottomNav -->
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
  transform: translateY(10px);
}
</style>
