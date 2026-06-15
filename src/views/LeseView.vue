<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ScreenHeader from '@/components/layout/ScreenHeader.vue'
import KBadge from '@/components/ui/KBadge.vue'
import readingData from '@/data/reading-n5.json'

interface Segment {
  type: 'ruby' | 'text'
  text: string
  kana?: string
}

interface Sentence {
  segments: Segment[]
  translation: string
}

interface VocabEntry {
  jp: string
  furi: string
  de: string
  pos: string
}

interface ReadingText {
  id: string
  title: string
  subtitle: string
  level: string
  sentences: Sentence[]
  vocab: VocabEntry[]
}

const texts = readingData as ReadingText[]

const route = useRoute()
const router = useRouter()

const currentId = ref(route.params.id as string)

const currentIndex = computed(() => texts.findIndex(t => t.id === currentId.value))
const text = computed<ReadingText | undefined>(() => texts[currentIndex.value])

const showFurigana = ref(true)
const showTranslation = ref(false)
const showVocab = ref(false)

function prev() {
  if (currentIndex.value > 0) {
    currentId.value = texts[currentIndex.value - 1].id
    router.replace(`/lesen/${currentId.value}`)
  }
}

function next() {
  if (currentIndex.value < texts.length - 1) {
    currentId.value = texts[currentIndex.value + 1].id
    router.replace(`/lesen/${currentId.value}`)
  }
}
</script>

<template>
  <div class="min-h-dvh bg-bg flex flex-col">
    <ScreenHeader
      :title="text ? text.title : 'Leseübung'"
      :back="true"
    >
      <template #right>
        <span class="font-mono text-sm text-text-muted">{{ currentIndex + 1 }} / {{ texts.length }}</span>
      </template>
    </ScreenHeader>

    <div class="flex-1 p-6 max-w-lg mx-auto w-full flex flex-col gap-6" v-if="text">

      <!-- Text-Info -->
      <div class="flex items-center gap-2">
        <KBadge variant="jp" size="sm">{{ text.level }}</KBadge>
        <p class="font-sans text-sm text-text-muted italic">{{ text.subtitle }}</p>
      </div>

      <!-- Toggle Buttons -->
      <div class="flex gap-2 flex-wrap">
        <button
          @click="showFurigana = !showFurigana"
          class="px-3 py-1.5 rounded-md font-sans text-xs font-semibold transition-colors"
          :class="showFurigana
            ? 'bg-primary/15 text-primary'
            : 'bg-surface border border-border text-text-muted hover:border-primary'"
        >
          ふりがな {{ showFurigana ? 'an' : 'aus' }}
        </button>
        <button
          @click="showTranslation = !showTranslation"
          class="px-3 py-1.5 rounded-md font-sans text-xs font-semibold transition-colors"
          :class="showTranslation
            ? 'bg-primary/15 text-primary'
            : 'bg-surface border border-border text-text-muted hover:border-primary'"
        >
          Übersetzung {{ showTranslation ? 'an' : 'aus' }}
        </button>
      </div>

      <!-- Lesetext -->
      <div class="bg-surface rounded-xl border border-border p-5 flex flex-col gap-5">
        <div
          v-for="(sentence, si) in text.sentences"
          :key="si"
          class="flex flex-col gap-1.5"
        >
          <p lang="ja" class="font-jp text-xl leading-loose text-jp">
            <template v-for="(seg, gi) in sentence.segments" :key="gi">
              <ruby v-if="seg.type === 'ruby' && showFurigana">
                {{ seg.text }}<rt class="font-jp text-[0.6em] text-text-muted">{{ seg.kana }}</rt>
              </ruby>
              <span v-else>{{ seg.text }}</span>
            </template>
          </p>
          <Transition name="fade">
            <p
              v-if="showTranslation"
              class="font-sans text-sm text-text-muted italic leading-relaxed"
            >
              {{ sentence.translation }}
            </p>
          </Transition>
        </div>
      </div>

      <!-- Vokabelliste -->
      <div>
        <button
          @click="showVocab = !showVocab"
          class="w-full flex items-center justify-between py-2 font-sans text-sm font-semibold text-text-muted hover:text-text transition-colors"
        >
          <span>Vokabelliste ({{ text.vocab.length }})</span>
          <span class="font-mono">{{ showVocab ? '▲' : '▼' }}</span>
        </button>

        <Transition name="fade">
          <div v-if="showVocab" class="bg-surface rounded-xl border border-border divide-y divide-border">
            <div
              v-for="entry in text.vocab"
              :key="entry.jp"
              class="flex items-center gap-3 px-4 py-2.5"
            >
              <div class="w-20 shrink-0">
                <p lang="ja" class="font-jp text-base text-jp leading-tight">{{ entry.jp }}</p>
                <p lang="ja" class="font-jp text-xs text-text-muted">{{ entry.furi }}</p>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-sans text-sm text-text">{{ entry.de }}</p>
              </div>
              <KBadge variant="default" size="sm">{{ entry.pos }}</KBadge>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Vor / Zurück Navigation -->
      <div class="flex gap-3 mt-auto">
        <button
          @click="prev"
          :disabled="currentIndex === 0"
          class="flex-1 py-3 rounded-lg font-serif font-semibold bg-surface border border-border text-text disabled:opacity-30 hover:border-primary transition-colors"
        >
          ← Vorheriger
        </button>
        <button
          @click="next"
          :disabled="currentIndex >= texts.length - 1"
          class="flex-1 py-3 rounded-lg font-serif font-semibold bg-primary text-white disabled:opacity-30 hover:bg-primary-dark transition-colors"
        >
          Nächster →
        </button>
      </div>

    </div>

    <!-- Nicht gefunden -->
    <div v-else class="flex-1 flex flex-col items-center justify-center gap-3 text-center p-6">
      <p class="font-serif text-lg text-text">Text nicht gefunden</p>
      <button @click="router.push('/')" class="font-sans text-sm text-primary">Zurück zum Lernpfad</button>
    </div>

    <div class="h-20 lg:h-0 shrink-0" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
