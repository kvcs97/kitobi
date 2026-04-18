import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotes } from '@/hooks/useNotes'
import { useSubjects } from '@/hooks/useSubjects'
import SubjectList from '@/components/subjects/SubjectList'
import { Button } from '@/components/ui/button'
import type { Database } from '@/types/database.types'

type Subject = Database['public']['Tables']['subjects']['Row']

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function Notes() {
  const navigate = useNavigate()
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const { data: allNotes = [], isLoading, create } = useNotes()
  const { data: subjects = [] } = useSubjects()

  // Group notes: filter by selected subject or show all grouped
  const filteredNotes = selectedSubject
    ? allNotes.filter(n => n.subject_id === selectedSubject.id)
    : allNotes

  // For "all" view: group by subject
  const grouped = selectedSubject
    ? null
    : subjects.map(s => ({
        subject: s,
        notes: allNotes.filter(n => n.subject_id === s.id),
      })).concat([{
        subject: null as unknown as Subject,
        notes: allNotes.filter(n => n.subject_id === null),
      }]).filter(g => g.notes.length > 0)

  async function handleCreate() {
    const note = await create.mutateAsync({ subject_id: selectedSubject?.id ?? null })
    navigate(`/notes/${note.id}`)
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* Subjects sidebar */}
      <aside
        className="w-56 shrink-0 p-4 border-r hidden md:block"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      >
        <div className="mb-4">
          <button
            className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
            style={{
              backgroundColor: !selectedSubject ? 'var(--color-surface-raised)' : 'transparent',
              color: 'var(--color-text)',
            }}
            onClick={() => setSelectedSubject(null)}
          >
            Alle Notizen
          </button>
        </div>
        <SubjectList
          selectedId={selectedSubject?.id}
          onSelect={s => setSelectedSubject(prev => prev?.id === s.id ? null : s)}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            {selectedSubject ? selectedSubject.name : 'Notizen'}
          </h1>
          <Button onClick={handleCreate} disabled={create.isPending}>
            {create.isPending ? 'Erstelle…' : '+ Neue Notiz'}
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-xl animate-pulse"
                   style={{ backgroundColor: 'var(--color-surface)' }} />
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-4xl">📝</p>
            <p style={{ color: 'var(--color-text-muted)' }}>Noch keine Notizen.</p>
            <Button variant="outline" onClick={handleCreate}>Erste Notiz erstellen</Button>
          </div>
        ) : selectedSubject ? (
          // Single subject view — flat list
          <NoteGrid notes={filteredNotes} subjectColor={selectedSubject.color ?? '#C084FC'} />
        ) : (
          // All notes — grouped by subject
          <div className="space-y-8">
            {grouped?.map(g => (
              <section key={g.subject?.id ?? 'unsorted'}>
                <div className="flex items-center gap-2 mb-3">
                  {g.subject && (
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: g.subject.color ?? '#C084FC' }}
                    />
                  )}
                  <h2 className="text-sm font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--color-text-muted)' }}>
                    {g.subject?.name ?? 'Kein Fach'}
                  </h2>
                </div>
                <NoteGrid
                  notes={g.notes}
                  subjectColor={g.subject?.color ?? 'var(--color-border)'}
                />
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// ── Note card grid ────────────────────────────────────────────────────────────

function NoteGrid({
  notes,
  subjectColor,
}: {
  notes: Database['public']['Tables']['notes']['Row'][]
  subjectColor: string
}) {
  const navigate = useNavigate()
  const { remove } = useNotes()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {notes.map(note => (
        <div
          key={note.id}
          className="group relative rounded-xl p-4 cursor-pointer transition-colors border"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            borderLeftColor: subjectColor,
            borderLeftWidth: '3px',
          }}
          onClick={() => navigate(`/notes/${note.id}`)}
        >
          <h3
            className="font-medium text-sm truncate mb-1"
            style={{ color: 'var(--color-text)' }}
          >
            {note.title || 'Ohne Titel'}
          </h3>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {formatDate(note.updated_at)}
          </p>

          {/* Delete button */}
          {confirmDelete === note.id ? (
            <div
              className="absolute inset-0 flex items-center justify-center gap-3 rounded-xl"
              style={{ backgroundColor: 'var(--color-surface)' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="text-sm px-3 py-1 rounded-lg"
                style={{ color: 'var(--color-danger)', backgroundColor: 'var(--color-surface-raised)' }}
                onClick={() => { remove.mutate(note.id); setConfirmDelete(null) }}
              >
                Löschen
              </button>
              <button
                className="text-sm px-3 py-1 rounded-lg"
                style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-raised)' }}
                onClick={() => setConfirmDelete(null)}
              >
                Nein
              </button>
            </div>
          ) : (
            <button
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-xs px-1.5 py-0.5 rounded transition-opacity"
              style={{ color: 'var(--color-danger)' }}
              onClick={e => { e.stopPropagation(); setConfirmDelete(note.id) }}
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
