import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store'

/**
 * useDatabase — single source of truth hook that exposes all Redux database
 * state slices via selectors and provides a dispatch helper.
 */
export default function useDatabase() {
  const dispatch = useDispatch()

  return {
    // ── Data slices ──────────────────────────────────────────────────────
    courses: useSelector((state: RootState) => state.database.courses),
    instructors: useSelector((state: RootState) => state.database.instructors),
    courseLinks: useSelector((state: RootState) => state.database.courseLinks),
    students: useSelector((state: RootState) => state.database.students),
    completedInternships: useSelector((state: RootState) => state.database.completedInternships),
    projects: useSelector((state: RootState) => state.database.projects),
    projectCollaborators: useSelector((state: RootState) => state.database.projectCollaborators),
    projectInvitations: useSelector((state: RootState) => state.database.projectInvitations),
    taskFeedback: useSelector((state: RootState) => state.database.taskFeedback),
    projectFeedback: useSelector((state: RootState) => state.database.projectFeedback),
    projectRatings: useSelector((state: RootState) => state.database.projectRatings),
    flaggedProjects: useSelector((state: RootState) => state.database.flaggedProjects),
    projectAppeals: useSelector((state: RootState) => state.database.projectAppeals),
    companies: useSelector((state: RootState) => state.database.companies),
    employerStats: useSelector((state: RootState) => state.database.employerStats),
    internships: useSelector((state: RootState) => state.database.internships),
    applications: useSelector((state: RootState) => state.database.applications),
    favorites: useSelector((state: RootState) => state.database.favorites),
    messages: useSelector((state: RootState) => state.database.messages),
    conversations: useSelector((state: RootState) => state.database.conversations),
    notifications: useSelector((state: RootState) => state.database.notifications),
    users: useSelector((state: RootState) => state.database.users) || [],

    // ── Dispatch helper ──────────────────────────────────────────────────
    dispatch,
  }
}
