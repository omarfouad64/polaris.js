import { useState, useCallback, useMemo, useEffect } from 'react'
import type { TaskFeedback, ProjectFeedback, ProjectRating } from '../types'

// ── Seed data (only applied once on first load) ──────────────────────────

function seedTaskFeedback(projectId: string): TaskFeedback[] {
  if (projectId === 'proj-001') {
    const now = Date.now()
    return [
      { id: 'tf-001', taskId: 'task-1', instructorId: 'instructor@guc.edu.eg', instructorName: 'Dr. Fatima Al-Mansouri', comment: 'Good progress on the database schema. Ensure proper indexing for performance.', createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'tf-002', taskId: 'task-2', instructorId: 'instructor@guc.edu.eg', instructorName: 'Dr. Fatima Al-Mansouri', comment: 'Authentication implementation looks solid. Consider adding refresh-token rotation for production readiness.', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'tf-003', taskId: 'task-3', instructorId: 'instructor@guc.edu.eg', instructorName: 'Dr. Fatima Al-Mansouri', comment: 'Unit test coverage is still low. Aim for at least 80% branch coverage before final submission.', createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(now - 3 * 60 * 60 * 1000).toISOString() },
      { id: 'tf-004', taskId: 'task-1', instructorId: 'prof.ahmed@guc.edu.eg', instructorName: 'Prof. Ahmed Khalil', comment: 'Schema design is thorough. I recommend adding foreign key constraints and reviewing the normalization level.', createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'tf-005', taskId: 'task-2', instructorId: 'prof.ahmed@guc.edu.eg', instructorName: 'Prof. Ahmed Khalil', comment: 'JWT implementation looks clean, but make sure tokens are invalidated on logout. Also consider adding rate limiting.', createdAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(now - 6 * 60 * 60 * 1000).toISOString() },
    ]
  }
  return []
}

function seedProjectFeedback(projectId: string): ProjectFeedback[] {
  if (projectId === 'proj-001') {
    return [
      { id: 'pf-001', projectId: 'proj-001', instructorId: 'instructor@guc.edu.eg', instructorName: 'Dr. Fatima Al-Mansouri', feedbackType: 'general', comment: 'Overall, the project shows good understanding of full-stack development.', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'pf-002', projectId: 'proj-001', instructorId: 'prof.ahmed@guc.edu.eg', instructorName: 'Prof. Ahmed Khalil', feedbackType: 'thesis_draft', comment: 'The thesis draft shows promise but needs a stronger literature review section.', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    ]
  }
  return []
}

function seedProjectRatings(projectId: string): ProjectRating[] {
  if (projectId === 'proj-001') {
    return [
      { id: 'rating-001', projectId: 'proj-001', instructorId: 'instructor@guc.edu.eg', instructorName: 'Dr. Fatima Al-Mansouri', rating: 4, comment: 'Well-executed project with good technical implementation.', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'rating-002', projectId: 'proj-001', instructorId: 'prof.ahmed@guc.edu.eg', instructorName: 'Prof. Ahmed Khalil', rating: 3, comment: 'Solid foundation but the code quality needs improvement.', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ]
  }
  return []
}

const TASK_KEY = (pid: string) => `polaris_task_feedback_${pid}`
const FB_KEY = (pid: string) => `polaris_project_feedback_${pid}`
const RATING_KEY = (pid: string) => `polaris_project_ratings_${pid}`
const VERSION_KEY = 'polaris_feedback_version'
const DATA_VERSION = 'v8'

  ; (() => {
    if (localStorage.getItem(VERSION_KEY) !== DATA_VERSION) {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('polaris_task_feedback_') || key.startsWith('polaris_project_feedback_') || key.startsWith('polaris_project_ratings_'))) {
          localStorage.removeItem(key)
        }
      }
      localStorage.setItem(VERSION_KEY, DATA_VERSION)
    }
  })()

type Listener = () => void
const taskListeners: Record<string, Set<Listener>> = {}
const fbListeners: Record<string, Set<Listener>> = {}
const ratingListeners: Record<string, Set<Listener>> = {}
const taskStore: Record<string, TaskFeedback[]> = {}
const fbStore: Record<string, ProjectFeedback[]> = {}
const ratingStore: Record<string, ProjectRating[]> = {}

function getTask(pid: string): TaskFeedback[] {
  if (!taskStore[pid]) {
    try { taskStore[pid] = JSON.parse(localStorage.getItem(TASK_KEY(pid)) ?? 'null') ?? seedTaskFeedback(pid) }
    catch { taskStore[pid] = seedTaskFeedback(pid) }
  }
  return taskStore[pid]
}
function getFb(pid: string): ProjectFeedback[] {
  if (!fbStore[pid]) {
    try { fbStore[pid] = JSON.parse(localStorage.getItem(FB_KEY(pid)) ?? 'null') ?? seedProjectFeedback(pid) }
    catch { fbStore[pid] = seedProjectFeedback(pid) }
  }
  return fbStore[pid]
}
function getRating(pid: string): ProjectRating[] {
  if (!ratingStore[pid]) {
    try { ratingStore[pid] = JSON.parse(localStorage.getItem(RATING_KEY(pid)) ?? 'null') ?? seedProjectRatings(pid) }
    catch { ratingStore[pid] = seedProjectRatings(pid) }
  }
  return ratingStore[pid]
}
function emitTask(pid: string) { localStorage.setItem(TASK_KEY(pid), JSON.stringify(taskStore[pid])); taskListeners[pid]?.forEach(fn => fn()) }
function emitFb(pid: string) { localStorage.setItem(FB_KEY(pid), JSON.stringify(fbStore[pid])); fbListeners[pid]?.forEach(fn => fn()) }
function emitRating(pid: string) { localStorage.setItem(RATING_KEY(pid), JSON.stringify(ratingStore[pid])); ratingListeners[pid]?.forEach(fn => fn()) }

