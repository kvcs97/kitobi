import { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { generateFlashcards } from '@/lib/claude'
import { useDecks } from '@/hooks/useFlashcards'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'

function htmlToText(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  noteContent: string
  noteSubjectId: string | null
}

type GeneratedCard = { front: string; back: string }

export default function GenerateCardsDialog({ open, onOpenChange, noteContent, noteSubjectId }: Props) {
  const { user } = useAuthStore()
  const { data: decks = [], create: createDeck } = useDecks()


  const [step, setStep] = useState<'idle' | 'generating' | 'review' | 'saving' | 'done'>('idle')
  const [cards, setCards] = useState<GeneratedCard[]>([])
  const [targetDeckId, setTargetDeckId] = useState('')
  const [newDeckName, setNewDeckName] = useState('')
  const [useNewDeck, setUseNewDeck] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setStep('generating')
    setError(null)
    try {
      const text = htmlToText(noteContent)
      if (!text.trim()) throw new Error('Notiz ist leer')
      const result = await generateFlashcards(text)
      if (!result || result.length === 0) throw new Error('Keine Karten generiert')
      setCards(result)
      setStep('review')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Generieren')
      setStep('idle')
    }
  }

  async function handleSave() {
    if (!user) return
    setStep('saving')
    try {
      let deckId = targetDeckId
      if (useNewDeck) {
        const name = newDeckName.trim() || 'Neue Karteikarten'
        const deck = await createDeck.mutateAsync({ name, subject_id: noteSubjectId })
        deckId = deck.id
      }
      if (!deckId) throw new Error('Kein Deck ausgewählt')

      const now = new Date().toISOString()
      await supabase.from('flashcards').insert(
        cards.map(c => ({
          deck_id: deckId,
          front: c.front,
          back: c.back,
          due_date: now,
          stability: 0,
          difficulty: 0,
          state: 0,
          reps: 0,
          lapses: 0,
        }))
      )
      toast.success(`${cards.length} Karte${cards.length !== 1 ? 'n' : ''} gespeichert! ✨`)
      setStep('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Speichern')
      setStep('review')
    }
  }

  function handleClose() {
    setStep('idle')
    setCards([])
    setTargetDeckId('')
    setNewDeckName('')
    setUseNewDeck(false)
    setError(null)
    onOpenChange(false)
  }

  function removeCard(i: number) {
    setCards(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-lg"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
            <span className="flex items-center gap-2">
              <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
              KI-Karten generieren
            </span>
          </DialogTitle>
        </DialogHeader>

        {step === 'idle' && (
          <div className="mt-2 space-y-4">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Claude erstellt Karteikarten aus dem Inhalt dieser Notiz.
            </p>
            {error && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>Abbrechen</Button>
              <Button onClick={handleGenerate}>Karten generieren</Button>
            </div>
          </div>
        )}

        {step === 'generating' && (
          <div className="mt-4 flex flex-col items-center gap-3 py-6">
            <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Claude generiert Karten…
            </p>
          </div>
        )}

        {(step === 'review' || step === 'saving') && (
          <div className="mt-2 space-y-4">
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {cards.length} Karten generiert – unerwünschte Karten entfernen, dann Deck auswählen und speichern.
            </p>

            {/* Generated cards list */}
            <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
              {cards.map((card, i) => (
                <div
                  key={i}
                  className="rounded-lg border px-3 py-2 flex items-start gap-3"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--color-text)' }}>{card.front}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{card.back}</p>
                  </div>
                  <button
                    className="text-xs shrink-0 mt-0.5"
                    style={{ color: 'var(--color-danger)' }}
                    onClick={() => removeCard(i)}
                  >✕</button>
                </div>
              ))}
            </div>

            {/* Deck selector */}
            <div className="space-y-2">
              <Label style={{ color: 'var(--color-text-muted)' }}>Deck</Label>
              <div className="flex gap-2">
                <button
                  className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
                  style={{
                    borderColor: !useNewDeck ? 'var(--color-primary)' : 'var(--color-border)',
                    color: !useNewDeck ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  }}
                  onClick={() => setUseNewDeck(false)}
                >
                  Bestehendes Deck
                </button>
                <button
                  className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
                  style={{
                    borderColor: useNewDeck ? 'var(--color-primary)' : 'var(--color-border)',
                    color: useNewDeck ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  }}
                  onClick={() => setUseNewDeck(true)}
                >
                  Neues Deck
                </button>
              </div>

              {useNewDeck ? (
                <input
                  type="text"
                  value={newDeckName}
                  onChange={e => setNewDeckName(e.target.value)}
                  placeholder="Name des neuen Decks…"
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--color-surface-raised)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              ) : (
                <select
                  value={targetDeckId}
                  onChange={e => setTargetDeckId(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--color-surface-raised)',
                    borderColor: 'var(--color-border)',
                    color: targetDeckId ? 'var(--color-text)' : 'var(--color-text-muted)',
                  }}
                >
                  <option value="">— Deck auswählen —</option>
                  {decks.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              )}
            </div>

            {error && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>Abbrechen</Button>
              <Button
                disabled={
                  step === 'saving' || cards.length === 0 ||
                  (!useNewDeck && !targetDeckId)
                }
                onClick={handleSave}
              >
                {step === 'saving' ? (
                  <><Loader2 size={13} className="mr-1.5 animate-spin" /> Speichern…</>
                ) : (
                  `${cards.length} Karten speichern`
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="mt-4 flex flex-col items-center gap-3 py-4">
            <p className="text-3xl">✅</p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              {cards.length} Karten gespeichert!
            </p>
            <Button onClick={handleClose}>Fertig</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
