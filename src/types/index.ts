// TypeScript types for all Kitobi database tables
// Generated types via `supabase gen types` will be added in Task 2.7

export interface Subject {
  id: string
  created_at: string
  user_id: string
  name: string
  color: string | null
  exam_date: string | null
}

export interface Note {
  id: string
  created_at: string
  updated_at: string | null
  user_id: string
  subject_id: string
  title: string
  content: string | null
}

export interface FlashcardDeck {
  id: string
  created_at: string
  user_id: string
  subject_id: string
  note_id: string | null
  name: string
}

export interface Flashcard {
  id: string
  created_at: string
  deck_id: string
  front: string
  back: string
  stability: number
  difficulty: number
  due_date: string
  state: number
  reps: number
  lapses: number
}

export interface QuizSession {
  id: string
  created_at: string
  user_id: string
  subject_id: string | null
  score: number | null
  total: number | null
  completed_at: string | null
}

export interface QuizQuestion {
  id: string
  session_id: string
  question: string
  type: 'multiple_choice' | 'fill' | 'free'
  correct_answer: string
  user_answer: string | null
  options: string[] | null
  is_correct: boolean | null
}

export interface StudyLog {
  id: string
  created_at: string
  user_id: string
  subject_id: string | null
  date: string
  duration_min: number | null
  cards_reviewed: number | null
}

export interface UserProfile {
  id: string
  name: string | null
  study_program: string | null
  semester: number | null
  daily_goal_min: number
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

// Generated types — see database.types.ts (Task 2.7)
export type { Database } from './database.types'
