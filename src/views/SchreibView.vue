<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSRS } from '@/composables/useSRS'
import ScreenHeader from '@/components/layout/ScreenHeader.vue'
import hiraganaData from '@/data/hiragana.json'
import katakanaData from '@/data/katakana.json'
import type { Character } from '@/types/character.types'
import type { SRSRating } from '@/types/srs.types'

const route = useRoute()
const router = useRouter()
const srs = useSRS()

const zeichen = decodeURIComponent(route.params.zeichen as string)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const hasDrawn = ref(false)
const showRating = ref(false)
const ghostOpacity = ref(0.12)

const allChars = [...hiraganaData, ...katakanaData] as Character[]
const charInfo = computed(() => allChars.find(c => c.char === zeichen))

// Drawing state
let ctx: CanvasRenderingContext2D | null = null
let drawing = false

function setupCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  if (!ctx) return

  const size = canvas.offsetWidth
  canvas.width = size * window.devicePixelRatio
  canvas.height = size * window.devicePixelRatio
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  ctx.strokeStyle = '#1C1917'
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

function getPos(e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect()
  if ('touches' in e) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    }
  }
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function startDraw(e: MouseEvent | TouchEvent) {
  if (!ctx || !canvasRef.value) return
  e.preventDefault()
  drawing = true
  const { x, y } = getPos(e, canvasRef.value)
  ctx.beginPath()
  ctx.moveTo(x, y)
}

function draw(e: MouseEvent | TouchEvent) {
  if (!drawing || !ctx || !canvasRef.value) return
  e.preventDefault()
  const { x, y } = getPos(e, canvasRef.value)
  ctx.lineTo(x, y)
  ctx.stroke()
  if (!hasDrawn.value) {
    hasDrawn.value = true
    showRating.value = false
  }
}

function stopDraw() {
  if (!drawing) return
  drawing = false
  if (hasDrawn.value) showRating.value = true
}

function clearCanvas() {
  if (!ctx || !canvasRef.value) return
  const size = canvasRef.value.offsetWidth
  ctx.clearRect(0, 0, size, size)
  hasDrawn.value = false
  showRating.value = false
}

async function rate(rating: SRSRating) {
  const charId = charInfo.value?.id
  if (charId) {
    await srs.rateItem(charId, rating)
  }
  router.back()
}

onMounted(() => {
  setupCanvas()
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.addEventListener('mousedown', startDraw)
  canvas.addEventListener('mousemove', draw)
  canvas.addEventListener('mouseup', stopDraw)
  canvas.addEventListener('mouseleave', stopDraw)
  canvas.addEventListener('touchstart', startDraw, { passive: false })
  canvas.addEventListener('touchmove', draw, { passive: false })
  canvas.addEventListener('touchend', stopDraw)
})

onUnmounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.removeEventListener('mousedown', startDraw)
  canvas.removeEventListener('mousemove', draw)
  canvas.removeEventListener('mouseup', stopDraw)
  canvas.removeEventListener('mouseleave', stopDraw)
  canvas.removeEventListener('touchstart', startDraw)
  canvas.removeEventListener('touchmove', draw)
  canvas.removeEventListener('touchend', stopDraw)
})
</script>

<template>
  <div class="min-h-dvh bg-bg flex flex-col">
    <ScreenHeader
      :title="charInfo ? `${zeichen} schreiben` : 'Schreiben'"
      :back="true"
    >
      <template #right>
        <button
          @click="clearCanvas"
          class="font-sans text-sm text-text-muted hover:text-danger transition-colors px-2 py-1"
        >
          Löschen
        </button>
      </template>
    </ScreenHeader>

    <div class="flex-1 flex flex-col items-center p-6 gap-6 max-w-sm mx-auto w-full">

      <!-- Anweisung -->
      <p class="font-sans text-sm text-text-muted text-center">
        Schreibe
        <span lang="ja" class="font-jp text-base text-jp font-medium"> {{ zeichen }} </span>
        ({{ charInfo?.romaji }}) in das Feld unten.
      </p>

      <!-- Canvas mit Ghost-Overlay -->
      <div class="relative w-full aspect-square max-w-xs bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">

        <!-- Ghost: Zeichen als Vorbild -->
        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          :style="{ opacity: ghostOpacity }"
        >
          <p lang="ja" class="font-jp text-[10rem] leading-none text-jp">{{ zeichen }}</p>
        </div>

        <!-- Zeichenfläche -->
        <canvas
          ref="canvasRef"
          class="absolute inset-0 w-full h-full touch-none cursor-crosshair"
        />
      </div>

      <!-- Ghost-Stärke Slider -->
      <div class="w-full flex items-center gap-3">
        <span class="font-sans text-xs text-text-muted whitespace-nowrap">Ghost</span>
        <input
          type="range"
          min="0"
          max="0.3"
          step="0.01"
          v-model.number="ghostOpacity"
          class="flex-1 accent-primary"
        />
        <span class="font-sans text-xs text-text-muted w-8 text-right">
          {{ Math.round(ghostOpacity * 100 / 0.3 * 100) / 100 > 0
            ? Math.round(ghostOpacity / 0.3 * 100) + '%'
            : 'Aus' }}
        </span>
      </div>

      <!-- Selbstbewertung -->
      <Transition name="slide-up">
        <div v-if="showRating" class="w-full flex flex-col gap-3">
          <p class="font-sans text-sm text-text-muted text-center">Wie war deine Schreibung?</p>
          <div class="flex gap-3">
            <button
              @click="rate('wieder')"
              class="flex-1 py-3 rounded-lg bg-danger/10 text-danger font-sans font-semibold text-sm hover:bg-danger/20 active:scale-[0.97] transition-all"
            >
              Wieder
            </button>
            <button
              @click="rate('gut')"
              class="flex-1 py-3 rounded-lg bg-warning/10 text-warning font-sans font-semibold text-sm hover:bg-warning/20 active:scale-[0.97] transition-all"
            >
              Gut
            </button>
            <button
              @click="rate('perfekt')"
              class="flex-1 py-3 rounded-lg bg-success/10 text-success font-sans font-semibold text-sm hover:bg-success/20 active:scale-[0.97] transition-all"
            >
              Perfekt
            </button>
          </div>
        </div>
      </Transition>

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
