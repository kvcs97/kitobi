import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { Database } from '@/types/database.types'

type Card = Database['public']['Tables']['flashcards']['Row']

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: { front: string; back: string }) => void
  loading?: boolean
  initial?: Pick<Card, 'front' | 'back'>
}

export default function CardDialog({ open, onOpenChange, onSubmit, loading, initial }: Props) {
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')

  useEffect(() => {
    if (open) {
      setFront(initial?.front ?? '')
      setBack(initial?.back ?? '')
    }
  }, [open, initial])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!front.trim() || !back.trim()) return
    onSubmit({ front: front.trim(), back: back.trim() })
  }

  const isEdit = !!initial

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
            {isEdit ? 'Karte bearbeiten' : 'Neue Karte'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label style={{ color: 'var(--color-text-muted)' }}>Vorderseite</Label>
            <textarea
              autoFocus
              value={front}
              onChange={e => setFront(e.target.value)}
              placeholder="Frage oder Begriff…"
              rows={3}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none resize-none"
              style={{
                backgroundColor: 'var(--color-surface-raised)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label style={{ color: 'var(--color-text-muted)' }}>Rückseite</Label>
            <textarea
              value={back}
              onChange={e => setBack(e.target.value)}
              placeholder="Antwort oder Definition…"
              rows={3}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none resize-none"
              style={{
                backgroundColor: 'var(--color-surface-raised)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={!front.trim() || !back.trim() || loading}>
              {loading ? 'Speichern…' : isEdit ? 'Speichern' : 'Karte erstellen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
