import { useState, useCallback, useMemo, useEffect } from 'react'
import type { TaskFeedback, ProjectFeedback, ProjectRating } from '../types'

/**
 * Returns the correct seed data for task feedback, scoped to a projectId.
 * Task IDs match the dummy projects in useStudentProjects.
 */
function seedTaskFeedback(projectId: string): TaskFeedback[] {
  if (projectId === 'proj-001') {
    const now = Date.now()
    return [
      {
        id: 'tf-001',
        taskId: 'task-1',
        instructorId: 'instructor@guc.edu.eg',
        instructorName: 'Dr. Fatima Al-Mansouri',
        comment: 'Good progress on the database schema. Ensure proper indexing for performance.',
        createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'tf-002',
        taskId: 'task-2',
        instructorId: 'instructor@guc.edu.eg',
        instructorName: 'Dr. Fatima Al-Mansouri',
        comment: 'Authentication implementation looks solid. Consider adding refresh-token rotation for production readiness.',
        createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'tf-003',
        taskId: 'task-3',
        instructorId: 'instructor@guc.edu.eg',
        instructorName: 'Dr. Fatima Al-Mansouri',
        comment: 'Unit test coverage is still low. Aim for at least 80% branch coverage before final submission.',
        createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now - 3 * 60 * 60 * 1000).toISOString()
      },
      // Second instructor's feedback
      {
        id: 'tf-004',
        taskId: 'task-1',
        instructorId: 'prof.ahmed@guc.edu.eg',
        instructorName: 'Prof. Ahmed Khalil',
        comment: 'Schema design is thorough. I recommend adding foreign key constraints and reviewing the normalization level.',
        createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'tf-005',
        taskId: 'task-2',
        instructorId: 'prof.ahmed@guc.edu.eg',
        instructorName: 'Prof. Ahmed Khalil',
        comment: 'JWT implementation looks clean, but make sure tokens are invalidated on logout. Also consider adding rate limiting.',
        createdAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now - 6 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
  return []
}

/**
 * Returns the correct seed data for project feedback, scoped to a projectId.
 */
function seedProjectFeedback(projectId: string): ProjectFeedback[] {
  if (projectId === 'proj-001') {
    return [
      {
        id: 'pf-001',
        projectId: 'proj-001',
        instructorId: 'instructor@guc.edu.eg',
        instructorName: 'Dr. Fatima Al-Mansouri',
        feedbackType: 'general',
        comment: 'Overall, the project shows good understanding of full-stack development. The UI is clean and user-friendly.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'pf-002',
        projectId: 'proj-001',
        instructorId: 'prof.ahmed@guc.edu.eg',
        instructorName: 'Prof. Ahmed Khalil',
        feedbackType: 'thesis_draft',
        comment: 'The thesis draft shows promise but needs a stronger literature review section. The methodology chapter is well-structured. Please expand the analysis of related work before the final submission.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
  return []
}

/**
 * Returns the correct seed data for project ratings, scoped to a projectId.
 */
function seedProjectRatings(projectId: string): ProjectRating[] {
  if (projectId === 'proj-001') {
    return [
      {
        id: 'rating-001',
        projectId: 'proj-001',
        instructorId: 'instructor@guc.edu.eg',
        instructorName: 'Dr. Fatima Al-Mansouri',
        rating: 4,
        comment: 'Well-executed project with good technical implementation. Could improve documentation.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'rating-002',
        projectId: 'proj-001',
        instructorId: 'prof.ahmed@guc.edu.eg',
        instructorName: 'Prof. Ahmed Khalil',
        rating: 3,
        comment: 'Solid foundation but the code quality needs improvement. Refactor the service layer before the deadline.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
  return []
}

/** Bump this string any time the dummy data schema changes to auto-clear stale cache. */
const FEEDBACK_DATA_VERSION = 'v7'

function flushStaleCache() {
  const stored = localStorage.getItem('polaris_feedback_version')
  if (stored !== FEEDBACK_DATA_VERSION) {
    // Remove all feedback-related keys
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (
        key.startsWith('polaris_task_feedback_') ||
        key.startsWith('polaris_project_feedback_') ||
        key.startsWith('polaris_project_ratings_')
      )) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k))
    localStorage.setItem('polaris_feedback_version', FEEDBACK_DATA_VERSION)
  }
}

// Run once at module load time
flushStaleCache()

/**
 * useInstructorFeedback – manages instructor feedback on projects and tasks.
 * Provides methods to add, edit, and remove feedback/comments and ratings.
 * One feedback and one rating per instructor per project is enforced in the UI layer.
 *
 * @param projectId - The ID of the project
 * @returns Object containing feedback, ratings, and CRUD operations.
 */
export function useInstructorFeedback(projectId: string) {
  const [taskFeedback, setTaskFeedback] = useState<TaskFeedback[]>(() => {
    const saved = localStorage.getItem(`polaris_task_feedback_${projectId}`)
    return saved ? JSON.parse(saved) : seedTaskFeedback(projectId)
  })
  const [projectFeedback, setProjectFeedback] = useState<ProjectFeedback[]>(() => {
    const saved = localStorage.getItem(`polaris_project_feedback_${projectId}`)
    return saved ? JSON.parse(saved) : seedProjectFeedback(projectId)
  })
  const [projectRatings, setProjectRatings] = useState<ProjectRating[]>(() => {
    const saved = localStorage.getItem(`polaris_project_ratings_${projectId}`)
    return saved ? JSON.parse(saved) : seedProjectRatings(projectId)
  })

  // Persistence
  useEffect(() => {
    localStorage.setItem(`polaris_task_feedback_${projectId}`, JSON.stringify(taskFeedback))
  }, [taskFeedback, projectId])

  useEffect(() => {
    localStorage.setItem(`polaris_project_feedback_${projectId}`, JSON.stringify(projectFeedback))
  }, [projectFeedback, projectId])

  useEffect(() => {
    localStorage.setItem(`polaris_project_ratings_${projectId}`, JSON.stringify(projectRatings))
  }, [projectRatings, projectId])

  // Add task feedback
  const addTaskFeedback = useCallback(
    (taskId: string, instructorId: string, instructorName: string, comment: string) => {
      const newFeedback: TaskFeedback = {
        id: `tf-${Date.now()}`,
        taskId,
        instructorId,
        instructorName,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setTaskFeedback(prev => [...prev, newFeedback])
      return newFeedback
    },
    []
  )

  // Edit task feedback
  const editTaskFeedback = useCallback((feedbackId: string, newComment: string) => {
    setTaskFeedback(prev =>
      prev.map(fb =>
        fb.id === feedbackId
          ? { ...fb, comment: newComment, updatedAt: new Date().toISOString() }
          : fb
      )
    )
  }, [])

  // Remove task feedback
  const removeTaskFeedback = useCallback((feedbackId: string) => {
    setTaskFeedback(prev => prev.filter(fb => fb.id !== feedbackId))
  }, [])

  // Get task feedback for a specific task
  const getTaskFeedback = useCallback(
    (taskId: string) => {
      return taskFeedback.filter(fb => fb.taskId === taskId)
    },
    [taskFeedback]
  )

  // Add project feedback (enforcing one-per-instructor is handled in UI)
  const addProjectFeedback = useCallback(
    (
      instructorId: string,
      instructorName: string,
      comment: string,
      feedbackType: 'general' | 'thesis_draft' = 'general',
      relatedThesisDraftId?: string
    ) => {
      const newFeedback: ProjectFeedback = {
        id: `pf-${Date.now()}`,
        projectId,
        instructorId,
        instructorName,
        feedbackType,
        comment,
        relatedThesisDraftId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setProjectFeedback(prev => [...prev, newFeedback])
      return newFeedback
    },
    [projectId]
  )

  // Edit project feedback
  const editProjectFeedback = useCallback((feedbackId: string, newComment: string) => {
    setProjectFeedback(prev =>
      prev.map(fb =>
        fb.id === feedbackId
          ? { ...fb, comment: newComment, updatedAt: new Date().toISOString() }
          : fb
      )
    )
  }, [])

  // Remove project feedback
  const removeProjectFeedback = useCallback((feedbackId: string) => {
    setProjectFeedback(prev => prev.filter(fb => fb.id !== feedbackId))
  }, [])

  // Add or update project rating (upsert by instructorId)
  const rateProject = useCallback(
    (
      instructorId: string,
      instructorName: string,
      rating: number,
      comment?: string
    ) => {
      const existing = projectRatings.find(r => r.instructorId === instructorId)
      if (existing) {
        setProjectRatings(prev =>
          prev.map(r =>
            r.instructorId === instructorId
              ? { ...r, rating: Math.max(1, Math.min(5, rating)), comment: comment ?? r.comment, createdAt: new Date().toISOString() }
              : r
          )
        )
        return existing
      } else {
        const newRating: ProjectRating = {
          id: `rating-${Date.now()}`,
          projectId,
          instructorId,
          instructorName,
          rating: Math.max(1, Math.min(5, rating)),
          comment,
          createdAt: new Date().toISOString()
        }
        setProjectRatings(prev => [...prev, newRating])
        return newRating
      }
    },
    [projectId, projectRatings]
  )

  // Edit an existing rating by ID
  const editProjectRating = useCallback((ratingId: string, newRating: number, newComment?: string) => {
    setProjectRatings(prev =>
      prev.map(r =>
        r.id === ratingId
          ? { ...r, rating: Math.max(1, Math.min(5, newRating)), comment: newComment ?? r.comment, createdAt: new Date().toISOString() }
          : r
      )
    )
  }, [])

  // Remove a rating by ID
  const removeProjectRating = useCallback((ratingId: string) => {
    setProjectRatings(prev => prev.filter(r => r.id !== ratingId))
  }, [])

  // Get average rating across all instructors
  const averageRating = useMemo(() => {
    if (projectRatings.length === 0) return 0
    const sum = projectRatings.reduce((acc, r) => acc + r.rating, 0)
    return Number((sum / projectRatings.length).toFixed(1))
  }, [projectRatings])

  // Get this instructor's rating
  const getInstructorRating = useCallback(
    (instructorId: string) => {
      return projectRatings.find(r => r.instructorId === instructorId)
    },
    [projectRatings]
  )

  return {
    // State
    taskFeedback,
    projectFeedback,
    projectRatings,
    averageRating,

    // Task feedback actions
    addTaskFeedback,
    editTaskFeedback,
    removeTaskFeedback,
    getTaskFeedback,

    // Project feedback actions
    addProjectFeedback,
    editProjectFeedback,
    removeProjectFeedback,

    // Rating actions
    rateProject,
    editProjectRating,
    removeProjectRating,
    getInstructorRating
  }
}