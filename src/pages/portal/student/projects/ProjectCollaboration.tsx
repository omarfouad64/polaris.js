import { useProjectInvitations } from '../../../../hooks/useProjectInvitations'
import ProjectCollaborationPage from './components/ProjectCollaborationPage'

/**
 * ProjectCollaboration – full page for project collaboration management.
 * Can be nested in project detail or accessed as standalone page.
 * Shows current collaborators and allows management of team.
 */
export default function ProjectCollaboration() {
  // For demo purposes, using hardcoded project and user IDs
  const projectId = 'proj-001'
  const projectTitle = 'E-Commerce Platform'
  const currentUserId = 'student-001'
  const isOwner = true

  const { collaborators } = useProjectInvitations(projectId, currentUserId)

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
          <button className="px-4 py-3 font-jakarta font-semibold text-sm border-b-2 border-primary text-primary">
            Collaborators
          </button>
          <button className="px-4 py-3 font-jakarta font-semibold text-sm border-b-2 border-transparent text-on-surface-variant hover:text-on-surface transition-colors">
            Pending Invitations
          </button>
        </div>
      </div>

      {/* Collaboration Content */}
      <ProjectCollaborationPage
        projectId={projectId}
        projectTitle={projectTitle}
        currentUserId={currentUserId}
        isOwner={isOwner}
      />

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