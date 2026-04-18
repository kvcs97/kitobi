import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, GraduationCap, Pencil, Trash2, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useCards, useDeckStats } from '@/hooks/useFlashcards'
import { useSubjects } from '@/hooks/useSubjects'
import { Button } from '@/components/ui/button'
import CardDialog from '@/components/decks/CardDialog'
import type { Database } from '@/types/database.types'

type Deck = Database['public']['Tables']['flashcard_decks']['Row']
type Card = Database['public']['Tables']['flashcards']['Row']

export default function DeckDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: cards = [], isLoading, create, update, remove } = useCards(id)
  const { data: stats } = useDeckStats()
  const { data: subjects = [] } = useSubjects()

  const [createOpen, setCreateOpen] = useState(false)
  const [editCard, setEditCard] = useState<Card | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const { data: deck } = useQuery({
    queryKey: ['deck', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flashcard_decks')
        .select('*')
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as Deck
    },
    enabled: !!id,
  })

  const subject = deck?.subject_id ? subjects.find(s => s.id === deck.subject_id) : undefined
  const dueCount = id ? (stats?.due[id] ?? 0) : 0

  async function handleCreate(values: { front: string; back: string }) {
    await create.mutateAsync(values)
    setCreateOpen(false)
  }

  async function handleUpdate(values: { front: string; back: string }) {
    if (!editCard) return
    await update.mutateAsync({ id: editCard.id, ...values })
    setEditCard(null)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-3 border-b sticky top-0 z-10"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      >
        <button
          onClick={() => navigate('/decks')}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          <ArrowLeft size={15} />
          Decks
        </button>

        {dueCount > 0 && (
          <Button size="sm" onClick={() => navigate(`/study/${id}`)}>
            <GraduationCap size={14} className="mr-1.5" />
            {dueCount} fällig – Lernen
          </Button>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Deck title */}
        <div className="mb-8">
          {subject && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{subject.name}</span>
            </div>
          )}
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            {deck?.name ?? '…'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {cards.length} {cards.length === 1 ? 'Karte' : 'Karten'}
          </p>
        </div>

        {/* Add card button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'var(--color-text-muted)' }}>
            Karten
          </h2>
          <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
            <Plus size={14} className="mr-1" />
            Karte hinzufügen
          </Button>
        </div>

        {/* Card list */}
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl animate-pulse"
                   style={{ backgroundColor: 'var(--color-surface)' }} />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-16 space-y-3 rounded-xl border"
               style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-3xl">🃏</p>
            <p style={{ color: 'var(--color-text-muted)' }}>Noch keine Karten.</p>
            <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)}>
              Erste Karte erstellen
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {cards.map(card => (
              <CardRow
                key={card.id}
                card={card}
                confirmDelete={confirmDelete}
                onConfirmDelete={setConfirmDelete}
                onEdit={() => setEditCard(card)}
                onDelete={() => { remove.mutate(card.id); setConfirmDelete(null) }}
              />
            ))}
          </div>
        )}
      </main>

      <CardDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        loading={create.isPending}
      />
      <CardDialog
        open={!!editCard}
        onOpenChange={open => { if (!open) setEditCard(null) }}
        onSubmit={handleUpdate}
        loading={update.isPending}
        initial={editCard ?? undefined}
      />
    </div>
  )
}

// ── Card row ──────────────────────────────────────────────────────────────────

function CardRow({
  card,
  confirmDelete,
  onConfirmDelete,
  onEdit,
  onDelete,
}: {
  card: Card
  confirmDelete: string | null
  onConfirmDelete: (id: string | null) => void
  onEdit: () => void
  onDelete: () => void
}) {
  if (confirmDelete === card.id) {
    return (
      <div
        className="rounded-xl border px-4 py-3 flex items-center justify-between gap-3"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Karte löschen?</span>
        <div className="flex gap-2">
          <button
            className="text-sm px-3 py-1 rounded-lg"
            style={{ color: 'var(--color-danger)', backgroundColor: 'var(--color-surface-raised)' }}
            onClick={onDelete}
          >
            Löschen
          </button>
          <button
            className="text-sm px-3 py-1 rounded-lg"
            style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-raised)' }}
            onClick={() => onConfirmDelete(null)}
          >
            Nein
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group rounded-xl border px-4 py-3 flex items-start gap-4"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <div className="flex-1 grid grid-cols-2 gap-4 min-w-0">
        <p className="text-sm truncate" style={{ color: 'var(--color-text)' }}>{card.front}</p>
        <p className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>{card.back}</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          onClick={onEdit}
          title="Bearbeiten"
        >
          <Pencil size={13} />
        </button>
        <button
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-danger)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          onClick={() => onConfirmDelete(card.id)}
          title="Löschen"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
