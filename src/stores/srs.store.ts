import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { calculateNextReview, isDueToday } from '@/lib/srs'
import type { SRSItem, SRSRating } from '@/types/srs.types'

export const useSRSStore = defineStore('srs', () => {
  const items = ref<SRSItem[]>([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    const { data } = await supabase.from('srs_items').select('*')
    items.value = data ?? []
    loading.value = false
  }

  function getItemsDueToday(type?: SRSItem['type']) {
    return items.value.filter(
      (i) => isDueToday(i) && (type ? i.type === type : true)
    )
  }

  async function addItem(itemId: string, type: SRSItem['type'], userId: string) {
    const { data } = await supabase
      .from('srs_items')
      .upsert({ item_id: itemId, user_id: userId, type })
      .select()
      .single()
    if (data) items.value.push(data)
  }

  async function rateItem(itemId: string, userId: string, rating: SRSRating) {
    const item = items.value.find((i) => i.item_id === itemId && i.user_id === userId)
    if (!item) return

    const updates = calculateNextReview(item, rating)
    Object.assign(item, updates)

    await supabase
      .from('srs_items')
      .update(updates)
      .eq('item_id', itemId)
      .eq('user_id', userId)
  }

  return { items, loading, load, getItemsDueToday, addItem, rateItem }
})