/**
 * useInstructorFeedback — manages instructor feedback on projects and tasks.
 */
export function useInstructorFeedback(projectId: string) {
  const [, setTaskTick] = useState(0)
  const [, setFbTick] = useState(0)
  const [, setRatingTick] = useState(0)

  useEffect(() => {
    if (!taskListeners[projectId]) taskListeners[projectId] = new Set()
    if (!fbListeners[projectId]) fbListeners[projectId] = new Set()
    if (!ratingListeners[projectId]) ratingListeners[projectId] = new Set()
    getTask(projectId); getFb(projectId); getRating(projectId)
    const tl = () => setTaskTick(t => t + 1)
    const fl = () => setFbTick(t => t + 1)
    const rl = () => setRatingTick(t => t + 1)
    taskListeners[projectId].add(tl)
    fbListeners[projectId].add(fl)
    ratingListeners[projectId].add(rl)
    return () => {
      taskListeners[projectId]?.delete(tl)
      fbListeners[projectId]?.delete(fl)
      ratingListeners[projectId]?.delete(rl)
    }
  }, [projectId])

  const addTaskFeedback = useCallback(
    (taskId: string, instructorId: string, instructorName: string, comment: string) => {
      const fb: TaskFeedback = { id: `tf-${Date.now()}`, taskId, instructorId, instructorName, comment, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      taskStore[projectId] = [...getTask(projectId), fb]
      emitTask(projectId)
      return fb
    }, [projectId])

  const editTaskFeedback = useCallback((feedbackId: string, newComment: string) => {
    taskStore[projectId] = getTask(projectId).map(fb => fb.id === feedbackId ? { ...fb, comment: newComment, updatedAt: new Date().toISOString() } : fb)
    emitTask(projectId)
  }, [projectId])

  const removeTaskFeedback = useCallback((feedbackId: string) => {
    taskStore[projectId] = getTask(projectId).filter(fb => fb.id !== feedbackId)
    emitTask(projectId)
  }, [projectId])

  const getTaskFeedback = useCallback((taskId: string) => getTask(projectId).filter(fb => fb.taskId === taskId), [projectId])

  const addProjectFeedback = useCallback((instructorId: string, instructorName: string, comment: string, feedbackType: 'general' | 'thesis_draft' = 'general', relatedThesisDraftId?: string) => {
    const fb: ProjectFeedback = { id: `pf-${Date.now()}`, projectId, instructorId, instructorName, feedbackType, comment, relatedThesisDraftId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    fbStore[projectId] = [...getFb(projectId), fb]
    emitFb(projectId)
    return fb
  }, [projectId])

  const editProjectFeedback = useCallback((feedbackId: string, newComment: string) => {
    fbStore[projectId] = getFb(projectId).map(fb => fb.id === feedbackId ? { ...fb, comment: newComment, updatedAt: new Date().toISOString() } : fb)
    emitFb(projectId)
  }, [projectId])

  const removeProjectFeedback = useCallback((feedbackId: string) => {
    fbStore[projectId] = getFb(projectId).filter(fb => fb.id !== feedbackId)
    emitFb(projectId)
  }, [projectId])

  const rateProject = useCallback((instructorId: string, instructorName: string, rating: number, comment?: string) => {
    const clampedRating = Math.max(1, Math.min(5, rating))
    const existing = getRating(projectId).find(r => r.instructorId === instructorId)
    if (existing) {
      ratingStore[projectId] = getRating(projectId).map(r => r.instructorId === instructorId ? { ...r, rating: clampedRating, comment: comment ?? r.comment, createdAt: new Date().toISOString() } : r)
    } else {
      ratingStore[projectId] = [...getRating(projectId), { id: `rating-${Date.now()}`, projectId, instructorId, instructorName, rating: clampedRating, comment, createdAt: new Date().toISOString() }]
    }
    emitRating(projectId)
  }, [projectId])

  const editProjectRating = useCallback((ratingId: string, newRating: number, newComment?: string) => {
    ratingStore[projectId] = getRating(projectId).map(r => r.id === ratingId ? { ...r, rating: Math.max(1, Math.min(5, newRating)), comment: newComment ?? r.comment, createdAt: new Date().toISOString() } : r)
    emitRating(projectId)
  }, [projectId])

  const removeProjectRating = useCallback((ratingId: string) => {
    ratingStore[projectId] = getRating(projectId).filter(r => r.id !== ratingId)
    emitRating(projectId)
  }, [projectId])

  const getInstructorRating = useCallback((instructorId: string) => getRating(projectId).find(r => r.instructorId === instructorId), [projectId])

  const averageRating = useMemo(() => {
    const ratings = getRating(projectId)
    if (!ratings.length) return 0
    return Number((ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, ratingStore[projectId]])

  return {
    taskFeedback: getTask(projectId),
    projectFeedback: getFb(projectId),
    projectRatings: getRating(projectId),
    averageRating,
    addTaskFeedback, editTaskFeedback, removeTaskFeedback, getTaskFeedback,
    addProjectFeedback, editProjectFeedback, removeProjectFeedback,
    rateProject, editProjectRating, removeProjectRating, getInstructorRating,
  }
}
