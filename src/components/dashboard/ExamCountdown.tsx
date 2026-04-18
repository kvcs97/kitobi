interface ExamCountdownProps {
  name: string
  color: string
  daysLeft: number
  date: string
}

export function ExamCountdown({ name, color, daysLeft, date }: ExamCountdownProps) {
  const dateLabel = new Date(date).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const urgency =
    daysLeft <= 7
      ? 'var(--color-danger)'
      : daysLeft <= 21
        ? 'var(--color-warning)'
        : 'var(--color-success)'

  return (
    <div
      className="rounded-xl p-4 flex items-center justify-between"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            {name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {dateLabel}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: urgency }}>
          {daysLeft === 0 ? 'Heute!' : `${daysLeft}d`}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {daysLeft === 0 ? '' : 'verbleibend'}
        </p>
      </div>
    </div>
  )
}
