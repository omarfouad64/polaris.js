import { useState, useCallback, useMemo, useEffect } from 'react'
import type { TaskFeedback, ProjectFeedback, ProjectRating } from '../types'

// Dummy task feedback data
const DUMMY_TASK_FEEDBACK: TaskFeedback[] = [
  {
    id: 'tf-001',
    taskId: 'task-001',
    instructorId: 'instructor-001',
    instructorName: 'Dr. Fatima Al-Mansouri',
    comment: 'Good progress on the backend implementation. Make sure to add proper error handling.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Dummy project feedback data
const DUMMY_PROJECT_FEEDBACK: ProjectFeedback[] = [
  {
    id: 'pf-001',
    projectId: 'proj-001',
    instructorId: 'instructor-001',
    instructorName: 'Dr. Fatima Al-Mansouri',
    feedbackType: 'general',
    comment: 'Overall, the project shows good understanding of full-stack development. The UI is clean and user-friendly.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Dummy project ratings
const DUMMY_PROJECT_RATINGS: ProjectRating[] = [
  {
    id: 'rating-001',
    projectId: 'proj-001',
    instructorId: 'instructor-001',
    instructorName: 'Dr. Fatima Al-Mansouri',
    rating: 4,
    comment: 'Well-executed project with good technical implementation. Could improve documentation.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
]

/**
 * useInstructorFeedback – manages instructor feedback on projects and tasks.
 * Provides methods to add, edit, and remove feedback/comments.
 *
 * @param projectId - The ID of the project
 * @returns Object containing feedback, and CRUD operations.
 */
export function useInstructorFeedback(projectId: string) {
  const [taskFeedback, setTaskFeedback] = useState<TaskFeedback[]>(() => {
    const saved = localStorage.getItem(`polaris_task_feedback_${projectId}`)
    return saved ? JSON.parse(saved) : DUMMY_TASK_FEEDBACK
  })
  const [projectFeedback, setProjectFeedback] = useState<ProjectFeedback[]>(() => {
    const saved = localStorage.getItem(`polaris_project_feedback_${projectId}`)
    return saved ? JSON.parse(saved) : DUMMY_PROJECT_FEEDBACK
  })
  const [projectRatings, setProjectRatings] = useState<ProjectRating[]>(() => {
    const saved = localStorage.getItem(`polaris_project_ratings_${projectId}`)
    return saved ? JSON.parse(saved) : DUMMY_PROJECT_RATINGS
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

  // Get task feedback by ID
  const getTaskFeedback = useCallback(
    (taskId: string) => {
      return taskFeedback.filter(fb => fb.taskId === taskId)
    },
    [taskFeedback]
  )

  // Add project feedback
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

  // Add or update project rating
  const rateProject = useCallback(
    (
      instructorId: string,
      instructorName: string,
      rating: number,
      comment?: string
    ) => {
      // Check if instructor already rated this project
      const existingRating = projectRatings.find(r => r.instructorId === instructorId)

      if (existingRating) {
        // Update existing rating
        setProjectRatings(prev =>
          prev.map(r =>
            r.instructorId === instructorId
              ? { ...r, rating, comment: comment || '', createdAt: new Date().toISOString() }
              : r
          )
        )
        return existingRating
      } else {
        // Create new rating
        const newRating: ProjectRating = {
          id: `rating-${Date.now()}`,
          projectId,
          instructorId,
          instructorName,
          rating: Math.max(1, Math.min(5, rating)), // Ensure 1-5 range
          comment,
          createdAt: new Date().toISOString()
        }
        setProjectRatings(prev => [...prev, newRating])
        return newRating
      }
    },
    [projectId, projectRatings]
  )

  // Get average rating
  const averageRating = useMemo(() => {
    if (projectRatings.length === 0) return 0
    const sum = projectRatings.reduce((acc, r) => acc + r.rating, 0)
    return Number((sum / projectRatings.length).toFixed(1))
  }, [projectRatings])

  // Get rating by instructor
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
    getInstructorRating
  }
}