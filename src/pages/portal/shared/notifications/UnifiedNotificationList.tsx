import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useNotifications from '../../../../hooks/useNotifications'
import { useProjectNotifications } from '../../../../hooks/useProjectNotifications'
import { useGlobalContext } from '../../../../globalContext'

const nIcons: Record<string, string> = {
  message: 'chat_bubble',
  internship_status: 'work',
  project_invitation: 'group_add',
  feedback: 'comment',
  flag: 'flag',
  admin: 'admin_panel_settings',
  appeal_response: 'gavel',
}

/**
 * UnifiedNotificationList — Shared component for displaying merged notifications
 * with a global mute toggle (Req 91) and mark-read controls (Req 36).
 * Used in both CommunicationsPage and the standalone NotificationCenter.
 */
export default function UnifiedNotificationList(): React.JSX.Element {
  const navigate = useNavigate()
  const { user } = useGlobalContext()
  const {
    notifications: generalNotifs,
    toggleRead,
    markAllRead,
    notificationsMuted,
    toggleMuteAll,
  } = useNotifications()
  const { notifications: projectNotifs, markAsRead, markAllAsRead } = useProjectNotifications()

  const allNotifications = useMemo(() => {
    return [...generalNotifs, ...projectNotifs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  }, [generalNotifs, projectNotifs])

  const rolePath = user?.role === 'Course Instructor' ? 'instructor'
    : user?.role === 'Administrator' ? 'administrator'
    : user?.role === 'Employer' ? 'employer'
    : 'student'

  const handleToggle = (n: { id: string; type: string; read: boolean }): void => {
    if (n.type === 'project_invitation') {
      markAsRead(n.id)
    } else {
      toggleRead(n.id)
    }
  }

  const handleMarkAll = (): void => {
    markAllRead()
    markAllAsRead()
  }

  const handleNavigate = (n: { id: string; read: boolean; link?: string; type: string }) => {
    if (!n.read) {
      handleToggle(n)
    }
    const link = n.link

    // Admin-type notifications route to specific admin pages
    if (n.type === 'admin') {
      if (link) {
        navigate(link)
        return
      }
      navigate(`/portal/${rolePath}`)
      return
    }

    // Flag notifications for admin go to moderation
    if (n.type === 'flag' && rolePath === 'administrator') {
      if (link) {
        navigate(link)
        return
      }
      navigate(`/portal/${rolePath}/moderation`)
      return
    }

    // Message notifications link to the Communications page
    if (n.type === 'message') {
      navigate(`/portal/${rolePath}/communications`)
      return
    }

    // Internship status notifications link to the internships page
    if (n.type === 'internship_status') {
      navigate(`/portal/${rolePath}/internships`)
      return
    }

    // Project-related notifications link to the project details page
    if (n.type === 'feedback' || n.type === 'flag' || n.type === 'appeal_response') {
      const projectId = (n as any).projectId
      if (projectId) {
        navigate(`/portal/${rolePath}/projects/${projectId}/view`)
        return
      }
    }

    if (link) {
      if (link.startsWith('http')) {
        window.open(link, '_blank')
      } else {
        navigate(link)
      }
    } else {
      navigate(`/portal/${rolePath}/notifications`)
    }
  }

  const fmt = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime()
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
    return new Date(iso).toLocaleDateString()
  }

  return (
    <div className="space-y-4">
      {/* ── Controls Row ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        {/* Mute All toggle (Req 91) */}
        <button
          onClick={toggleMuteAll}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border font-jakarta font-semibold text-sm transition-all duration-200 ${
            notificationsMuted
              ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
              : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30 hover:bg-surface-container hover:text-on-surface'
          }`}
          aria-pressed={notificationsMuted}
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: notificationsMuted ? "'FILL' 1" : "'FILL' 0" }}
          >
            {notificationsMuted ? 'volume_off' : 'notifications'}
          </span>
          {notificationsMuted ? 'Notifications Muted' : 'Mute All'}
        </button>

        {/* Mark all read */}
        <button
          id="btn-mark-all-read"
          onClick={handleMarkAll}
          className="text-sm font-jakarta text-primary hover:underline focus-visible:ring-2 focus-visible:ring-secondary rounded-lg px-3 py-1"
        >
          Mark All Read
        </button>
      </div>

      {/* ── Muted Banner ─────────────────────────────────────── */}
      {notificationsMuted && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-error/5 border border-error/20 animate-in fade-in duration-300">
          <span
            className="material-symbols-outlined text-error text-[22px] flex-shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            notifications_paused
          </span>
          <div className="flex-1">
            <p className="text-sm font-jakarta font-bold text-error">Notifications are paused</p>
            <p className="text-xs font-lexend text-on-surface-variant mt-0.5">
              You will not receive new notification alerts. Toggle above to re-enable.
            </p>
          </div>
        </div>
      )}

      {/* ── Notification List ─────────────────────────────────── */}
      {allNotifications.length === 0 ? (
        <div
          className="text-center py-12 bg-surface-container-lowest rounded-xl border border-outline-variant/40"
          style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}
        >
          <span className="material-symbols-outlined text-[48px] text-outline/40">
            notifications_off
          </span>
          <p className="font-lexend text-on-surface-variant mt-2">No notifications.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allNotifications.map(n => (
            <div
              key={n.id}
              role="button"
              tabIndex={0}
              onClick={() => handleNavigate(n)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleNavigate(n)
                }
              }}
              className={`flex items-start gap-3 p-4 rounded-xl border border-outline-variant/40 transition-colors cursor-pointer hover:bg-surface-container ${
                n.read ? 'bg-surface-container-lowest' : 'bg-surface-container-low'
              } ${notificationsMuted ? 'opacity-60' : ''}`}
            >
              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              )}
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant mt-0.5 flex-shrink-0">
                {nIcons[n.type] ?? 'notifications'}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm ${
                    n.read ? 'font-lexend' : 'font-jakarta font-semibold'
                  } text-on-surface`}
                >
                  {n.title}
                </p>
                <p className="text-sm font-lexend text-on-surface-variant mt-0.5">{n.body}</p>
                <p className="text-xs font-lexend text-outline mt-1">{fmt(n.timestamp)}</p>
              </div>
              <button
                onClick={e => { e.stopPropagation(); handleToggle(n) }}
                className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors focus-visible:ring-2 focus-visible:ring-secondary"
                aria-label={n.read ? 'Mark unread' : 'Mark read'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {n.read ? 'mark_email_unread' : 'mark_email_read'}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
