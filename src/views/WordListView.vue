<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDailyStore } from '@/stores/daily.store'
import { allWords } from '@/lib/daily'
import ScreenHeader from '@/components/layout/ScreenHeader.vue'
import KProgressBar from '@/components/ui/KProgressBar.vue'
import KButton from '@/components/ui/KButton.vue'
import WordListItem from '@/components/word/WordListItem.vue'
import BottomNav from '@/components/layout/BottomNav.vue'

const DAILY_COUNT = 5

const router = useRouter()
const store = useDailyStore()

const todaysWords = computed(() =>
  store.wordIds
    .map(id => allWords.find(w => w.id === id))
    .filter(Boolean) as typeof allWords
)

const progress = computed(() =>
  store.wordIds.length === 0
    ? 0
    : Math.round((store.completedIds.length / store.wordIds.length) * 100)
)

const allDone = computed(() => store.isComplete())

onMounted(async () => {
  await store.load(allWords.map(w => w.id), DAILY_COUNT)
})
</script>

<template>
  <div class="min-h-dvh bg-bg flex flex-col">
    <ScreenHeader title="語 · Tagesvokabular" :back="false" />

    <div class="flex-1 p-6 max-w-lg mx-auto w-full flex flex-col gap-5">

      <!-- Loading -->
      <template v-if="store.loading">
        <div class="flex-1 flex items-center justify-center">
          <p lang="ja" class="font-jp text-6xl text-jp animate-pulse">語</p>
        </div>
      </template>

      <template v-else>
        <!-- Fortschritt-Karte -->
        <div class="bg-surface rounded-xl border border-border p-4 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <p class="font-sans text-sm font-semibold text-text">Heute</p>
            <p class="font-mono text-sm text-text-muted">
              {{ store.completedIds.length }} / {{ store.wordIds.length }}
            </p>
          </div>
          <KProgressBar :value="progress" />
          <p v-if="allDone" class="font-sans text-sm text-success font-medium">
            Tagesziel erreicht!
          </p>
        </div>

        <!-- Wortliste -->
        <div class="bg-surface rounded-xl border border-border px-4">
          <WordListItem
            v-for="word in todaysWords"
            :key="word.id"
            :word="word"
            :done="store.completedIds.includes(word.id)"
          />
        </div>

        <!-- Aktions-Button -->
        <KButton
          v-if="!allDone"
          :full="true"
          @click="router.push('/lernen/woerter/session')"
        >
          {{ store.completedIds.length === 0 ? 'Lernen beginnen' : 'Weiterlernen' }}
        </KButton>

        <KButton
          v-else
          variant="secondary"
          :full="true"
          @click="router.push('/')"
        >
          Zurück zum Lernpfad
        </KButton>
      </template>

    </div>

    <BottomNav />
  </div>
</template>
