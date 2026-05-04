import { useState } from 'react'
import FlagAppealModal from './FlagAppealModal'
import { useProjectModeration } from '../../../../../hooks/useProjectModeration'

interface FlaggedProjectBannerProps {
  projectId: string
  projectTitle: string
  studentId: string
  studentName: string
}

/**
 * FlaggedProjectBanner – displays warning when project is flagged.
 * Shows flag reason and provides appeal button.
 */
export default function FlaggedProjectBanner({
  projectId,
  studentId,
  studentName
}: FlaggedProjectBannerProps) {
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false)

  const { flaggedProjects, getAppealForProject, submitAppeal } = useProjectModeration()

  const flaggedProject = flaggedProjects.find(f => f.projectId === projectId)
  const appeal = getAppealForProject(projectId)

  if (!flaggedProject) return null

  return (
    <>
      {/* Flag Banner */}
      <div className="bg-error/15 border-2 border-error rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="text-3xl shrink-0">⚠️</div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-jakarta font-bold text-error mb-2">
              Project Flagged
            </h3>

            <p className="text-body-md text-on-surface mb-3">
              <span className="font-jakarta font-semibold">Reason:</span> {flaggedProject.reason}
            </p>

            {flaggedProject.description && (
              <p className="text-body-sm text-on-surface-variant mb-4">
                {flaggedProject.description}
              </p>
            )}

            <p className="text-sm text-on-surface-variant mb-4">
              Flagged by: <span className="font-semibold">{flaggedProject.flaggedByName}</span> on{' '}
              {new Date(flaggedProject.flaggedAt).toLocaleDateString()}
            </p>

            {/* Status */}
            <div className="mb-4">
              {flaggedProject.status === 'flagged' && (
                <p className="text-sm text-on-surface-variant">
                  <span className="inline-block px-2 py-1 rounded-full bg-error text-error-container font-jakarta font-semibold text-xs">
                    🔴 Active Flag
                  </span>
                </p>
              )}
              {flaggedProject.status === 'appealed' && (
                <p className="text-sm text-on-surface-variant">
                  <span className="inline-block px-2 py-1 rounded-full bg-surface-container text-on-surface-variant font-jakarta font-semibold text-xs">
                    ⏳ Appeal Pending Review
                  </span>
                </p>
              )}
              {flaggedProject.status === 'resolved' && (
                <p className="text-sm text-on-surface-variant">
                  <span className="inline-block px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container font-jakarta font-semibold text-xs">
                    ✓ Resolved
                  </span>
                </p>
              )}
            </div>

            {/* Appeal Info */}
            {appeal && (
              <div className="bg-white/50 rounded-lg p-3 mb-4">
                <p className="text-xs text-on-surface-variant">
                  <span className="font-jakarta font-semibold">Appeal Status:</span>{' '}
                  {appeal.status === 'pending'
                    ? '⏳ Pending Review'
                    : appeal.status === 'approved'
                      ? '✓ Approved'
                      : '✕ Rejected'}
                </p>
              </div>
            )}

            {/* Action Button */}
            {flaggedProject.status === 'flagged' && !appeal && (
              <button
                onClick={() => setIsAppealModalOpen(true)}
                className="px-6 py-2 bg-error text-error-container rounded-lg font-jakarta font-semibold hover:bg-error/90 transition-colors"
              >
                Submit Appeal
              </button>
            )}

            {appeal && appeal.status === 'pending' && (
              <p className="text-xs text-on-surface-variant">
                Your appeal is under review. You will be notified of the decision.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Appeal Modal */}
      <FlagAppealModal
        projectId={projectId}
        flagId={flaggedProject.id}
        flagReason={flaggedProject.reason}
        flagDescription={flaggedProject.description}
        studentId={studentId}
        studentName={studentName}
        isOpen={isAppealModalOpen}
        onClose={() => setIsAppealModalOpen(false)}
        onAppealSubmitted={() => {
          setIsAppealModalOpen(false)
        }}
        onSubmitAppeal={submitAppeal}
      />
    </>
  )
}