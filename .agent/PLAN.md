# PLAN: Admin Moderation & Link Requests

## 1. Feature Summary
This feature implements the Admin Control Panel's Course Link Requests and Content Moderation sections. It allows the admin to view, accept, or reject link/unlink requests from course instructors (Req 57), and receive notifications for these requests (Req 58). It also introduces the moderation capabilities where admins (and instructors) can flag inappropriate projects (Req 59), view lists of flagged projects (Req 62) and student appeals (Req 63), and activate or deactivate any project (Req 64).

## 2. Affected Pages & Routes
| Page | Route | Change Type |
|---|---|---|
| Course Directory | `/portal/administrator/courses` | Modified |
| Content Moderation | `/portal/administrator/moderation` | New |
| App Routes | `src/routes.tsx` | Modified |

## 3. New Components to Create

### `LinkRequestHandler` — `src/pages/portal/admin/courses/components/LinkRequestHandler.tsx`
```tsx
interface LinkRequestHandlerProps {
  requests: LinkRequest[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}
```
- **Reusability:** page-local
- **Design reference:** Tabbed lists with accept/reject buttons

### `FlaggedProjectList` — `src/pages/portal/admin/moderation/components/FlaggedProjectList.tsx`
```tsx
interface FlaggedProjectListProps {
  projects: FlaggedProject[];
  onDeactivate: (id: string) => void;
  onActivate: (id: string) => void;
}
```
- **Reusability:** page-local
- **Design reference:** List view with project name, reason for flagging, and toggle actions.

### `AppealReviewList` — `src/pages/portal/admin/moderation/components/AppealReviewList.tsx`
```tsx
interface AppealReviewListProps {
  appeals: Appeal[];
  onAcceptAppeal: (id: string, projectId: string) => void;
  onRejectAppeal: (id: string) => void;
}
```
- **Reusability:** page-local
- **Design reference:** Accordion or list with message text.

### `ContentModerationPage` — `src/pages/portal/admin/moderation/ContentModerationPage.tsx`
```tsx
export default function ContentModerationPage()
```
- **Reusability:** page-local

## 4. Existing Components to Modify
| Component | File | Change Description |
|---|---|---|
| CourseDirectoryPage | `src/pages/portal/admin/courses/CourseDirectoryPage.tsx` | Add a tab switcher for "Course List" and "Link Requests", and include the `LinkRequestHandler` component. |
| Router | `src/routes.tsx` | Replace `<div className="text-on-surface">Content Moderation Section</div>` with `<ContentModerationPage />` |

## 5. State Changes
| Context | New Keys Added | Type | Purpose |
|---|---|---|---|
| N/A | N/A | N/A | State will be managed by custom hooks encapsulating dummy data. |

## 6. New Hooks to Create
- **Name:** `useLinkRequests`
- **Location:** `src/pages/portal/admin/courses/scripts/useLinkRequests.ts`
- **Returns:** `{ requests: LinkRequest[], acceptRequest: (id: string) => void, rejectRequest: (id: string) => void }`
- **Data source:** Dummy list of link/unlink requests. Include dummy notifications logic.

- **Name:** `useModeration`
- **Location:** `src/pages/portal/admin/moderation/scripts/useModeration.ts`
- **Returns:** `{ flaggedProjects: FlaggedProject[], appeals: Appeal[], toggleProjectStatus: (id: string, activate: boolean) => void, acceptAppeal: (appealId: string) => void, rejectAppeal: (appealId: string) => void }`
- **Data source:** Dummy lists of flagged projects and appeals.

## 7. Routes to Register
- `/portal/administrator/moderation` (Updating existing dummy route in `routes.tsx` to point to `ContentModerationPage`)

## 8. Edge Cases & Error States
- **Empty States:** "No pending link requests", "No flagged projects", "No appeals".
- **Interaction States:** Confirmation toasts for accepting/rejecting requests or changing project statuses.

## 9. Open Questions
- None.

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
