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
