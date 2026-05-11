import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useGlobalContext } from '../globalContext'
import type { RootState } from '../store'
import type { Conversation, Message } from '../types'

export default function useMessages() {
  const dispatch = useDispatch()
  const { user } = useGlobalContext()
  const reduxMessages = useSelector((state: RootState) => state.database.messages)
  const reduxConversations = useSelector((state: RootState) => state.database.conversations)

  const myId = user?.username || 'me'
  const myEmail = user?.username || 'me'

  // Filter conversations: only show conversations where the current user has messages
  const conversations = useMemo(() => {
    return (reduxConversations as Conversation[]).filter((c) => {
      const hasMessages = (reduxMessages as Message[]).some((m: Message) =>
        m.conversationId === c.id
      )
      return hasMessages
    })
  }, [reduxConversations, reduxMessages])

  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    () => typeof window !== 'undefined' ? window.localStorage.getItem('polaris_active_conv') : null
  )

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem('polaris_active_conv', activeConversationId)
    }
  }, [activeConversationId])

  const activeConversation = useMemo(
    () => conversations.find(c => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId]
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
      c.participantId === myEmail || c.participantId === myId
    ).reduce((sum, c) => sum + c.unreadCount, 0),
    [reduxConversations, myId, myEmail]
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
        participantRole: 'Student' as const,
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
    markAllRead,
    totalUnread,
  }
}
