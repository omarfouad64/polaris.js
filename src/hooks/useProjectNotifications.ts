import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'

export interface ProjectInvitationNotification {
  id: string
  type: 'project_invitation'
  title: string
  body: string
  timestamp: string
  read: boolean
  projectId: string
  projectTitle: string
  senderName: string
  senderId: string
  link?: string
}

/**
 * useProjectNotifications — reads project invitation notifications from Redux store.
 */
export function useProjectNotifications() {
  const dispatch = useDispatch()
  const allNotifs = useSelector((state: RootState) => state.database.notifications)

  const invitationNotifications = useMemo(
    () => allNotifs.filter((n: any) => n.type === 'project_invitation'),
    [allNotifs]
  )

  const unreadCount = useMemo(
    () => invitationNotifications.filter((n: any) => !n.read).length,
    [invitationNotifications]
  )

  const markAsRead = (notificationId: string) => {
    dispatch({ type: 'database/toggleNotificationRead', payload: notificationId })
  }

  const markAllAsRead = () => {
    const projNotifs = invitationNotifications.filter((n: any) => !n.read)
    projNotifs.forEach((n: any) => {
      dispatch({ type: 'database/toggleNotificationRead', payload: n.id })
    })
  }

  const deleteNotification = (notificationId: string) => {
    dispatch({ type: 'database/removeNotification', payload: notificationId })
  }

  const addNotification = (notification: Omit<ProjectInvitationNotification, 'id' | 'timestamp' | 'read'>) => {
    dispatch({
      type: 'database/addNotification',
      payload: { ...notification, type: 'project_invitation' },
    })
  }

  const getNotificationById = (id: string) => {
    return allNotifs.find((n: any) => n.id === id)
  }

  return {
    notifications: invitationNotifications,
    allNotifications: allNotifs,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    getNotificationById,
  }
}
