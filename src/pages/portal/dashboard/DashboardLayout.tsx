import { Outlet, NavLink } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div className="flex flex-col gap-8">
      {/* Sub-Tabs for Dashboard */}
      <div className="flex items-center gap-2 border-b border-surface-container">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => `px-6 py-3 text-sm font-jakarta font-bold border-b-2 transition-all ${
            isActive ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Overview
        </NavLink>
        <NavLink 
          to="/projects" 
          className={({ isActive }) => `px-6 py-3 text-sm font-jakarta font-bold border-b-2 transition-all ${
            isActive ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          My Projects
        </NavLink>
        <NavLink 
          to="/activity" 
          className={({ isActive }) => `px-6 py-3 text-sm font-jakarta font-bold border-b-2 transition-all ${
            isActive ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Activity
        </NavLink>
      </div>

      {/* Content Area for Sub-Tabs */}
      <Outlet />
    </div>
  )
}
