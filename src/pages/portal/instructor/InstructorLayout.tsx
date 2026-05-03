import { Outlet } from 'react-router-dom'
import { useState } from 'react'

interface InstructorTab {
  id: 'profile' | 'courses'
  label: string
  icon: string
}

const INSTRUCTOR_TABS: InstructorTab[] = [
  { id: 'profile', label: 'My Profile', icon: '👤' },
  { id: 'courses', label: 'My Courses', icon: '📚' }
]

/**
 * InstructorLayout – main layout shell for instructor portal.
 * Provides navigation between profile and course management pages.
 */
export default function InstructorLayout() {
  const [activeTab, setActiveTab] = useState<'profile' | 'courses'>('profile')

  return (
    <div className="min-h-screen bg-background">
      {/* Instructor Sub-Navigation */}
      <div className="border-b border-surface-container-high bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto">
            {INSTRUCTOR_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-jakarta font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <Outlet />
    </div>
  )
}