# Missing Features: Project Viewing & Details

This document outlines the requirements and functionalities related to viewing a project that are currently unimplemented or only exist as visual placeholders.

## 1. Task Management (Req 32, 33, 34)
While the project overview is implemented, the granular task-level view is missing.
- **Task List (Req 33)**: No UI exists to display the specific tasks associated with a project, including their descriptions, assignees, and deadlines.
- **Task Ordering (Req 34)**: The ability to view tasks sorted by importance or custom order is not implemented.
- **Task Details (Req 33)**: Clicking a task to see full implementation details/status is not yet possible.

## 2. Advanced Instructor Feedback (Req 37, 38, 40)
The current "Evaluation" section on the Project Details page is a static placeholder.
- **Per-Task Feedback (Req 37, 40)**: Instructors cannot currently leave, and users cannot view, specific comments tied to individual tasks.
- **General Feedback (Req 38)**: There is no system to display a full text-based general review from an instructor.

## 3. Interaction & Social Features (Req 65, 69)
The action buttons in the Project Details header are currently non-functional.
- **Favorite System (Req 65)**: The "Save" button does not persist the project to the user's favorites list.
- **Direct Messaging (Req 69)**: The "Message Student" button does not yet initialize a new conversation in the Communications hub.

## 4. Moderation & Flagging (Req 59, 60)
Privileged users (Administrators and Instructors) do not have the UI to perform moderation actions from the Project Details page.
- **Flagging Interface (Req 59)**: Missing a "Flag Project" button with a modal to specify a reason (Copyright, Inappropriate content, etc.).

## 5. Project Statistics (Req 72)
Data visualization features for projects are entirely missing.
- **Stats View**: Viewing a breakdown of language distribution, code complexity, or top collaborator contributions is not implemented.

---

### Suggested Next Steps
1. **Implement Task List Component**: Add a dedicated section for tasks within the `ProjectDetailsPage`.
2. **Hook up Favorites Logic**: Connect the "Save" button to the `useFavorites` hook.
3. **Add Moderation Controls**: Conditionally render "Flag" buttons for Admin/Instructor roles.
4. **Initiate Messaging**: Map the "Message Student" button to a function that creates a conversation thread.
