# PLAN: Notification Click-to-Navigate & Tab Badge Bubbles

## 1. Feature Summary

This feature enhances the existing notification system in two ways:

1. **Click-to-navigate + auto-read:** Every notification card in the unified notification list becomes clickable. When clicked, it navigates the user to the page specified by the notification's `link` field AND automatically marks the notification as read. If `link` is null or undefined, it falls back to the role-appropriate notifications page. The existing separate mark-read button remains for manual control.

2. **Role-filtered tab bubble badges:** Sidebar navigation tabs corresponding to pages with notification requirements from `requirements.md` display a red bubble badge showing the **role-filtered** unread count. Only the logged-in user's notifications count toward the badge. The affected tabs are:
   - **Invitations** (Req 28, 29, 30) — shows project invitation unread count filtered by role
   - **Communications** (Req 68, 69, 70) — shows total unread message count filtered by role
   - **Notifications** (Req 35, 36) — shows general notification unread count filtered by role

**Affected user roles:** All roles (Student, Employer, Course Instructor, Administrator).

---

## 2. Affected Pages & Routes

| Page | Route | Change Type |
|---|---|---|
| NotificationCenter (unified list) | `/portal/{role}/notifications` | Modified |
| CommunicationsPage (tab view) | `/portal/{role}/communications` | Unchanged (uses same list component) |
| Sidebar (global nav) | All portal routes | Modified — badges added to 3 tabs, role-filtered |
| Header (global) | All portal routes | Modified — composes new hook, role-filtered |

---

## 3. New Components to Create

### None

No new components are needed. `NotificationBadge` (already exists at `src/components/NotificationBadge.tsx`) is reused.

---

## 4. Existing Components to Modify

| Component | File | Change Description |
|---|---|---|
| `UnifiedNotificationList` | `src/pages/portal/shared/notifications/UnifiedNotificationList.tsx` | Make each notification card clickable via `role="button"`, `tabIndex={0}`, `onClick` → `navigate(link)` + `mark as read`. Fall back to role-based notifications page if `link` is null. Use `useGlobalContext()` to determine role. |
| `Sidebar` | `src/pages/portal/components/Sidebar.tsx` | Import `NotificationBadge` and `useTabNotifications`. Add optional `notificationKey` field to the `Tab` interface. Enrich the three relevant tabs (`Invitations`, `Communications`, `Notifications`) with `notificationKey`. Render `<NotificationBadge count={...} />` next to the tab text when the key's count > 0. |
| `Header` | `src/pages/portal/components/Header.tsx` | Replace separate `useNotifications()` and `useProjectNotifications()` calls with `useTabNotifications()`. Display aggregate total in the notification icon badge. |

---

## 5. State Changes

| Context | New Keys Added | Type | Purpose |
|---|---|---|---|
| None | — | — | No Redux/Context changes needed. All data already exists in `databaseSlice.notifications` and `databaseSlice.conversations`. |

No state changes required — this feature only consumes existing data and reads `useGlobalContext()` for the logged-in user's role.

---

## 6. New Hooks to Create

### `useTabNotifications`
- **Name:** `useTabNotifications`
- **Location:** `src/hooks/useTabNotifications.ts` (new)
- **Returns:** `TabNotifications` interface:
  ```typescript
  interface TabNotifications {
    invitations: number
    communications: number
    notifications: number
    total: number
  }
  ```
- **Data source:** Composes three existing hooks, filtering by the logged-in user's role from `useGlobalContext()`:
  - **`invitations`:** Count unread notifications of type `project_invitation` where the `link` path matches the user's role (e.g., `/portal/student/invitations` for students, `/portal/instructor/invitations` for instructors). Uses `useProjectNotifications()` under the hood but filters by role.
  - **`communications`:** Count unread conversations where the participant ID matches the logged-in user's username (or where the conversation is relevant to the user's role). Uses `useMessages()` under the hood with role filtering.
  - **`notifications`:** Count unread notifications of other types (`message`, `feedback`, `flag`, `admin`, `appeal_response`, `internship_status`) filtered by checking if the `link` path matches the user's role. Uses `useNotifications()` under the hood with role filtering.
  - **`total`** = sum of the three above

**Role filtering logic:**
```typescript
// Pseudocode for role filtering
const rolePath = user.role === 'Course Instructor' ? 'instructor'
  : user.role === 'Administrator' ? 'administrator'
  : user.role === 'Employer' ? 'employer'
  : 'student'

const matchesRole = (link?: string) =>
  link?.includes(`/portal/${rolePath}/`) || link?.includes(`/portal/${rolePath}`)

const roleFilteredNotifications = allNotifications.filter(
  n => !n.read && (n.link ? matchesRole(n.link) : matchesRole(defaultRoleLink))
)
```

---

## 7. Routes to Register

None. No new routes are created.

---

## 8. Edge Cases & Error States

- **Notification `link` is null/undefined:** Navigate to the role-appropriate notifications page (e.g., `/portal/student/notifications`) and mark as read.
- **Notification `link` points to an external URL:** Use `window.open(link, '_blank')` instead of `navigate()` for non-portal URLs (URLs not starting with `/portal/` or `/`).
- **User is not logged in:** If `navigate()` is called outside a router context, silently fail (no-op).
- **Zero unread counts:** No badge renders for any tab when the count is 0 (existing `NotificationBadge` behavior).
- **Multiple unread sources:** The header badge shows the aggregate total of all unread items across all categories.
- **Keyboard accessibility:** Notification cards support Enter and Space keys for navigation (WCAG 2.1 AA).
- **Auto-read on click:** Clicking a notification card marks it as read automatically via `toggleRead(n.id)` or `markAsRead(n.id)`, regardless of the notification type. The separate mark-read button remains available for manual control.
- **Role filtering for edge cases:** Notifications that don't have a `link` field or have a `link` that doesn't contain a role path are filtered by checking the notification `type` against the user's role (e.g., `admin` type only for administrators, `project_invitation` only for students/instructors).
- **Notification `link` changed by backend:** Since this is dummy data only, links are static in `initialData.ts` and will navigate correctly.

---

## 9. Open Questions

None — resolved.

---

## 10. Checklist (Acceptance Gate)

- [x] All affected requirements listed (Req 28, 29, 30, 35, 36, 68, 69, 70).
- [x] All affected pages/routes listed.
- [x] All new hooks listed with return types (`useTabNotifications`).
- [x] All existing components' changes described.
- [x] No Context/state changes needed.
- [x] No new routes needed.
- [x] All edge cases listed.
- [x] Zero open questions remain.
- [x] TypeScript compiles with zero errors (strict mode).
- [x] Implementation complete.
