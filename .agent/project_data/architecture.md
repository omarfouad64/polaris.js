# System Architecture - Polaris Portal

This document outlines the directory structure and routing architecture for the Project Polaris frontend.

## 1. Top-Level Directory Structure
```text
src/
├── components/          # Shared atomic components (Button, Input, etc.)
├── hooks/               # Shared logic (useUsers, etc.)
└── pages/               # Feature-specific layouts and pages
    ├── auth/            # Authentication domain
    │   ├── AuthPage/    # Components specific to Auth (Branding, Forms)
    │   ├── AuthLayout.tsx # Shared layout for Login/Signup
    │   ├── LoginPage.tsx  # Wrapper for Login form
    │   └── SignupPage.tsx # Wrapper for Signup form
    └── portal/          # Authenticated Portal domain (Root)
        ├── components/  # Layout parts (Sidebar, Header)
        ├── dashboard/   # Home/Overview feature folder
        ├── explorer/    # Search/Discovery feature folder
        ├── student/     # Student-specific sub-routes
        ├── employer/    # Employer-specific sub-routes
        ├── instructor/  # Instructor-specific sub-routes
        └── admin/       # Administrator-specific sub-routes

## 2. Routing Hierarchy (React Router v7)
The application uses a nested layout pattern with `<Outlet />` to manage shared UI shells while swapping content based on sub-routes and user roles.

### Authentication Flow
- **Parent:** `AuthLayout` (Provides branding section and glassmorphic card container)
  - `/auth/login` -> `LoginPage`
  - `/auth/signup` -> `SignupPage`
- **Standalone:** `/auth/forgot-password` (Standardized branding at absolute top-left)

### Portal Flow (Role-Based Redirection)
- **Root Redirection:** `/` -> `RoleSwitcher` -> Redirects to `/portal/[role]`
- **Parent:** `PortalLayout` (Provides Sidebar and Top Header)
  - `/portal/student` -> DashboardLayout (Sub-tabs: Overview, Projects, etc.)
  - `/portal/employer` -> Employer-specific views
  - `/portal/instructor` -> Instructor-specific views
  - `/portal/admin` -> AdminPage (Control Center)

## 3. Communication Patterns
- **Layout to Child:** Use `useOutletContext` for state that needs to be shared between a Layout and its nested routes (e.g., sharing the active role in Signup).
- **Global State:** Uses `GlobalContext` for session management (user authentication status).
