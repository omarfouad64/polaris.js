import { useState, useMemo } from 'react'
import type { Notification } from '../types'

const dummyNotifications: Notification[] = [
  { id: 'n-1', type: 'message', title: 'New Message', body: 'Ahmed Hassan sent you a message.', timestamp: '2026-04-30T10:30:00Z', read: false },
  { id: 'n-2', type: 'internship_status', title: 'Application Accepted', body: 'Your application for "Software Engineering Intern" at TechVentures has been accepted!', timestamp: '2026-04-29T16:00:00Z', read: false },
  { id: 'n-3', type: 'message', title: 'New Message', body: 'Sara Mohamed sent you a message about the internship.', timestamp: '2026-04-28T09:20:00Z', read: true },
  { id: 'n-4', type: 'project_invitation', title: 'Project Invitation', body: 'You have been invited to collaborate on "AI Study Planner".', timestamp: '2026-04-27T14:00:00Z', read: true },
  { id: 'n-5', type: 'feedback', title: 'Instructor Feedback', body: 'Dr. Mona left feedback on your project task "API Integration".', timestamp: '2026-04-26T11:00:00Z', read: true },
  { id: 'n-6', type: 'internship_status', title: 'Application Rejected', body: 'Your application for "UX Research Intern" at DesignCo has been declined.', timestamp: '2026-04-25T09:00:00Z', read: true },
  { id: 'n-7', type: 'message', title: 'New Message', body: 'Dr. Mona Farid updated the project feedback.', timestamp: '2026-04-24T15:45:00Z', read: true }
]

/**
 * useNotifications — provides notification data and management operations.
 *
 * @returns notifications list, mark-read functions, and unread count.
 */
export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications)

  const unreadCount = useMemo(() =>
    notifications.filter(n => !n.read).length,
    [notifications]
  )

  const toggleRead = (id: string): void => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    ))
  }

  const markAllRead = (): void => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return { notifications, unreadCount, toggleRead, markAllRead }
}
