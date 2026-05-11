/**
 * NotificationBadge — displays a red bubble count badge overlaid on an icon container.
 * Only renders when count > 0.
 *
 * @param count - Number to display in the badge.
 */
interface NotificationBadgeProps {
  count: number
}

export default function NotificationBadge({ count }: NotificationBadgeProps) {
  if (!count || count <= 0) return null

  return (
    <span className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 bg-error text-on-error text-[10px] font-jakarta font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1">
      {count}
    </span>
  )
}
