interface StepIndicatorProps {
  current: number
  total: number
  labels: string[]
}

export default function StepIndicator({ current, total, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current
        const active = i === current
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
                style={{
                  backgroundColor: done
                    ? 'var(--color-primary)'
                    : active
                    ? 'var(--color-primary)'
                    : 'var(--color-surface-raised)',
                  color: done || active ? 'var(--color-bg)' : 'var(--color-text-muted)',
                  opacity: done ? 0.7 : 1,
                }}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className="text-xs hidden sm:block"
                style={{ color: active ? 'var(--color-text)' : 'var(--color-text-muted)' }}
              >
                {labels[i]}
              </span>
            </div>
            {i < total - 1 && (
              <div
                className="w-8 h-px mb-4"
                style={{ backgroundColor: i < current ? 'var(--color-primary)' : 'var(--color-border)' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
