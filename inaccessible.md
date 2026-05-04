# Inaccessible Features Audit

This document lists features marked as **implemented** `[x]` in `checklist.md` that are currently inaccessible through the user interface or missing corresponding routes in the application.

## Global Features

### Notifications (Req 35, 36)
- **Status in Checklist:** `[x]` (Implemented)
- **Roles:** Student, Employer, Course Instructor, Administrator
- **Issues:** 
    - The notification bell in the `Header` is a static UI element with no functionality.
    - There are no links to a "Notifications" page in any of the role-based sidebars.
    - Routes for notifications are missing in `routes.tsx` for Employer, Instructor, and Administrator roles.

---

## Student Portal

### Project Invitations (Req 29, 30)
- **Status in Checklist:** `[x]` (Implemented)
- **Issues:** 
    - Although the route `/portal/student/invitations` exists in `routes.tsx`, there is no link to it in the Student Sidebar.

### Appeal Unflagging (Req 61)
- **Status in Checklist:** `[x]` (Implemented)
- **Issues:** 
    - There is no visible entry point in the UI for a student to initiate an appeal for a flagged project.

---

## Course Instructor Portal

### Project Invitations (Req 28, 29, 30)
- **Status in Checklist:** `[x]` (Implemented)
- **Issues:** 
    - There is no route defined in `routes.tsx` for instructor invitations.
    - There is no link in the Instructor Sidebar.

### Private Messages / Communications (Req 68, 69, 70)
- **Status in Checklist:** `[x]` (Implemented)
- **Issues:** 
    - The Instructor Sidebar contains a "Communications" link pointing to `/portal/instructor/communications`, but this route is missing from `routes.tsx`.

---

## Administrator Portal

*All implemented administrator features currently appear to be accessible via the "Admin Dashboard" sub-tabs (Stats, Verification, User Management, Courses, Moderation).*

---

## Summary Table

| Req ID | Feature | Role(s) Affected | Reason for Inaccessibility |
|---|---|---|---|
| 35, 36 | Notifications | All Roles | No sidebar links; Header bell is non-functional; Missing routes for 3/4 roles. |
| 28, 29, 30 | Project Invitations | Student, Instructor | Student: Missing sidebar link; Instructor: Missing route and sidebar link. |
| 68, 69, 70 | Communications | Instructor | Sidebar link points to a non-existent route. |
| 61 | Appeal Unflagging | Student | No UI entry point. |
