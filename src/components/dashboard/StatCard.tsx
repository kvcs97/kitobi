interface StatCardProps {
  icon: string
  label: string
  value: string
  accent: string
}

export function StatCard({ icon, label, value, accent }: StatCardProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accent}20` }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </p>
        <p
          className="text-2xl font-bold mt-0.5"
          style={{ fontFamily: 'var(--font-heading)', color: accent }}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
