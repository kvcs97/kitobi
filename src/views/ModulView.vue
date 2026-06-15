<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import hiraganaData from '@/data/hiragana.json'
import katakanaData from '@/data/katakana.json'
import type { Character } from '@/types/character.types'
import ScreenHeader from '@/components/layout/ScreenHeader.vue'
import KButton from '@/components/ui/KButton.vue'
import BottomNav from '@/components/layout/BottomNav.vue'

const route = useRoute()
const router = useRouter()

const modul = route.params.id as string

const META: Record<string, { label: string; labelJp: string }> = {
  hiragana: { label: 'Hiragana', labelJp: '平仮名' },
  katakana: { label: 'Katakana', labelJp: '片仮名' },
}

const chars = computed<Character[]>(() => {
  if (modul === 'hiragana') return hiraganaData as Character[]
  if (modul === 'katakana') return katakanaData as Character[]
  return []
})

const meta = computed(() => META[modul] ?? { label: modul, labelJp: '' })

function goStroke(char: string) {
  router.push(`/lernen/stroke/${encodeURIComponent(char)}`)
}
</script>

<template>
  <div class="min-h-dvh bg-bg flex flex-col">
    <ScreenHeader :title="`${meta.label} · ${meta.labelJp}`" :back="true" />

    <div class="flex-1 p-6 max-w-lg mx-auto w-full flex flex-col gap-5">

      <!-- Session-Buttons -->
      <div class="flex gap-3">
        <KButton
          variant="primary"
          class="flex-1"
          @click="router.push(`/lernen/flashcard/${modul}`)"
        >
          Karteikarten
        </KButton>
        <KButton
          variant="secondary"
          class="flex-1"
          @click="router.push(`/quiz/${modul}`)"
        >
          Quiz
        </KButton>
      </div>

      <!-- Zeichen-Grid -->
      <div>
        <p class="font-sans text-xs text-text-muted uppercase tracking-widest font-semibold mb-3">
          Alle Zeichen — Strichfolge wählen
        </p>
        <div class="grid grid-cols-5 gap-2">
          <button
            v-for="c in chars"
            :key="c.id"
            @click="goStroke(c.char)"
            class="aspect-square flex flex-col items-center justify-center gap-0.5 bg-surface rounded-xl border border-border hover:border-primary hover:bg-bg active:scale-[0.95] transition-all"
          >
            <span lang="ja" class="font-jp text-xl text-jp leading-none">{{ c.char }}</span>
            <span class="font-mono text-[9px] text-text-muted leading-none">{{ c.romaji }}</span>
          </button>
        </div>
      </div>

    </div>

    <BottomNav />
  </div>
</template>
