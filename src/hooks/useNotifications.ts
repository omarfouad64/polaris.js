import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import type { Notification } from '../types'

const STORAGE_KEY = 'polaris_notifications'

const dummyNotifications: Notification[] = [
  { id: 'n-1', type: 'message', title: 'New Message', body: 'Ahmed Hassan sent you a message.', timestamp: '2026-04-30T10:30:00Z', read: false },
  { id: 'n-2', type: 'internship_status', title: 'Application Accepted', body: 'Your application for "Software Engineering Intern" at TechVentures has been accepted!', timestamp: '2026-04-29T16:00:00Z', read: false },
  { id: 'n-3', type: 'message', title: 'New Message', body: 'Sara Mohamed sent you a message about the internship.', timestamp: '2026-04-28T09:20:00Z', read: true },
  { id: 'n-4', type: 'project_invitation', title: 'Project Invitation', body: 'You have been invited to collaborate on "AI Study Planner".', timestamp: '2026-04-27T14:00:00Z', read: true },
  { id: 'n-5', type: 'feedback', title: 'Instructor Feedback', body: 'Dr. Mona left feedback on your project task "API Integration".', timestamp: '2026-04-26T11:00:00Z', read: true },
  { id: 'n-6', type: 'internship_status', title: 'Application Rejected', body: 'Your application for "UX Research Intern" at DesignCo has been declined.', timestamp: '2026-04-25T09:00:00Z', read: true },
  { id: 'n-7', type: 'message', title: 'New Message', body: 'Dr. Mona Farid updated the project feedback.', timestamp: '2026-04-24T15:45:00Z', read: true }
]

// ── Shared module-level state ──────────────────────────────────────────────
// Every useNotifications() instance subscribes here so that when ONE
// component calls toggleRead / markAllRead, ALL consumers re-render
// (including the Header badge).

type Listener = () => void

const loadInitial = (): Notification[] => {
  if (typeof window === 'undefined') return dummyNotifications
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) return dummyNotifications
  try {
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : dummyNotifications
  } catch {
    return dummyNotifications
  }
}

let sharedNotifications: Notification[] = loadInitial()
const listeners: Set<Listener> = new Set()

function emit() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedNotifications))
  }
  listeners.forEach(fn => fn())
}

/**
 * useNotifications — provides notification data and management operations.
 * Uses a shared module-level store so every component that calls this hook
 * sees the same data and re-renders together.
 *
 * @returns notifications list, mark-read functions, and unread count.
 */
export default function useNotifications() {
  // Force re-render when shared state changes
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

  const notifications = sharedNotifications

  const unreadCount = useMemo(() =>
    notifications.filter(n => !n.read).length,
    [notifications]
  )

  const toggleRead = useCallback((id: string): void => {
    sharedNotifications = sharedNotifications.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    )
    emit()
  }, [])

  const markAllRead = useCallback((): void => {
    sharedNotifications = sharedNotifications.map(n => ({ ...n, read: true }))
    emit()
  }, [])

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false
      }
      sharedNotifications = [newNotification, ...sharedNotifications]
      emit()
    },
    []
  )

  return { notifications, unreadCount, toggleRead, markAllRead, addNotification }
}
