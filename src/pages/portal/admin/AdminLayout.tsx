import { Outlet, NavLink } from 'react-router-dom'

export default function AdminLayout() {
  const tabs = [
    { name: 'Stats', path: '/portal/administrator', end: true },
    { name: 'Verification', path: '/portal/administrator/verification' },
    { name: 'User Management', path: '/portal/administrator/users' },
    { name: 'Courses', path: '/portal/administrator/courses' },
    { name: 'Moderation', path: '/portal/administrator/moderation' }
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-jakarta text-4xl font-extrabold text-on-surface">Admin Control Panel</h1>
        <p className="font-lexend text-on-surface-variant">Platform-wide dashboard for monitoring usage and managing ecosystem entities.</p>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-container overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <NavLink 
            key={tab.name}
            to={tab.path} 
            end={tab.end}
            className={({ isActive }) => `px-6 py-3 text-sm font-jakarta font-bold border-b-2 transition-all whitespace-nowrap ${
              isActive ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.name}
          </NavLink>
        ))}
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Outlet />
      </div>
    </div>
  )
}
