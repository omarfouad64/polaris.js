# PLAN: Task List Cleanup — Invitations, Moderation, Search, and UI Fixes

## 1. Feature Summary
Implement the task list updates across invitations, moderation appeals, notifications, search UX, and admin/student confirmations. This touches Student, Instructor, Employer, and Administrator flows. Covered requirements include Req 7, 8, 9, 19, 21, 29, 30, 35, 36, 42, 43, 44, 45, 47, 48, 49, 50, 59, 60, 61, 62, 63, 64, 67.

## 2. Affected Pages & Routes
| Page | Route | Change Type |
|---|---|---|
| My Projects | /portal/student/projects | Modified |
| Project Editor | /portal/student/projects/:id | Modified |
| Project Detail View | /portal/*/projects/:id/view | Modified |
| Project Invitations | /portal/*/invitations | Modified |
| Notifications Center | /portal/*/notifications | Modified |
| Search Hub | /portal/*/search | Modified |
| Instructor Directory | /portal/*/search (instructor section) | Modified |
| Instructor Profile | /portal/instructor | Referenced for layout parity |
| My Courses (Instructor) | /portal/instructor/courses | Modified |
| Admin User Directory | /portal/admin/users | Modified |
| Admin Course Directory | /portal/admin/courses | Modified |
| Admin Employer Verification | /portal/admin/verification | Modified |
| Admin Content Moderation | /portal/admin/moderation | Modified |
| Portal Header | (layout component) | Modified |

## 3. New Components to Create
### `ConfirmationDialog` — `src/components/ConfirmationDialog.tsx`
```tsx
interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'primary' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}
```
- **Reusability:** Global (`src/components/`).
- **Design reference:** styling.md Modals section.

### `FeedbackDialog` — `src/components/FeedbackDialog.tsx`
```tsx
interface FeedbackDialogProps {
  isOpen: boolean
  title: string
  message: string
  actionLabel?: string
  onClose: () => void
}
```
- **Reusability:** Global (`src/components/`).
- **Design reference:** styling.md Modals section.

## 4. Existing Components to Modify
| Component | File | Change Description |
|---|---|---|
| Header | src/pages/portal/components/Header.tsx | Add unread badge and avatar logic using profile hooks. |
| useNotifications | src/hooks/useNotifications.ts | Add `addNotification`, persist to localStorage, expose unread count for badge. |
| useProjectInvitationsList | src/hooks/useProjectInvitationsList.ts | Deduplicate accepted/rejected entries and remove duplicates after status change. |
| ProjectCard | src/pages/portal/student/projects/components/ProjectCard.tsx | Remove appeal button, anchor reason at bottom, align actions bottom. |
| MyProjectsPage | src/pages/portal/student/projects/MyProjectsPage.tsx | Replace delete modal with ConfirmationDialog. |
| ProjectEditor | src/pages/portal/student/projects/components/ProjectEditor.tsx | Add confirmation dialog on edit save. |
| ProjectDetailsPage | src/pages/portal/shared/projects/ProjectDetailsPage.tsx | Replace appeal alert with feedback modal; ensure flag notification includes reason. |
| SearchHubPage | src/pages/portal/explorer/SearchHubPage.tsx | Replace tabs with unified layout, sidebar filters, and sectioned results. |
| InstructorDirectory | src/pages/portal/explorer/InstructorDirectory.tsx | Refactor to sectioned results; update profile modal layout to match InstructorProfilePage. |
| ProjectSearchPanel | src/pages/portal/explorer/projects/ProjectSearchPanel.tsx | Adapt for section rendering and external filters. |
| MyCourses | src/pages/portal/instructor/courses/MyCourses.tsx | Add link/unlink feedback dialog. |
| Admin pages/components | src/pages/portal/admin/** | Add ConfirmationDialog before admin actions (create, edit, delete, accept/reject, activate/deactivate). |

## 5. State Changes
| Context | New Keys Added | Type | Purpose |
|---|---|---|---|
| N/A | N/A | N/A | Use local state for confirmation/feedback dialogs and search filters. |

Local state updates:
- SearchHubPage: unified filter state and empty-search detection.
- Admin pages: selected entity for confirmation dialogs.
- ProjectEditor: pending edit confirmation state.

## 6. New Hooks to Create
- **Name:** `usePortfolioSearch`
- **Location:** `src/hooks/usePortfolioSearch.ts`
- **Returns:** `{ portfolios: StudentPortfolio[], filters, updateFilters, recommendedPortfolios }`
- **Data source:** Dummy portfolios list encapsulated in hook.

## 7. Routes to Register
N/A.

## 8. Edge Cases & Error States
- Invitations: accepting/rejecting a non-existent invite should be a no-op.
- Confirmation dialogs: cancel leaves data unchanged.
- Search: empty search shows recommendations; zero results shows empty state per section.
- Profile avatar: no image falls back to first-letter initials.

## 9. Open Questions
N/A.

## 10. Checklist (Acceptance Gate)
- [x] All affected requirements listed.
- [x] All affected pages/routes listed.
- [x] All new components have props interfaces.
- [x] All existing components' changes described.
- [x] All Context/state changes listed.
- [x] All new hooks listed with return types.
- [x] All new routes listed.
- [x] All edge cases listed.
- [x] Zero open questions remain.

## Workflow Checklist

- [x] 1. READ — All required documentation read.
- [x] 2. PLAN — PLAN.md complete; zero open questions.
- [ ] 3. IMPLEMENT — All planned code written; TypeScript compiles.
- [ ] 4. SELF-REVIEW — All review checklist items self-assessed as PASS.
- [ ] 5. REVIEW — review_agent report: zero unresolved items.
- [ ] 6. TEST — All test cases PASS; zero regressions.
- [x] 7. DOCUMENT — project_data/ updated.
- [ ] 8. DONE
