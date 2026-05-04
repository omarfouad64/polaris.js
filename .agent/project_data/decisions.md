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

## 10. Employer Portal Architecture
- **Decision:** Created a dedicated `EmployerLayout` mirroring the `AdminLayout` pattern with sub-navigation tabs.
- **Rationale:** The employer portal has 5 distinct feature areas (Dashboard, Profile, Internships, Favorites, Communications) that benefit from a tabbed layout for contextual navigation.
- **Impact:** All employer pages are nested under `/portal/employer/` with their own layout shell.

## 11. Shared Pages Pattern
- **Decision:** Created a `shared/` directory under `pages/portal/` for pages reused across multiple roles (Favorites, Communications).
- **Rationale:** Favorites and Communications pages have identical UI for both Students and Employers. Sharing components avoids duplication while keeping the code DRY.
- **Impact:** Both Student and Employer routes reference the same `FavoritesPage` and `CommunicationsPage` components.

## 12. OSM Map Picker with Nominatim
- **Decision:** Replaced the Company Profile map placeholder with a React Leaflet OSM map picker and Nominatim reverse geocoding.
- **Rationale:** Avoids API key requirements while still enabling real map interaction and address lookup.
- **Impact:** Employer profile locations store coordinates plus an optional formatted address, with a fallback to lat/lng when Nominatim fails.

## 13. Internship Application Flow
- **Decision:** Student internship applications use a modal overlay with a cover letter textarea.
- **Rationale:** Keeps the user in context (the internship listing) while providing a focused application form. Cover letter is limited to 500 characters per Req 84.
- **Impact:** Applications are tracked in the student's "My Applications" tab and appear in the employer's "Applicant Review" page.

## 14. Unified Search Hub
- **Decision:** Consolidated search-related experiences into a single Search tab per role, with tabbed sub-views for search types.
- **Rationale:** Reduces sidebar clutter and groups discovery workflows in one consistent location.
- **Impact:** Role-specific routes under `/portal/<role>/search` render a shared SearchHubPage with tabbed sections.
