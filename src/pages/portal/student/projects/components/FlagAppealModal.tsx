import { useState } from 'react'
import { useProjectModeration } from '../../../../../hooks/useProjectModeration'

interface FlagAppealModalProps {
  projectId: string
  flagId: string
  flagReason: string
  flagDescription?: string
  studentId: string
  studentName: string
  isOpen: boolean
  onClose: () => void
  onAppealSubmitted: () => void
}

/**
 * FlagAppealModal – allows students to appeal a flagged project.
 * Students can submit explanation and evidence of original work.
 */
export default function FlagAppealModal({
  projectId,
  flagId,
  flagReason,
  flagDescription,
  studentId,
  studentName,
  isOpen,
  onClose,
  onAppealSubmitted
}: FlagAppealModalProps) {
  const [appealMessage, setAppealMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { submitAppeal } = useProjectModeration()

  const handleSubmitAppeal = async () => {
    if (!appealMessage.trim()) return

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      submitAppeal(flagId, projectId, studentId, studentName, appealMessage.trim())
      setSubmitted(true)

      setTimeout(() => {
        setSubmitted(false)
        setAppealMessage('')
        onAppealSubmitted()
        onClose()
      }, 1500)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg max-w-2xl w-full">
        {/* Modal Header */}
        <div className="border-b border-surface-container-high p-6 flex justify-between items-center bg-error/10">
          <div>
            <h2 className="text-xl font-jakarta font-bold text-on-surface">
              Appeal Flagged Project
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Reason: <span className="font-semibold">{flagReason}</span>
            </p>
          </div>
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
          {!submitted ? (
            <>
              {/* Flag Details */}
              {flagDescription && (
                <div className="bg-surface-container rounded-lg p-4 border border-surface-container-high">
                  <p className="text-sm font-jakarta font-semibold text-on-surface-variant mb-1">
                    Flag Details
                  </p>
                  <p className="text-body-sm text-on-surface">
                    {flagDescription}
                  </p>
                </div>
              )}

              {/* Warning Box */}
              <div className="bg-error/10 rounded-lg p-4 border border-error/20">
                <p className="text-sm text-on-surface-variant">
                  <span className="font-jakarta font-semibold text-error">⚠️ Important:</span> Your
                  project is currently flagged and hidden. Submit a compelling appeal to restore it.
                </p>
              </div>

              {/* Appeal Message Textarea */}
              <div>
                <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
                  Appeal Message
                </label>
                <textarea
                  value={appealMessage}
                  onChange={(e) => setAppealMessage(e.target.value)}
                  placeholder="Explain why this flag was made in error. Provide details about your work process, development timeline, and any evidence of original work..."
                  rows={8}
                  className="w-full px-4 py-3 border border-outline rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  autoFocus
                />
                <p className="text-xs text-on-surface-variant mt-2">
                  {appealMessage.length} characters (minimum 50 recommended)
                </p>
              </div>

              {/* Guidelines */}
              <div className="bg-surface-container rounded-lg p-4">
                <p className="text-sm font-jakarta font-semibold text-on-surface mb-2">
                  📋 Appeal Guidelines
                </p>
                <ul className="text-xs text-on-surface-variant space-y-1">
                  <li>• Explain your development process and timeline</li>
                  <li>• Reference any learning resources or libraries you used</li>
                  <li>• If work was collaborative, clearly state each person's contribution</li>
                  <li>• Provide links to git repositories or development history if available</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-outline text-on-surface rounded-lg font-jakarta font-semibold hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAppeal}
                  disabled={appealMessage.length < 20 || isSubmitting}
                  className={`flex-1 px-4 py-2 rounded-lg font-jakarta font-semibold transition-colors ${
                    appealMessage.length >= 20 && !isSubmitting
                      ? 'bg-secondary text-on-secondary hover:bg-secondary-container'
                      : 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Appeal'}
                </button>
              </div>
            </>
          ) : (
            // Success State
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✓</div>
              <p className="font-jakarta font-bold text-on-surface mb-2">
                Appeal Submitted!
              </p>
              <p className="text-body-sm text-on-surface-variant mb-4">
                Your appeal has been received. An administrator will review it within 48 hours.
              </p>
              <p className="text-xs text-on-surface-variant">
                You will receive a notification when the appeal is resolved.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}