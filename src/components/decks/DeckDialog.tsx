import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSubjects } from '@/hooks/useSubjects'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: { name: string; subject_id: string | null }) => void
  loading?: boolean
}

export default function DeckDialog({ open, onOpenChange, onSubmit, loading }: Props) {
  const { data: subjects = [] } = useSubjects()
  const [name, setName] = useState('')
  const [subjectId, setSubjectId] = useState<string>('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), subject_id: subjectId || null })
    setName('')
    setSubjectId('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <DialogHeader>
          <DialogTitle style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
            Neues Deck
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label style={{ color: 'var(--color-text-muted)' }}>Name</Label>
            <Input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="z.B. Anatomie Grundlagen"
              style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            />
          </div>

          {subjects.length > 0 && (
            <div className="space-y-1.5">
              <Label style={{ color: 'var(--color-text-muted)' }}>Fach (optional)</Label>
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm outline-none"
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderColor: 'var(--color-border)',
                  color: subjectId ? 'var(--color-text)' : 'var(--color-text-muted)',
                }}
              >
                <option value="">Kein Fach</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={!name.trim() || loading}>
              {loading ? 'Erstelle…' : 'Deck erstellen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
