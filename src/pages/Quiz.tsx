import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { generateQuizQuestions } from '@/lib/claude'
import { useNotes } from '@/hooks/useNotes'
import { useDecks } from '@/hooks/useFlashcards'
import { useQuiz, type GeneratedQuestion } from '@/hooks/useQuiz'

import { Button } from '@/components/ui/button'
import type { Database } from '@/types/database.types'

type Card = Database['public']['Tables']['flashcards']['Row']
type QuizPhase = 'config' | 'generating' | 'session' | 'result'

function htmlToText(html: string | null): string {
  if (!html) return ''
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default function Quiz() {
  const navigate = useNavigate()
  const { data: notes = [] } = useNotes()
  const { data: decks = [] } = useDecks()

  const { saveSession } = useQuiz()

  const [phase, setPhase] = useState<QuizPhase>('config')
  const [sourceType, setSourceType] = useState<'note' | 'deck'>('note')
  const [sourceId, setSourceId] = useState('')
  const [questionCount, setQuestionCount] = useState(5)
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [answers, setAnswers] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [score, setScore] = useState(0)


  async function fetchContent(): Promise<{ content: string; subjectId: string | null }> {
    if (sourceType === 'note') {
      const note = notes.find(n => n.id === sourceId)
      if (!note) throw new Error('Notiz nicht gefunden')
      return { content: htmlToText(note.content), subjectId: note.subject_id }
    } else {
      const { data, error } = await supabase
        .from('flashcards')
        .select('front, back')
        .eq('deck_id', sourceId)
      if (error) throw error
      const deck = decks.find(d => d.id === sourceId)
      const content = (data as Pick<Card, 'front' | 'back'>[])
        .map(c => `${c.front}\n${c.back}`)
        .join('\n\n')
      return { content, subjectId: deck?.subject_id ?? null }
    }
  }

  async function startQuiz() {
    if (!sourceId) return
    setPhase('generating')
    setError(null)
    try {
      const { content } = await fetchContent()
      if (!content.trim()) throw new Error('Kein Inhalt zum Verarbeiten')
      const qs = await generateQuizQuestions(content, questionCount)
      if (!qs || qs.length === 0) throw new Error('Keine Fragen generiert')
      setQuestions(qs)
      setAnswers([])
      setCurrentIndex(0)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setPhase('session')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Generieren')
      setPhase('config')
    }
  }

  function handleAnswer(option: string) {
    if (showFeedback) return
    setSelectedAnswer(option)
    setShowFeedback(true)
  }

  async function handleNext() {
    const newAnswers = [...answers, selectedAnswer ?? '']
    setAnswers(newAnswers)

    if (currentIndex + 1 >= questions.length) {
      const finalScore = newAnswers.filter(
        (a, i) => a === questions[i]?.correct_answer
      ).length
      setScore(finalScore)
      setPhase('result')
      const pct = Math.round((finalScore / questions.length) * 100)
      toast.success(`Quiz abgeschlossen! ${finalScore}/${questions.length} richtig (${pct}%) 🎉`)
      // Save to Supabase
      const deck = sourceType === 'deck' ? decks.find(d => d.id === sourceId) : null
      const note = sourceType === 'note' ? notes.find(n => n.id === sourceId) : null
      const subjectId = deck?.subject_id ?? note?.subject_id ?? null
      try {
        await saveSession.mutateAsync({ questions, answers: newAnswers, subjectId })
      } catch { /* non-critical */ }
    } else {
      setCurrentIndex(i => i + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    }
  }

  // ── Config phase ──────────────────────────────────────────────────────────
  if (phase === 'config' || phase === 'generating') {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm mb-8 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <ArrowLeft size={15} /> Dashboard
          </button>

          <h1 className="text-2xl font-bold mb-8"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            Quiz erstellen
          </h1>

          <div
            className="rounded-2xl border p-6 space-y-6"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            {/* Source type tabs */}
            <div>
              <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-muted)' }}>Quelle</p>
              <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
                {(['note', 'deck'] as const).map(t => (
                  <button
                    key={t}
                    className="flex-1 py-2 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: sourceType === t ? 'var(--color-primary)' : 'transparent',
                      color: sourceType === t ? '#0F0F13' : 'var(--color-text-muted)',
                    }}
                    onClick={() => { setSourceType(t); setSourceId('') }}
                  >
                    {t === 'note' ? 'Notiz' : 'Deck'}
                  </button>
                ))}
              </div>
            </div>

            {/* Source selector */}
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>
                {sourceType === 'note' ? 'Notiz auswählen' : 'Deck auswählen'}
              </p>
              <select
                value={sourceId}
                onChange={e => setSourceId(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderColor: 'var(--color-border)',
                  color: sourceId ? 'var(--color-text)' : 'var(--color-text-muted)',
                }}
              >
                <option value="">— auswählen —</option>
                {sourceType === 'note'
                  ? notes.map(n => <option key={n.id} value={n.id}>{n.title || 'Ohne Titel'}</option>)
                  : decks.map(d => <option key={d.id} value={d.id}>{d.name}</option>)
                }
              </select>
            </div>

            {/* Question count */}
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Anzahl Fragen</p>
              <div className="flex gap-2">
                {[5, 10, 15].map(n => (
                  <button
                    key={n}
                    className="flex-1 py-2 rounded-lg border text-sm font-medium transition-colors"
                    style={{
                      borderColor: questionCount === n ? 'var(--color-primary)' : 'var(--color-border)',
                      color: questionCount === n ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      backgroundColor: questionCount === n ? 'rgba(192,132,252,0.1)' : 'transparent',
                    }}
                    onClick={() => setQuestionCount(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>
            )}

            <Button
              className="w-full"
              disabled={!sourceId || phase === 'generating'}
              onClick={startQuiz}
            >
              {phase === 'generating' ? (
                <><Loader2 size={14} className="mr-2 animate-spin" /> Generiere Fragen…</>
              ) : (
                'Quiz starten'
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Result phase ──────────────────────────────────────────────────────────
  if (phase === 'result') {
    const pct = Math.round((score / questions.length) * 100)
    const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
           style={{ backgroundColor: 'var(--color-bg)' }}>
        <p className="text-5xl">{emoji}</p>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          Quiz abgeschlossen!
        </h2>
        <div className="text-center">
          <p className="text-5xl font-bold" style={{ color: 'var(--color-primary)' }}>{pct}%</p>
          <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
            {score} von {questions.length} richtig
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => { setPhase('config'); setSourceId('') }}>
            Neues Quiz
          </Button>
          <Button onClick={() => navigate('/')}>
            Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // ── Session phase ─────────────────────────────────────────────────────────
  const currentQ = questions[currentIndex]
  if (!currentQ) return null

  const isCorrect = selectedAnswer === currentQ.correct_answer

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <header
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      >
        <button
          onClick={() => setPhase('config')}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          <ArrowLeft size={15} /> Abbrechen
        </button>
        <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
          {currentIndex + 1} / {questions.length}
        </span>
      </header>

      {/* Progress bar */}
      <div className="h-1" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${(currentIndex / questions.length) * 100}%`, backgroundColor: 'var(--color-primary)' }}
        />
      </div>

      <main className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-6 py-8 gap-6">
        {/* Question */}
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-3"
             style={{ color: 'var(--color-text-muted)' }}>
            Frage {currentIndex + 1}
          </p>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text)' }}>
            {currentQ.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {currentQ.options.map((option, i) => {
            let borderColor = 'var(--color-border)'
            let bg = 'transparent'
            let textColor = 'var(--color-text)'

            if (showFeedback) {
              if (option === currentQ.correct_answer) {
                borderColor = 'var(--color-success)'
                bg = 'rgba(74,222,128,0.1)'
              } else if (option === selectedAnswer && !isCorrect) {
                borderColor = 'var(--color-danger)'
                bg = 'rgba(248,113,113,0.1)'
                textColor = 'var(--color-danger)'
              }
            } else if (selectedAnswer === option) {
              borderColor = 'var(--color-primary)'
              bg = 'rgba(192,132,252,0.1)'
            }

            return (
              <button
                key={i}
                className="w-full text-left rounded-xl border px-4 py-3 text-sm transition-all"
                style={{ borderColor, backgroundColor: bg, color: textColor, cursor: showFeedback ? 'default' : 'pointer' }}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            )
          })}
        </div>

        {showFeedback && (
          <div className="flex justify-end">
            <Button onClick={handleNext}>
              {currentIndex + 1 >= questions.length ? 'Ergebnis' : 'Weiter'}
              <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
