import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Layers, HelpCircle, CalendarDays } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/',        icon: LayoutDashboard, label: 'Home',    end: true },
  { to: '/notes',   icon: FileText,        label: 'Notizen', end: false },
  { to: '/decks',   icon: Layers,          label: 'Karten',  end: false },
  { to: '/quiz',    icon: HelpCircle,      label: 'Quiz',    end: false },
  { to: '/planner', icon: CalendarDays,    label: 'Planer',  end: false },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 md:hidden border-t z-50 flex items-center justify-around px-2 h-16"
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl min-w-0 text-center transition-colors ${
              isActive ? 'nav-active' : 'nav-item'
            }`
          }
        >
          <Icon size={20} className="shrink-0" />
          <span className="text-[10px] font-medium leading-none">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
