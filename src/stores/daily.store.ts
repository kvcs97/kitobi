import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'

export const useDailyStore = defineStore('daily', () => {
  const wordIds = ref<string[]>([])
  const completedIds = ref<string[]>([])
  const loading = ref(false)

  async function load(allWordIds: string[], dailyCount: number) {
    const auth = useAuthStore()
    if (!auth.user) return

    loading.value = true
    const today = new Date().toISOString().split('T')[0]

    const { data } = await supabase
      .from('daily_assignments')
      .select('*')
      .eq('user_id', auth.user.id)
      .eq('date', today)
      .single()

    if (data) {
      wordIds.value = data.word_ids
      completedIds.value = data.completed_ids
    } else {
      const assigned = allWordIds.slice(0, dailyCount)
      await supabase.from('daily_assignments').insert({
        user_id: auth.user.id,
        date: today,
        word_ids: assigned,
        completed_ids: [],
      })
      wordIds.value = assigned
      completedIds.value = []
    }

    loading.value = false
  }

  async function markComplete(wordId: string) {
    const auth = useAuthStore()
    if (!auth.user || completedIds.value.includes(wordId)) return

    completedIds.value.push(wordId)
    const today = new Date().toISOString().split('T')[0]

    await supabase
      .from('daily_assignments')
      .update({ completed_ids: completedIds.value })
      .eq('user_id', auth.user.id)
      .eq('date', today)
  }

  const isComplete = () => wordIds.value.every((id) => completedIds.value.includes(id))

  return { wordIds, completedIds, loading, load, markComplete, isComplete }
})
