import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

interface SessionStats {
  perfekt: number
  gut: number
  wieder: number
  startedAt: number
}

export const useSessionStore = defineStore('session', () => {
  const queue = ref<string[]>([])
  const stats = ref<SessionStats>({ perfekt: 0, gut: 0, wieder: 0, startedAt: 0 })
  const currentIndex = ref(0)

  function startSession(itemIds: string[]) {
    queue.value = [...itemIds]
    currentIndex.value = 0
    stats.value = { perfekt: 0, gut: 0, wieder: 0, startedAt: Date.now() }
  }

  function recordRating(rating: 'perfekt' | 'gut' | 'wieder') {
    stats.value[rating] += 1
  }

  function next() {
    currentIndex.value += 1
  }

  function addToEnd(itemId: string) {
    queue.value.push(itemId)
  }

  async function saveSession(userId: string, type: string, modul: string) {
    const duration = Math.round((Date.now() - stats.value.startedAt) / 1000)
    await supabase.from('sessions').insert({
      user_id: userId,
      type,
      modul,
      perfekt: stats.value.perfekt,
      gut: stats.value.gut,
      wieder: stats.value.wieder,
      duration_sec: duration,
    })
  }

  const isDone = () => currentIndex.value >= queue.value.length
  const current = () => queue.value[currentIndex.value]

  return { queue, stats, currentIndex, startSession, recordRating, next, addToEnd, saveSession, isDone, current }
})
