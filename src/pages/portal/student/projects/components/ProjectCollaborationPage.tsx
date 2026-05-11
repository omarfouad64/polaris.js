import { useState } from 'react'
import { useProjectInvitations } from '../../../../../hooks/useProjectInvitations'
import SearchCollaboratorModal from './SearchCollaboratorModal'
import CollaboratorList from './CollaboratorList'

interface ProjectCollaborationPageProps {
  projectId: string
  projectTitle: string
  currentUserId: string
  isOwner: boolean
  projectCourseId?: string
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
  isOwner,
  projectCourseId
}: ProjectCollaborationPageProps) {
  const [modalRole, setModalRole] = useState<'Student' | 'Course Instructor'>('Student')
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const openSearchModal = (role: 'Student' | 'Course Instructor') => {
    setModalRole(role)
    setIsSearchModalOpen(true)
  }

  const handleInvitationSent = () => {
    setIsSearchModalOpen(false)
  }

  const { suggestedInstructors, sendInvitation } = useProjectInvitations(projectId, currentUserId, projectCourseId)

  const isBachelorProject = projectCourseId === 'course-001'

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

        {!isBachelorProject && isOwner && (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => openSearchModal('Course Instructor')}
              className="px-6 py-2 bg-surface-container-high text-primary rounded-xl font-jakarta font-bold hover:bg-surface-container transition-all flex items-center justify-center gap-2 border border-primary/20"
            >
              <span className="material-symbols-outlined text-[20px]">school</span>
              Invite Instructor
            </button>
            <button
              onClick={() => openSearchModal('Student')}
              className="px-6 py-2 bg-primary text-on-primary rounded-xl font-jakarta font-bold hover:shadow-raised transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Invite Collaborator
            </button>
          </div>
        )}
      </div>

      {/* Bachelor Project Banner */}
      {isBachelorProject && (
        <div className="bg-primary-container/20 rounded-xl p-4 border border-primary/10">
          <p className="text-sm text-on-surface-variant">
            <span className="font-jakarta font-semibold text-on-surface">ℹ️ Note:</span> This is a Bachelor's project and does not support collaborators. Only the project owner can manage tasks.
          </p>
        </div>
      )}

      {/* Suggested Instructors (Requirement 3) */}
      {!isBachelorProject && isOwner && suggestedInstructors.length > 0 && (
        <div className="bg-surface-container-low/40 rounded-2xl p-6 border border-outline-variant/20 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            <h3 className="text-sm font-jakarta font-bold text-on-surface uppercase tracking-wider">Suggested Instructors</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedInstructors.map(instructor => (
              <div key={instructor.userId} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between group hover:border-primary/40 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-xs">
                    {instructor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-jakarta font-bold text-on-surface">{instructor.name}</p>
                    <p className="text-[10px] font-lexend text-on-surface-variant italic">Course Instructor</p>
                  </div>
                </div>
                <button
                  onClick={() => sendInvitation(instructor.userId, instructor.email, instructor.name)}
                  className="p-2 rounded-lg bg-primary/5 text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-on-primary"
                  title="Send Invitation"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      {!isBachelorProject && (
        <div className="bg-primary-container/20 rounded-xl p-4 border border-primary/10">
          <p className="text-sm text-on-surface-variant">
            <span className="font-jakarta font-semibold text-on-surface">💡 Tip:</span> You can invite
            both students and instructors to collaborate on your project. Instructors can provide
            feedback and grade your work.
          </p>
        </div>
      )}

      {/* Collaborator List */}
      <CollaboratorList
        projectId={projectId}
        currentUserId={currentUserId}
        isOwner={isOwner}
        projectCourseId={projectCourseId}
      />

      {/* Search Collaborator Modal */}
      <SearchCollaboratorModal
        projectId={projectId}
        currentUserId={currentUserId}
        projectCourseId={projectCourseId}
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onInvitationSent={handleInvitationSent}
        roleFilter={modalRole}
      />
    </div>
  )
}
