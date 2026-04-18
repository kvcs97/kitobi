import { useCallback } from 'react'
import { getSchedulePreviews, applyRating, Rating, type Grade, type RatingPreview } from '@/lib/fsrs'
import type { Database } from '@/types/database.types'

type DbCard = Database['public']['Tables']['flashcards']['Row']

export { Rating, type Grade, type RatingPreview }

export function useFSRS() {
  const preview = useCallback((card: DbCard): RatingPreview[] => {
    return getSchedulePreviews(card)
  }, [])

  const rate = useCallback((card: DbCard, rating: Grade) => {
    return applyRating(card, rating)
  }, [])

  return { preview, rate }
}
