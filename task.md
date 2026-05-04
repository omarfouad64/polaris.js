# Project Polaris — Task List

> **Before starting:** Read `.agent/agent.md` and follow the workflow defined in `.agent/workflow.md`.

---

## Bug Fixes

### 1. Duplicate Invitations
- Remove duplicate invitation entries for both **students** and **instructors** once an invitation has been accepted or rejected.

### 2. Appeal Unflagging — Submit Does Nothing
- When a student opens a flagged project card, clicks **"Appeal Unflagging"**, then clicks **Submit**, nothing currently happens.
- Fix this by displaying a modal dialog after submission with the message:
  > *"Your appeal has been submitted and will be reviewed by an administrator within 48 hours."*
- The modal must include an **OK** button to dismiss it.

---

## UI / UX Improvements

### 3. Notification Badge on Icon
- Add a **red alert bubble** to the notifications icon in the top-right corner displaying the count of unread notifications.
- The bubble must be **bottom-right aligned** relative to the icon.
- The bubble must **not appear** when there are zero unread notifications.

### 4. Flagged Project Cards (Student — My Projects)
- Remove the **"Appeal Unflagging"** button from the project card surface.
- Replace it with the **reason for flagging**, displayed at the **bottom of the card**, properly anchored (not floating).
- The appeal action should only be accessible from inside the project detail view.

### 5. Card Layout — Edit & Delete Buttons
- In all project cards, ensure:
  - Card **text/content** is top-aligned.
  - **Edit** and **Delete** buttons are bottom-aligned and anchored (not floating).

### 6. Logged-in User Profile Picture
- The top-right corner currently shows a blank/empty circle.
- Replace it with the **actual profile picture** of the logged-in user.
- If the user has **not set a profile picture**, display their **first name's initial** (first letter) as a styled placeholder avatar instead of an empty circle.

### 7. Search UI Redesign
- Replace the current tabbed search UI with a **unified, single-page search layout** structured as follows:
  - **Left column:** Search bar at the top, filters below it (all filter types available simultaneously).
  - **Right area:** Search results divided into clearly labeled sections by type.
- The layout should be similar to the internships search UI in the student portal.
- **Default state (empty search):** Display personalized recommendations for each search category relevant to the current user.

### 8. View Instructor Profile (from Search)
- When viewing an instructor's profile from search results, apply the **same UI layout** used in the instructor's Edit Profile page.

### 9. Admin Confirmation Dialogs
- Before any admin action on the dashboard takes effect, display a **confirmation dialog** that:
  - Describes what is about to happen.
  - Asks the admin to confirm before proceeding.

### 10. Student Project Action Confirmation Dialogs
- When a student attempts to **delete a project** or **confirm edits** to project info, display a confirmation dialog matching the style used for admin confirmations.

### 11. Course Link / Unlink Feedback Dialogs (Instructor)
- In the **Courses** section, after an instructor clicks **"Link Course"** or **"Unlink Course"**, display a feedback dialog confirming the action was performed successfully.
- Each dialog must include an **OK** button to dismiss it.

---

## New Features

### 12. Flagged Project Notifications (Student)
- Send a **notification to the student** when any project they are working on is flagged.
- The notification must include the **reason for flagging** inline.