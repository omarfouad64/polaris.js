# Component Library - Project Polaris

This document lists and describes the reusable UI components implemented for the Polaris design system.

## Global Components (`src/components/`)

### 1. Button
- **Path:** `src/components/Button.tsx`
- **Description:** A highly customizable button component following the Polaris premium aesthetic.
- **Variants:** `primary`, `secondary`, `outline`, `ghost`.
- **Sizes:** `sm`, `md`, `lg`.
- **Key Features:**
    - Uses `Plus Jakarta Sans` for typography.
    - Custom shadow and transition effects.
    - Active state translation for tactile feedback.

### 2. Input
- **Path:** `src/components/Input.tsx`
- **Description:** A standard text input component with optional icons and error states.
- **Key Features:**
    - Material Symbols icon integration.
    - Consistent padding and border radius.
    - Focus states using the `secondary` color token.
    - Accessible labels and error messages.

### 3. Card
- **Path:** `src/components/Card.tsx`
- **Description:** A container component for grouping related content.
- **Key Features:**
    - Premium shadow (`rgb(55,48,163,0.06)`).
    - Optional header with title and description.
    - Flexible padding using design system tokens.

### 4. ProtectedRoute
- **Path:** `src/components/ProtectedRoute.tsx`
- **Description:** A layout-level component that guards routes based on authentication status.
- **Functionality:** Redirects unauthenticated users to `/auth`.

---

## Page-Specific Components

### AuthPage Components
- **AuthPage:** Unified Login/Register flow with split-screen design. Includes role-specific branding and Employer-specific features like **Tax Certificate PDF upload**.
- **ForgotPassword:** 3-step password recovery wizard with glassmorphic UI and step indicator.

### Layout Components
- **RootLayout:** Sidebar-based navigation shell with user profile and logout.
- **AdminLayout:** Admin Control Panel layout with sub-navigation tabs for Stats, Users, Courses, etc.

### Admin Components
- **UserDataTable:** Reusable table list for displaying users with role badges and active/deactivate toggles.
- **CreateAdminModal:** Dialog form for creating new administrators.
- **CourseDataTable:** Reusable table list for displaying courses.
- **CourseModal:** Dialog form for creating and editing courses.
- **EmployerApplicationList:** Reusable card list for displaying employer applications awaiting verification.
- **EmployerDetailModal:** Modal pane for viewing employer company details and embedded PDF tax certificates.

### Employer Components
- **EmployerLayout:** (`src/pages/portal/employer/EmployerLayout.tsx`) — Layout shell with sub-navigation tabs: Dashboard, Company Profile, Internships, Favorites, Communications.
- **EmployerDashboardPage:** (`src/pages/portal/employer/dashboard/EmployerDashboardPage.tsx`) — Statistics cards (internships offered, students placed) and placements-over-time bar chart. Req 71.
- **CompanyProfilePage:** (`src/pages/portal/employer/profile/CompanyProfilePage.tsx`) — Company info CRUD with Details/Location/Documents tabs. Includes OSM map picker with Nominatim reverse geocoding and real PDF uploads. Req 10, 11, 13.
- **InternshipManagementPage:** (`src/pages/portal/employer/internships/InternshipManagementPage.tsx`) — Internship CRUD with Active/Archived tabs, hiring status toggle, archive control, and create/edit modal. Req 74, 77, 78, 85, 86.
- **ApplicantReviewPage:** (`src/pages/portal/employer/applicants/ApplicantReviewPage.tsx`) — Candidates/Suggested Matches tabs, applicant cards with status selector (Nominated/Accepted/Rejected), cover letter preview, sort by top contributors. Req 75, 76, 87, 88.

### Student Components
- **InternshipExplorerPage:** (`src/pages/portal/student/internships/InternshipExplorerPage.tsx`) — Search/filter/sort internships with filter sidebar, application modal with cover letter, My Applications and Completed tabs. Req 79–84, 89, 90.

### Shared Components
- **FavoritesPage:** (`src/pages/portal/shared/favorites/FavoritesPage.tsx`) — Projects/Portfolios/Recommended tabs with favorite cards, remove buttons. Shared between Student and Employer. Req 65, 66, 67.
- **CommunicationsPage:** (`src/pages/portal/shared/communications/CommunicationsPage.tsx`) — Notifications list with read/unread management and private messaging chat interface. Req 68, 69, 70.
