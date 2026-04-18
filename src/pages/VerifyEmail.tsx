import { Link, useLocation } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerifyEmail() {
  const location = useLocation()
  const email: string = location.state?.email || 'deine Email-Adresse'

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="w-full max-w-sm space-y-6">

        <div className="text-center space-y-1">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
          >
            Kitobi
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            記憶の扉 — Dein KI-Lernassistent
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4 text-center">
            <div
              className="text-5xl mb-3"
              style={{ color: 'var(--color-primary)' }}
            >
              ✉️
            </div>
            <CardTitle className="text-lg">Fast geschafft!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Wir haben dir eine Bestätigungsmail an{' '}
              <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{email}</span>{' '}
              geschickt. Bitte klicke auf den Link in der Mail um dein Konto zu aktivieren.
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Keine Mail erhalten? Prüfe deinen Spam-Ordner.
            </p>
            <Link
              to="/login"
              className="text-sm hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              Zurück zum Login
            </Link>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
