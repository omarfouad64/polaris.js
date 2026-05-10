import Button from './Button'

/**
 * ConfirmDialog — modal confirmation dialog with confirm and cancel actions.
 *
 * @param isOpen - Whether the dialog is visible.
 * @param title - Short title describing the action to confirm.
 * @param message - Detailed message shown in the dialog body.
 * @param confirmLabel - Label for the confirm/destructive action button.
 * @param cancelLabel - Label for the cancel button.
 * @param onConfirm - Callback invoked when the user confirms.
 * @param onCancel - Callback invoked when the user cancels.
 * @param variant - Visual style of the confirm button ('danger' or 'primary').
 */
interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'primary'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-on-background/30 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onCancel}
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-md shadow-floating"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          {variant === 'danger' && (
            <span className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </span>
          )}
          <h2
            id="confirm-dialog-title"
            className="text-xl font-jakarta font-bold text-on-surface"
          >
            {title}
          </h2>
        </div>
        <p className="text-sm font-lexend text-on-surface-variant mb-8 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <button
            onClick={onConfirm}
            className={`inline-flex items-center justify-center rounded-lg font-jakarta font-semibold transition-all duration-200 active:translate-y-[1px] h-8 px-3 text-sm ${
              variant === 'danger'
                ? 'bg-error text-on-error hover:bg-error/90'
                : 'bg-primary text-on-primary hover:bg-primary-container'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
