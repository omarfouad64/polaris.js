import { useProjectNotifications } from '../../../../hooks/useProjectNotifications'

/**
 * InvitationNotificationsCenter – displays project invitation notifications.
 * Shows unread invitations and allows marking as read.
 * Can be used as a component in notifications dropdown or full page.
 */
export default function InvitationNotificationsCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useProjectNotifications()

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId)
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-jakarta font-bold text-on-surface mb-2">
            Invitation Notifications
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Stay updated with your project invitations
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm font-jakarta font-semibold text-secondary hover:bg-secondary-container/20 rounded-lg transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Unread Count Badge */}
      {unreadCount > 0 && (
        <div className="mb-6 bg-secondary-container/20 rounded-xl p-4 border border-secondary/20">
          <p className="text-body-md text-on-surface-variant">
            You have <span className="font-jakarta font-bold text-secondary">{unreadCount}</span> unread
            invitation{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`rounded-xl border shadow-sm transition-all ${
                !notification.read
                  ? 'bg-primary-container/10 border-primary/30 shadow-md'
                  : 'bg-surface-container-lowest border-surface-container-high'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📬</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-jakarta font-bold text-on-surface">
                          {notification.title}
                        </h3>
                      </div>
                      {!notification.read && (
                        <span className="shrink-0 w-3 h-3 rounded-full bg-secondary animate-pulse" />
                      )}
                    </div>

                    {/* Message */}
                    <p className="text-body-md text-on-surface mb-2">
                      {notification.body}
                    </p>

                    {/* Project & Sender Info */}
                    <div className="bg-surface-container rounded-lg p-3 mb-4">
                      <p className="text-sm font-jakarta font-semibold text-on-surface mb-1">
                        {notification.projectTitle}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        From: <span className="font-semibold">{notification.senderName}</span>
                      </p>
                    </div>

                    {/* Timestamp */}
                    <p className="text-xs text-on-surface-variant">
                      {getRelativeTime(notification.timestamp)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="px-3 py-1 text-xs font-jakarta font-semibold bg-secondary text-on-secondary hover:bg-secondary-container rounded-lg transition-colors whitespace-nowrap"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="px-3 py-1 text-xs font-jakarta font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Action Button */}
                <button className="mt-4 w-full px-4 py-2 bg-primary text-on-primary rounded-lg font-jakarta font-semibold hover:bg-primary-container transition-colors">
                  View Invitations
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-surface-container rounded-xl p-12 text-center">
            <p className="text-body-md text-on-surface-variant mb-2">
              No invitation notifications
            </p>
            <p className="text-body-sm text-on-surface-variant">
              When you receive an invitation, a notification will appear here
            </p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 bg-surface-container rounded-xl p-6 border border-surface-container-high">
        <h3 className="font-jakarta font-semibold text-on-surface mb-2">💡 Notification Tips</h3>
        <ul className="text-body-sm text-on-surface-variant space-y-2">
          <li>• Notifications are sent immediately when you're invited to a project</li>
          <li>• Unread notifications are highlighted for easy identification</li>
          <li>• Mark as read to dismiss the notification</li>
          <li>• View all invitations in the Project Invitations page</li>
        </ul>
      </div>
    </div>
  )
}

// Helper function to get relative time
function getRelativeTime(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return then.toLocaleDateString()
}