import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useSRSStore } from '@/stores/srs.store'

const MODULE_SIZES: Record<string, number> = {
  hiragana: 48,
  katakana: 48,
  'kanji-n5': 80,
  'vocab-n5': 50,
}

// Maps modul id → item_id prefix in srs_items table
const MODULE_PREFIXES: Record<string, string> = {
  hiragana: 'hira-',
  katakana: 'kata-',
  'kanji-n5': 'kanji-',
  'vocab-n5': 'n5-',
}

const UNLOCK_REQUIRES: Record<string, string[]> = {
  hiragana: [],
  katakana: [],
  'kanji-n5': ['hiragana', 'katakana'],
  'vocab-n5': [],
}

export const useProgressStore = defineStore('progress', () => {
  const srs = useSRSStore()

  function getProgress(modul: string): number {
    const total = MODULE_SIZES[modul] ?? 0
    if (total === 0) return 0
    const prefix = MODULE_PREFIXES[modul] ?? `${modul}-`
    const learned = srs.items.filter(
      (i) => i.item_id.startsWith(prefix) && i.reps > 0
    ).length
    return Math.round((learned / total) * 100)
  }

  function isUnlocked(modul: string): boolean {
    const requires = UNLOCK_REQUIRES[modul] ?? []
    return requires.every((req) => getProgress(req) >= 100)
  }

  const modules = computed(() =>
    Object.keys(MODULE_SIZES).map((id) => ({
      id,
      total: MODULE_SIZES[id],
      progress: getProgress(id),
      unlocked: isUnlocked(id),
    }))
  )

  return { modules, getProgress, isUnlocked }
})
