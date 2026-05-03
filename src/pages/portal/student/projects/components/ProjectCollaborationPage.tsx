import { useState } from 'react'
import SearchCollaboratorModal from './SearchCollaboratorModal'
import CollaboratorList from './CollaboratorList'

interface ProjectCollaborationPageProps {
  projectId: string
  projectTitle: string
  currentUserId: string
  isOwner: boolean
}

/**
 * ProjectCollaborationPage – main interface for managing project collaborators.
 * Displays collaborator list and allows inviting new team members.
 * Shows pending invitations and allows management by project owner.
 */
export default function ProjectCollaborationPage({
  projectId,
  projectTitle,
  currentUserId,
  isOwner
}: ProjectCollaborationPageProps) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleInvitationSent = () => {
    // Trigger list refresh
    setRefreshTrigger(prev => prev + 1)
    setIsSearchModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-jakarta font-bold text-on-surface">
            Project Team
          </h2>
          <p className="text-body-md text-on-surface-variant mt-1">
            {projectTitle}
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="px-6 py-2 bg-primary text-on-primary rounded-lg font-jakarta font-semibold hover:bg-primary-container transition-colors w-full sm:w-auto"
          >
            + Invite Collaborator
          </button>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-primary-container/20 rounded-xl p-4 border border-primary/10">
        <p className="text-sm text-on-surface-variant">
          <span className="font-jakarta font-semibold text-on-surface">💡 Tip:</span> You can invite
          both students and instructors to collaborate on your project. Instructors can provide
          feedback and grade your work.
        </p>
      </div>

      {/* Collaborator List */}
      <CollaboratorList
        projectId={projectId}
        currentUserId={currentUserId}
        isOwner={isOwner}
      />

      {/* Search Collaborator Modal */}
      <SearchCollaboratorModal
        projectId={projectId}
        currentUserId={currentUserId}
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onInvitationSent={handleInvitationSent}
      />
    </div>
  )
}