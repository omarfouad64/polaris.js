import { useState, useMemo } from 'react'
import type { Conversation, Message } from '../types'

const dummyConversations: Conversation[] = [
  { id: 'conv-1', participantId: 'u-1', participantName: 'Ahmed Hassan', participantAvatar: 'AH', lastMessage: 'Thanks for reviewing my portfolio!', lastTimestamp: '2026-04-30T10:30:00Z', unreadCount: 2 },
  { id: 'conv-2', participantId: 'u-2', participantName: 'Dr. Mona Farid', participantAvatar: 'MF', lastMessage: 'The project feedback has been updated.', lastTimestamp: '2026-04-29T15:45:00Z', unreadCount: 0 },
  { id: 'conv-3', participantId: 'u-3', participantName: 'Sara Mohamed', participantAvatar: 'SM', lastMessage: 'When is the application deadline?', lastTimestamp: '2026-04-28T09:20:00Z', unreadCount: 1 },
  { id: 'conv-4', participantId: 'u-4', participantName: 'Omar Khaled', participantAvatar: 'OK', lastMessage: 'I submitted my cover letter.', lastTimestamp: '2026-04-27T14:10:00Z', unreadCount: 0 }
]

const dummyMessages: Record<string, Message[]> = {
  'conv-1': [
    { id: 'm-1', senderId: 'u-1', senderName: 'Ahmed Hassan', receiverId: 'me', receiverName: 'Me', content: 'Hi! I noticed your company has open internship positions.', timestamp: '2026-04-30T10:00:00Z', read: true },
    { id: 'm-2', senderId: 'me', senderName: 'Me', receiverId: 'u-1', receiverName: 'Ahmed Hassan', content: 'Yes, we have several positions open. Feel free to apply through the portal!', timestamp: '2026-04-30T10:15:00Z', read: true },
    { id: 'm-3', senderId: 'u-1', senderName: 'Ahmed Hassan', receiverId: 'me', receiverName: 'Me', content: 'Thanks for reviewing my portfolio!', timestamp: '2026-04-30T10:30:00Z', read: false }
  ],
  'conv-2': [
    { id: 'm-4', senderId: 'u-2', senderName: 'Dr. Mona Farid', receiverId: 'me', receiverName: 'Me', content: 'Hello, I wanted to discuss the project requirements.', timestamp: '2026-04-29T15:00:00Z', read: true },
    { id: 'm-5', senderId: 'me', senderName: 'Me', receiverId: 'u-2', receiverName: 'Dr. Mona Farid', content: 'Of course! What would you like to discuss?', timestamp: '2026-04-29T15:30:00Z', read: true },
    { id: 'm-6', senderId: 'u-2', senderName: 'Dr. Mona Farid', receiverId: 'me', receiverName: 'Me', content: 'The project feedback has been updated.', timestamp: '2026-04-29T15:45:00Z', read: true }
  ],
  'conv-3': [
    { id: 'm-7', senderId: 'u-3', senderName: 'Sara Mohamed', receiverId: 'me', receiverName: 'Me', content: 'When is the application deadline?', timestamp: '2026-04-28T09:20:00Z', read: false }
  ]
}

/**
 * useMessages — provides messaging data and operations for private conversations.
 *
 * @returns conversations list, messages for active conversation, and send function.
 */
export default function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>(dummyConversations)
  const [messages, setMessages] = useState<Record<string, Message[]>>(dummyMessages)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

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

  return {
    conversations,
    activeConversation,
    activeMessages,
    activeConversationId,
    sendMessage,
    selectConversation,
    totalUnread
  }
}
