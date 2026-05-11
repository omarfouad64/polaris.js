import { useParams, useNavigate } from 'react-router-dom'
import useStudentProjects, { type ProjectTask } from './scripts/useStudentProjects'
import { useGlobalContext } from '../../../../globalContext'
import ProjectTaskManager from './components/ProjectTaskManager'

/**
 * ProjectTasksPage — dedicated page for viewing and managing tasks on a project.
 * Covers Requirement 32: create/view/edit/delete tasks with description,
 * assignee, status, and deadline. Project creators manage all tasks;
 * collaborators may only update the status of their own task.
 */
export default function ProjectTasksPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useGlobalContext()
  const { getProjectById, updateProject } = useStudentProjects()

  if (!id) {
    return (
      <div className="text-center py-20">
        <p className="font-lexend text-on-surface-variant">Invalid project ID.</p>
      </div>
    )
  }

  const project = getProjectById(id)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-6xl text-outline/30 mb-4">search_off</span>
        <h2 className="text-2xl font-jakarta font-bold text-on-surface">Project Not Found</h2>
        <p className="font-lexend text-on-surface-variant mt-2 mb-6">
          The project you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate('/portal/student/projects')}
          className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-jakarta font-semibold text-sm hover:shadow-raised transition-all"
        >
          Back to My Projects
        </button>
      </div>
    )
  }

  const handleTasksChange = (tasks: ProjectTask[]): void => {
    updateProject(id, { tasks })
  }

  // Determine ownership based on project data — a student may be viewing another student's project as collaborator
  const currentUserId = user?.username ?? 'current-user'
  const isOwner = project?.ownerId === currentUserId

  return (
    <div className="min-h-screen bg-background p-[--spacing-polaris-md] md:p-[--spacing-polaris-lg]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back navigation */}
        <button
          onClick={() => {
            const rolePath = user?.role === 'Course Instructor' ? 'instructor' : 'student'
            navigate(`/portal/${rolePath}/projects/${id}/view`)
          }}
          className="flex items-center gap-2 text-sm font-jakarta font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Project Overview
        </button>

        {/* Project context header */}
        <div className="bg-surface-container-lowest rounded-2xl px-6 py-4 border border-outline-variant/30 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <span
              className="material-symbols-outlined text-primary text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              task
            </span>
          </div>
          <div>
            <p className="text-xs font-lexend text-on-surface-variant uppercase tracking-widest">
              Task Board
            </p>
            <h1 className="text-lg font-jakarta font-bold text-on-surface leading-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {/* Task Manager */}
        <ProjectTaskManager
          projectId={id}
          tasks={project.tasks}
          onTasksChange={handleTasksChange}
          isOwner={isOwner}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  )
}
