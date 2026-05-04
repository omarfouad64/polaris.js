# PLAN: Unified Search Hub

## 1. Feature Summary
Create a single Search hub tab per portal role (Student, Employer, Course Instructor, Administrator) that lets users switch between search types using a tab UI similar to the Admin pages. This will centralize search-related requirements: instructor search (Req 8/9), project search (Req 42-46), and portfolio search (Req 47-51). Collaborator search remains inside project views per user note.

## 2. Affected Pages & Routes
| Page | Route | Change Type |
|---|---|---|
| Search Hub | /portal/student/search | New |
| Search Hub | /portal/employer/search | New |
| Search Hub | /portal/instructor/search | New |
| Search Hub | /portal/administrator/search | New |
| Sidebar | N/A | Modified |
| Routes | N/A | Modified |

## 3. New Components to Create
### `SearchHubPage` — `src/pages/portal/explorer/SearchHubPage.tsx`
```tsx
interface SearchHubPageProps {
  // No props; uses role from GlobalContext.
}
```
- **Reusability:** Page-local (portal/explorer).
- **Design reference:** Admin tabs layout pattern (CourseDirectoryPage, ContentModerationPage).

### `SearchTabPanel` — `src/pages/portal/explorer/components/SearchTabPanel.tsx`
```tsx
interface SearchTabPanelProps {
  title: string
  description: string
  children: React.ReactNode
}
```
- **Reusability:** Page-local.
- **Design reference:** Admin tabs layout pattern.

## 4. Existing Components to Modify
| Component | File | Change Description |
|---|---|---|
| Sidebar | src/pages/portal/components/Sidebar.tsx | Replace role-specific instructor search links with a single Search tab per role. |
| Router | src/routes.tsx | Add role-specific /search routes that render SearchHubPage; remove role-specific /instructors routes if no longer used. |

## 5. State Changes
| Context | New Keys Added | Type | Purpose |
|---|---|---|---|
| N/A | N/A | N/A | Use local state in SearchHubPage to track active tab. |

Local state:
- `activeTab` string to select Instructor / Projects / Portfolios.

## 6. New Hooks to Create
N/A. Reuse `useInstructorSearch` for instructor search tab. Project/portfolio search tabs will show placeholders until their requirements are implemented.

## 7. Routes to Register
- `/portal/student/search` -> `SearchHubPage`
- `/portal/employer/search` -> `SearchHubPage`
- `/portal/instructor/search` -> `SearchHubPage`
- `/portal/administrator/search` -> `SearchHubPage`

## 8. Edge Cases & Error States
- Tabs for search types not implemented should show a clear placeholder state.
- Active tab persists during navigation within the page.
- Instructor search retains existing empty-state messages.

## 9. Open Questions
- [ ] N/A

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
- [x] 3. IMPLEMENT — All planned code written; TypeScript compiles.
- [ ] 4. SELF-REVIEW — All review checklist items self-assessed as PASS.
- [ ] 5. REVIEW — review_agent report: zero unresolved items.
- [ ] 6. TEST — All test cases PASS; zero regressions.
- [x] 7. DOCUMENT — project_data/ updated.
- [ ] 8. DONE
