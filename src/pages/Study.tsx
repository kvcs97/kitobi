import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useFSRS, Rating, type Grade, type RatingPreview } from '@/hooks/useFSRS'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import type { Database } from '@/types/database.types'

type DbCard = Database['public']['Tables']['flashcards']['Row']
type Deck = Database['public']['Tables']['flashcard_decks']['Row']

const RATING_CONFIG: Record<Grade, { label: string; color: string; bg: string }> = {
  [Rating.Again]: { label: 'Nochmal', color: 'var(--color-danger)',   bg: 'rgba(248,113,113,0.12)' },
  [Rating.Hard]:  { label: 'Schwer',  color: 'var(--color-warning)',  bg: 'rgba(250,204,21,0.12)' },
  [Rating.Good]:  { label: 'Gut',     color: 'var(--color-success)',  bg: 'rgba(74,222,128,0.12)' },
  [Rating.Easy]:  { label: 'Einfach', color: 'var(--color-secondary)',bg: 'rgba(103,232,249,0.12)' },
}

export default function Study() {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { user } = useAuthStore()
  const { preview, rate } = useFSRS()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [phase, setPhase] = useState<'studying' | 'done'>('studying')
  const [reviewed, setReviewed] = useState(0)
  const [saving, setSaving] = useState(false)
  const sessionStart = useRef(Date.now())

  const { data: deck } = useQuery({
    queryKey: ['deck', deckId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flashcard_decks')
        .select('*')
        .eq('id', deckId!)
        .single()
      if (error) throw error
      return data as Deck
    },
    enabled: !!deckId,
  })

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['due-cards', deckId],
    queryFn: async () => {
      const now = new Date().toISOString()
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('deck_id', deckId!)
        .lte('due_date', now)
        .order('due_date', { ascending: true })
      if (error) throw error
      return data as DbCard[]
    },
    enabled: !!deckId,
    staleTime: Infinity,
  })

  const currentCard = cards[currentIndex] ?? null
  const previews: RatingPreview[] = currentCard ? preview(currentCard) : []

  // 5.5 – Keyboard navigation: Space = flip, 1-4 = rate
  useEffect(() => {
    if (phase !== 'studying') return
    const KEY_RATINGS: Record<string, Grade> = {
      '1': Rating.Again, '2': Rating.Hard, '3': Rating.Good, '4': Rating.Easy,
    }
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.code === 'Space') {
        e.preventDefault()
        if (!flipped) setFlipped(true)
      } else if (flipped && KEY_RATINGS[e.key]) {
        handleRate(KEY_RATINGS[e.key])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, flipped])

  async function handleRate(rating: Grade) {
    if (!currentCard || saving) return
    setSaving(true)

    const update = rate(currentCard, rating)
    await supabase.from('flashcards').update(update).eq('id', currentCard.id)

    const nextReviewed = reviewed + 1
    setReviewed(nextReviewed)

    if (currentIndex + 1 >= cards.length) {
      await saveStudyLog(nextReviewed)
      qc.invalidateQueries({ queryKey: ['deck-stats'] })
      qc.invalidateQueries({ queryKey: ['cards', deckId] })
      qc.invalidateQueries({ queryKey: ['streak'] })
      toast.success(`${nextReviewed} Karte${nextReviewed !== 1 ? 'n' : ''} gelernt! 🔥`)
      setPhase('done')
    } else {
      setCurrentIndex(i => i + 1)
      setFlipped(false)
    }
    setSaving(false)
  }

  async function saveStudyLog(cardCount: number) {
    if (!user) return
    const durationMin = Math.max(1, Math.round((Date.now() - sessionStart.current) / 60_000))
    await supabase.from('study_logs').insert({
      user_id: user.id,
      subject_id: deck?.subject_id ?? null,
      date: new Date().toISOString().split('T')[0],
      duration_min: durationMin,
      cards_reviewed: cardCount,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="w-full max-w-lg px-6 space-y-4">
          <div className="h-6 w-40 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-surface)' }} />
          <div className="h-60 rounded-2xl animate-pulse" style={{ backgroundColor: 'var(--color-surface)' }} />
        </div>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6"
           style={{ backgroundColor: 'var(--color-bg)' }}>
        <p className="text-5xl">🎉</p>
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          Keine Karten fällig!
        </h2>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Alle Karten in diesem Deck sind auf dem neuesten Stand.
        </p>
        <Button variant="outline" onClick={() => navigate(`/decks/${deckId}`)}>
          <ArrowLeft size={14} className="mr-1.5" /> Zurück zum Deck
        </Button>
      </div>
    )
  }

  if (phase === 'done') {
    const durationMin = Math.max(1, Math.round((Date.now() - sessionStart.current) / 60_000))
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
           style={{ backgroundColor: 'var(--color-bg)' }}>
        <p className="text-5xl">✅</p>
        <h2 className="text-2xl font-bold text-center"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          Session abgeschlossen!
        </h2>
        <div className="flex gap-8 text-center">
          <div>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{reviewed}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Karten</p>
          </div>
          <div>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{durationMin}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Minuten</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/decks')}>
            <ArrowLeft size={14} className="mr-1.5" /> Decks
          </Button>
          <Button onClick={() => {
            setCurrentIndex(0)
            setFlipped(false)
            setReviewed(0)
            sessionStart.current = Date.now()
            setPhase('studying')
            qc.invalidateQueries({ queryKey: ['due-cards', deckId] })
          }}>
            <RotateCcw size={14} className="mr-1.5" /> Nochmal
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      >
        <button
          onClick={() => navigate(`/decks/${deckId}`)}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          <ArrowLeft size={15} />
          {deck?.name ?? 'Deck'}
        </button>

        <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
          {currentIndex + 1} / {cards.length}
        </span>
      </header>

      {/* Progress bar */}
      <div className="h-1 w-full" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${((currentIndex) / cards.length) * 100}%`,
            backgroundColor: 'var(--color-primary)',
          }}
        />
      </div>

      {/* Card area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-8">
        {/* Flashcard */}
        <div
          className="card-3d w-full max-w-lg cursor-pointer select-none"
          style={{ height: '260px' }}
          onClick={() => !flipped && setFlipped(true)}
        >
          <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
            {/* Front */}
            <div
              className="card-face rounded-2xl border flex flex-col items-center justify-center p-8"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <p className="text-lg text-center leading-relaxed" style={{ color: 'var(--color-text)' }}>
                {currentCard?.front}
              </p>
              {!flipped && (
                <p className="mt-6 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Klicken zum Umdrehen
                </p>
              )}
            </div>

            {/* Back */}
            <div
              className="card-face rounded-2xl border flex flex-col p-8 overflow-y-auto"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-primary)',
                borderWidth: '1.5px',
              }}
            >
              <p className="text-sm text-center mb-4" style={{ color: 'var(--color-text-muted)' }}>
                {currentCard?.front}
              </p>
              <div className="w-full h-px mb-4" style={{ backgroundColor: 'var(--color-border)' }} />
              <p className="text-base text-center flex-1 flex items-center justify-center leading-relaxed"
                 style={{ color: 'var(--color-text)' }}>
                {currentCard?.back}
              </p>
            </div>
          </div>
        </div>

        {/* Rating buttons (only visible when flipped) */}
        {flipped && (
          <div className="grid grid-cols-4 gap-3 w-full max-w-lg">
            {previews.map(({ rating, intervalLabel }) => {
              const cfg = RATING_CONFIG[rating]
              return (
                <button
                  key={rating}
                  disabled={saving}
                  onClick={() => handleRate(rating)}
                  className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all"
                  style={{
                    borderColor: cfg.color,
                    backgroundColor: cfg.bg,
                    opacity: saving ? 0.6 : 1,
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  <span className="font-semibold text-sm" style={{ color: cfg.color }}>{cfg.label}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{intervalLabel}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Flip hint when not flipped */}
        {!flipped && (
          <Button onClick={() => setFlipped(true)} variant="outline">
            Umdrehen
          </Button>
        )}
      </main>
    </div>
  )
}
