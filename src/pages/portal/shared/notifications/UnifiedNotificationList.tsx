import { useMemo } from 'react'
import useNotifications from '../../../../hooks/useNotifications'
import { useProjectNotifications } from '../../../../hooks/useProjectNotifications'

const nIcons: Record<string, string> = {
  message: 'chat_bubble', 
  internship_status: 'work', 
  project_invitation: 'group_add',
  feedback: 'comment', 
  flag: 'flag', 
  admin: 'admin_panel_settings'
}

/**
 * UnifiedNotificationList — Shared component for displaying merged notifications.
 * Used in both CommunicationsPage and the standalone NotificationCenter.
 */
export default function UnifiedNotificationList(): React.JSX.Element {
  const { notifications: generalNotifs, toggleRead, markAllRead } = useNotifications()
  const { notifications: projectNotifs, markAsRead, markAllAsRead } = useProjectNotifications()

  const allNotifications = useMemo(() => {
    return [...generalNotifs, ...projectNotifs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [generalNotifs, projectNotifs])

  const handleToggle = (n: any) => {
    if (n.type === 'project_invitation') {
      markAsRead(n.id)
    } else {
      toggleRead(n.id)
    }
  }

  const handleMarkAll = () => {
    markAllRead()
    markAllAsRead()
  }

  const fmt = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime()
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return new Date(iso).toLocaleDateString()
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <button onClick={handleMarkAll} className="text-sm font-jakarta text-primary hover:underline focus-visible:ring-2 focus-visible:ring-secondary rounded-lg px-3 py-1">Mark All Read</button>
      </div>
      {allNotifications.length === 0 ? (
        <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-outline-variant/40" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
          <span className="material-symbols-outlined text-[48px] text-outline/40">notifications_off</span>
          <p className="font-lexend text-on-surface-variant mt-2">No notifications.</p>
        </div>
      ) : allNotifications.map(n => (
        <div key={n.id} className={`flex items-start gap-3 p-4 rounded-xl border border-outline-variant/40 transition-colors hover:bg-surface-container ${n.read ? 'bg-surface-container-lowest' : 'bg-surface-container-low'}`}>
          {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant mt-0.5 flex-shrink-0">{nIcons[n.type] ?? 'notifications'}</span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${n.read ? 'font-lexend' : 'font-jakarta font-semibold'} text-on-surface`}>{n.title}</p>
            <p className="text-sm font-lexend text-on-surface-variant mt-0.5">{n.body}</p>
            <p className="text-xs font-lexend text-outline mt-1">{fmt(n.timestamp)}</p>
          </div>
          <button onClick={() => handleToggle(n)} className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors focus-visible:ring-2 focus-visible:ring-secondary" aria-label={n.read ? 'Mark unread' : 'Mark read'}>
            <span className="material-symbols-outlined text-[18px]">{n.read ? 'mark_email_unread' : 'mark_email_read'}</span>
          </button>
        </div>
      ))}
    </div>
  )
}
