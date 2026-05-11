# Custom Hooks - Project Polaris

This document lists and describes the custom React hooks implemented to manage state and data for the Polaris frontend.

## Global Context Hooks

### 1. useGlobalContext
- **Source:** `src/globalContext.tsx`
- **Purpose:** Access the global application state, including user authentication data.
- **Values provided:**
    - `user`: Object containing `username` and `role`.
    - `isLoggedIn`: Boolean indicator of session status.
    - `login(username, role)`: Function to establish a session and persist to `localStorage`.
    - `logout()`: Function to clear the session.

## Data Hooks (`src/hooks/`)

### 1. useUsers
- **Source:** `src/hooks/useUsers.ts`
- **Purpose:** Simulates a backend database for user management.
- **Key Features:**
    - **In-Memory Storage:** Maintains a list of registered users for the duration of the browser session.
    - **Dummy Data:** Pre-populated with default accounts for Students, Admins, Employers, and Instructors.
    - **Functions:**
        - `registerUser(username, role, password)`: Appends a new user to the mock database.
        - `findUser(username)`: Retrieves a user by their email/username.

## Local/Page Hooks

### 1. Admin - useUsers
- **Source:** `src/pages/portal/admin/users/scripts/useUsers.ts`
- **Purpose:** Provides a dummy list of users with toggle status and add admin functions.
- **Key Features:**
    - State: `users`
    - Functions: `toggleUserStatus`, `addAdmin`

### 2. Admin - useCourses
- **Source:** `src/pages/portal/admin/courses/scripts/useCourses.ts`
- **Purpose:** Provides a dummy list of courses with CRUD capabilities.
- **Key Features:**
    - State: `courses`
    - Functions: `addCourse`, `editCourse`, `deleteCourse`

### 3. Admin - usePlatformStats
- **Source:** `src/pages/portal/admin/scripts/usePlatformStats.ts`
- **Purpose:** Provides static dummy data for the main admin dashboard stats.

### 4. Admin - useEmployerApplications
- **Source:** `src/pages/portal/admin/verification/scripts/useEmployerApplications.ts`
- **Purpose:** Provides a dummy list of employer applications for verification.
- **Key Features:**
    - State: `applications`
    - Functions: `acceptApplication`, `rejectApplication`, `downloadDocument`

### 4.1 Admin - useLinkRequests
- **Source:** `src/pages/portal/admin/courses/scripts/useLinkRequests.ts`
- **Purpose:** Provides a dummy list of instructor course link/unlink requests.
- **Key Features:**
    - State: `requests`, `pendingRequests`
    - Functions: `acceptRequest`, `rejectRequest`

### 4.2 Admin - useModeration
- **Source:** `src/pages/portal/admin/moderation/scripts/useModeration.ts`
- **Purpose:** Manages flagged projects and student appeals.
- **Key Features:**
    - State: `flaggedProjects`, `appeals`
    - Functions: `toggleProjectStatus`, `acceptAppeal`, `rejectAppeal`

### 5. Employer - useCompanyProfile
- **Source:** `src/pages/portal/employer/profile/scripts/useCompanyProfile.ts`
- **Purpose:** Manages employer company profile data with CRUD operations.
- **Key Features:**
    - State: `profile` (CompanyProfile)
    - Functions: `updateProfile`, `setLocation`, `uploadDocument`, `removeDocument`

### 6. Employer - useInternships
- **Source:** `src/pages/portal/employer/internships/scripts/useInternships.ts`
- **Purpose:** Manages employer internship listings with CRUD, archive, and status toggling.
- **Key Features:**
    - State: `internships`, `activeInternships`, `archivedInternships`
    - Functions: `addInternship`, `updateInternship`, `deleteInternship`, `toggleStatus`, `toggleArchive`

### 7. Employer - useApplicants
- **Source:** `src/pages/portal/employer/applicants/scripts/useApplicants.ts`
- **Purpose:** Manages student applications for a specific internship with sorting and filtering.
- **Key Features:**
    - State: `applicants`, `suggestedApplicants`, `sortByContributors`
    - Functions: `updateStatus`, `toggleSortByContributors`

### 8. Employer - useEmployerStats
- **Source:** `src/pages/portal/employer/dashboard/scripts/useEmployerStats.ts`
- **Purpose:** Provides employer dashboard statistics (internships offered, students placed, monthly trends).

