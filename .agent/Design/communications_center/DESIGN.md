# Design: Communications Center

**Page:** Communications Center
**Related Requirements:** Req 35, 36, 68, 69, 70, 91
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Portal layout wraps this page. Three tabs: Notifications, Messages, Settings.

```
┌──────────────────────────────────────────────────────────────┐
│ SIDEBAR │  HEADER: "Communications"                          │
│         │  Tabs: [Notifications (N)]  [Messages]  [Settings] │
│         │──────────────────────────────────────────────────  │
│         │  TAB: Notifications                               │
│         │  [Mark All Read btn]                              │
│         │  ┌──────────────────────────────────────────┐     │
│         │  │ NotificationItem (unread — bold)         │     │
│         │  │ [icon] text  [time]  [Mark Read btn]     │     │
│         │  │ NotificationItem (read — dimmed)         │     │
│         │  └──────────────────────────────────────────┘     │
│         │  TAB: Messages                                    │
│         │  ┌────────────────────┐ ┌────────────────────┐   │
│         │  │ ConversationList   │ │ ChatInterface       │   │
│         │  │ [user] last msg    │ │ Message bubbles     │   │
│         │  │ [user] last msg    │ │ [input + send]      │   │
│         │  └────────────────────┘ └────────────────────┘   │
│         │  TAB: Settings                                    │
│         │  [Mute All Notifications toggle]                  │
│         │  [Per-category settings]                          │
└──────────────────────────────────────────────────────────────┘
```

---

## States

### Notifications Tab
- List of notifications, newest first.
- Unread items: `bg-surface-container-low` background, bold text.
- Read items: `bg-surface-container-lowest` background, normal weight.
- "Mark All Read" ghost button top-right.
- Each item: per-notification "Mark Read / Unread" toggle icon.
- Count badge on "Notifications" tab label (unread count).
- Empty state: "You're all caught up! No notifications."

### Messages Tab
- Two-panel layout: conversation list (left 33%) + active chat (right 67%).
- Conversation list shows: avatar, name, last message snippet, timestamp.
- Chat interface: message bubbles, send input at bottom.
- Empty (no conversations): "No messages yet. Start a conversation from a user profile."

### Settings Tab
- "Mute All Notifications" toggle (Req 91): large toggle with label.
  - On: `bg-error` toggle, label "Notifications muted".
  - Off: `bg-secondary` toggle, label "Notifications active".
- <!-- ASSUMPTION: Per-category notification settings are not explicitly required by Req 91. Only a global mute toggle is specified. Future per-category settings can be added here. -->

---

## Components

### NotificationList
- Scrollable list, max height `calc(100vh - 200px)`, overflowing with scroll.
- Each item: icon (varies by type), notification text, relative timestamp, mark-read toggle.
- Notification types and icons:
  - Project invitation → `group_add`
  - Instructor feedback → `comment`
  - Flagged project → `flag`
  - Message → `chat_bubble`
  - Internship status → `work`
  - Admin request → `admin_panel_settings`
- Unread dot: `w-2 h-2 rounded-full bg-primary` in the left margin.

### ChatInterface
- Message bubble — sent: `bg-primary text-on-primary rounded-tl-xl rounded-bl-xl rounded-tr-xl ml-auto`.
- Message bubble — received: `bg-surface-container rounded-tr-xl rounded-br-xl rounded-tl-xl mr-auto`.
- Input: full-width with send icon button (primary small, `send` icon).
- Empty thread: "Say hello to [Name]!" placeholder.

### NotificationSettingsForm
- "Mute All" toggle: `flex items-center justify-between p-6 bg-surface-container-lowest rounded-xl`.
- Label: `font-jakarta font-semibold text-on-surface`.
- Sub-label: `font-lexend text-sm text-on-surface-variant`.

---

## Interaction States

| Element | Hover | Focus | Active |
|---|---|---|---|
| NotificationItem | `bg-surface-container` | n/a | n/a |
| Mark Read btn | `text-primary` | Ring visible | n/a |
| ConversationItem | `bg-surface-container-low` | Ring visible | `bg-surface-container` |
| Send button | `bg-primary-container` | Ring visible | `translate-y-0.5` |
| Mute toggle | `opacity-90` | Ring visible | n/a |

---

## Responsive Behaviour

| Breakpoint | Messages tab layout |
|---|---|
| Mobile | Conversation list full-width; selecting a conversation shows chat full-screen with back button |
| `md:` | Side-by-side 33/67 split |
