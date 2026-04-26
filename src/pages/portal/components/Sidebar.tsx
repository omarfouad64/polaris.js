import React from 'react'
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
    { name: 'Explorer', path: '/portal/student/explorer', icon: 'explore' },
    { name: 'Portfolio', path: '/portal/student/portfolio', icon: 'person' },
    { name: 'Communications', path: '/portal/student/communications', icon: 'chat' }
  ],
  Employer: [
    { name: 'Company Overview', path: '/portal/employer', icon: 'business' },
    { name: 'Talent Pool', path: '/portal/employer/talent', icon: 'groups' },
    { name: 'Postings', path: '/portal/employer/postings', icon: 'post_add' },
    { name: 'Communications', path: '/portal/employer/communications', icon: 'chat' }
  ],
  'Course Instructor': [
    { name: 'Course Dashboard', path: '/portal/instructor', icon: 'school' },
    { name: 'Gradebook', path: '/portal/instructor/grades', icon: 'grade' },
    { name: 'Project Oversight', path: '/portal/instructor/oversight', icon: 'visibility' },
    { name: 'Communications', path: '/portal/instructor/communications', icon: 'chat' }
  ],
  Administrator: [
    { name: 'Admin Control', path: '/portal/administrator', icon: 'admin_panel_settings' },
    { name: 'User Management', path: '/portal/administrator/users', icon: 'manage_accounts' }
  ]
}

export default function Sidebar() {
  const { user, logout } = useGlobalContext()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  const tabs = roleTabs[user?.role || 'Student']

  return (
    <aside className="w-72 bg-surface-container-lowest border-r border-surface-container flex flex-col shadow-sm">
      <div className="h-24 flex items-center px-8 border-b border-surface-container bg-surface-container-low/20">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 shadow-sm">
            <span className="material-symbols-outlined text-primary text-[24px] fill-1">explore</span>
          </div>
          <span className="font-jakarta text-xl font-extrabold text-on-surface tracking-tight">Project Polaris</span>
        </div>
      </div>
      
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-jakarta font-semibold rounded-xl transition-all ${
              location.pathname === tab.path
                ? 'bg-primary text-on-primary shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${location.pathname === tab.path ? '' : 'text-outline-variant'}`}>
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
