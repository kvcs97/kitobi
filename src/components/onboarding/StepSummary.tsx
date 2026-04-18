import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { summarizeOnboardingSetup } from '@/lib/claude'

interface StepSummaryProps {
  name: string
  studyProgram: string
  semester: number
  subjects: string[]
  dailyGoalMin: number
  loading: boolean
  onFinish: () => void
  onBack: () => void
}

export default function StepSummary({
  name, studyProgram, semester, subjects, dailyGoalMin, loading, onFinish, onBack,
}: StepSummaryProps) {
  const [message, setMessage] = useState('')
  const [loadingMessage, setLoadingMessage] = useState(true)

  useEffect(() => {
    summarizeOnboardingSetup({ name, studyProgram, semester: semester || 1, subjects, dailyGoalMin })
      .then(setMessage)
      .catch(() => setMessage(`Alles bereit, ${name}! Viel Erfolg beim Lernen.`))
      .finally(() => setLoadingMessage(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          Alles bereit!
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Dein persönlicher Lernassistent ist eingerichtet.
        </p>
      </div>

      {/* Zusammenfassung */}
      <div
        className="rounded-xl p-4 space-y-2"
        style={{ backgroundColor: 'var(--color-surface-raised)' }}
      >
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>Name</span>
          <span style={{ color: 'var(--color-text)' }}>{name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>Studiengang</span>
          <span style={{ color: 'var(--color-text)' }}>{studyProgram}</span>
        </div>
        {semester > 0 && (
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--color-text-muted)' }}>Semester</span>
            <span style={{ color: 'var(--color-text)' }}>{semester}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>Fächer</span>
          <span style={{ color: 'var(--color-text)' }}>{subjects.length > 0 ? subjects.length : '—'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>Tägliches Ziel</span>
          <span style={{ color: 'var(--color-primary)' }}>{dailyGoalMin} min</span>
        </div>
      </div>

      {/* KI-Nachricht */}
      <div
        className="rounded-xl p-4 border"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-primary)',
        }}
      >
        {loadingMessage ? (
          <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
            <div
              className="w-4 h-4 rounded-full border-2 animate-spin shrink-0"
              style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}
            />
            <span className="text-sm">Kitobi schreibt dir eine Nachricht…</span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
            {message}
          </p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={loading}>
          Zurück
        </Button>
        <Button type="button" onClick={onFinish} className="flex-1" disabled={loading || loadingMessage}>
          {loading ? 'Wird gespeichert…' : 'Kitobi starten'}
        </Button>
      </div>
    </div>
  )
}
