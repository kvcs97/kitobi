import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

interface Props {
  children: ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
        {/* Spacer so content clears the mobile bottom nav */}
        <div className="h-16 md:hidden" />
      </main>
      <BottomNav />
    </div>
  )
}
