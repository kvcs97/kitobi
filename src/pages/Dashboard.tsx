import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { useStreak } from '@/hooks/useStudyStats'
import { useSubjects } from '@/hooks/useSubjects'
import { useDecks, useDeckStats } from '@/hooks/useFlashcards'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/dashboard/StatCard'
import { SubjectProgress } from '@/components/dashboard/SubjectProgress'
import { ExamCountdown } from '@/components/dashboard/ExamCountdown'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('id', user!.id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const { data: streakData, isLoading: streakLoading } = useStreak()
  const { data: subjects, isLoading: subjectsLoading } = useSubjects()
  const { data: decks, isLoading: decksLoading } = useDecks()
  const { data: deckStats, isLoading: statsLoading } = useDeckStats()

  const isLoading = streakLoading || subjectsLoading || decksLoading || statsLoading

  const totalDue = deckStats
    ? Object.values(deckStats.due).reduce((s, v) => s + v, 0)
    : 0

  const subjectStats =
    subjects?.map(subject => {
      const subjectDecks = decks?.filter(d => d.subject_id === subject.id) ?? []
      const due = subjectDecks.reduce((s, d) => s + (deckStats?.due[d.id] ?? 0), 0)
      const total = subjectDecks.reduce((s, d) => s + (deckStats?.total[d.id] ?? 0), 0)
      return { ...subject, due, total }
    }) ?? []

  const today = new Date().toISOString().split('T')[0]
  const upcomingExams =
    subjects
      ?.filter(s => s.exam_date && s.exam_date >= today)
      .sort((a, b) => (a.exam_date! < b.exam_date! ? -1 : 1))
      .slice(0, 3) ?? []

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'
  const dateStr = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2">
            <div className="h-8 w-64 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-surface)' }} />
            <div className="h-4 w-40 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--color-surface)' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--color-surface)' }} />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-5 w-36 rounded animate-pulse" style={{ backgroundColor: 'var(--color-surface)' }} />
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--color-surface)' }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Greeting */}
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
          >
            {greeting}{profile?.name ? `, ${profile.name}` : ''} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {dateStr}
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon="🔥"
            label="Streak"
            value={`${streakData?.streak ?? 0} Tage`}
            accent="var(--color-warning)"
          />
          <StatCard
            icon="📅"
            label="Fällig heute"
            value={String(totalDue)}
            accent="var(--color-secondary)"
          />
          <StatCard
            icon="✅"
            label="Heute erledigt"
            value={String(streakData?.reviewedToday ?? 0)}
            accent="var(--color-success)"
          />
        </div>

        {/* Empty state when no subjects */}
        {(subjects?.length ?? 0) === 0 && (
          <div
            className="rounded-xl p-8 text-center border border-dashed"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <p className="text-4xl mb-3">🎓</p>
            <p className="font-semibold mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
              Noch keine Fächer eingerichtet
            </p>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Füge Fächer hinzu, um deinen Lernfortschritt zu sehen.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/notes')}
            >
              Jetzt starten
            </Button>
          </div>
        )}

        {/* CTA */}
        {totalDue > 0 && (
          <Button
            className="w-full text-base font-semibold h-12"
            style={{ backgroundColor: 'var(--color-primary)', color: '#0F0F13' }}
            onClick={() => navigate('/decks')}
          >
            ▶ Lernen starten – {totalDue} Karte{totalDue !== 1 ? 'n' : ''} fällig
          </Button>
        )}

        {/* Subject Progress */}
        {subjectStats.length > 0 && (
          <section>
            <h2
              className="text-base font-semibold mb-3"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            >
              Fach-Fortschritt
            </h2>
            <div className="space-y-2">
              {subjectStats.map(s => (
                <SubjectProgress
                  key={s.id}
                  name={s.name}
                  color={s.color}
                  due={s.due}
                  total={s.total}
                />
              ))}
            </div>
          </section>
        )}

        {/* Exam Countdown */}
        {upcomingExams.length > 0 && (
          <section>
            <h2
              className="text-base font-semibold mb-3"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            >
              Nächste Prüfungen
            </h2>
            <div className="space-y-2">
              {upcomingExams.map(s => {
                const daysLeft = Math.ceil(
                  (new Date(s.exam_date!).getTime() - new Date(today).getTime()) /
                    (1000 * 60 * 60 * 24),
                )
                return (
                  <ExamCountdown
                    key={s.id}
                    name={s.name}
                    color={s.color}
                    daysLeft={daysLeft}
                    date={s.exam_date!}
                  />
                )
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
