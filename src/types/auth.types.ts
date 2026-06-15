export interface Profile {
  id: string
  created_at: string
  username: string | null
  daily_word_count: number
  furigana_default: boolean
  stroke_ghost_default: boolean
}
