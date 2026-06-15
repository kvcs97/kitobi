import type { SRSItem, SRSRating } from '@/types/srs.types'

const MIN_EASE = 1.3

export function calculateNextReview(item: SRSItem, rating: SRSRating): Partial<SRSItem> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let { ease, interval, reps, lapses } = item

  if (rating === 'wieder') {
    lapses += 1
    reps = 0
    interval = 1
    ease = Math.max(MIN_EASE, ease - 0.2)
  } else if (rating === 'gut') {
    reps += 1
    if (reps === 1) interval = 1
    else if (reps === 2) interval = 6
    else interval = Math.round(interval * ease)
  } else {
    // perfekt
    reps += 1
    ease = Math.min(2.5, ease + 0.1)
    if (reps === 1) interval = 1
    else if (reps === 2) interval = 6
    else interval = Math.round(interval * ease)
  }

  const due = new Date(today)
  due.setDate(due.getDate() + interval)

  return {
    ease,
    interval,
    reps,
    lapses,
    due: due.toISOString().split('T')[0],
    last_review: today.toISOString().split('T')[0],
  }
}

export function isDueToday(item: SRSItem): boolean {
  const today = new Date().toISOString().split('T')[0]
  return item.due <= today
}
