<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ScreenHeader from '@/components/layout/ScreenHeader.vue'
import StrokeCanvas from '@/components/stroke/StrokeCanvas.vue'
import KButton from '@/components/ui/KButton.vue'
import hiraganaStrokes from '@/data/strokeorder/hiragana.json'
import katakanaStrokes from '@/data/strokeorder/katakana.json'
import hiraganaData from '@/data/hiragana.json'
import katakanaData from '@/data/katakana.json'
import type { Character } from '@/types/character.types'

const route = useRoute()
const router = useRouter()

const zeichen = decodeURIComponent(route.params.zeichen as string)

const allChars = [...hiraganaData, ...katakanaData] as Character[]

const charInfo = computed(() => allChars.find(c => c.char === zeichen))

type StrokeDB = { characters: Record<string, { strokes: string[]; tips: string[] }> }

const strokeData = computed(() => {
  const hira = (hiraganaStrokes as StrokeDB).characters[zeichen]
  const kata = (katakanaStrokes as StrokeDB).characters[zeichen]
  return hira ?? kata ?? null
})

const title = computed(() =>
  charInfo.value ? `${zeichen}  ·  ${charInfo.value.romaji}` : zeichen
)

function goToSchreiben() {
  router.push(`/lernen/schreiben/${encodeURIComponent(zeichen)}`)
}
</script>

<template>
  <div class="min-h-dvh bg-bg flex flex-col">
    <ScreenHeader :title="title" :back="true" />

    <div class="flex-1 flex flex-col items-center p-6 gap-6 max-w-sm mx-auto w-full">

      <!-- Zeichen-Info -->
      <div class="w-full bg-surface rounded-xl border border-border p-4 flex items-center gap-4 shadow-sm">
        <p lang="ja" class="font-jp text-5xl text-jp leading-none w-14 text-center">{{ zeichen }}</p>
        <div class="flex flex-col gap-0.5">
          <p class="font-mono text-2xl text-primary leading-none">{{ charInfo?.romaji }}</p>
          <p class="font-sans text-xs text-text-muted capitalize mt-1">
            {{ charInfo?.type }}
          </p>
          <p class="font-sans text-xs text-text-muted">
            {{ strokeData?.strokes.length ?? 0 }}
            {{ (strokeData?.strokes.length ?? 0) === 1 ? 'Strich' : 'Striche' }}
          </p>
        </div>
      </div>

      <!-- Keine Daten -->
      <div v-if="!strokeData" class="flex-1 flex flex-col items-center justify-center gap-3 text-center">
        <p class="font-serif text-lg text-text">Keine Strichdaten verfügbar</p>
        <p class="font-sans text-sm text-text-muted">Für dieses Zeichen sind noch keine Strichfolge-Daten hinterlegt.</p>
      </div>

      <!-- Canvas -->
      <StrokeCanvas
        v-else
        :strokes="strokeData.strokes"
        :tips="strokeData.tips"
      />

      <!-- Weiter zur Schreibübung -->
      <KButton
        v-if="strokeData"
        variant="secondary"
        :full="true"
        @click="goToSchreiben"
        class="mt-auto"
      >
        Jetzt selbst schreiben →
      </KButton>

      <!-- KanjiVG Attribution -->
      <p class="text-[10px] font-sans text-text-muted/40 text-center">
        Strichfolge: KanjiVG © Ulrich Apel · CC BY-SA 3.0
      </p>

    </div>

    <div class="h-20 lg:h-0 shrink-0" />
  </div>
</template>
