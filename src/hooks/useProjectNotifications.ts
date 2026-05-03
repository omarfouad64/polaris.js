import { useState, useCallback, useMemo } from 'react'
import type { Notification } from '../types'

export interface ProjectInvitationNotification extends Notification {
  type: 'project_invitation'
  projectId: string
  projectTitle: string
  senderName: string
  senderId: string
}

// Dummy notification data
const DUMMY_NOTIFICATIONS: ProjectInvitationNotification[] = [
  {
    id: 'notif-001',
    type: 'project_invitation',
    title: 'New Project Invitation',
    body: 'You have been invited to join the E-Commerce Platform project',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
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
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
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
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    read: true,
    projectId: 'proj-003',
    projectTitle: 'Mobile App Development',
    senderName: 'Dr. Fatima Al-Mansouri',
    senderId: 'instructor-001',
    link: '/portal/student/invitations'
  }
]

/**
 * useProjectNotifications – manages project invitation notifications.
 * Provides methods to view, mark as read, and track invitation notifications.
 *
 * @returns Object containing notifications, filtering, and action functions.
 */
export function useProjectNotifications() {
  const [notifications, setNotifications] = useState<ProjectInvitationNotification[]>(
    DUMMY_NOTIFICATIONS
  )

  // Get unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length
  }, [notifications])

  // Get only project invitation notifications
  const invitationNotifications = useMemo(() => {
    return notifications.filter(n => n.type === 'project_invitation')
  }, [notifications])

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }, [])

  // Delete notification
  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    )
  }, [])

  // Add new notification
  const addNotification = useCallback((notification: ProjectInvitationNotification) => {
    setNotifications(prev => [notification, ...prev])
  }, [])

  // Get notification by ID
  const getNotificationById = useCallback((id: string) => {
    return notifications.find(n => n.id === id)
  }, [notifications])

  return {
    // State
    notifications: invitationNotifications,
    allNotifications: notifications,
    unreadCount,

    // Actions
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    getNotificationById
  }
}