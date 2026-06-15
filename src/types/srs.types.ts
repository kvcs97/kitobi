export type SRSRating = 'wieder' | 'gut' | 'perfekt'

export interface SRSItem {
  item_id: string
  user_id: string
  created_at: string
  type: 'character' | 'word'
  ease: number
  interval: number
  reps: number
  lapses: number
  due: string
  last_review: string | null
}
