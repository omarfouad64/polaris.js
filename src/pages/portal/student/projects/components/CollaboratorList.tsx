import { useState, useMemo } from 'react'
import { useProjectInvitations } from '../../../../../hooks/useProjectInvitations'
import ConfirmDialog from '../../../../../components/ConfirmDialog'

interface CollaboratorListProps {
  projectId: string
  currentUserId: string
  isOwner: boolean
  projectCourseId?: string
  isBachelorProject?: boolean
}

type FilterType = 'all' | 'collaborators' | 'instructors' | 'pending'

/**
 * CollaboratorList – displays project collaborators with their invitation status.
 * Shows collaborators, pending invitations, and allows removal by project owner.
 */
export default function CollaboratorList({
  projectId,
  currentUserId,
  isOwner,
  projectCourseId,
  isBachelorProject
}: CollaboratorListProps) {
  // Use passed prop, fall back to false
  const _isBachelorProject = isBachelorProject ?? false
  const { collaborators, stats, cancelInvitation, removeCollaborator } = useProjectInvitations(
    projectId,
    currentUserId,
    projectCourseId,
    _isBachelorProject
  )

  const [filter, setFilter] = useState<FilterType>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Confirm dialog state
  const [confirmAction, setConfirmAction] = useState<{
    email: string
    type: 'remove' | 'cancel'
    name: string
  } | null>(null)

  const executeAction = () => {
    if (!confirmAction) return
    if (confirmAction.type === 'cancel') {
      cancelInvitation(confirmAction.email)
    } else {
      removeCollaborator(confirmAction.email)
    }
    setConfirmAction(null)
  }

  // Filtered and searched collaborators
  const filteredCollaborators = useMemo(() => {
    return collaborators.filter(c => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'collaborators' && c.role === 'collaborator') ||
        (filter === 'instructors' && c.role === 'instructor') ||
        (filter === 'pending' && c.invitationStatus === 'pending')

      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesFilter && matchesSearch
    })
  }, [collaborators, filter, searchTerm])

  return (
    <div className="space-y-4">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high shadow-sm">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            type="text"
            placeholder="Search team by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low border border-surface-container-high rounded-lg pl-10 pr-4 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'collaborators', 'instructors', 'pending'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-jakarta font-semibold rounded-lg transition-all capitalize ${
                filter === f
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-surface-container-low px-6 py-4 border-b border-surface-container-high flex items-center justify-between">
          <div>
            <h3 className="text-lg font-jakarta font-bold text-on-surface">
              Team Members ({stats.total})
            </h3>
            <p className="text-sm text-on-surface-variant mt-1">
              {stats.accepted} accepted • {stats.pending} pending
              {stats.instructors > 0 && ` • ${stats.instructors} instructor${stats.instructors > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Collaborators List */}
        <div className="divide-y divide-surface-container-high">
          {filteredCollaborators.length > 0 ? (
            filteredCollaborators.map(collaborator => (
              <div
                key={collaborator.collaboratorId}
                className="p-4 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Collaborator Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary font-jakarta font-bold text-sm shrink-0 overflow-hidden">
                      {collaborator.profilePicture ? (
                        <img
                          src={collaborator.profilePicture}
                          alt={collaborator.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        collaborator.name.charAt(0)
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-jakarta font-semibold text-on-surface">
                          {collaborator.name}
                        </p>
                        <span
                          className={`text-[10px] font-jakarta font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            collaborator.role === 'owner'
                              ? 'bg-primary/10 text-primary'
                              : collaborator.role === 'instructor'
                                ? 'bg-tertiary/10 text-tertiary'
                                : 'bg-secondary/10 text-secondary'
                          }`}
                        >
                          {collaborator.role}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant truncate">
                        {collaborator.email}
                      </p>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2 mt-2">
                        {collaborator.invitationStatus === 'pending' && (
                          <span className="text-[10px] font-jakarta font-bold px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            NO REPLY
                          </span>
                        )}
                        {collaborator.invitationStatus === 'accepted' && collaborator.role !== 'owner' && (
                          <span className="text-[10px] font-jakarta font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">check_circle</span>
                            ACCEPTED
                          </span>
                        )}
                        {collaborator.invitationStatus === 'rejected' && (
                          <span className="text-[10px] font-jakarta font-bold px-2 py-0.5 rounded-full bg-error/10 text-error flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">cancel</span>
                            REJECTED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions — only project owner, never on self, never on bachelor projects */}
                  {!_isBachelorProject && isOwner && collaborator.role !== 'owner' && (
                    <div className="flex flex-col gap-2 shrink-0">
                      {collaborator.invitationStatus === 'pending' ? (
                        <button
                          onClick={() => setConfirmAction({ email: collaborator.email, type: 'cancel', name: collaborator.name })}
                          className="px-4 py-1.5 text-xs font-jakarta font-semibold border border-outline-variant text-on-surface-variant hover:border-error/30 hover:text-error hover:bg-error/5 rounded-lg transition-all whitespace-nowrap"
                        >
                          Cancel Invitation
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmAction({ email: collaborator.email, type: 'remove', name: collaborator.name })}
                          className="px-4 py-1.5 text-xs font-jakarta font-semibold border border-error/30 text-error hover:bg-error hover:text-on-error rounded-lg transition-all whitespace-nowrap"
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
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-[48px] text-outline-variant mb-2">group_off</span>
              <p className="text-sm font-lexend text-on-surface-variant">
                {searchTerm || filter !== 'all'
                  ? 'No matching team members found.'
                  : 'No collaborators yet. Invite someone to get started!'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmAction !== null}
        title={confirmAction?.type === 'cancel' ? 'Cancel Invitation' : 'Remove Team Member'}
        message={
          confirmAction?.type === 'cancel'
            ? `Are you sure you want to cancel the invitation sent to ${confirmAction?.name}?`
            : `Are you sure you want to remove ${confirmAction?.name} from the project? They will lose access immediately.`
        }
        confirmLabel={confirmAction?.type === 'cancel' ? 'Cancel Invitation' : 'Remove'}
        cancelLabel="Keep"
        variant="danger"
        onConfirm={executeAction}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  )
}