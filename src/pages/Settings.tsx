import { useNavigate } from 'react-router-dom'
import { signOut } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Settings() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  async function handleLogout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-lg mx-auto space-y-6">

        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          Einstellungen
        </h1>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
            <CardDescription>Deine Anmeldedaten</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Eingeloggt als{' '}
              <span style={{ color: 'var(--color-text)' }}>{user?.email}</span>
            </p>
            <Button variant="destructive" onClick={handleLogout}>
              Abmelden
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
