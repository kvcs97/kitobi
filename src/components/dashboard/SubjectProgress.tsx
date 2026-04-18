interface SubjectProgressProps {
  name: string
  color: string
  due: number
  total: number
}

export function SubjectProgress({ name, color, due, total }: SubjectProgressProps) {
  const done = Math.max(0, total - due)
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            {name}
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {total === 0 ? 'Keine Karten' : due > 0 ? `${due} fällig` : 'Alles erledigt ✓'}
        </span>
      </div>
      <div
        className="w-full h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface-raised)' }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            backgroundColor: due === 0 ? 'var(--color-success)' : color,
            transition: 'var(--transition-normal)',
          }}
        />
      </div>
    </div>
  )
}
