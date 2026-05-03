import { useState } from 'react'
import { useInstructorFeedback } from '../../../../../hooks/useInstructorFeedback'

interface TaskFeedbackFormProps {
  projectId: string
  taskId: string
  taskTitle: string
  instructorId: string
  instructorName: string
  isOpen: boolean
  onClose: () => void
  onFeedbackSubmitted: () => void
}

/**
 * TaskFeedbackForm – modal for instructors to add feedback on project tasks.
 * Allows adding comments and guidance for task completion.
 */
export default function TaskFeedbackForm({
  projectId,
  taskId,
  taskTitle,
  instructorId,
  instructorName,
  isOpen,
  onClose,
  onFeedbackSubmitted
}: TaskFeedbackFormProps) {
  const [feedbackText, setFeedbackText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { addTaskFeedback } = useInstructorFeedback(projectId)

  const handleSubmit = async () => {
    if (!feedbackText.trim()) return

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call

      addTaskFeedback(taskId, instructorId, instructorName, feedbackText.trim())
      setSubmitted(true)

      setTimeout(() => {
        setSubmitted(false)
        setFeedbackText('')
        onFeedbackSubmitted()
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
        <div className="border-b border-surface-container-high p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-jakarta font-bold text-on-surface">
              Add Task Feedback
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">{taskTitle}</p>
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
              {/* Feedback Textarea */}
              <div>
                <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Provide constructive feedback on this task..."
                  rows={6}
                  className="w-full px-4 py-3 border border-outline rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                  autoFocus
                />
                <p className="text-xs text-on-surface-variant mt-2">
                  {feedbackText.length} characters
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-primary-container/20 rounded-lg p-4 border border-primary/10">
                <p className="text-sm text-on-surface-variant">
                  <span className="font-jakarta font-semibold text-on-surface">💡 Tip:</span> Be
                  constructive and specific. Provide actionable feedback that helps students improve.
                </p>
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
                  onClick={handleSubmit}
                  disabled={!feedbackText.trim() || isSubmitting}
                  className={`flex-1 px-4 py-2 rounded-lg font-jakarta font-semibold transition-colors ${
                    feedbackText.trim() && !isSubmitting
                      ? 'bg-primary text-on-primary hover:bg-primary-container'
                      : 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </>
          ) : (
            // Success State
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✓</div>
              <p className="font-jakarta font-bold text-on-surface mb-2">
                Feedback Submitted!
              </p>
              <p className="text-body-sm text-on-surface-variant">
                Your feedback has been added to the task. A notification will be sent to the team.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}