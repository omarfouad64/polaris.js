import { useState, useMemo } from 'react'
import { useProjectInvitations } from '../../../../../hooks/useProjectInvitations'
import type { CollaborationSearchResult } from '../../../../../types'

interface SearchCollaboratorModalProps {
  projectId: string
  currentUserId: string
  isOpen: boolean
  onClose: () => void
  onInvitationSent: () => void
}

/**
 * SearchCollaboratorModal – modal for searching and inviting collaborators/instructors.
 * Allows users to search by name or email and send project invitations.
 */
export default function SearchCollaboratorModal({
  projectId,
  currentUserId,
  isOpen,
  onClose,
  onInvitationSent
}: SearchCollaboratorModalProps) {
  const [searchInputValue, setSearchInputValue] = useState('')
  const [selectedUser, setSelectedUser] = useState<CollaborationSearchResult | null>(null)
  const [invitationSent, setInvitationSent] = useState(false)

  const { setSearchQuery, searchCollaborators, sendInvitation } = useProjectInvitations(
    projectId,
    currentUserId
  )

  // Get search results
  const searchResults = useMemo(() => {
    if (!searchInputValue.trim()) return []
    return searchCollaborators(searchInputValue)
  }, [searchInputValue, searchCollaborators])

  // Handler: Send invitation
  const handleSendInvitation = () => {
    if (!selectedUser) return

    const success = sendInvitation(selectedUser.userId, selectedUser.email, selectedUser.name)

    if (success) {
      setInvitationSent(true)
      setTimeout(() => {
        setInvitationSent(false)
        setSearchInputValue('')
        setSelectedUser(null)
        onInvitationSent()
      }, 1500)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg max-w-md w-full">
        {/* Modal Header */}
        <div className="border-b border-surface-container-high p-6 flex justify-between items-center">
          <h2 className="text-xl font-jakarta font-bold text-on-surface">
            Invite Collaborators
          </h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface text-2xl"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {!invitationSent ? (
            <>
              {/* Search Input */}
              <div>
                <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
                  Search by Name or Email
                </label>
                <input
                  type="text"
                  value={searchInputValue}
                  onChange={(e) => {
                    setSearchInputValue(e.target.value)
                    setSearchQuery(e.target.value)
                  }}
                  placeholder="e.g., Fatima or fatima@guc.edu.eg"
                  className="w-full px-4 py-2 border border-outline rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  autoFocus
                />
              </div>

              {/* Search Results */}
              {searchInputValue && (
                <div className="space-y-2">
                  {searchResults.length > 0 ? (
                    searchResults.map(user => (
                      <button
                        key={user.userId}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          selectedUser?.userId === user.userId
                            ? 'border-primary bg-primary-container/20'
                            : 'border-surface-container-high hover:border-primary'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-jakarta font-bold text-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-jakarta font-semibold text-on-surface truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-on-surface-variant truncate">
                              {user.email}
                            </p>
                            <p className="text-xs text-secondary font-semibold">
                              {user.role}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-center text-body-sm text-on-surface-variant py-4">
                      No results found
                    </p>
                  )}
                </div>
              )}

              {/* Selected User Details */}
              {selectedUser && (
                <div className="bg-surface-container rounded-lg p-4">
                  <p className="text-xs text-on-surface-variant mb-2">Selected User</p>
                  <p className="font-jakarta font-semibold text-on-surface">
                    {selectedUser.name}
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    {selectedUser.email}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-outline text-on-surface rounded-lg font-jakarta font-semibold hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvitation}
                  disabled={!selectedUser}
                  className={`flex-1 px-4 py-2 rounded-lg font-jakarta font-semibold transition-colors ${
                    selectedUser
                      ? 'bg-primary text-on-primary hover:bg-primary-container'
                      : 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                  }`}
                >
                  Send Invitation
                </button>
              </div>
            </>
          ) : (
            // Success State
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✓</div>
              <p className="font-jakarta font-bold text-on-surface mb-2">
                Invitation Sent!
              </p>
              <p className="text-body-sm text-on-surface-variant">
                {selectedUser?.name} will receive the invitation soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}