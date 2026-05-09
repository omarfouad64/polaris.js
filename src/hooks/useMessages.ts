import { useState, useMemo, useEffect } from 'react'
import type { Conversation, Message } from '../types'

const dummyConversations: Conversation[] = [
  { id: 'conv-1', participantId: 'u-1', participantName: 'Ahmed Hassan', participantAvatar: 'AH', participantRole: 'Student', lastMessage: 'Thanks for reviewing my portfolio!', lastTimestamp: '2026-04-30T10:30:00Z', unreadCount: 2 },
  { id: 'conv-2', participantId: 'u-2', participantName: 'Dr. Mona Farid', participantAvatar: 'MF', participantRole: 'Course Instructor', lastMessage: 'The project feedback has been updated.', lastTimestamp: '2026-04-29T15:45:00Z', unreadCount: 0 },
  { id: 'conv-3', participantId: 'u-3', participantName: 'Sara Mohamed', participantAvatar: 'SM', participantRole: 'Student', lastMessage: 'When is the application deadline?', lastTimestamp: '2026-04-28T09:20:00Z', unreadCount: 1 },
  { id: 'conv-4', participantId: 'u-4', participantName: 'Omar Khaled', participantAvatar: 'OK', participantRole: 'Employer', lastMessage: 'I submitted my cover letter.', lastTimestamp: '2026-04-27T14:10:00Z', unreadCount: 0 }
]

const roleByParticipantId = new Map(dummyConversations.map(conv => [conv.participantId, conv.participantRole]))

const hydrateConversations = (items: Conversation[]): Conversation[] => {
  return items.map(conv => (
    conv.participantRole
      ? conv
      : { ...conv, participantRole: roleByParticipantId.get(conv.participantId) }
  ))
}

const hydrateMessages = (items: Record<string, Message[]>): Record<string, Message[]> => {
  return Object.fromEntries(Object.entries(items).map(([id, messages]) => [
    id,
    messages.map(message => {
      const senderRole = message.senderRole ?? roleByParticipantId.get(message.senderId)
      const receiverRole = message.receiverRole ?? roleByParticipantId.get(message.receiverId)
      if (senderRole === message.senderRole && receiverRole === message.receiverRole) {
        return message
      }
      return {
        ...message,
        senderRole,
        receiverRole
      }
    })
  ]))
}

const dummyMessages: Record<string, Message[]> = {
  'conv-1': [
    { id: 'm-1', senderId: 'u-1', senderName: 'Ahmed Hassan', senderRole: 'Student', receiverId: 'me', receiverName: 'Me', content: 'Hi! I noticed your company has open internship positions.', timestamp: '2026-04-30T10:00:00Z', read: true },
    { id: 'm-2', senderId: 'me', senderName: 'Me', receiverId: 'u-1', receiverName: 'Ahmed Hassan', receiverRole: 'Student', content: 'Yes, we have several positions open. Feel free to apply through the portal!', timestamp: '2026-04-30T10:15:00Z', read: true },
    { id: 'm-3', senderId: 'u-1', senderName: 'Ahmed Hassan', senderRole: 'Student', receiverId: 'me', receiverName: 'Me', content: 'Thanks for reviewing my portfolio!', timestamp: '2026-04-30T10:30:00Z', read: false }
  ],
  'conv-2': [
    { id: 'm-4', senderId: 'u-2', senderName: 'Dr. Mona Farid', senderRole: 'Course Instructor', receiverId: 'me', receiverName: 'Me', content: 'Hello, I wanted to discuss the project requirements.', timestamp: '2026-04-29T15:00:00Z', read: true },
    { id: 'm-5', senderId: 'me', senderName: 'Me', receiverId: 'u-2', receiverName: 'Dr. Mona Farid', receiverRole: 'Course Instructor', content: 'Of course! What would you like to discuss?', timestamp: '2026-04-29T15:30:00Z', read: true },
    { id: 'm-6', senderId: 'u-2', senderName: 'Dr. Mona Farid', senderRole: 'Course Instructor', receiverId: 'me', receiverName: 'Me', content: 'The project feedback has been updated.', timestamp: '2026-04-29T15:45:00Z', read: true }
  ],
  'conv-3': [
    { id: 'm-7', senderId: 'u-3', senderName: 'Sara Mohamed', senderRole: 'Student', receiverId: 'me', receiverName: 'Me', content: 'When is the application deadline?', timestamp: '2026-04-28T09:20:00Z', read: false }
  ]
}

/**
 * useMessages — provides messaging data and operations for private conversations.
 * Persists data to localStorage to ensure conversations stay active across navigations.
 */
export default function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('polaris_conversations')
    const parsed = saved ? (JSON.parse(saved) as Conversation[]) : dummyConversations
    return hydrateConversations(parsed)
  })

  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('polaris_messages')
    const parsed = saved ? (JSON.parse(saved) as Record<string, Message[]>) : dummyMessages
    return hydrateMessages(parsed)
  })

  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    return localStorage.getItem('polaris_active_conv')
  })

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('polaris_conversations', JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    localStorage.setItem('polaris_messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem('polaris_active_conv', activeConversationId)
    } else {
      localStorage.removeItem('polaris_active_conv')
    }
  }, [activeConversationId])

  const activeMessages = useMemo(() =>
    activeConversationId ? (messages[activeConversationId] ?? []) : [],
    [messages, activeConversationId]
  )

  const activeConversation = useMemo(() =>
    conversations.find(c => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId]
  )

  const sendMessage = (content: string): void => {
    if (!activeConversationId || !content.trim()) return
    const conv = conversations.find(c => c.id === activeConversationId)
    if (!conv) return

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      senderName: 'Me',
      receiverId: conv.participantId,
      receiverName: conv.participantName,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      read: true
    }

    setMessages(prev => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] ?? []), newMsg]
    }))

    setConversations(prev => prev.map(c =>
      c.id === activeConversationId
        ? { ...c, lastMessage: content.trim(), lastTimestamp: newMsg.timestamp }
        : c
    ))
  }

  const selectConversation = (id: string): void => {
    setActiveConversationId(id)
    setConversations(prev => prev.map(c =>
      c.id === id ? { ...c, unreadCount: 0 } : c
    ))
  }

  const totalUnread = useMemo(() =>
    conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations]
  )

  const startConversation = (participantId: string, name: string, avatar: string): string => {
    const existing = conversations.find(c => c.participantId === participantId)
    if (existing) {
      setActiveConversationId(existing.id)
      localStorage.setItem('polaris_active_conv', existing.id)
      return existing.id
    }

    const newId = `conv-${Date.now()}`
    const newConv: Conversation = {
      id: newId,
      participantId,
      participantName: name,
      participantAvatar: avatar,
      participantRole: roleByParticipantId.get(participantId),
      lastMessage: 'Start of your conversation',
      lastTimestamp: new Date().toISOString(),
      unreadCount: 0
    }

    const updatedConversations = [newConv, ...conversations]
    const updatedMessages = { ...messages, [newId]: [] }

    setConversations(updatedConversations)
    setMessages(updatedMessages)
    setActiveConversationId(newId)

    // Manual sync for immediate navigation safety
    localStorage.setItem('polaris_conversations', JSON.stringify(updatedConversations))
    localStorage.setItem('polaris_messages', JSON.stringify(updatedMessages))
    localStorage.setItem('polaris_active_conv', newId)

    return newId
  }

  return {
    conversations,
    activeConversation,
    activeMessages,
    activeConversationId,
    sendMessage,
    startConversation,
    selectConversation,
    totalUnread
  }
}
