import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { ProjectData } from '../scripts/useStudentProjects'
import ProjectCard from './ProjectCard'

interface ProjectListProps {
  projects: ProjectData[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView: (id: string) => void
  onToggleVisibility?: (id: string) => void
  onTasks?: (id: string) => void
  isLoading?: boolean
}

/**
 * ProjectList — Renders a grid of project cards with per-project notification badges.
 */
export default function ProjectList({
  projects,
  onEdit,
  onDelete,
  onView,
  onToggleVisibility,
  onTasks,
  isLoading = false,
}: ProjectListProps) {
  const allNotifications = useSelector((state: { database: { notifications: any[] } }) => state.database.notifications)

  const projectNotificationCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const project of projects) {
      let count = 0
      for (const n of allNotifications) {
        if (
          !n.read &&
          (n.type === 'feedback' || n.type === 'flag' || n.type === 'appeal_response') &&
          (n as any).projectId === project.id
        ) {
          count++
        }
      }
      counts[project.id] = count
    }
    return counts
  }, [projects, allNotifications])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-xl p-6 animate-pulse h-64 border border-outline-variant/40"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const count = projectNotificationCounts[project.id] || 0
        return (
          <div
            key={project.id}
            style={{ position: 'relative' }}
          >
            {count > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  zIndex: 10,
                }}
              >
                <span className="bg-error text-on-error text-[10px] font-jakarta font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {count}
                </span>
              </div>
            )}
            <ProjectCard
              {...project}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              onToggleVisibility={onToggleVisibility}
              onTasks={onTasks}
            />
          </div>
        )
      })}
    </div>
  )
}
