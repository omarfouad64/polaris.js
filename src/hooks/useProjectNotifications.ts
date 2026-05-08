import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import type { Notification } from '../types'

export interface ProjectInvitationNotification extends Notification {
  type: 'project_invitation'
  projectId: string
  projectTitle: string
  senderName: string
  senderId: string
}

// Dummy notification data
const INITIAL_NOTIFICATIONS: ProjectInvitationNotification[] = [
  {
    id: 'notif-001',
    type: 'project_invitation',
    title: 'New Project Invitation',
    body: 'You have been invited to join the E-Commerce Platform project',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    projectId: 'proj-001',
    projectTitle: 'E-Commerce Platform',
    senderName: 'Ahmed Hassan',
    senderId: 'student-001',
    link: '/portal/student/invitations'
  },
  {
    id: 'notif-002',
    type: 'project_invitation',
    title: 'New Project Invitation',
    body: 'You have been invited to join the AI Chatbot project',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    projectId: 'proj-002',
    projectTitle: 'AI Chatbot',
    senderName: 'Fatima Mousa',
    senderId: 'student-002',
    link: '/portal/student/invitations'
  },
  {
    id: 'notif-003',
    type: 'project_invitation',
    title: 'New Project Invitation',
    body: 'You have been invited to join the Mobile App Development project',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    projectId: 'proj-003',
    projectTitle: 'Mobile App Development',
    senderName: 'Dr. Fatima Al-Mansouri',
    senderId: 'instructor-001',
    link: '/portal/student/invitations'
  }
]

// ── Shared module-level state ──────────────────────────────────────────────
type Listener = () => void

let sharedNotifications: ProjectInvitationNotification[] = [...INITIAL_NOTIFICATIONS]
const listeners: Set<Listener> = new Set()

function emit() {
  listeners.forEach(fn => fn())
}

/**
 * useProjectNotifications – manages project invitation notifications.
 * Uses shared module-level state so that all consumers (Header, NotificationCenter)
 * stay in sync.
 *
 * @returns Object containing notifications, filtering, and action functions.
 */
export function useProjectNotifications() {
  const [, setTick] = useState(0)
  const tickRef = useRef(0)

  useEffect(() => {
    const listener = () => {
      tickRef.current += 1
      setTick(tickRef.current)
    }
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, [])

  // Get unread count
  const unreadCount = useMemo(() => {
    return sharedNotifications.filter(n => !n.read).length
  }, [sharedNotifications]) // eslint-disable-line react-hooks/exhaustive-deps

  // Get only project invitation notifications
  const invitationNotifications = useMemo(() => {
    return sharedNotifications.filter(n => n.type === 'project_invitation')
  }, [sharedNotifications]) // eslint-disable-line react-hooks/exhaustive-deps

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    sharedNotifications = sharedNotifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    )
    emit()
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    sharedNotifications = sharedNotifications.map(notif => ({ ...notif, read: true }))
    emit()
  }, [])

  // Delete notification
  const deleteNotification = useCallback((notificationId: string) => {
    sharedNotifications = sharedNotifications.filter(notif => notif.id !== notificationId)
    emit()
  }, [])

  // Add new notification
  const addNotification = useCallback((notification: ProjectInvitationNotification) => {
    sharedNotifications = [notification, ...sharedNotifications]
    emit()
  }, [])

  // Get notification by ID
  const getNotificationById = useCallback((id: string) => {
    return sharedNotifications.find(n => n.id === id)
  }, [])

  return {
    // State
    notifications: invitationNotifications,
    allNotifications: sharedNotifications,
    unreadCount,

    // Actions
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    getNotificationById
  }
}