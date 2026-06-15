import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useSRSStore } from '@/stores/srs.store'

const MODULE_SIZES: Record<string, number> = {
  hiragana: 46,
  katakana: 46,
  'kanji-n5': 80,
  'vocab-n5': 800,
}

const UNLOCK_REQUIRES: Record<string, string[]> = {
  katakana: [],
  'kanji-n5': ['katakana'],
  'vocab-n5': ['kanji-n5'],
}

export const useProgressStore = defineStore('progress', () => {
  const srs = useSRSStore()

  function getProgress(modul: string): number {
    const total = MODULE_SIZES[modul] ?? 0
    if (total === 0) return 0
    const learned = srs.items.filter(
      (i) => i.item_id.startsWith(`${modul}_`) && i.reps > 0
    ).length
    return Math.round((learned / total) * 100)
  }

  function isUnlocked(modul: string): boolean {
    const requires = UNLOCK_REQUIRES[modul]
    if (!requires || requires.length === 0) return true
    return requires.every((req) => getProgress(req) >= 100)
  }

  const modules = computed(() => {
    return Object.keys(MODULE_SIZES).map((id) => ({
      id,
      total: MODULE_SIZES[id],
      progress: getProgress(id),
      unlocked: isUnlocked(id),
    }))
  })

  return { modules, getProgress, isUnlocked }
})
