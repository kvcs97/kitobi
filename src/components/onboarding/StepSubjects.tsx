import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { suggestSubjectsForProgram } from '@/lib/claude'

interface StepSubjectsProps {
  studyProgram: string
  subjects: string[]
  onChange: (subjects: string[]) => void
  onNext: () => void
  onBack: () => void
}

export default function StepSubjects({ studyProgram, subjects, onChange, onNext, onBack }: StepSubjectsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [customInput, setCustomInput] = useState('')

  async function loadSuggestions() {
    if (!studyProgram) return
    setLoadingSuggestions(true)
    try {
      const result = await suggestSubjectsForProgram(studyProgram)
      setSuggestions(result)
    } catch {
      // silently fail — user can still add subjects manually
    } finally {
      setLoadingSuggestions(false)
    }
  }

  function toggleSubject(subject: string) {
    if (subjects.includes(subject)) {
      onChange(subjects.filter(s => s !== subject))
    } else {
      onChange([...subjects, subject])
    }
  }

  function addCustom() {
    const trimmed = customInput.trim()
    if (trimmed && !subjects.includes(trimmed)) {
      onChange([...subjects, trimmed])
    }
    setCustomInput('')
  }

  function removeSubject(subject: string) {
    onChange(subjects.filter(s => s !== subject))
  }

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          Deine Fächer
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Welche Fächer lernst du gerade? Du kannst sie jederzeit ändern.
        </p>
      </div>

      {/* KI-Vorschläge */}
      {suggestions.length === 0 ? (
        <Button
          type="button"
          variant="outline"
          onClick={loadSuggestions}
          disabled={loadingSuggestions}
          className="w-full"
        >
          {loadingSuggestions ? 'KI lädt Vorschläge…' : `✨ KI-Vorschläge für ${studyProgram}`}
        </Button>
      ) : (
        <div className="space-y-2">
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Tippe auf ein Fach um es auszuwählen:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSubject(s)}
                className="px-3 py-1 rounded-full text-sm transition-all"
                style={{
                  backgroundColor: subjects.includes(s)
                    ? 'var(--color-primary)'
                    : 'var(--color-surface-raised)',
                  color: subjects.includes(s)
                    ? 'var(--color-bg)'
                    : 'var(--color-text)',
                  border: `1px solid ${subjects.includes(s) ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manuell hinzufügen */}
      <div className="flex gap-2">
        <Input
          placeholder="Fach manuell eingeben …"
          value={customInput}
          onChange={e => setCustomInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
        />
        <Button type="button" variant="outline" onClick={addCustom} disabled={!customInput.trim()}>
          +
        </Button>
      </div>

      {/* Ausgewählte Fächer */}
      {subjects.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Ausgewählt ({subjects.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {subjects.map(s => (
              <span
                key={s}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-bg)',
                }}
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeSubject(s)}
                  className="opacity-70 hover:opacity-100 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Zurück
        </Button>
        <Button type="button" onClick={onNext} className="flex-1">
          Weiter
        </Button>
      </div>
    </div>
  )
}
