import { useState } from 'react'
import { Button } from '@/components/ui/button'
import SubjectDialog from './SubjectDialog'
import { useSubjects } from '@/hooks/useSubjects'
import type { Database } from '@/types/database.types'

type Subject = Database['public']['Tables']['subjects']['Row']

interface SubjectListProps {
  onSelect?: (subject: Subject) => void
  selectedId?: string | null
}

export default function SubjectList({ onSelect, selectedId }: SubjectListProps) {
  const { data: subjects = [], isLoading, create, update, remove } = useSubjects()
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Subject | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
          FÄCHER
        </h2>
        <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
          + Neu
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 rounded-lg animate-pulse"
                 style={{ backgroundColor: 'var(--color-surface-raised)' }} />
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
          Noch keine Fächer. Leg dein erstes Fach an!
        </p>
      ) : (
        <ul className="space-y-1">
          {subjects.map(s => (
            <li key={s.id}>
              {confirmDelete === s.id ? (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: 'var(--color-surface-raised)' }}
                >
                  <span style={{ color: 'var(--color-text-muted)' }} className="flex-1">
                    Wirklich löschen?
                  </span>
                  <button
                    onClick={() => { remove.mutate(s.id); setConfirmDelete(null) }}
                    className="text-xs px-2 py-1 rounded"
                    style={{ color: 'var(--color-danger)' }}
                  >
                    Löschen
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="text-xs px-2 py-1 rounded"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Nein
                  </button>
                </div>
              ) : (
                <div
                  className="group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                  style={{
                    backgroundColor: selectedId === s.id
                      ? 'var(--color-surface-raised)'
                      : 'transparent',
                  }}
                  onClick={() => onSelect?.(s)}
                >
                  {/* Color dot */}
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color ?? '#C084FC' }}
                  />
                  <span className="flex-1 text-sm truncate" style={{ color: 'var(--color-text)' }}>
                    {s.name}
                  </span>
                  {/* Actions — visible on hover */}
                  <div className="hidden group-hover:flex gap-1">
                    <button
                      onClick={e => { e.stopPropagation(); setEditTarget(s) }}
                      className="text-xs px-1.5 py-0.5 rounded opacity-60 hover:opacity-100"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      ✎
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setConfirmDelete(s.id) }}
                      className="text-xs px-1.5 py-0.5 rounded opacity-60 hover:opacity-100"
                      style={{ color: 'var(--color-danger)' }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Create dialog */}
      <SubjectDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={async (name, color) => { await create.mutateAsync({ name, color }) }}
      />

      {/* Edit dialog */}
      <SubjectDialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSave={(name, color) => update.mutateAsync({ id: editTarget!.id, name, color })}
        initial={editTarget ? { name: editTarget.name, color: editTarget.color ?? '#C084FC' } : undefined}
        title="Fach bearbeiten"
      />
    </div>
  )
}
