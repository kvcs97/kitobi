import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Layers, HelpCircle,
  CalendarDays, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

const NAV_ITEMS = [
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/notes',   icon: FileText,        label: 'Notizen',   end: false },
  { to: '/decks',   icon: Layers,          label: 'Karten',    end: false },
  { to: '/quiz',    icon: HelpCircle,      label: 'Quiz',      end: false },
  { to: '/planner', icon: CalendarDays,    label: 'Planer',    end: false },
]

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const location = useLocation()
  const collapsed = !sidebarOpen

  return (
    <aside
      className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 border-r transition-all duration-200 ${collapsed ? 'w-[60px]' : 'w-56'}`}
      style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      {/* Header */}
      <div
        className={`flex items-center h-14 px-3 border-b ${collapsed ? 'justify-center' : 'justify-between'}`}
        style={{ borderColor: 'var(--color-border)' }}
      >
        {!collapsed && (
          <span
            className="text-base font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
          >
            Kitobi
          </span>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md nav-item"
          title={collapsed ? 'Erweitern' : 'Minimieren'}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm ${collapsed ? 'justify-center' : ''} ${isActive ? 'nav-active' : 'nav-item'}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={17} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Settings at bottom */}
      <div className="px-2 pb-4">
        <NavLink
          to="/settings"
          className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm ${collapsed ? 'justify-center' : ''} ${location.pathname === '/settings' ? 'nav-active' : 'nav-item'}`}
          title={collapsed ? 'Einstellungen' : undefined}
        >
          <Settings size={17} className="shrink-0" />
          {!collapsed && <span>Einstellungen</span>}
        </NavLink>
      </div>
    </aside>
  )
}
