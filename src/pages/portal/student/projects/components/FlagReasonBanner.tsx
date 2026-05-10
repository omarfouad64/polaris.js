/**
 * FlagReasonBanner — displayed at the bottom of flagged project cards.
 *
 * @param reason - The flag reason text.
 * @param description - Optional additional details.
 */
interface FlagReasonBannerProps {
  reason: string
  description?: string
}

export default function FlagReasonBanner({ reason, description }: FlagReasonBannerProps) {
  return (
    <div className="mt-auto pt-4 border-t border-error/20">
      <p className="text-xs font-lexend text-error leading-relaxed">
        <span className="font-bold">Reason:</span> {reason}
      </p>
      {description && (
        <p className="text-xs font-lexend text-on-surface-variant mt-1">{description}</p>
      )}
    </div>
  )
}
