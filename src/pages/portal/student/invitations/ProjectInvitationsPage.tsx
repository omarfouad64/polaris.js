import { useState } from 'react'
import { useProjectNotifications } from '../../../../hooks/useProjectNotifications'
import { useProjectInvitationsList } from '../../../../hooks/useProjectInvitationsList'
import Button from '../../../../components/Button'

type TabType = 'pending' | 'accepted' | 'rejected'

/**
 * ProjectInvitationsPage – displays all project invitations received by the user.
 * Shows pending, accepted, and rejected invitations with action buttons.
 * Handles accept/reject actions and notification integration.
 */
export default function ProjectInvitationsPage() {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('pending')
  const [expandedInvitationId, setExpandedInvitationId] = useState<string | null>(null)

  // For demo purposes, using hardcoded user ID
  // const currentUserId = 'student-001'

  // Hooks
  const { markAsRead } = useProjectNotifications()
  const {
    pendingInvitations,
    acceptedInvitations,
    rejectedInvitations,
    stats,
    acceptInvitation,
    rejectInvitation
  } = useProjectInvitationsList()

  // Handler: Accept invitation
  const handleAcceptInvitation = (invitationId: string) => {
    acceptInvitation(invitationId)
    markAsRead(invitationId)
  }

  // Handler: Reject invitation
  const handleRejectInvitation = (invitationId: string) => {
    rejectInvitation(invitationId)
    markAsRead(invitationId)
  }

  // Get current tab data
  const getTabData = () => {
    switch (activeTab) {
      case 'pending':
        return pendingInvitations
      case 'accepted':
        return acceptedInvitations
      case 'rejected':
        return rejectedInvitations
      default:
        return []
    }
  }

  const currentTabData = getTabData()

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-jakarta font-bold text-on-surface mb-2">
          Project Invitations
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Manage invitations to join different projects
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 border-b border-surface-container-high overflow-x-auto">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-3 font-jakarta font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${
              activeTab === 'pending'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-4 py-3 font-jakarta font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${
              activeTab === 'accepted'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Accepted ({stats.accepted})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-3 font-jakarta font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${
              activeTab === 'rejected'
                ? 'border-error text-error'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Rejected ({stats.rejected})
          </button>
        </div>
      </div>

      {/* Invitations List */}
      <div className="space-y-4">
        {currentTabData.length > 0 ? (
          currentTabData.map(invitation => (
            <div
              key={invitation.id}
              className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Invitation Card Header */}
              <button
                onClick={() =>
                  setExpandedInvitationId(
                    expandedInvitationId === invitation.id ? null : invitation.id
                  )
                }
                className="w-full p-6 flex items-start justify-between hover:bg-surface-container-low transition-colors"
              >
                {/* Left Content */}
                <div className="flex-1 text-left min-w-0">
                  {/* Status Badge */}
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-jakarta font-bold uppercase tracking-wider px-3 py-1 rounded-lg flex items-center gap-1.5 ${
                        invitation.status === 'pending'
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : invitation.status === 'accepted'
                            ? 'bg-secondary/10 text-secondary border border-secondary/20'
                            : 'bg-error/10 text-error border border-error/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {invitation.status === 'pending' ? 'schedule' : invitation.status === 'accepted' ? 'check_circle' : 'cancel'}
                      </span>
                      {invitation.status}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-lg font-jakarta font-bold text-on-surface mb-1 truncate">
                    {invitation.projectTitle}
                  </h3>

                  {/* Sender Info */}
                  <p className="text-body-sm text-on-surface-variant mb-2">
                    Invited by <span className="font-semibold">{invitation.senderName}</span>
                  </p>

                  {/* Invitation Date */}
                  <p className="text-xs text-on-surface-variant">
                    {new Date(invitation.invitedAt).toLocaleDateString()} at{' '}
                    {new Date(invitation.invitedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Expand Arrow */}
                <span
                  className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 shrink-0 ml-4 ${
                    expandedInvitationId === invitation.id ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>

              {/* Expanded Content */}
              {expandedInvitationId === invitation.id && (
                <div className="border-t border-surface-container-high p-6 bg-surface-container-low space-y-4">
                  {/* Project Description */}
                  <div>
                    <h4 className="text-sm font-jakarta font-semibold text-on-surface-variant mb-2">
                      About this project
                    </h4>
                    <p className="text-body-sm text-on-surface leading-relaxed">
                      {invitation.projectDescription}
                    </p>
                  </div>

                  {/* Sender Details */}
                  <div>
                    <h4 className="text-sm font-jakarta font-semibold text-on-surface-variant mb-2">
                      Sent by
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-jakarta font-bold text-sm">
                        {invitation.senderName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-jakarta font-semibold text-on-surface">
                          {invitation.senderName}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {invitation.senderEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions - Only for Pending Invitations */}
                  {invitation.status === 'pending' && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => handleAcceptInvitation(invitation.id)}
                        variant="secondary"
                        className="flex-1 gap-2"
                      >
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleRejectInvitation(invitation.id)}
                        variant="outline"
                        className="flex-1 gap-2 text-error border-error/30 hover:bg-error/5 hover:border-error"
                      >
                        <span className="material-symbols-outlined text-[20px]">cancel</span>
                        Reject
                      </Button>
                    </div>
                  )}

                  {/* Accepted Message */}
                  {invitation.status === 'accepted' && (
                    <div className="bg-secondary-container/20 rounded-lg p-4 border border-secondary/20">
                      <p className="text-sm text-on-surface-variant">
                        <span className="font-jakarta font-semibold text-secondary">✓ Accepted</span> - You are now part of this project team
                      </p>
                    </div>
                  )}

                  {/* Rejected Message */}
                  {invitation.status === 'rejected' && (
                    <div className="bg-error/10 rounded-lg p-4 border border-error/20">
                      <p className="text-sm text-on-surface-variant">
                        <span className="font-jakarta font-semibold text-error">✕ Rejected</span> - You declined this invitation
                      </p>
                    </div>
                  )}

                  {/* View Project Button */}
                  {invitation.status === 'accepted' && (
                    <Button className="w-full mt-2 gap-2">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                      View Project
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-surface-container rounded-xl p-12 text-center">
            <p className="text-body-md text-on-surface-variant mb-2">
              {activeTab === 'pending'
                ? 'No pending invitations'
                : activeTab === 'accepted'
                  ? 'No accepted invitations yet'
                  : 'No rejected invitations'}
            </p>
            <p className="text-body-sm text-on-surface-variant">
              When you receive an invitation, it will appear here
            </p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-primary-container/20 rounded-xl p-6 border border-primary/10">
        <h3 className="font-jakarta font-semibold text-on-surface mb-2">💡 About Project Invitations</h3>
        <ul className="text-body-sm text-on-surface-variant space-y-2">
          <li>• You will receive notifications when invited to join a project</li>
          <li>• You can accept or reject invitations to join project teams</li>
          <li>• Accepted invitations will add you to the project collaborators list</li>
          <li>• You can view all your invitations, both pending and completed</li>
        </ul>
      </div>
    </div>
  )
}