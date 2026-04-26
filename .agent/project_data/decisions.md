# Executive Design Decisions - Phase 1

This document records key architectural and design decisions made during the implementation of the Core Auth Flow & Home Shell.

## 1. Unified Authentication Flow
- **Decision:** Combined separate "Employer" and "Student" registration/login flows into a single `AuthPage` component.
- **Rationale:** Reduces code duplication and provides a cleaner, more modern user experience. Role selection is handled via a toggle during registration.
- **Impact:** `AuthPage` dynamically adjusts its fields based on the selected role (e.g., Company Name for Employers, First/Last Name for others).

## 2. Password Reset UI
- **Decision:** Designed a 3-step wizard flow for password recovery.
- **Rationale:** The original design files lacked a complete reset flow. A multi-step approach (Email -> OTP -> New Password) is industry standard and user-friendly.
- **Impact:** Implemented as a state-driven component within `ForgotPassword.tsx`.

## 3. Global Navigation Shell (RootLayout)
- **Decision:** Adopted a persistent Sidebar navigation with a Top Header.
- **Rationale:** Standardizes navigation across all user types and provides clear hierarchy.
- **Impact:** The sidebar contains main app "tabs", while the header displays the current context. The user profile and logout are consistently accessible at the bottom of the sidebar.

## 4. In-Memory Mock Backend
- **Decision:** Implemented a module-level variable in `useUsers.ts` to persist registered users within the current browser session.
- **Rationale:** Simplifies development while fulfilling the requirement for simulating a database without a real backend.
- **Impact:** Allows "Register then Login" flow to work during a single session.

## 6. Modular Layout & Sub-Page Architecture (Outlet Pattern)
- **Decision:** Refactored large monolithic pages (like AuthPage and Home) into modular layouts using React Router `<Outlet />`.
- **Rationale:** Separates common UI shells (Sidebar, Branding) from specific content (Forms, Dashboards). This improves readability, reduces file size, and allows for clean sub-route management.
- **Impact:** Feature-specific logic is now isolated in lightweight "Page" components, while the layout handles the visual "Shell".

## 9. Administrator Control Center
- **Decision:** Created a dedicated `AdminPage` with ecosystem-wide metrics and activity feeds.
- **Rationale:** Administrators require a high-level overview of system health and user activities that differs significantly from other roles.
- **Impact:** Provides a centralized hub for system oversight and manual user approvals.
