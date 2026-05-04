/**
 * ConfirmationDialog — modal dialog for confirming irreversible or sensitive actions.
 *
 * @param isOpen - Whether the dialog is visible.
 * @param title - Short title describing the action.
 * @param message - Detailed message explaining the impact.
 * @param confirmLabel - Label for the confirm action button.
 * @param cancelLabel - Label for the cancel action button.
 * @param tone - Visual emphasis for the confirm action.
 * @param onConfirm - Callback invoked when the user confirms.
 * @param onCancel - Callback invoked when the user cancels.
 */
import Button from './Button'

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'primary' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  onConfirm,
  onCancel
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  const confirmClassName =
    tone === 'danger' ? 'bg-error hover:opacity-90' : ''

  return (
    <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-xl p-8 w-full max-w-lg shadow-floating">
        <h2 className="text-2xl font-jakarta font-semibold text-on-background mb-4">
          {title}
        </h2>
        <p className="text-base font-lexend text-on-surface mb-6">
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="primary" onClick={onConfirm} className={confirmClassName}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
