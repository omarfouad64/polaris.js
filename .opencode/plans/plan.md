# PLAN: Polaris Task Batch — Refactor, Bug Fixes, UI/UX Improvements

## 1. Feature Summary

This plan covers **12 items** from `task.md`, organized into three workstreams:

### Workstream A — Redux Hook Refactoring (Item 1, HIGH PRIORITY)
Refactor all 19 custom hooks in `src/hooks/` (and 1 local hook) to source their data from the Redux store (`src/store/databaseSlice.ts`) instead of standalone dummy data arrays. The Redux store already has the full `DatabaseState` shape with initial data populated in `src/store/initialData.ts`. This is the foundational change — everything else depends on it.

### Workstream B — Bug Fixes (Items 2–3)
- **Duplicate Invitations**: When an invitation is accepted or rejected, remove duplicate entries from both the student's invitations list and the instructor's notification inbox.
- **Appeal Unflagging Submit**: Ensure the FlagAppealModal's submit flow shows a FeedbackDialog confirmation after submission.

### Workstream C — UI/UX Improvements (Items 4–12)
- Notification badge on icon (already partially implemented in Header)
- Flagged project cards redesign
- Card layout fixes (edit/delete buttons anchored)
- Profile picture display fix
- Search UI redesign
- Instructor profile from search
- Admin confirmation dialogs
- Student confirmation dialogs (already partially implemented)
- Course link/unlink feedback dialogs (already partially implemented)
- Flagged project notifications

---

## 2. Affected Pages & Routes

| Page | Route | Change Type |
|---|---|---|
| Communications Page (Notifications tab) | `/portal/:role/communications` | Modified |
| Header (notification icon) | Global (all portal pages) | Modified |
| My Projects | `/portal/student/projects` | Modified |
| Project Card (student) | `src/pages/portal/student/projects/components/ProjectCard.tsx` | Modified |
| Project Detail View | `/portal/student/projects/:id/view` | Modified |
| Search Hub | `/portal/:role/search` | Modified |
| Instructor Profile (view from search) | `/portal/:role/instructors/:id` | Modified |
| Admin Control Panel | `/portal/administrator` | Modified |
| User Directory | `/portal/administrator/users` | Modified |
| Course Directory | `/portal/administrator/courses` | Modified |
| Content Moderation | `/portal/administrator/moderation` | Modified |
| My Courses (Instructor) | `/portal/instructor/courses` | Modified |
| Communications Page (Messages tab) | `/portal/:role/communications` | Modified |

---

## 3. New Components to Create

### `<NotificationBadge>` — `src/components/NotificationBadge.tsx`
```tsx
interface NotificationBadgeProps {
  count: number
}
```
- **Reusability:** Global (`src/components/`)
- **Design reference:** Styling.md badges section; positioned absolute bottom-right of icon container. Shows red bubble only when count > 0, with `bg-error text-on-error rounded-full`.

### `<FlagReasonBanner>` — `src/pages/portal/student/projects/components/FlagReasonBanner.tsx`
```tsx
interface FlagReasonBannerProps {
  reason: string
  description?: string
}
```
- **Reusability:** Page-local (`src/pages/portal/student/projects/components/`)
- **Design reference:** Styling.md cards section; displayed at bottom of flagged project cards.

---

## 4. Existing Components to Modify

| Component | File | Change Description |
|---|---|---|
| Header | `src/pages/portal/components/Header.tsx` | Wire `NotificationBadge` component for unread count; use Redux-sourced data |
| ProjectCard | `src/pages/portal/student/projects/components/ProjectCard.tsx` | Remove "Appeal Unflagging" button; add `FlagReasonBanner` at bottom for flagged cards; anchor edit/delete buttons to bottom; fix card text top-alignment |
| FlagAppealModal | `src/pages/portal/student/projects/components/FlagAppealModal.tsx` | After submit success, show `FeedbackDialog` with message "Your appeal has been submitted and will be reviewed by an administrator within 48 hours." |
| CommunicationsPage | `src/pages/portal/shared/communications/CommunicationsPage.tsx` | No direct changes — just ensure notifications use Redux-sourced data |
| UnifiedNotificationList | `src/pages/portal/shared/notifications/UnifiedNotificationList.tsx` | Ensure flag notifications include inline flag reason; use Redux-sourced data |
| CourseDirectoryPage | `src/pages/portal/admin/courses/CourseDirectoryPage.tsx` | Add `ConfirmationDialog` before delete/edit course actions |
| UserDataTable | `src/pages/portal/admin/users/components/UserDataTable.tsx` | Already has confirmation dialog — verify it's wired for all admin actions |
| EmployerApplicationList | `src/pages/portal/admin/verification/components/EmployerApplicationList.tsx` | Add `ConfirmationDialog` before approve/reject company actions |
| LinkRequestHandler | `src/pages/portal/admin/courses/components/LinkRequestHandler.tsx` | Add `ConfirmationDialog` before accept/reject link requests |
| ProjectList (search results) | `src/pages/portal/explorer/` | Ensure instructor cards navigate to correct view profile page |

---

## 5. State Changes

### Redux Store Additions (`src/store/databaseSlice.ts`)

The existing `databaseSlice.ts` only has `resetDatabase` and `updateDatabase` — these are too generic. We need specific reducers for each entity type:

