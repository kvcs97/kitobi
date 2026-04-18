import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

export function useStreak() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['streak', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_logs')
        .select('date, cards_reviewed, duration_min')
        .order('date', { ascending: false })
      if (error) throw error

      const today = new Date().toISOString().split('T')[0]

      const todayLogs = data.filter(l => l.date === today)
      const reviewedToday = todayLogs.reduce((s, l) => s + (l.cards_reviewed ?? 0), 0)
      const durationToday = todayLogs.reduce((s, l) => s + (l.duration_min ?? 0), 0)

      const uniqueDates = new Set(data.map(l => l.date))

      // Count consecutive days ending today (or yesterday if today has no entry yet)
      let streak = 0
      const cursor = new Date(today)
      if (!uniqueDates.has(today)) {
        cursor.setDate(cursor.getDate() - 1)
      }
      while (true) {
        const dateStr = cursor.toISOString().split('T')[0]
        if (uniqueDates.has(dateStr)) {
          streak++
          cursor.setDate(cursor.getDate() - 1)
        } else {
          break
        }
      }

      return { streak, reviewedToday, durationToday }
    },
    enabled: !!user,
  })
}
