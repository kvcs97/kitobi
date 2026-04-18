import { Button } from '@/components/ui/button'

const GOAL_OPTIONS = [15, 30, 45, 60, 90]
const DAYS_OPTIONS = [3, 7, 14, 21, 30]

interface StepGoalsProps {
  dailyGoalMin: number
  daysBeforeExam: number
  onChange: (field: 'dailyGoalMin' | 'daysBeforeExam', value: number) => void
  onNext: () => void
  onBack: () => void
}

export default function StepGoals({ dailyGoalMin, daysBeforeExam, onChange, onNext, onBack }: StepGoalsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2
          className="text-xl font-semibold mb-1"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          Deine Lernziele
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Kitobi plant deinen Lernplan automatisch auf Basis dieser Angaben.
        </p>
      </div>

      {/* Tägliches Ziel */}
      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
          Wie viele Minuten willst du täglich lernen?
        </p>
        <div className="flex flex-wrap gap-2">
          {GOAL_OPTIONS.map(min => (
            <button
              key={min}
              type="button"
              onClick={() => onChange('dailyGoalMin', min)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: dailyGoalMin === min
                  ? 'var(--color-primary)'
                  : 'var(--color-surface-raised)',
                color: dailyGoalMin === min
                  ? 'var(--color-bg)'
                  : 'var(--color-text)',
                border: `1px solid ${dailyGoalMin === min ? 'var(--color-primary)' : 'var(--color-border)'}`,
              }}
            >
              {min} min
            </button>
          ))}
        </div>
      </div>

      {/* Tage vor Prüfung */}
      <div className="space-y-3">
        <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
          Wie viele Tage vor einer Prüfung willst du anfangen?
        </p>
        <div className="flex flex-wrap gap-2">
          {DAYS_OPTIONS.map(days => (
            <button
              key={days}
              type="button"
              onClick={() => onChange('daysBeforeExam', days)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: daysBeforeExam === days
                  ? 'var(--color-primary)'
                  : 'var(--color-surface-raised)',
                color: daysBeforeExam === days
                  ? 'var(--color-bg)'
                  : 'var(--color-text)',
                border: `1px solid ${daysBeforeExam === days ? 'var(--color-primary)' : 'var(--color-border)'}`,
              }}
            >
              {days} Tage
            </button>
          ))}
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
