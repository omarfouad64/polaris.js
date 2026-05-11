import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useTabNotifications } from '../../../hooks/useTabNotifications'

export default function AdminLayout() {
  const location = useLocation()
  const tabNotifs = useTabNotifications()
  const showTabs = location.pathname.startsWith('/portal/administrator') && !location.pathname.includes('/search') && location.pathname !== '/portal/administrator/notifications'
  const showTitle = !location.pathname.includes('/search') && location.pathname !== '/portal/administrator/notifications'

  const tabs = [
    { name: 'Stats', path: '/portal/administrator', end: true },
    { name: 'Verification', path: '/portal/administrator/verification' },
    { name: 'User Management', path: '/portal/administrator/users' },
    { name: 'Courses', path: '/portal/administrator/courses' },
    { name: 'Moderation', path: '/portal/administrator/moderation' }
  ]

  return (
    <div className="flex flex-col gap-8">
      {showTitle && (
        <div className="flex flex-col gap-2">
          <h1 className="font-jakarta text-4xl font-extrabold text-on-surface">Admin Control Panel</h1>
          <p className="font-lexend text-on-surface-variant">Platform-wide dashboard for monitoring usage and managing ecosystem entities.</p>
        </div>
      )}

      {/* Admin Sub-Tabs */}
      {showTabs && (
        <div className="flex items-center gap-2 border-b border-surface-container overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            let count = 0
            if (tab.name === 'Verification') count = tabNotifs.admin
            if (tab.name === 'Moderation') count = tabNotifs.projects
            if (tab.name === 'Courses') count = tabNotifs.courses
            const hasBadge = count > 0
            return (
              <NavLink 
                key={tab.name}
                to={tab.path} 
                end={tab.name === 'Stats'}
                className={({ isActive }) => `px-6 py-3 text-sm font-jakarta font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.name}
                {hasBadge && (
                  <span className="bg-error text-on-error text-[10px] font-jakarta font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1">
                    {count}
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>
      )}

      {/* Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Outlet />
      </div>
    </div>
  )
}