### 9. Global - useFavorites
- **Source:** `src/hooks/useFavorites.ts`
- **Purpose:** Manages saved projects and portfolios, and provides recommended projects.
- **Key Features:**
    - State: `favorites`, `favoriteProjects`, `favoritePortfolios`, `recommendedProjects`
    - Functions: `addFavorite`, `removeFavorite`, `isFavorite`

### 10. Global - useMessages
- **Source:** `src/hooks/useMessages.ts`
- **Purpose:** Manages private messaging conversations with send/receive functionality.
- **Key Features:**
    - State: `conversations`, `activeConversation`, `activeMessages`, `totalUnread`
    - Functions: `sendMessage`, `selectConversation`

### 11. Global - useNotifications
- **Source:** `src/hooks/useNotifications.ts`
- **Purpose:** Manages notification data with read/unread toggling.
- **Key Features:**
    - State: `notifications`, `unreadCount`
    - Functions: `toggleRead`, `markAllRead`

### 12. Global - useInternshipSearch
- **Source:** `src/hooks/useInternshipSearch.ts`
- **Purpose:** Provides student-facing internship search, filter, sort, and application functionality.
- **Key Features:**
    - State: `internships`, `applications`, `completedInternships`, search/filter state
    - Functions: `applyForInternship`, `hasApplied`, filter/sort setters

### 13. Global - usePortfolioSearch
- **Source:** `src/hooks/usePortfolioSearch.ts`
- **Purpose:** Provides portfolio search and filter functionality with dummy portfolio data.
- **Key Features:**
    - State: `filters`, `portfolios`, `recommendedPortfolios`
    - Functions: `updateFilters`
    - Metadata: `availableMajors`, `availableSkills`

### 14. Global - useStudentStats
- **Source:** `src/hooks/useStudentStats.ts`
- **Purpose:** Computes portfolio-level statistics for the logged-in student (Req 72).
- **Key Features:**
    - Derived State: `totalProjects`, `publicProjects`, `activeProjects`, `totalTasks`, `languageStats`, `projectsWithCollaborators`

### 15. Local - useCourseLinks (Instructor)
- **Source:** `src/hooks/useCourseLinks.ts`
- **Purpose:** Manages instructor course linking with request-based approval flow.
- **Key Features:**
    - State: `courseLinks`, `linkedCourses`, `availableCourses`
    - Functions: `linkCourse`, `unlinkCourse`, `requestLink`, `requestUnlink`
    - `requestLink(courseId)` sets status to `'pending'` with direction `'link'` for admin approval.
    - `requestUnlink(courseId)` sets status to `'pending'` with direction `'unlink'` for admin approval.

### 16. Local - useProjectInvitations (Student Projects)
- **Source:** `src/hooks/useProjectInvitations.ts`
- **Purpose:** Manages project collaboration invitations and collaborator management.
- **Key Features:**
    - State: `collaborators`, `searchableUsers`, `pendingInvitations`
    - Functions: `sendInvitation`, `removeCollaborator`, `cancelInvitation`, `acceptInvitation`, `rejectInvitation`
    - Bachelor's projects (course-001) block all collaborator invitations.

### 17. Local - useStudentProjects (Student)
- **Source:** `src/pages/portal/student/projects/scripts/useStudentProjects.ts`
- **Purpose:** Manages student project CRUD via Redux store.
- **Key Features:**
    - State: `projects` (filtered by current user)
    - Functions: `createProject`, `updateProject`, `deleteProject`, `getProjectById`
    - Accepts `currentUserId` parameter to scope projects to the authenticated user.
    - Filters projects where the user is either the owner or an accepted collaborator.
    - `createProject` uses the passed `currentUserId` as the `ownerId` (no longer hardcoded).
    - `projectCollaborators` from Redux store is used to determine contributor projects.

### 18. Local - useTabNotifications (Global)
- **Source:** `src/hooks/useTabNotifications.ts`
- **Purpose:** Computes unread notification counts for header/sidebar tab badges.
- **Key Features:**
    - State: `userNotifications`, `messageUnread`, per-category unread counts
    - Properly scopes notifications to the current user by `recipientId`.
    - Filters conversations by `participantId` matching the current user.
