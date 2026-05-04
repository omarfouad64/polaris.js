import { useProjectInvitations } from '../../../../../hooks/useProjectInvitations'

interface CollaboratorListProps {
  projectId: string
  currentUserId: string
  isOwner: boolean
}

/**
 * CollaboratorList – displays project collaborators with their invitation status.
 * Shows collaborators, pending invitations, and allows removal by project owner.
 */
export default function CollaboratorList({
  projectId,
  currentUserId,
  isOwner
}: CollaboratorListProps) {
  const { collaborators, stats, cancelInvitation, removeCollaborator } = useProjectInvitations(
    projectId,
    currentUserId
  )

  const handleRemoveCollaborator = (email: string) => {
    if (window.confirm('Are you sure you want to remove this collaborator?')) {
      removeCollaborator(email)
    }
  }

  const handleCancelInvitation = (email: string) => {
    if (window.confirm('Cancel this invitation?')) {
      cancelInvitation(email)
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-surface-container-low px-6 py-4 border-b border-surface-container-high">
        <h3 className="text-lg font-jakarta font-bold text-on-surface">
          Team Members ({stats.total})
        </h3>
        <p className="text-sm text-on-surface-variant mt-1">
          {stats.accepted} accepted • {stats.pending} pending
          {stats.instructors > 0 && ` • ${stats.instructors} instructor${stats.instructors > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Collaborators List */}
      <div className="divide-y divide-surface-container-high">
        {collaborators.length > 0 ? (
          collaborators.map(collaborator => (
            <div
              key={collaborator.collaboratorId}
              className="p-4 hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Collaborator Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary font-jakarta font-bold text-sm shrink-0">
                    {collaborator.profilePicture ? (
                      <img
                        src={collaborator.profilePicture}
                        alt={collaborator.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      collaborator.name.charAt(0)
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-jakarta font-semibold text-on-surface">
                      {collaborator.name}
                    </p>
                    <p className="text-sm text-on-surface-variant truncate">
                      {collaborator.email}
                    </p>

                    {/* Status Badges */}
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs font-jakarta font-semibold px-2 py-1 rounded-full ${
                          collaborator.role === 'owner'
                            ? 'bg-primary text-on-primary'
                            : collaborator.role === 'instructor'
                              ? 'bg-tertiary text-on-tertiary'
                              : 'bg-secondary-container text-on-secondary-container'
                        }`}
                      >
                        {collaborator.role === 'owner'
                          ? '👤 Owner'
                          : collaborator.role === 'instructor'
                            ? '👨‍🏫 Instructor'
                            : '👥 Collaborator'}
                      </span>

                      {collaborator.invitationStatus === 'pending' && (
                        <span className="text-xs font-jakarta font-semibold px-2 py-1 rounded-full bg-surface-container text-on-surface-variant">
                          ⏳ Pending
                        </span>
                      )}

                      {collaborator.invitationStatus === 'accepted' && (
                        <span className="text-xs font-jakarta font-semibold px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container">
                          ✓ Accepted
                        </span>
                      )}
                    </div>

                    {/* Invitation Date */}
                    <p className="text-xs text-on-surface-variant mt-1">
                      Invited {new Date(collaborator.invitedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {isOwner && collaborator.role !== 'owner' && (
                  <div className="flex flex-col gap-2 shrink-0">
                    {collaborator.invitationStatus === 'pending' ? (
                      <button
                        onClick={() => handleCancelInvitation(collaborator.email)}
                        className="px-3 py-1 text-xs font-jakarta font-semibold text-error hover:bg-error/10 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRemoveCollaborator(collaborator.email)}
                        className="px-3 py-1 text-xs font-jakarta font-semibold text-error hover:bg-error/10 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-body-md text-on-surface-variant">
              No collaborators yet. Invite someone to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}