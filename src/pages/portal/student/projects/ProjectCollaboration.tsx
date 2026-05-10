import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useProjectInvitations } from '../../../../hooks/useProjectInvitations'
import { useGlobalContext } from '../../../../globalContext'
import useStudentProjects, { type ProjectData, type ProjectTask } from './scripts/useStudentProjects'
import ProjectCollaborationPage from './components/ProjectCollaborationPage'
import ProjectTaskManager from './components/ProjectTaskManager'

/**
 * ProjectCollaboration – full page for project collaboration management.
 * Can be nested in project detail or accessed as standalone page.
 * Shows current collaborators and allows management of team.
 */
export default function ProjectCollaboration() {
  const { id } = useParams<{ id: string }>()
  const { user } = useGlobalContext()
  const { getProjectById, updateProject } = useStudentProjects()
  
  const projectId = id || 'proj-001'
  const project = getProjectById(projectId)
  const projectTitle = project?.title || 'E-Commerce Platform'
  const currentUserId = user?.username || 'student-001'
  // A student only ever sees their own projects, so they are always the owner
  const isOwner = user?.role === 'Student'
  const isInstructor = user?.role === 'Course Instructor'

  const [activeTab, setActiveTab] = useState<'team' | 'tasks'>('team')
  const { collaborators = [] } = useProjectInvitations(projectId, currentUserId)

  const handleTasksChange = (tasks: ProjectTask[]) => {
    updateProject(projectId, { tasks })
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-jakarta font-bold text-on-surface mb-2">
          Collaboration
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Manage your project team and send invitations
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-surface-container-high">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-3 font-jakarta font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'team'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Collaborators
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-3 font-jakarta font-semibold text-sm border-b-2 transition-all ${
              activeTab === 'tasks'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Project Tasks
          </button>
        </div>
      </div>

      {activeTab === 'team' ? (
        <ProjectCollaborationPage
          projectId={projectId}
          projectTitle={projectTitle}
          currentUserId={currentUserId}
          isOwner={isOwner}
          projectCourseId={project?.course}
        />
      ) : (
        <ProjectTaskManager
          projectId={projectId}
          tasks={project?.tasks || []}
          onTasksChange={handleTasksChange}
          isOwner={isOwner}
          isInstructor={isInstructor}
          currentUserId={currentUserId}
          userName={user?.username || 'Unknown User'}
        />
      )}

      {/* Stats Card */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high p-6">
          <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-2">
            Total Team Members
          </p>
          <p className="text-3xl font-jakarta font-bold text-on-surface">
            {collaborators.length}
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high p-6">
          <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-2">
            Accepted
          </p>
          <p className="text-3xl font-jakarta font-bold text-secondary">
            {collaborators.filter(c => c.invitationStatus === 'accepted').length}
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high p-6">
          <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-2">
            Pending Invitations
          </p>
          <p className="text-3xl font-jakarta font-bold text-tertiary">
            {collaborators.filter(c => c.invitationStatus === 'pending').length}
          </p>
        </div>
      </div>
    </div>
  )
}