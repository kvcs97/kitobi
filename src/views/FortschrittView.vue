<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useSRSStore } from '@/stores/srs.store'
import { useDailyStore } from '@/stores/daily.store'
import { allWords } from '@/lib/daily'
import ScreenHeader from '@/components/layout/ScreenHeader.vue'
import KProgressBar from '@/components/ui/KProgressBar.vue'
import KBadge from '@/components/ui/KBadge.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import SideBar from '@/components/layout/SideBar.vue'

const auth = useAuthStore()
const srs = useSRSStore()
const daily = useDailyStore()

const DAILY_COUNT = 5

const totalLearned = computed(() => srs.items.filter(i => i.reps > 0).length)
const totalDue = computed(() => srs.getItemsDueToday().length)
const totalItems = computed(() => srs.items.length)

interface ModuleStat {
  id: string
  label: string
  labelJp: string
  prefix: string
  total: number
}

const MODULES: ModuleStat[] = [
  { id: 'hiragana', label: 'Hiragana', labelJp: '平仮名', prefix: 'hira-', total: 48 },
  { id: 'katakana', label: 'Katakana', labelJp: '片仮名', prefix: 'kata-', total: 48 },
]

function learnedCount(prefix: string): number {
  return srs.items.filter(i => i.item_id.startsWith(prefix) && i.reps > 0).length
}

function progressPct(prefix: string, total: number): number {
  return Math.round((learnedCount(prefix) / total) * 100)
}

const dailyProgress = computed(() =>
  daily.wordIds.length === 0
    ? 0
    : Math.round((daily.completedIds.length / daily.wordIds.length) * 100)
)

onMounted(async () => {
  await srs.load()
  await daily.load(allWords.map(w => w.id), DAILY_COUNT)
})
</script>

<template>
  <div class="min-h-dvh bg-bg flex">
    <SideBar />

    <div class="flex-1 flex flex-col min-w-0">
      <ScreenHeader title="Fortschritt" :back="false" :logo="true" />

      <!-- Loading -->
      <div v-if="srs.loading" class="flex-1 flex items-center justify-center">
        <p lang="ja" class="font-jp text-6xl text-jp animate-pulse">歩</p>
      </div>

      <!-- Fehler -->
      <div v-else-if="srs.error" class="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p class="font-serif text-lg text-danger">Fehler beim Laden</p>
        <p class="font-sans text-sm text-text-muted">{{ srs.error }}</p>
        <button
          @click="srs.load()"
          class="px-4 py-2 bg-primary text-white rounded-md font-sans text-sm font-semibold"
        >
          Erneut versuchen
        </button>
      </div>

      <div v-else class="flex-1 p-6 max-w-lg mx-auto w-full flex flex-col gap-5">

        <!-- Gesamt-Stats -->
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-surface rounded-xl border border-border p-4 flex flex-col items-center gap-1">
            <p class="font-mono text-3xl font-bold text-primary">{{ totalLearned }}</p>
            <p class="font-sans text-[10px] text-text-muted uppercase tracking-wide text-center leading-tight">Gelernt</p>
          </div>
          <div class="bg-surface rounded-xl border border-border p-4 flex flex-col items-center gap-1">
            <p class="font-mono text-3xl font-bold" :class="totalDue > 0 ? 'text-warning' : 'text-success'">
              {{ totalDue }}
            </p>
            <p class="font-sans text-[10px] text-text-muted uppercase tracking-wide text-center leading-tight">Fällig</p>
          </div>
          <div class="bg-surface rounded-xl border border-border p-4 flex flex-col items-center gap-1">
            <p class="font-mono text-3xl font-bold text-text">{{ totalItems }}</p>
            <p class="font-sans text-[10px] text-text-muted uppercase tracking-wide text-center leading-tight">Gesamt</p>
          </div>
        </div>

        <!-- Empty State (noch kein SRS-Fortschritt) -->
        <div
          v-if="totalItems === 0"
          class="bg-surface rounded-xl border border-border p-6 text-center flex flex-col items-center gap-3"
        >
          <p lang="ja" class="font-jp text-4xl text-jp/40">記飛</p>
          <p class="font-serif text-base font-semibold text-text">Noch keine Lernkarten</p>
          <p class="font-sans text-sm text-text-muted leading-relaxed">
            Starte eine Karteikarten-Session, um deinen Fortschritt zu sehen.
          </p>
        </div>

        <!-- Kana-Fortschritt -->
        <template v-else>
          <p class="font-sans text-xs text-text-muted uppercase tracking-widest font-semibold -mb-1">Kana-Module</p>

          <div class="bg-surface rounded-xl border border-border divide-y divide-border">
            <div
              v-for="mod in MODULES"
              :key="mod.id"
              class="p-4 flex flex-col gap-2"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <p class="font-serif font-semibold text-text text-sm">{{ mod.label }}</p>
                  <span lang="ja" class="font-jp text-xs text-text-muted">{{ mod.labelJp }}</span>
                  <KBadge v-if="progressPct(mod.prefix, mod.total) === 100" variant="success" size="sm">✓</KBadge>
                </div>
                <p class="font-mono text-sm text-text-muted">
                  {{ learnedCount(mod.prefix) }} / {{ mod.total }}
                </p>
              </div>
              <KProgressBar :value="progressPct(mod.prefix, mod.total)" size="sm" />
            </div>
          </div>
        </template>

        <!-- Tagesvokabular -->
        <p class="font-sans text-xs text-text-muted uppercase tracking-widest font-semibold -mb-1">Heute</p>
        <div class="bg-surface rounded-xl border border-border p-4 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <p class="font-sans text-sm font-semibold text-text">Tagesvokabular</p>
            <p class="font-mono text-sm text-text-muted">
              {{ daily.completedIds.length }} / {{ daily.wordIds.length || DAILY_COUNT }}
            </p>
          </div>
          <KProgressBar :value="dailyProgress" />
          <p v-if="dailyProgress === 100" class="font-sans text-xs text-success font-medium">Tagesziel erreicht!</p>
        </div>

        <!-- Konto -->
        <p class="font-sans text-xs text-text-muted uppercase tracking-widest font-semibold -mb-1">Konto</p>
        <div class="bg-surface rounded-xl border border-border p-4 flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="font-sans text-xs text-text-muted">Angemeldet als</p>
            <p class="font-mono text-sm text-text truncate mt-0.5">{{ auth.user?.email }}</p>
          </div>
          <button
            @click="auth.logout()"
            class="shrink-0 px-3 py-1.5 rounded-md border border-border font-sans text-sm text-text-muted hover:border-danger hover:text-danger transition-colors"
          >
            Abmelden
          </button>
        </div>

        <!-- KanjiVG Attribution -->
        <p class="text-[10px] font-sans text-text-muted/30 text-center">
          Strichfolgen: KanjiVG © Ulrich Apel · CC BY-SA 3.0
        </p>

      </div>

      <BottomNav />
    </div>
  </div>
</template>
