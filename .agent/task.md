# Task: Implement Core Auth Flow & Home Shell (Requirements 1-4)

**CRITICAL DIRECTIVE:** Before beginning this task, you MUST read and strictly adhere to your Standard Operating Procedure defined in `/.agent/agent.md`. Do not write any code until you have ingested the architectural rules, styling constraints, and workflow phases outlined there.

## Task Overview
Your objective is to implement the foundational Authentication flow, Global State management, Route Protection, and the foundational Home layout shell.

Please execute the following technical requirements:

### 1. Global State & Data Mocking
* **Global Context:** Create a file at `src/globalContext.tsx`. Implement a React Context to store the `username` globally. Note: This should be a general app-level context, not strictly limited to auth.
* **Persistence:** The logged-in `username` must be saved to `localStorage` (or `sessionStorage`) so the session persists across browser refreshes.
* **In-Memory Mock Backend:** To simulate a database, create a hook or utility that holds a hardcoded array of dummy usernames. When a user "registers", append their new username to this in-memory list so they can subsequently log in during the current session.

### 2. Routing & Security
* **Protected Routes:** Implement a route guard. If a user is NOT logged in and attempts to access any route outside of the `/auth` domain, automatically redirect them to the login page.

### 3. UI/UX & Component Architecture
* **Unified Auth UI:** The provided designs show separate, fragmented login/registration flows for "Employers" vs. other user types. **Override this design.** You must create a single, unified, and clean Auth component that handles all user types consistently.
* **Password Reset:** The UI for resetting passwords is incomplete in the design files. You must design and implement this missing UI so it perfectly matches the surrounding aesthetic. Since there is no backend, simply generate a dummy OTP and `console.log("OTP Sent: [code]")` when the user submits the reset form.
* **Error Handling:** Implement elegant, good-looking error states (e.g., inline validation text, toast notifications, or styled alert boxes) to trigger when a user inputs incorrect data or fails validation.
* **Home Layout Shell:** Build the primary Home "Tab" layout (the navigation shell). Do not build the internal content for these tabs yet. The design files are inconsistent regarding this layout—evaluate them, choose the cleanest approach, and standardize it.

### 4. Documentation & Synchronization (Phase 4)
* **Record Decisions:** You are making several executive design decisions here (unifying the auth flow, finalizing the password reset UI, and choosing a consistent home layout). You MUST document these specific design decisions and deviations in the `/agent/project_data/` markdown files so you (and the team) remember them for future tasks.