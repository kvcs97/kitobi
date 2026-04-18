import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Target } from 'lucide-react'
import { useSubjects } from '@/hooks/useSubjects'
import { useDecks, useDeckStats } from '@/hooks/useFlashcards'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember']

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function firstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return (d + 6) % 7  // Monday = 0
}

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function Planner() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [editSubjectId, setEditSubjectId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState('')

  const { data: subjects = [], update: updateSubject } = useSubjects()
  const { data: decks = [] } = useDecks()
  const { data: stats } = useDeckStats()

  // exam dates keyed by date string
  const examsByDate = useMemo(() => {
    const map: Record<string, typeof subjects> = {}
    for (const s of subjects) {
      if (s.exam_date) {
        const d = s.exam_date.split('T')[0]
        map[d] = [...(map[d] ?? []), s]
      }
    }
    return map
  }, [subjects])

  // upcoming exams + daily goals
  const todayStr = isoDate(today.getFullYear(), today.getMonth(), today.getDate())

  const upcomingExams = useMemo(() => {
    return subjects
      .filter(s => s.exam_date && s.exam_date.split('T')[0] >= todayStr)
      .sort((a, b) => (a.exam_date ?? '').localeCompare(b.exam_date ?? ''))
      .map(s => {
        const examDate = new Date(s.exam_date!)
        const daysLeft = Math.max(1, Math.ceil((examDate.getTime() - today.getTime()) / 86_400_000))
        const subjectDecks = decks.filter(d => d.subject_id === s.id)
        const totalCards = subjectDecks.reduce((sum, d) => sum + (stats?.total[d.id] ?? 0), 0)
        const dueCards = subjectDecks.reduce((sum, d) => sum + (stats?.due[d.id] ?? 0), 0)
        const dailyGoal = totalCards > 0 ? Math.ceil(dueCards / daysLeft) : 0
        return { subject: s, daysLeft, totalCards, dueCards, dailyGoal }
      })
  }, [subjects, decks, stats, todayStr])

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  function openEdit(subjectId: string, currentDate: string | null) {
    setEditSubjectId(subjectId)
    setEditDate(currentDate ? currentDate.split('T')[0] : '')
  }

  async function saveExamDate() {
    if (!editSubjectId) return
    await updateSubject.mutateAsync({ id: editSubjectId, exam_date: editDate || null } as Parameters<typeof updateSubject.mutateAsync>[0])
    setEditSubjectId(null)
  }

  const totalDays = daysInMonth(viewYear, viewMonth)
  const startOffset = firstDayOfMonth(viewYear, viewMonth)
  const cells = Array.from({ length: startOffset + totalDays }, (_, i) =>
    i < startOffset ? null : i - startOffset + 1
  )

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-8"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          Lernplaner
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div
            className="lg:col-span-2 rounded-2xl border p-6"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                onClick={prevMonth}
              >
                <ChevronLeft size={18} />
              </button>
              <h2 className="font-semibold text-base"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                {MONTHS[viewMonth]} {viewYear}
              </h2>
              <button
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                onClick={nextMonth}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map(d => (
                <div key={d} className="text-center text-xs font-semibold py-1"
                     style={{ color: 'var(--color-text-muted)' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />
                const dateStr = isoDate(viewYear, viewMonth, day)
                const isToday = dateStr === todayStr
                const exams = examsByDate[dateStr] ?? []

                return (
                  <div
                    key={dateStr}
                    className="relative rounded-lg p-1 min-h-[52px] flex flex-col"
                    style={{
                      backgroundColor: isToday ? 'rgba(192,132,252,0.15)' : 'transparent',
                      border: isToday ? '1.5px solid var(--color-primary)' : '1.5px solid transparent',
                    }}
                  >
                    <span
                      className="text-xs font-medium mb-1 w-5 h-5 flex items-center justify-center rounded-full"
                      style={{
                        color: isToday ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        fontWeight: isToday ? 700 : 400,
                      }}
                    >
                      {day}
                    </span>
                    {exams.map(s => (
                      <span
                        key={s.id}
                        className="text-[9px] px-1 py-0.5 rounded truncate leading-tight"
                        style={{ backgroundColor: s.color + '33', color: s.color }}
                        title={s.name}
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sidebar: exams + goals */}
          <div className="space-y-4">
            <div
              className="rounded-2xl border p-5"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-4"
                  style={{ color: 'var(--color-text)' }}>
                <Calendar size={14} style={{ color: 'var(--color-primary)' }} />
                Prüfungstermine
              </h3>

              {subjects.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Keine Fächer.</p>
              ) : (
                <div className="space-y-2">
                  {subjects.map(s => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-2 py-1"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-sm truncate" style={{ color: 'var(--color-text)' }}>{s.name}</span>
                      </div>
                      <button
                        className="text-xs shrink-0 px-2 py-0.5 rounded-lg"
                        style={{
                          color: s.exam_date ? 'var(--color-text-muted)' : 'var(--color-primary)',
                          backgroundColor: 'var(--color-surface-raised)',
                        }}
                        onClick={() => openEdit(s.id, s.exam_date)}
                      >
                        {s.exam_date ? new Date(s.exam_date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }) : '+ Datum'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily goals */}
            {upcomingExams.length > 0 && (
              <div
                className="rounded-2xl border p-5"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-4"
                    style={{ color: 'var(--color-text)' }}>
                  <Target size={14} style={{ color: 'var(--color-primary)' }} />
                  Tägliche Ziele
                </h3>
                <div className="space-y-3">
                  {upcomingExams.map(({ subject, daysLeft, dueCards, dailyGoal }) => (
                    <div key={subject.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: subject.color }} />
                          <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>
                            {subject.name}
                          </span>
                        </div>
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          {daysLeft} {daysLeft === 1 ? 'Tag' : 'Tage'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          {dueCards} fällige Karten
                        </span>
                        {dailyGoal > 0 && (
                          <span className="text-xs font-semibold" style={{ color: subject.color }}>
                            ~{dailyGoal}/Tag
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit exam date dialog */}
      <Dialog open={!!editSubjectId} onOpenChange={open => { if (!open) setEditSubjectId(null) }}>
        <DialogContent style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>
              Prüfungstermin bearbeiten
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label style={{ color: 'var(--color-text-muted)' }}>
                {subjects.find(s => s.id === editSubjectId)?.name}
              </Label>
              <Input
                type="date"
                value={editDate}
                onChange={e => setEditDate(e.target.value)}
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>
            <div className="flex justify-between">
              {editDate && (
                <Button
                  variant="outline"
                  onClick={() => { setEditDate(''); saveExamDate() }}
                >
                  Datum entfernen
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" onClick={() => setEditSubjectId(null)}>Abbrechen</Button>
                <Button onClick={saveExamDate} disabled={updateSubject.isPending}>Speichern</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
