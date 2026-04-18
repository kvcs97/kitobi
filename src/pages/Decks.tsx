import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, GraduationCap } from 'lucide-react'
import { useDecks, useDeckStats } from '@/hooks/useFlashcards'
import { useSubjects } from '@/hooks/useSubjects'
import { Button } from '@/components/ui/button'
import DeckDialog from '@/components/decks/DeckDialog'
import type { Database } from '@/types/database.types'

type Deck = Database['public']['Tables']['flashcard_decks']['Row']
type Subject = Database['public']['Tables']['subjects']['Row']

export default function Decks() {
  const navigate = useNavigate()
  const { data: decks = [], isLoading, create, remove } = useDecks()
  const { data: stats } = useDeckStats()
  const { data: subjects = [] } = useSubjects()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const subjectMap = Object.fromEntries(subjects.map(s => [s.id, s]))

  async function handleCreate(values: { name: string; subject_id: string | null }) {
    await create.mutateAsync(values)
    setDialogOpen(false)
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            Karteikarten
          </h1>
          <Button onClick={() => setDialogOpen(true)}>+ Neues Deck</Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 rounded-xl animate-pulse"
                   style={{ backgroundColor: 'var(--color-surface)' }} />
            ))}
          </div>
        ) : decks.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-4xl">🃏</p>
            <p style={{ color: 'var(--color-text-muted)' }}>Noch keine Decks.</p>
            <Button variant="outline" onClick={() => setDialogOpen(true)}>Erstes Deck erstellen</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {decks.map(deck => (
              <DeckCard
                key={deck.id}
                deck={deck}
                subject={deck.subject_id ? subjectMap[deck.subject_id] : undefined}
                totalCards={stats?.total[deck.id] ?? 0}
                dueCards={stats?.due[deck.id] ?? 0}
                confirmDelete={confirmDelete}
                onConfirmDelete={setConfirmDelete}
                onDelete={id => { remove.mutate(id); setConfirmDelete(null) }}
                onOpen={() => navigate(`/decks/${deck.id}`)}
                onStudy={() => navigate(`/study/${deck.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <DeckDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
        loading={create.isPending}
      />
    </div>
  )
}

// ── Deck card ─────────────────────────────────────────────────────────────────

function DeckCard({
  deck,
  subject,
  totalCards,
  dueCards,
  confirmDelete,
  onConfirmDelete,
  onDelete,
  onOpen,
  onStudy,
}: {
  deck: Deck
  subject?: Subject
  totalCards: number
  dueCards: number
  confirmDelete: string | null
  onConfirmDelete: (id: string | null) => void
  onDelete: (id: string) => void
  onOpen: () => void
  onStudy: () => void
}) {
  const accentColor = subject?.color ?? 'var(--color-border)'

  if (confirmDelete === deck.id) {
    return (
      <div
        className="rounded-xl border p-4 flex flex-col items-center justify-center gap-3"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <p className="text-sm text-center" style={{ color: 'var(--color-text)' }}>
          Deck „{deck.name}" löschen?
        </p>
        <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
          Alle Karten werden mitgelöscht.
        </p>
        <div className="flex gap-2">
          <button
            className="text-sm px-3 py-1.5 rounded-lg"
            style={{ color: 'var(--color-danger)', backgroundColor: 'var(--color-surface-raised)' }}
            onClick={() => onDelete(deck.id)}
          >
            Löschen
          </button>
          <button
            className="text-sm px-3 py-1.5 rounded-lg"
            style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-raised)' }}
            onClick={() => onConfirmDelete(null)}
          >
            Abbrechen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group relative rounded-xl border overflow-hidden cursor-pointer transition-colors"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        borderTopColor: accentColor,
        borderTopWidth: '3px',
      }}
      onClick={onOpen}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h2
            className="font-semibold text-base leading-tight"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
          >
            {deck.name}
          </h2>
          <button
            className="opacity-0 group-hover:opacity-100 text-xs px-1.5 py-0.5 rounded transition-opacity shrink-0"
            style={{ color: 'var(--color-danger)' }}
            onClick={e => { e.stopPropagation(); onConfirmDelete(deck.id) }}
          >
            ✕
          </button>
        </div>

        {subject && (
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: subject.color }} />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{subject.name}</span>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
          <span className="flex items-center gap-1">
            <BookOpen size={12} />
            {totalCards} Karten
          </span>
          {dueCards > 0 && (
            <span className="font-medium" style={{ color: 'var(--color-warning)' }}>
              {dueCards} fällig
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 text-xs py-1.5 rounded-lg border transition-colors"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
              backgroundColor: 'transparent',
            }}
            onClick={e => { e.stopPropagation(); onOpen() }}
          >
            Karten
          </button>
          {dueCards > 0 && (
            <button
              className="flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#0F0F13',
              }}
              onClick={e => { e.stopPropagation(); onStudy() }}
            >
              <GraduationCap size={12} className="inline mr-1" />
              Lernen
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
