import { fsrs, Rating, State, type Card, type Grade } from 'ts-fsrs'
import type { Database } from '@/types/database.types'

type DbCard = Database['public']['Tables']['flashcards']['Row']
type DbCardUpdate = Pick<
  Database['public']['Tables']['flashcards']['Update'],
  'stability' | 'difficulty' | 'due_date' | 'state' | 'reps' | 'lapses' | 'last_review'
>

export { Rating, State, type Grade }

export function toFsrsCard(db: DbCard): Card {
  return {
    due: new Date(db.due_date),
    stability: db.stability,
    difficulty: db.difficulty,
    elapsed_days: 0,
    scheduled_days: 0,
    learning_steps: 0,
    reps: db.reps,
    lapses: db.lapses,
    state: db.state as State,
    last_review: db.last_review ? new Date(db.last_review) : undefined,
  }
}

export type RatingPreview = {
  rating: Grade
  card: Card
  intervalLabel: string
}

export function getSchedulePreviews(dbCard: DbCard): RatingPreview[] {
  const f = fsrs()
  const card = toFsrsCard(dbCard)
  const now = new Date()
  const preview = f.repeat(card, now)

  return ([Rating.Again, Rating.Hard, Rating.Good, Rating.Easy] as Grade[]).map(rating => ({
    rating,
    card: preview[rating].card,
    intervalLabel: formatInterval(preview[rating].card.due, now),
  }))
}

export function applyRating(dbCard: DbCard, rating: Grade): DbCardUpdate {
  const f = fsrs()
  const card = toFsrsCard(dbCard)
  const now = new Date()
  const result = f.next(card, now, rating)

  return {
    stability: result.card.stability,
    difficulty: result.card.difficulty,
    due_date: result.card.due.toISOString(),
    state: result.card.state as number,
    reps: result.card.reps,
    lapses: result.card.lapses,
    last_review: now.toISOString(),
  }
}

export function formatInterval(due: Date, now: Date): string {
  const diffMs = due.getTime() - now.getTime()
  const diffMin = Math.round(diffMs / 60_000)
  const diffH = Math.round(diffMs / 3_600_000)
  const diffD = Math.round(diffMs / 86_400_000)

  if (diffMin < 1) return '< 1 Min.'
  if (diffMin < 60) return `${diffMin} Min.`
  if (diffH < 24) return `${diffH} Std.`
  if (diffD === 1) return '1 Tag'
  if (diffD < 30) return `${diffD} Tage`
  const diffM = Math.round(diffD / 30)
  return diffM === 1 ? '1 Monat' : `${diffM} Monate`
}
