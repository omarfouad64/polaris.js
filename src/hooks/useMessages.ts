import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useGlobalContext } from '../globalContext'
import type { RootState } from '../store'
import type { Conversation, Message } from '../types'

interface OtherParticipant {
  name: string
  avatar: string
  role?: string
}

export default function useMessages() {
  const dispatch = useDispatch()
  const { user } = useGlobalContext()
  const reduxMessages = useSelector((state: RootState) => state.database.messages)
  const reduxConversations = useSelector((state: RootState) => state.database.conversations)

  const myId = user?.username || 'me'
  const myEmail = user?.username || 'me'

  const getOtherParticipant = useCallback((conv: Conversation): OtherParticipant => {
    const convMessages = (reduxMessages as Message[]).filter(m => m.conversationId === conv.id)
    if (convMessages.length > 0) {
      const otherMsg = convMessages.find(m => m.senderId !== myId) || convMessages[0]
      return {
        name: otherMsg.senderName || conv.participantName,
        avatar: conv.participantAvatar,
        role: otherMsg.senderRole,
      }
    }
    if (conv.participantId === myId || conv.participantId === myEmail) {
      return {
        name: conv.participantName,
        avatar: conv.participantAvatar,
        role: conv.participantRole,
      }
    }
    return {
      name: conv.participantName,
      avatar: conv.participantAvatar,
      role: conv.participantRole,
    }
  }, [myId, myEmail, reduxMessages])

  // Filter conversations: only show conversations where the current user is a participant
  const conversations = useMemo(() => {
    const filtered = (reduxConversations as Conversation[]).filter((c) => {
      const isInParticipants = c.participants?.includes(myId)
      if (isInParticipants) return true
      if (c.participantId !== myId && c.participantId !== myEmail) return false
      const hasMessages = (reduxMessages as Message[]).some((m: Message) =>
        m.conversationId === c.id
      )
      return hasMessages
    })
    return filtered.map(c => ({ ...c, _otherParticipant: getOtherParticipant(c) }))
  }, [reduxConversations, reduxMessages, myId, myEmail, getOtherParticipant])

  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    () => typeof window !== 'undefined' ? window.localStorage.getItem('polaris_active_conv') : null
  )

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem('polaris_active_conv', activeConversationId)
    }
  }, [activeConversationId])

  const activeConversation = useMemo(
    () => {
      const conv = conversations.find(c => c.id === activeConversationId)
      if (!conv) return null
      return { ...conv, _otherParticipant: getOtherParticipant(conv as unknown as Conversation) }
    },
    [conversations, activeConversationId, getOtherParticipant]
  )

  // Filter messages: show messages in the active conversation
  const activeMessages = useMemo(() => {
    if (!activeConversationId) return []
    return (reduxMessages as Message[]).filter((m: Message) =>
      m.conversationId === activeConversationId
    ).sort((a: Message, b: Message) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  }, [reduxMessages, activeConversationId])

  const sendMessage = useCallback((content: string): void => {
    if (!activeConversationId || !content.trim()) return
    const conv = conversations.find(c => c.id === activeConversationId)
    if (!conv) return

    dispatch({
      type: 'database/sendMessage',
      payload: {
        content: content.trim(),
        conversationId: activeConversationId,
        senderId: myId,
        senderName: user?.username || 'Me',
        receiverId: conv.participantId,
        receiverName: conv.participantName,
      },
    })
  }, [dispatch, activeConversationId, conversations, myId, user])

  const selectConversation = useCallback((id: string): void => {
    dispatch({ type: 'database/selectConversation', payload: id })
    setActiveConversationId(id)
  }, [dispatch])

  const markAllRead = useCallback((): void => {
    dispatch({ type: 'database/markConversationsAllRead' })
  }, [dispatch])

  const totalUnread = useMemo(
    () => (reduxConversations as Conversation[]).filter((c) =>
      c.participants?.includes(myId)
    ).reduce((sum, c) => sum + c.unreadCount, 0),
    [reduxConversations, myId]
  )

  const startConversation = useCallback((otherUserId: string, name: string, avatar: string): string => {
    const existing = conversations.find(c =>
      c.participants &&
      c.participants.includes(myId) &&
      c.participants.includes(otherUserId)
    )
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
        participantRole: 'Student' as const,
        lastMessage: '',
        lastTimestamp: new Date().toISOString(),
        unreadCount: 0,
        senderId: myId
      }
    })
    setActiveConversationId(newId)
    return newId
  }, [dispatch, conversations])

  return {
    conversations: conversations as any,
    activeConversation: activeConversation ? ({ ...activeConversation, _otherParticipant: activeConversation._otherParticipant }) as any : null,
    activeMessages,
    activeConversationId,
    sendMessage,
    startConversation,
    selectConversation,
    markAllRead,
    totalUnread,
  }
}
