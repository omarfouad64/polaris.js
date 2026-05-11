# PLAN: Student Portfolio, Instructor Profile & Project Collaboration

## 1. Feature Summary

This is an integrated 18-requirement implementation covering:
- **Student Portfolio (Req 5):** Manage portfolio info (major, skills, LinkedIn)
- **Instructor Profile (Req 6-9):** Profile management and instructor discovery
- **Project Collaboration (Req 25-31):** Search, invite, manage collaborators
- **Feedback & Ratings (Req 37-41):** Task/project feedback and instructor ratings
- **Project Moderation (Req 60-61):** Flagged project notifications and appeals

## 2. Affected Pages & Routes

| Page | Route | Change Type |
|------|-------|-------------|
| Student Portfolio | `/portal/student/portfolio` | New |
| Instructor Profile | `/portal/instructor/profile` | New |
| Instructor Directory | `/portal/instructor/directory` | New |
| Instructor Detail | `/portal/instructor/:id` | New |
| Project Collaboration | `/portal/student/projects/:id/collaboration` | New |
| Project Feedback | `/portal/student/projects/:id/feedback` | New |
| Project Appeals | `/portal/student/projects/:id/appeal` | New |

## 3. New Components to Create

### A. Student Portfolio Components
- `StudentPortfolioPage` — Main portfolio management page
- `PortfolioInfoForm` — Form to edit major, skills, LinkedIn
- `SkillsInput` — Reusable tag input for skills

### B. Instructor Profile Components
- `InstructorProfilePage` — Instructor's own profile management
- `InstructorInfoForm` — Form to edit bio, research, education
- `MyCourses` — Tab to manage linked courses with link/unlink buttons

### C. Instructor Discovery Components
- `InstructorDirectoryPage` — Search and browse instructors
- `InstructorSearchBar` — Search by name/course
- `InstructorCard` — Preview card in directory
- `InstructorDetailPage` — Full profile view with linked courses

### D. Project Collaboration Components
- `ProjectCollaborationPage` — Manage invitations, collaborators
- `SearchCollaboratorModal` — Modal to search users (students + instructors)
- `CollaboratorList` — Display collaborators with invitation status badges
- `InvitationForm` — Send new invitations
- `PendingInvitationsList` — Show sent invitations awaiting response

### E. Project Feedback Components
- `ProjectFeedbackPage` — View/manage feedback on project
- `TaskFeedbackForm` — Instructor adds feedback on specific task
- `ProjectFeedbackForm` — Instructor adds general project feedback
- `ProjectRatingComponent` — Instructor rates project (1-5 stars)
- `StudentFeedbackView` — Student views feedback (read-only)

### F. Project Moderation Components
- `FlaggedNotification` — Toast/modal when project is flagged
- `ProjectAppealForm` — Form to submit appeal with message
- `AppealStatusView` — View appeal status

## 4. Existing Components to Modify

| Component | File | Change |
|-----------|------|--------|
| Routes | `src/routes.tsx` | Add 7 new routes for pages |
| Instructor Layout | (create new) | Create layout with tabs |
| Student Dashboard | `/pages/portal/student/` | Add Portfolio tab |

## 5. State Changes

No Global Context changes. All state managed by local hooks with dummy data.

## 6. New Hooks to Create

### Student Portfolio
- `useStudentPortfolio()` at `src/pages/portal/student/portfolio/scripts/useStudentPortfolio.ts`

### Instructor
- `useInstructorProfile()` at `src/pages/portal/instructor/profile/scripts/useInstructorProfile.ts`
- `useInstructorDirectory()` at `src/pages/portal/instructor/directory/scripts/useInstructorDirectory.ts`

### Project Collaboration
- `useCollaboratorSearch()` at `src/pages/portal/student/projects/collaboration/scripts/useCollaboratorSearch.ts`
- `useProjectInvitations()` at `src/pages/portal/student/projects/collaboration/scripts/useProjectInvitations.ts`

### Feedback & Moderation
- `useProjectFeedback()` at `src/pages/portal/student/projects/feedback/scripts/useProjectFeedback.ts`
- `useProjectModeration()` at `src/pages/portal/student/projects/appeal/scripts/useProjectModeration.ts`

## 7. Routes to Register

7 new routes covering all pages above.

## 8. Edge Cases & Error States

- No collaborators: "No collaborators added yet"
- No feedback: "No feedback yet"
- Invitation pending: Show "Pending" badge
- Project flagged: Show modal with reason
- Appeal submitted: Show confirmation

## 9. Design Tokens

All UI uses Tailwind classes with design tokens from `src/index.css`.

## 10. Workflow Checklist

- [x] 1. READ — All documentation reviewed
- [x] 2. PLAN — This plan complete
- [ ] 3. IMPLEMENT — Code generation in progress
- [ ] 4. SELF-REVIEW — Pending
- [ ] 5. REVIEW — Pending
- [ ] 6. TEST — Pending
- [ ] 7. DOCUMENT — Pending
- [ ] 8. DONE
