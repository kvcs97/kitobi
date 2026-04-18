import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useNotes } from '@/hooks/useNotes'
import TipTapEditor from '@/components/notes/TipTapEditor'
import GenerateCardsDialog from '@/components/notes/GenerateCardsDialog'
import type { Database } from '@/types/database.types'

type Note = Database['public']['Tables']['notes']['Row']
type SaveStatus = 'idle' | 'pending' | 'saved' | 'error'

export default function NoteEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { update } = useNotes()

  const [title, setTitle] = useState('')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [genOpen, setGenOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<{ title: string; content: string }>({ title: '', content: '' })

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as Note
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      pendingRef.current = { title: note.title, content: note.content ?? '' }
    }
  }, [note?.id])

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  useEffect(() => {
    if (isError) navigate('/notes', { replace: true })
  }, [isError, navigate])

  function scheduleAutoSave(newTitle: string, newContent: string) {
    pendingRef.current = { title: newTitle, content: newContent }
    if (timerRef.current) clearTimeout(timerRef.current)
    setSaveStatus('pending')
    timerRef.current = setTimeout(() => {
      if (!id) return
      update.mutate(
        { id, title: pendingRef.current.title, content: pendingRef.current.content },
        {
          onSuccess: () => {
            setSaveStatus('saved')
            timerRef.current = setTimeout(() => setSaveStatus('idle'), 2000)
          },
          onError: () => setSaveStatus('error'),
        }
      )
    }, 2000)
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setTitle(val)
    scheduleAutoSave(val, pendingRef.current.content)
  }

  function handleContentChange(html: string) {
    scheduleAutoSave(pendingRef.current.title, html)
  }

  if (isLoading || !note) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">
          <div className="h-5 w-32 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-surface)' }} />
          <div className="h-10 w-2/3 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-surface)' }} />
          <div className="h-96 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--color-surface)' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-3 border-b sticky top-0 z-10"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      >
        <button
          onClick={() => navigate('/notes')}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          <ArrowLeft size={15} />
          Notizen
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setGenOpen(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--color-primary)'
              e.currentTarget.style.color = 'var(--color-primary)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.color = 'var(--color-text-muted)'
            }}
          >
            <Sparkles size={12} />
            KI-Karten
          </button>
          <SaveIndicator status={saveStatus} />
        </div>
      </header>

      {/* Editor */}
      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-6 py-8">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Titel…"
          className="w-full bg-transparent border-none outline-none mb-6"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.875rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            caretColor: 'var(--color-primary)',
          }}
        />

        <div
          className="flex-1 rounded-xl border overflow-hidden"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          <TipTapEditor
            key={note.id}
            content={note.content ?? ''}
            onChange={handleContentChange}
          />
        </div>
      </main>

      <GenerateCardsDialog
        open={genOpen}
        onOpenChange={setGenOpen}
        noteContent={pendingRef.current.content || note.content || ''}
        noteSubjectId={note.subject_id}
      />
    </div>
  )
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'idle') return null

  const map: Record<Exclude<SaveStatus, 'idle'>, { text: string; color: string }> = {
    pending: { text: 'Wird gespeichert…', color: 'var(--color-text-muted)' },
    saved:   { text: 'Gespeichert',       color: 'var(--color-success)' },
    error:   { text: 'Fehler beim Speichern', color: 'var(--color-danger)' },
  }

  const { text, color } = map[status]
  return <span className="text-xs" style={{ color }}>{text}</span>
}
