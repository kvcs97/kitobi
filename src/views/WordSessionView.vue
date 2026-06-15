<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDailyStore } from '@/stores/daily.store'
import { useAuthStore } from '@/stores/auth.store'
import { useSRS } from '@/composables/useSRS'
import { useSessionStore } from '@/stores/session.store'
import { allWords, getWordById } from '@/lib/daily'
import WordCard from '@/components/word/WordCard.vue'
import RatingBar from '@/components/flashcard/RatingBar.vue'
import ScreenHeader from '@/components/layout/ScreenHeader.vue'
import KButton from '@/components/ui/KButton.vue'
import type { SRSRating } from '@/types/srs.types'

const DAILY_COUNT = 5

const router = useRouter()
const daily = useDailyStore()
const auth = useAuthStore()
const srs = useSRS()
const session = useSessionStore()

const isFlipped = ref(false)
const loading = ref(true)
const requeuedIds = new Set<string>()

const currentWord = computed(() => {
  const id = session.current()
  return id ? getWordById(id) : undefined
})

const progress = computed(() => {
  const total = session.queue.length
  return total > 0 ? (session.currentIndex / total) * 100 : 0
})

onMounted(async () => {
  await daily.load(allWords.map(w => w.id), DAILY_COUNT)
  await srs.load()

  const knownWordIds = new Set(
    srs.items.value
      .filter(i => i.type === 'word')
      .map(i => i.item_id)
  )

  for (const id of daily.wordIds) {
    if (!knownWordIds.has(id)) {
      await srs.addItem(id, 'word')
    }
  }

  const pending = daily.wordIds.filter(id => !daily.completedIds.includes(id))
  session.startSession(pending)
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
  } else {
    await daily.markComplete(itemId)
  }

  session.next()
  isFlipped.value = false
}

async function finish() {
  await session.saveSession(auth.user?.id ?? '', 'vocabulary', 'n5')
  router.push('/lernen/woerter')
}
</script>

<template>
  <div class="min-h-dvh bg-bg flex flex-col">
    <ScreenHeader title="Wörter lernen" :back="true">
      <template #right>
        <span class="font-mono text-sm text-text-muted">
          {{ Math.min(session.currentIndex + 1, session.queue.length) }}
          /
          {{ session.queue.length }}
        </span>
      </template>
    </ScreenHeader>

    <!-- Fortschrittsbalken -->
    <div class="h-0.5 bg-border">
      <div
        class="h-full bg-primary transition-all duration-300"
        :style="{ width: progress + '%' }"
      />
    </div>

    <div class="flex-1 flex flex-col items-center justify-center p-6 gap-8 w-full max-w-sm mx-auto">

      <!-- Loading -->
      <template v-if="loading">
        <p lang="ja" class="font-jp text-6xl text-jp animate-pulse">語</p>
      </template>

      <!-- Queue leer (alle bereits erledigt) -->
      <template v-else-if="session.queue.length === 0">
        <div class="flex flex-col items-center gap-4 text-center">
          <p lang="ja" class="font-jp text-5xl text-success">完了</p>
          <p class="font-serif text-xl font-semibold text-text">Alle Wörter gelernt</p>
          <p class="font-sans text-sm text-text-muted leading-relaxed">
            Du hast alle heutigen Wörter abgeschlossen. Morgen gibt es neue Wörter.
          </p>
          <KButton variant="secondary" @click="router.push('/lernen/woerter')">Zur Übersicht</KButton>
        </div>
      </template>

      <!-- Session abgeschlossen -->
      <template v-else-if="session.isDone()">
        <div class="flex flex-col items-center gap-6 text-center w-full">
          <p lang="ja" class="font-jp text-6xl text-primary">完了</p>
          <h2 class="font-serif text-2xl font-semibold text-text">Wörter-Session abgeschlossen</h2>

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

          <KButton :full="true" @click="finish">Zur Übersicht</KButton>
        </div>
      </template>

      <!-- Aktive Karte -->
      <template v-else-if="currentWord">
        <WordCard :word="currentWord" @flip="onFlip" />

        <Transition name="slide-up">
          <RatingBar v-if="isFlipped" @rate="onRate" class="w-full" />
        </Transition>
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
  transform: translateY(10px);
}
</style>
