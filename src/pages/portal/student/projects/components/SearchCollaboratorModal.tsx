import { useState, useMemo } from 'react'
import { useProjectInvitations } from '../../../../../hooks/useProjectInvitations'
import type { CollaborationSearchResult } from '../../../../../types'

interface SearchCollaboratorModalProps {
  projectId: string
  currentUserId: string
  projectCourseId?: string
  isOpen: boolean
  onClose: () => void
  onInvitationSent: () => void
  roleFilter?: 'Student' | 'Course Instructor'
}

/**
 * SearchCollaboratorModal – modal for searching and inviting collaborators/instructors.
 * Allows users to search by name or email and send project invitations.
 */
export default function SearchCollaboratorModal({
  projectId,
  currentUserId,
  projectCourseId,
  isOpen,
  onClose,
  onInvitationSent,
  roleFilter
}: SearchCollaboratorModalProps) {
  const [searchInputValue, setSearchInputValue] = useState('')
  const [selectedUser, setSelectedUser] = useState<CollaborationSearchResult | null>(null)
  const [invitationSent, setInvitationSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { setSearchQuery, searchCollaborators, sendInvitation } = useProjectInvitations(
    projectId,
    currentUserId,
    projectCourseId
  )

  // Get search results
  const searchResults = useMemo(() => {
    if (!searchInputValue.trim()) return []
    return searchCollaborators(searchInputValue, roleFilter)
  }, [searchInputValue, searchCollaborators, roleFilter])

  // Handler: Send invitation
  const handleSendInvitation = () => {
    if (!selectedUser) return
    setErrorMessage(null)

    const result = sendInvitation(selectedUser.userId, selectedUser.email, selectedUser.name)

    if (result.success) {
      setInvitationSent(true)
      setTimeout(() => {
        setInvitationSent(false)
        setSearchInputValue('')
        setSelectedUser(null)
        onInvitationSent()
      }, 1500)
    } else {
      setErrorMessage(result.message || 'Failed to send invitation')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-3xl shadow-modal max-w-md w-full border border-outline-variant/30 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="border-b border-surface-container-high p-6 flex justify-between items-center bg-surface-container-low/30">
          <h2 className="text-xl font-jakarta font-bold text-on-surface">
            {roleFilter === 'Course Instructor' ? 'Invite Instructors' : 'Invite Collaborators'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {!invitationSent ? (
            <>
              {/* Search Input */}
              <div>
                <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
                  Search by Email or Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                  <input
                    type="text"
                    value={searchInputValue}
                    onChange={(e) => {
                      setSearchInputValue(e.target.value)
                      setSearchQuery(e.target.value)
                      setErrorMessage(null)
                    }}
                    placeholder="Search by first/last name or email..."
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-xl flex items-start gap-2">
                  <span className="material-symbols-outlined text-error text-[18px]">error</span>
                  <p className="text-xs font-lexend font-medium text-error">{errorMessage}</p>
                </div>
              )}

              {/* Search Results */}
              {searchInputValue && (
                <div className="space-y-2">
                  {searchResults.length > 0 ? (
                    searchResults.map(user => (
                      <button
                        key={user.userId}
                        onClick={() => {
                          setSelectedUser(user)
                          setErrorMessage(null)
                        }}
                        className={`w-full text-left p-3 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
                          selectedUser?.userId === user.userId
                            ? 'border-primary bg-primary/5'
                            : 'border-transparent bg-surface-container-low hover:border-primary/30'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-jakarta font-bold text-sm shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-jakarta font-semibold text-on-surface truncate text-sm">
                            {user.name}
                          </p>
                          <p className="text-[11px] font-lexend text-on-surface-variant truncate">
                            {user.email}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-[10px] font-jakarta font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                              user.role === 'Course Instructor' ? 'bg-tertiary/10 text-tertiary' : 'bg-secondary/10 text-secondary'
                            }`}>
                              {user.role}
                            </span>
                            {user.role === 'Course Instructor' && (
                              <span className="text-[10px] font-lexend text-on-surface-variant italic">
                                {user.teachingCourses?.includes(projectCourseId || '') ? '✓ Teaches this course' : '⚠ Doesn\'t teach this course'}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <span className="material-symbols-outlined text-outline-variant text-[40px] mb-2">person_search</span>
                      <p className="text-sm font-lexend text-on-surface-variant">No users found matching your search.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Selected User Summary */}
              {selectedUser && (
                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-jakarta font-bold text-primary uppercase tracking-widest mb-1">SELECTED RECIPIENT</p>
                    <p className="text-sm font-jakarta font-bold text-on-surface">{selectedUser.name}</p>
                    <p className="text-xs font-lexend text-on-surface-variant">{selectedUser.email}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="p-1 text-on-surface-variant hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">backspace</span>
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-surface-container-high text-on-surface rounded-xl font-jakarta font-bold text-sm hover:bg-surface-container transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvitation}
                  disabled={!selectedUser}
                  className={`flex-1 px-4 py-3 rounded-xl font-jakarta font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    selectedUser
                      ? 'bg-primary text-on-primary shadow-raised hover:bg-primary/90'
                      : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Send Invitation
                </button>
              </div>
            </>
          ) : (
            // Success State
            <div className="text-center py-10 animate-in zoom-in-90 duration-300">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-secondary/20">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              <h3 className="text-xl font-jakarta font-bold text-on-surface mb-2">
                Invitation Sent!
              </h3>
              <p className="text-sm font-lexend text-on-surface-variant px-4">
                A project collaboration request has been sent to <span className="font-bold text-on-surface">{selectedUser?.name}</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}