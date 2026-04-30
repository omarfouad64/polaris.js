import { useState } from 'react'
import useMessages from '../../../../hooks/useMessages'
import useNotifications from '../../../../hooks/useNotifications'

const nIcons: Record<string, string> = {
  message: 'chat_bubble', internship_status: 'work', project_invitation: 'group_add',
  feedback: 'comment', flag: 'flag', admin: 'admin_panel_settings'
}

/**
 * CommunicationsPage — notifications and private messaging interface.
 * Covers Req 68, 69, 70, 89.
 */
export default function CommunicationsPage(): React.JSX.Element {
  const { conversations, activeConversation, activeMessages, sendMessage, selectConversation, totalUnread } = useMessages()
  const { notifications, unreadCount, toggleRead, markAllRead } = useNotifications()
  const [tab, setTab] = useState<'notifications' | 'messages'>('notifications')
  const [msgInput, setMsgInput] = useState('')

  const handleSend = (): void => {
    if (!msgInput.trim()) return
    sendMessage(msgInput)
    setMsgInput('')
  }

  const fmt = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime()
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return new Date(iso).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-jakarta font-bold text-on-surface">Communications</h2>
        <p className="font-lexend text-on-surface-variant text-sm">Notifications and private messages.</p>
      </div>

      <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1 w-fit">
        <button onClick={() => setTab('notifications')} className={`px-5 py-2 rounded-lg text-sm font-jakarta font-semibold transition-all flex items-center gap-2 ${tab === 'notifications' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
          Notifications {unreadCount > 0 && <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center font-bold">{unreadCount}</span>}
        </button>
        <button onClick={() => setTab('messages')} className={`px-5 py-2 rounded-lg text-sm font-jakarta font-semibold transition-all flex items-center gap-2 ${tab === 'messages' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
          Messages {totalUnread > 0 && <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center font-bold">{totalUnread}</span>}
        </button>
      </div>

      {tab === 'notifications' && (
        <div className="space-y-2">
          <div className="flex justify-end">
            <button onClick={markAllRead} className="text-sm font-jakarta text-primary hover:underline focus-visible:ring-2 focus-visible:ring-secondary rounded-lg px-3 py-1">Mark All Read</button>
          </div>
          {notifications.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-outline-variant/40" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
              <span className="material-symbols-outlined text-[48px] text-outline/40">notifications_off</span>
              <p className="font-lexend text-on-surface-variant mt-2">No notifications.</p>
            </div>
          ) : notifications.map(n => (
            <div key={n.id} className={`flex items-start gap-3 p-4 rounded-xl border border-outline-variant/40 transition-colors hover:bg-surface-container ${n.read ? 'bg-surface-container-lowest' : 'bg-surface-container-low'}`}>
              {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant mt-0.5 flex-shrink-0">{nIcons[n.type] ?? 'notifications'}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? 'font-lexend' : 'font-jakarta font-semibold'} text-on-surface`}>{n.title}</p>
                <p className="text-sm font-lexend text-on-surface-variant mt-0.5">{n.body}</p>
                <p className="text-xs font-lexend text-outline mt-1">{fmt(n.timestamp)}</p>
              </div>
              <button onClick={() => toggleRead(n.id)} className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors focus-visible:ring-2 focus-visible:ring-secondary" aria-label={n.read ? 'Mark unread' : 'Mark read'}>
                <span className="material-symbols-outlined text-[18px]">{n.read ? 'mark_email_unread' : 'mark_email_read'}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'messages' && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden flex" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)', height: 'calc(100vh - 340px)', minHeight: '400px' }}>
          <div className="w-full md:w-1/3 border-r border-outline-variant/30 overflow-y-auto">
            {conversations.map(c => (
              <button key={c.id} onClick={() => selectConversation(c.id)} className={`w-full text-left p-4 flex items-center gap-3 transition-colors border-b border-outline-variant/20 ${activeConversation?.id === c.id ? 'bg-surface-container' : 'hover:bg-surface-container-low'}`}>
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-jakarta font-bold text-sm flex-shrink-0">{c.participantAvatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between"><span className="font-jakarta font-semibold text-sm text-on-surface truncate">{c.participantName}</span><span className="text-xs font-lexend text-outline flex-shrink-0">{fmt(c.lastTimestamp)}</span></div>
                  <p className="text-sm font-lexend text-on-surface-variant truncate">{c.lastMessage}</p>
                </div>
                {c.unreadCount > 0 && <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center font-bold">{c.unreadCount}</span>}
              </button>
            ))}
          </div>
          <div className="hidden md:flex flex-col flex-1">
            {activeConversation ? (
              <>
                <div className="p-4 border-b border-outline-variant/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-jakarta font-bold text-xs">{activeConversation.participantAvatar}</div>
                  <span className="font-jakarta font-semibold text-on-surface">{activeConversation.participantName}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {activeMessages.map(m => (
                    <div key={m.id} className={`max-w-[70%] ${m.senderId === 'me' ? 'ml-auto' : 'mr-auto'}`}>
                      <div className={`px-4 py-2.5 text-sm font-lexend ${m.senderId === 'me' ? 'bg-primary text-on-primary rounded-tl-xl rounded-bl-xl rounded-tr-xl' : 'bg-surface-container text-on-surface rounded-tr-xl rounded-br-xl rounded-tl-xl'}`}>{m.content}</div>
                      <p className={`text-xs font-lexend text-outline mt-1 ${m.senderId === 'me' ? 'text-right' : ''}`}>{fmt(m.timestamp)}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-outline-variant/30 flex gap-2">
                  <input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 font-lexend text-on-surface placeholder:text-outline focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors text-sm" placeholder="Type a message..." />
                  <button onClick={handleSend} className="p-2.5 bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-colors active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-secondary" aria-label="Send message"><span className="material-symbols-outlined text-[20px]">send</span></button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center"><div className="text-center"><span className="material-symbols-outlined text-[48px] text-outline/30">forum</span><p className="font-lexend text-on-surface-variant mt-2">Select a conversation</p></div></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
