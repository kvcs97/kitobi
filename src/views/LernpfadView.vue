<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProgress } from '@/composables/useProgress'
import { useSRSStore } from '@/stores/srs.store'
import { useDailyStore } from '@/stores/daily.store'
import { allWords } from '@/lib/daily'
import ScreenHeader from '@/components/layout/ScreenHeader.vue'
import KProgressBar from '@/components/ui/KProgressBar.vue'
import KBadge from '@/components/ui/KBadge.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import SideBar from '@/components/layout/SideBar.vue'

const router = useRouter()
const { modules, dueCount } = useProgress()
const srs = useSRSStore()
const daily = useDailyStore()

const MODULE_META: Record<string, { label: string; labelJp: string; desc: string; char: string }> = {
  hiragana:  { label: 'Hiragana',  labelJp: '平仮名', desc: '48 Silbenzeichen', char: 'あ' },
  katakana:  { label: 'Katakana',  labelJp: '片仮名', desc: '48 Silbenzeichen', char: 'ア' },
  'kanji-n5': { label: 'Kanji N5', labelJp: '漢字',   desc: '80 N5-Kanji',      char: '字' },
}

onMounted(async () => {
  await srs.load()
  await daily.load(allWords.map(w => w.id), 5)
})
</script>

<template>
  <div class="min-h-dvh bg-bg flex">
    <SideBar />

    <div class="flex-1 flex flex-col min-w-0">
      <ScreenHeader title="記飛 · Lernpfad" :back="false" />

      <!-- SRS Fehler -->
      <div v-if="srs.error" class="mx-6 mt-4 p-3 bg-danger/10 border border-danger/30 rounded-lg flex items-center gap-2">
        <span class="text-danger text-sm font-sans">⚠ {{ srs.error }}</span>
        <button @click="srs.load()" class="ml-auto font-sans text-xs text-danger underline">Retry</button>
      </div>

      <div class="flex-1 p-6 max-w-lg mx-auto w-full flex flex-col gap-5">

        <!-- Heute -->
        <div class="bg-surface rounded-xl border border-border p-4 flex flex-col gap-3">
          <p class="font-sans text-xs text-text-muted uppercase tracking-widest font-semibold">Heute</p>
          <div class="flex gap-3">
            <div
              class="flex-1 flex flex-col items-center gap-1 bg-bg rounded-lg p-3 cursor-pointer hover:ring-1 hover:ring-primary transition-all"
              @click="router.push('/lernen/flashcard/hiragana')"
            >
              <p class="font-mono text-2xl font-bold text-primary">{{ dueCount }}</p>
              <p class="font-sans text-xs text-text-muted text-center leading-tight">Karten fällig</p>
            </div>
            <div
              class="flex-1 flex flex-col items-center gap-1 bg-bg rounded-lg p-3 cursor-pointer hover:ring-1 hover:ring-primary transition-all"
              @click="router.push('/lernen/woerter')"
            >
              <p class="font-mono text-2xl font-bold text-jp">
                {{ daily.completedIds.length }}<span class="text-text-muted text-base"> / {{ daily.wordIds.length }}</span>
              </p>
              <p class="font-sans text-xs text-text-muted text-center leading-tight">Wörter heute</p>
            </div>
          </div>
        </div>

        <!-- Module -->
        <p class="font-sans text-xs text-text-muted uppercase tracking-widest font-semibold -mb-1">Module</p>

        <template v-for="mod in modules" :key="mod.id">
          <div
            v-if="MODULE_META[mod.id]"
            class="bg-surface rounded-xl border transition-all"
            :class="mod.unlocked
              ? 'border-border hover:border-primary cursor-pointer active:scale-[0.99]'
              : 'border-border opacity-50 cursor-not-allowed select-none'"
            @click="mod.unlocked && router.push(`/modul/${mod.id}`)"
          >
            <div class="p-4 flex items-center gap-4">
              <div class="w-14 h-14 rounded-xl bg-bg flex items-center justify-center shrink-0">
                <span lang="ja" class="font-jp text-3xl text-jp">{{ MODULE_META[mod.id].char }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <p class="font-serif font-semibold text-text">{{ MODULE_META[mod.id].label }}</p>
                  <span lang="ja" class="font-jp text-sm text-text-muted">{{ MODULE_META[mod.id].labelJp }}</span>
                  <KBadge v-if="!mod.unlocked" variant="warning" size="sm">gesperrt</KBadge>
                  <KBadge v-else-if="mod.progress === 100" variant="success" size="sm">abgeschlossen</KBadge>
                </div>
                <p class="font-sans text-xs text-text-muted mt-0.5">{{ MODULE_META[mod.id].desc }}</p>
                <KProgressBar :value="mod.progress" size="sm" class="mt-2" />
              </div>
              <p class="font-mono text-sm text-text-muted shrink-0">{{ mod.progress }}%</p>
            </div>
          </div>
        </template>

        <!-- Lesetexte -->
        <div
          class="bg-surface rounded-xl border border-border p-4 flex items-center gap-4 cursor-pointer hover:border-primary active:scale-[0.99] transition-all"
          @click="router.push('/lesen/n5-001')"
        >
          <div class="w-14 h-14 rounded-xl bg-bg flex items-center justify-center shrink-0">
            <span lang="ja" class="font-jp text-3xl text-jp">読</span>
          </div>
          <div class="flex-1">
            <p class="font-serif font-semibold text-text">Leseübungen N5</p>
            <p class="font-sans text-xs text-text-muted mt-0.5">5 kurze Texte · Furigana + Übersetzung</p>
          </div>
          <span class="text-text-muted">→</span>
        </div>

      </div>

      <BottomNav />
    </div>
  </div>
</template>
