import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useGlobalContext } from '../globalContext'
import type { RootState } from '../store'
import type { Conversation, Message } from '../types'

const dummyConversations: Conversation[] = [
  { id: 'conv-1', participantId: 'u-1', participantName: 'Ahmed Hassan', participantAvatar: 'AH', participantRole: 'Student', lastMessage: 'Thanks for reviewing my portfolio!', lastTimestamp: '2026-04-30T10:30:00Z', unreadCount: 2 },
  { id: 'conv-2', participantId: 'u-2', participantName: 'Dr. Mona Farid', participantAvatar: 'MF', participantRole: 'Course Instructor', lastMessage: 'The project feedback has been updated.', lastTimestamp: '2026-04-29T15:45:00Z', unreadCount: 0 },
  { id: 'conv-3', participantId: 'u-3', participantName: 'Sara Mohamed', participantAvatar: 'SM', participantRole: 'Student', lastMessage: 'When is the application deadline?', lastTimestamp: '2026-04-28T09:20:00Z', unreadCount: 1 },
  { id: 'conv-4', participantId: 'hr@techcorp.com', participantName: 'TechCorp HR', participantAvatar: 'TH', participantProfilePicture: '/hr_headshot.png', participantRole: 'Employer', lastMessage: 'We would like to interview you for the position.', lastTimestamp: '2026-04-27T14:10:00Z', unreadCount: 0 },
]

const roleByParticipantId = new Map(dummyConversations.map(conv => [conv.participantId, conv.participantRole]))

const hydrateConversations = (items: Conversation[]): Conversation[] => {
  return items.map(conv =>
    conv.participantRole ? conv : { ...conv, participantRole: roleByParticipantId.get(conv.participantId) }
  )
}

const dummyMessages: Record<string, Message[]> = {
  'conv-1': [
    { id: 'm-1', senderId: 'u-1', senderName: 'Ahmed Hassan', senderRole: 'Student', receiverId: 'me', receiverName: 'Me', content: 'Hi! I noticed your company has open internship positions.', timestamp: '2026-04-30T10:00:00Z', read: true },
    { id: 'm-2', senderId: 'me', senderName: 'Me', receiverId: 'u-1', receiverName: 'Ahmed Hassan', receiverRole: 'Student', content: 'Yes, we have several positions open. Feel free to apply through the portal!', timestamp: '2026-04-30T10:15:00Z', read: true },
    { id: 'm-3', senderId: 'u-1', senderName: 'Ahmed Hassan', senderRole: 'Student', receiverId: 'me', receiverName: 'Me', content: 'Thanks for reviewing my portfolio!', timestamp: '2026-04-30T10:30:00Z', read: false },
  ],
  'conv-2': [
    { id: 'm-4', senderId: 'u-2', senderName: 'Dr. Mona Farid', senderRole: 'Course Instructor', receiverId: 'me', receiverName: 'Me', content: 'Hello, I wanted to discuss the project requirements.', timestamp: '2026-04-29T15:00:00Z', read: true },
    { id: 'm-5', senderId: 'me', senderName: 'Me', receiverId: 'u-2', receiverName: 'Dr. Mona Farid', receiverRole: 'Course Instructor', content: 'Of course! What would you like to discuss?', timestamp: '2026-04-29T15:30:00Z', read: true },
    { id: 'm-6', senderId: 'u-2', senderName: 'Dr. Mona Farid', senderRole: 'Course Instructor', receiverId: 'me', receiverName: 'Me', content: 'The project feedback has been updated.', timestamp: '2026-04-29T15:45:00Z', read: true },
  ],
  'conv-3': [
    { id: 'm-7', senderId: 'u-3', senderName: 'Sara Mohamed', senderRole: 'Student', receiverId: 'me', receiverName: 'Me', content: 'When is the application deadline?', timestamp: '2026-04-28T09:20:00Z', read: false },
  ],
}

/**
 * useMessages — reads messages and conversations from Redux store (falls back to local state).
 */
export default function useMessages() {
  const dispatch = useDispatch()
  const { user } = useGlobalContext()
  const reduxMessages = useSelector((state: RootState) => state.database.messages)
  const reduxConversations = useSelector((state: RootState) => state.database.conversations)

  const conversations = reduxConversations.length > 0 ? reduxConversations : hydrateConversations(dummyConversations)

  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? window.localStorage.getItem('polaris_active_conv') : null
  })

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem('polaris_active_conv', activeConversationId)
    }
  }, [activeConversationId])

  const activeConversation = useMemo(
    () => conversations.find(c => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId]
  )

  const activeMessages = useMemo(() => {
    const participantId = activeConversation?.participantId
    const myId = user?.username
    if (participantId && myId && reduxMessages.length > 0) {
      return reduxMessages.filter((m: Message) =>
        (m.senderId === participantId && m.receiverId === myId) ||
        (m.receiverId === participantId && m.senderId === myId)
      )
    }
    if (activeConversationId && dummyMessages[activeConversationId]) {
      return dummyMessages[activeConversationId]
    }
    return []
  }, [reduxMessages, activeConversationId, activeConversation])

  const sendMessage = useCallback((content: string): void => {
    if (!activeConversationId || !content.trim()) return
    const conv = conversations.find(c => c.id === activeConversationId)
    if (!conv) return
    dispatch({
      type: 'database/sendMessage',
      payload: {
        content: content.trim(),
        conversationId: activeConversationId,
        senderId: user?.username || 'me',
        senderName: user?.username || 'Me',
        receiverId: conv.participantId,
        receiverName: conv.participantName,
      },
    })
  }, [dispatch, activeConversationId, conversations])

  const selectConversation = useCallback((id: string): void => {
    dispatch({ type: 'database/selectConversation', payload: id })
    setActiveConversationId(id)
  }, [dispatch])

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations]
  )

  const startConversation = useCallback((participantId: string, name: string, avatar: string): string => {
    const existing = conversations.find(c => c.participantId === participantId)
    if (existing) {
      setActiveConversationId(existing.id)
      dispatch({ type: 'database/selectConversation', payload: existing.id })
      return existing.id
    }

    const newId = `conv-${Date.now()}`
    dispatch({
      type: 'database/startConversation',
      payload: {
        id: newId,
        participantId,
        participantName: name,
        participantAvatar: avatar,
        participantRole: 'Student', // Default or fetch
        lastMessage: '',
        lastTimestamp: new Date().toISOString(),
        unreadCount: 0
      }
    })
    setActiveConversationId(newId)
    return newId
  }, [dispatch, conversations])

  return {
    conversations,
    activeConversation,
    activeMessages,
    activeConversationId,
    sendMessage,
    startConversation,
    selectConversation,
    totalUnread,
  }
}
