import { useNavigate, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../../../globalContext'
import Button from '../../../components/Button'
import { type UserRole } from '../../../types'

interface Tab {
  name: string
  path: string
  icon: string
}

const roleTabs: Record<UserRole, Tab[]> = {
  Student: [
    { name: 'Dashboard', path: '/portal/student', icon: 'dashboard' },
    { name: 'My Projects', path: '/portal/student/projects', icon: 'list_alt' },
    { name: 'Invitations', path: '/portal/student/invitations', icon: 'mail' },
    { name: 'Search', path: '/portal/student/search', icon: 'search' },
    { name: 'Internships', path: '/portal/student/internships', icon: 'work' },
    { name: 'Portfolio', path: '/portal/student/portfolio', icon: 'person' },
    { name: 'Favorites', path: '/portal/student/favorites', icon: 'favorite' },
    { name: 'Communications', path: '/portal/student/communications', icon: 'chat' },
    { name: 'Notifications', path: '/portal/student/notifications', icon: 'notifications' }
  ],
  Employer: [
    { name: 'Dashboard', path: '/portal/employer', icon: 'dashboard' },
    { name: 'Company Profile', path: '/portal/employer/profile', icon: 'business' },
    { name: 'Internships', path: '/portal/employer/internships', icon: 'work' },
    { name: 'Search', path: '/portal/employer/search', icon: 'search' },
    { name: 'Favorites', path: '/portal/employer/favorites', icon: 'favorite' },
    { name: 'Communications', path: '/portal/employer/communications', icon: 'chat' },
    { name: 'Notifications', path: '/portal/employer/notifications', icon: 'notifications' }
  ],
  'Course Instructor': [
    { name: 'Profile', path: '/portal/instructor', icon: 'person' },
    { name: 'Courses', path: '/portal/instructor/courses', icon: 'menu_book' },
    { name: 'Invitations', path: '/portal/instructor/invitations', icon: 'mail' },
    { name: 'Search', path: '/portal/instructor/search', icon: 'search' },
    { name: 'Gradebook', path: '/portal/instructor/grades', icon: 'grade' },
    { name: 'Project Oversight', path: '/portal/instructor/oversight', icon: 'visibility' },
    { name: 'Communications', path: '/portal/instructor/communications', icon: 'chat' },
    { name: 'Notifications', path: '/portal/instructor/notifications', icon: 'notifications' }
  ],
  Administrator: [
    { name: 'Admin Dashboard', path: '/portal/administrator', icon: 'admin_panel_settings' },
    { name: 'Search', path: '/portal/administrator/search', icon: 'search' },
    { name: 'Notifications', path: '/portal/administrator/notifications', icon: 'notifications' }
  ]
}

/**
 * Sidebar — persistent sidebar navigation with role-based tabs, user profile, and logout.
 */
export default function Sidebar(): React.JSX.Element {
  const { user, logout } = useGlobalContext()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = (): void => {
    logout()
    navigate('/auth/login')
  }

  const handleNavigate = (path: string): void => {
    if (location.pathname.includes('/search')) {
      window.location.assign(path)
      return
    }
    navigate(path)
  }

  const tabs = roleTabs[user?.role || 'Student']

  const isActive = (path: string): boolean => {
    // Special handling for Administrator Dashboard to highlight for all sub-routes except search
    if (path === '/portal/administrator') {
      return location.pathname.startsWith(path) && !location.pathname.includes('/search')
    }

    // Default behavior: portal root matches exactly, other paths match if they start with the path
    if (path === `/portal/${location.pathname.split('/')[2]}`) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="w-72 bg-surface-container-lowest border-r border-surface-container flex flex-col shadow-sm relative z-20">
      <div className="h-24 flex items-center px-8 border-b border-surface-container bg-surface-container-low/20">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 shadow-sm">
            <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
          </div>
          <span className="font-jakarta text-xl font-extrabold text-on-surface tracking-tight">Project Polaris</span>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleNavigate(tab.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-jakarta font-semibold rounded-xl transition-all ${isActive(tab.path)
              ? 'bg-primary text-on-primary shadow-md'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${isActive(tab.path) ? '' : 'text-outline-variant'}`}>
              {tab.icon}
            </span>
            {tab.name}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-surface-container bg-surface-container-low/30">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-jakarta font-bold shadow-sm">
            {user?.username[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-jakarta font-bold text-on-surface truncate">{user?.username}</p>
            <p className="text-xs text-on-surface-variant truncate lowercase">{user?.role}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-error/20 text-error hover:bg-error/5 hover:border-error/40"
          onClick={handleLogout}
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Logout
        </Button>
      </div>
    </aside>
  )
}
