import UnifiedNotificationList from './UnifiedNotificationList'

/**
 * NotificationCenter — standalone page for notifications.
 * Uses the exact same component as the Communications notifications tab.
 */
export default function NotificationCenter(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-jakarta font-bold text-on-surface">Notifications</h2>
        <p className="font-lexend text-on-surface-variant text-sm">Stay updated with your platform activities.</p>
      </div>
      
      <UnifiedNotificationList />
    </div>
  )
}
