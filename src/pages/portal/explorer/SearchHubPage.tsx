import { useMemo, useState } from 'react'
import type { UserRole } from '../../../types'
import { useGlobalContext } from '../../../globalContext'
import InstructorDirectory from './InstructorDirectory'
import ProjectSearchPanel from './projects/ProjectSearchPanel'
import SearchTabPanel from './components/SearchTabPanel'

type SearchTabKey = 'instructors' | 'projects' | 'portfolios'

interface SearchTabConfig {
  key: SearchTabKey
  label: string
  description: string
}

const ALL_TABS: SearchTabConfig[] = [
  {
    key: 'instructors',
    label: 'Instructors',
    description: 'Search and browse course instructors by name or course.'
  },
  {
    key: 'projects',
    label: 'Projects',
    description: 'Find projects by title, course, instructor, or date.'
  },
  {
    key: 'portfolios',
    label: 'Portfolios',
    description: 'Discover student portfolios by name, email, major, or skills.'
  }
]

const TABS_BY_ROLE: Record<UserRole, SearchTabKey[]> = {
  Student: ['instructors', 'projects', 'portfolios'],
  Employer: ['instructors', 'projects', 'portfolios'],
  'Course Instructor': ['instructors', 'projects', 'portfolios'],
  Administrator: ['instructors', 'projects', 'portfolios']
}

/**
 * SearchHubPage — unified search hub with role-specific tabs.
 */
export default function SearchHubPage(): React.JSX.Element {
  const { user } = useGlobalContext()
  const role = user?.role ?? 'Student'
  const allowedKeys = TABS_BY_ROLE[role]

  const tabs = useMemo(
    () => ALL_TABS.filter(tab => allowedKeys.includes(tab.key)),
    [allowedKeys]
  )

  const [activeTab, setActiveTab] = useState<SearchTabKey>(tabs[0]?.key ?? 'instructors')

  const activeConfig = tabs.find(tab => tab.key === activeTab)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-jakarta font-bold text-on-surface">Search</h1>
        <p className="text-sm font-lexend text-on-surface-variant">
          Explore instructors, projects, and portfolios from one place.
        </p>
      </div>

      <div className="flex border-b border-surface-container">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 font-jakarta font-bold text-sm transition-colors border-b-2 ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'instructors' && (
        <InstructorDirectory />
      )}

      {activeTab === 'projects' && activeConfig && (
        <ProjectSearchPanel />
      )}

      {activeTab === 'portfolios' && activeConfig && (
        <SearchTabPanel title="Portfolio Search" description={activeConfig.description}>
          <div
            className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-8 text-center"
            style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}
          >
            <p className="text-sm font-lexend text-on-surface-variant">
              Portfolio search is not available yet. This tab will connect to the portfolio discovery
              requirements once implemented.
            </p>
          </div>
        </SearchTabPanel>
      )}
    </div>
  )
}
