import { Outlet, NavLink } from 'react-router-dom'

const tabs = [
  { name: 'Dashboard', path: '/portal/employer', end: true },
  { name: 'Company Profile', path: '/portal/employer/profile' },
  { name: 'Internships', path: '/portal/employer/internships' },
  { name: 'Favorites', path: '/portal/employer/favorites' },
  { name: 'Communications', path: '/portal/employer/communications' }
]

/**
 * EmployerLayout — layout shell for the employer portal section with sub-navigation tabs.
 */
export default function EmployerLayout(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-jakarta text-4xl font-extrabold text-on-surface">Employer Portal</h1>
        <p className="font-lexend text-on-surface-variant">Manage your company, internships, and talent pipeline.</p>
      </div>

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

      <div>
        <Outlet />
      </div>
    </div>
  )
}
