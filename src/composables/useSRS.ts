import { computed } from 'vue'
import { useSRSStore } from '@/stores/srs.store'
import { useAuthStore } from '@/stores/auth.store'
import type { SRSRating, SRSItem } from '@/types/srs.types'

export function useSRS() {
  const store = useSRSStore()
  const auth = useAuthStore()

  function userId() {
    return auth.user?.id ?? ''
  }

  function getItemsDueToday(type?: SRSItem['type']) {
    return store.getItemsDueToday(type)
  }

  async function rateItem(itemId: string, rating: SRSRating) {
    await store.rateItem(itemId, userId(), rating)
  }

  async function addItem(itemId: string, type: SRSItem['type']) {
    await store.addItem(itemId, type, userId())
  }

  return {
    items: computed(() => store.items),
    loading: computed(() => store.loading),
    load: store.load,
    getItemsDueToday,
    rateItem,
    addItem,
  }
}
