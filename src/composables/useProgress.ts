import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress.store'
import { useSRSStore } from '@/stores/srs.store'

export function useProgress() {
  const store = useProgressStore()
  const srs = useSRSStore()

  const dueCount = computed(() => srs.getItemsDueToday().length)

  return {
    modules: store.modules,
    dueCount,
    getProgress: store.getProgress,
    isUnlocked: store.isUnlocked,
  }
}
