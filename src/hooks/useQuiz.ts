import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

export type GeneratedQuestion = {
  question: string
  options: string[]
  correct_answer: string
  type: string
}

export function useQuiz() {
  const { user } = useAuthStore()

  const saveSession = useMutation({
    mutationFn: async (params: {
      questions: GeneratedQuestion[]
      answers: string[]
      subjectId: string | null
    }) => {
      const score = params.answers.filter(
        (a, i) => a === params.questions[i]?.correct_answer
      ).length

      const { data: session, error: sessionErr } = await supabase
        .from('quiz_sessions')
        .insert({
          user_id: user!.id,
          subject_id: params.subjectId,
          score,
          total: params.questions.length,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single()
      if (sessionErr) throw sessionErr

      const { error: qErr } = await supabase.from('quiz_questions').insert(
        params.questions.map((q, i) => ({
          session_id: session.id,
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
          type: q.type ?? 'multiple_choice',
          user_answer: params.answers[i] ?? null,
          is_correct: params.answers[i] === q.correct_answer,
        }))
      )
      if (qErr) throw qErr

      return { session, score }
    },
  })

  return { saveSession }
}
