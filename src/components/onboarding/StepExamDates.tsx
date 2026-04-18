import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export interface ExamDate {
  subject: string
  date: string
}

interface StepExamDatesProps {
  subjects: string[]
  examDates: ExamDate[]
  onChange: (dates: ExamDate[]) => void
  onNext: () => void
  onBack: () => void
}

export default function StepExamDates({ subjects, examDates, onChange, onNext, onBack }: StepExamDatesProps) {
  const [customSubject, setCustomSubject] = useState('')
  const [customDate, setCustomDate] = useState('')

  function setDate(subject: string, date: string) {
    const existing = examDates.filter(d => d.subject !== subject)
    if (date) {
      onChange([...existing, { subject, date }])
    } else {
      onChange(existing)
    }
  }

  function getDate(subject: string) {
    return examDates.find(d => d.subject === subject)?.date ?? ''
  }

  function addCustom() {
    const s = customSubject.trim()
    const d = customDate.trim()
    if (s && d) {
      setDate(s, d)
      setCustomSubject('')
      setCustomDate('')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          Prüfungstermine
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Trage bekannte Prüfungsdaten ein — du kannst sie später jederzeit ergänzen.
        </p>
      </div>

      {/* Termine für ausgewählte Fächer */}
      {subjects.length > 0 && (
        <div className="space-y-3">
          {subjects.map(subject => (
            <div key={subject} className="flex items-center gap-3">
              <Label className="w-40 shrink-0 truncate">{subject}</Label>
              <Input
                type="date"
                value={getDate(subject)}
                onChange={e => setDate(subject, e.target.value)}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      )}

      {/* Weiteres Fach + Datum */}
      <div
        className="rounded-lg p-3 space-y-3"
        style={{ backgroundColor: 'var(--color-surface-raised)' }}
      >
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Weiteres Fach hinzufügen:</p>
        <div className="flex gap-2">
          <Input
            placeholder="Fach"
            value={customSubject}
            onChange={e => setCustomSubject(e.target.value)}
            className="flex-1"
          />
          <Input
            type="date"
            value={customDate}
            onChange={e => setCustomDate(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addCustom}
            disabled={!customSubject.trim() || !customDate.trim()}
          >
            +
          </Button>
        </div>
      </div>

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