| Entity | New Reducer(s) | Type |
|---|---|---|
| `notifications` | `toggleNotificationRead`, `markNotificationsAllRead`, `addNotification`, `removeNotification` | RTK createSlice actions |
| `favorites` | `addFavorite`, `removeFavorite` | RTK createSlice actions |
| `messages` | `sendMessage`, `selectConversation` | RTK createSlice actions |
| `projectInvitations` | `acceptInvitation`, `rejectInvitation`, `sendInvitation` | RTK createSlice actions |
| `flaggedProjects` | `flagProject`, `submitAppeal`, `approveAppeal`, `rejectAppeal` | RTK createSlice actions |
| `courses` | `addCourse`, `editCourse`, `deleteCourse` | RTK createSlice actions |
| `internships` | `addInternship`, `updateInternship`, `deleteInternship`, `toggleArchive`, `toggleStatus` | RTK createSlice actions |
| `applications` | `updateApplicationStatus`, `applyForInternship` | RTK createSlice actions |
| `instructors` | `updateInstructorProfile` | RTK createSlice actions |
| `students` | `updateStudentProfile` | RTK createSlice actions |

**Note:** The existing `updateDatabase` partial merge reducer can handle bulk updates during migration.

---

## 6. New Hooks to Create

All hooks will use `useSelector` and `useDispatch` from `react-redux`, with `RootState` from `../store`.

| Name | Location | Returns | Data Source |
|---|---|---|---|
| `useDatabase` | `src/hooks/useDatabase.ts` | `useSelector` selectors for all entities | `state.database` |

**Replacement hooks** — refactor in-place (do not create new files):

| Hook | Changes |
|---|---|
| `useNotifications` | Replace localStorage-based shared state with `useSelector(state => state.database.notifications)` + `useDispatch` for mutations |
| `useProjectNotifications` | Replace shared state with `useSelector(state => state.database.projectInvitations)` + dispatch |
| `useFavorites` | Replace localStorage state with `useSelector(state => state.database.favorites)` + dispatch |
| `useMessages` | Replace localStorage state with `useSelector(state => state.database.messages, state.database.conversations)` + dispatch |
| `useProjectSearch` | Replace `useStudentProjects` data source with Redux-sourced projects |
| `usePortfolioSearch` | Replace localStorage dummy data with Redux-sourced students |
| `useInstructorSearch` | Replace hardcoded arrays with Redux-sourced instructors + courses |
| `useInternshipSearch` | Replace hardcoded arrays with Redux-sourced internships + applications |
| `useStudentStats` | Already uses `useStudentProjects` — update to Redux-sourced data |
| `useCourseLinks` | Replace useState with Redux-sourced courseLinks + dispatch |
| `useProjectModeration` | Replace useState with Redux-sourced flaggedProjects + dispatch |
| `useProjectInvitations` | Replace localStorage state with Redux-sourced data |
| `useProjectInvitationsList` | Replace useState with Redux-sourced projectInvitations + dispatch |
| `useInstructorProfile` | Replace localStorage state with Redux-sourced instructors + dispatch |
| `useStudentPortfolio` | Replace localStorage state with Redux-sourced students + dispatch |
| `useUsers` | Replace in-memory state with Redux-sourced data |
| `useCourses` | Replace hardcoded array with Redux-sourced courses + dispatch |
| `useAvailableProgrammingLanguages` | No change needed — static data, acceptable as-is |

**Local hooks to refactor:**
| Hook | Location | Changes |
|---|---|---|
| `useStudentProjects` | `src/pages/portal/student/projects/scripts/useStudentProjects.ts` | Replace localStorage shared state with Redux-sourced projects + dispatch |

---

## 7. Routes to Register

No new routes needed. All existing routes remain unchanged.

---

## 8. Edge Cases & Error States

- **Empty states:** All list-based pages must handle zero-items gracefully (already covered by existing empty-state components).
- **Loading states:** Redux selectors are synchronous — no loading states needed for data fetching.
- **Role-based access:** Each hook must only return data relevant to the current user's role.
- **Duplicate invitation cleanup:** When accepting/rejecting, ensure the action only affects the invitation for the current user — other users' copies must remain untouched.
- **Flag reason display:** Flag reasons must be displayed within the card boundary, not floating. The banner must be anchored to the bottom of the card above the footer.
- **Search default state:** When no query is entered, each section (instructors, projects, portfolios) must show 3 recommended items sorted by relevance.
- **Profile picture fallback:** If no profile picture is set, show first letter of first name in a styled circle avatar (already implemented in Header).
- **Notification badge:** Must not render at all when count is 0 (not even a transparent zero).

---

## 9. Open Questions

- [ ] **Scope of Redux migration:** Should ALL hooks be migrated in one batch, or should we migrate a subset per workstream? (Recommend: all at once during Workstream A since it's marked HIGH PRIORITY and nothing else should depend on the old pattern.)
- [ ] **Existing confirmation dialogs:** `MyProjectsPage` already has `ConfirmationDialog` for delete. `ProjectEditor` already has it for edits. `MyCourses` already has it for link/unlink. Should we keep these or consolidate to a single global `useConfirmDialog` hook?
- [ ] **Notification badge alignment:** The task says "bottom-right aligned" — should it overlap the icon (like a typical iOS badge) or sit adjacent to it? (Recommend: overlapping bottom-right corner, like the existing badge in Header.tsx line 103.)

---

## 10. Checklist (Acceptance Gate)

- [x] All affected requirements listed (Req 1, 7, 12, 19, 21, 22, 25–31, 35–36, 39, 42–46, 47–51, 52–58, 59–65, 66, 68–70, 74, 77–79, 85, 91, plus task items 1–12)
- [x] All affected pages/routes listed (13 pages, 10 components)
- [x] All new components have props interfaces (NotificationBadge, FlagReasonBanner)
- [x] All existing components' changes described (10 components)
- [x] All Context/state changes listed (10 new reducers in databaseSlice)
- [x] All new hooks listed with return types (1 new hook + 18 refactored)
- [x] All new routes listed (0 — no new routes)
- [x] All edge cases listed (7 edge cases)
- [ ] Zero open questions remain — TBD on questions above
