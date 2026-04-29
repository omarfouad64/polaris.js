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
