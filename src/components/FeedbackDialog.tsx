/**
 * FeedbackDialog — modal dialog for success or informational feedback.
 *
 * @param isOpen - Whether the dialog is visible.
 * @param title - Short title describing the outcome.
 * @param message - Message shown in the dialog body.
 * @param actionLabel - Label for the dismiss button.
 * @param onClose - Callback invoked when the dialog is dismissed.
 */
import Button from './Button'

interface FeedbackDialogProps {
  isOpen: boolean
  title: string
  message: string
  actionLabel?: string
  onClose: () => void
}

export default function FeedbackDialog({
  isOpen,
  title,
  message,
  actionLabel = 'OK',
  onClose
}: FeedbackDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-on-background/20 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-xl p-8 w-full max-w-lg shadow-floating text-center">
        <h2 className="text-2xl font-jakarta font-semibold text-on-background mb-4">
          {title}
        </h2>
        <p className="text-base font-lexend text-on-surface mb-6">
          {message}
        </p>
        <div className="flex justify-center">
          <Button variant="primary" onClick={onClose}>
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
