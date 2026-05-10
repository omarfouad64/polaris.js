import { useState, useCallback, useMemo, useEffect } from 'react'
import type { ProjectCollaborator, ProjectInvitation, CollaborationSearchResult } from '../types'

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED_COLLABORATORS: Record<string, ProjectCollaborator[]> = {
  'proj-001': [
    {
      collaboratorId: 'student-001',
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@student.guc.edu.eg',
      role: 'owner',
      invitationStatus: 'accepted',
      invitedAt: new Date('2024-01-10').toISOString(),
      profilePicture: null
    },
    {
      collaboratorId: 'student-002',
      name: 'Mariam Khalil',
      email: 'mariam.khalil@student.guc.edu.eg',
      role: 'collaborator',
      invitationStatus: 'accepted',
      invitedAt: new Date('2024-01-15').toISOString(),
      respondedAt: new Date('2024-01-16').toISOString(),
      profilePicture: null
    }
  ]
}

// Searchable users pool (students + instructors)
const DUMMY_SEARCHABLE_USERS: CollaborationSearchResult[] = [
  {
    userId: 'student-003',
    name: 'Fatima Mousa',
    email: 'fatima.mousa@student.guc.edu.eg',
    role: 'Student',
    profilePicture: null,
    isAlreadyCollaborator: false
  },
  {
    userId: 'student-004',
    name: 'Omar Ibrahim',
    email: 'omar.ibrahim@student.guc.edu.eg',
    role: 'Student',
    profilePicture: null,
    isAlreadyCollaborator: false
  },
  {
    userId: 'student-005',
    name: 'Sarah Ali',
    email: 'sarah.ali@student.guc.edu.eg',
    role: 'Student',
    profilePicture: null,
    isAlreadyCollaborator: false
  },
  {
    userId: 'instructor-001',
    name: 'Dr. Fatima Al-Mansouri',
    email: 'fatima.mansouri@guc.edu.eg',
    role: 'Course Instructor',
    profilePicture: null,
    isAlreadyCollaborator: false,
    teachingCourses: ['course-001', 'course-002']
  },
  {
    userId: 'instructor-002',
    name: 'Prof. Ahmed Hassan',
    email: 'ahmed.hassan@guc.edu.eg',
    role: 'Course Instructor',
    profilePicture: null,
    isAlreadyCollaborator: false,
    teachingCourses: ['course-003', 'course-004']
  }
]

// ── Shared module-level state (keyed by projectId) ───────────────────────────
// This ensures all hook instances for the same project share the same data.

const STORAGE_KEY = (pid: string) => `polaris_collaborators_${pid}`

type Listener = () => void
const listenersByProject: Record<string, Set<Listener>> = {}

const collaboratorsByProject: Record<string, ProjectCollaborator[]> = {}

function loadCollaborators(projectId: string): ProjectCollaborator[] {
  if (collaboratorsByProject[projectId]) return collaboratorsByProject[projectId]
  try {
    const raw = localStorage.getItem(STORAGE_KEY(projectId))
    collaboratorsByProject[projectId] = raw
      ? (JSON.parse(raw) as ProjectCollaborator[])
      : (SEED_COLLABORATORS[projectId] ?? [])
  } catch {
    collaboratorsByProject[projectId] = SEED_COLLABORATORS[projectId] ?? []
  }
  return collaboratorsByProject[projectId]
}

function saveAndEmit(projectId: string) {
  try {
    localStorage.setItem(STORAGE_KEY(projectId), JSON.stringify(collaboratorsByProject[projectId]))
  } catch { /* ignore quota errors */ }
  listenersByProject[projectId]?.forEach(fn => fn())
}

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useProjectInvitations – manages project collaboration and invitations.
 * Uses shared module-level state so all component instances for the same project
 * stay in sync without prop-drilling.
 *
 * @param projectId       - The ID of the project
 * @param currentUserId   - The ID of the current user
 * @param projectCourseId - Course the project belongs to (for instructor validation)
 */
export function useProjectInvitations(projectId: string, currentUserId: string, projectCourseId?: string) {
  // Subscribe to changes so the component re-renders on any mutation
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!listenersByProject[projectId]) listenersByProject[projectId] = new Set()
    const listener = () => setTick(t => t + 1)
    listenersByProject[projectId].add(listener)
    // Ensure data is loaded
    loadCollaborators(projectId)
    return () => { listenersByProject[projectId]?.delete(listener) }
  }, [projectId])

  const collaborators = loadCollaborators(projectId)

  // ── Actions ────────────────────────────────────────────────────────────────

  /** Send an invitation (adds collaborator with 'pending' status). */
  const sendInvitation = useCallback((userId: string, userEmail: string, userName: string) => {
    const list = loadCollaborators(projectId)
    const userToInvite = DUMMY_SEARCHABLE_USERS.find(u => u.userId === userId)
    if (!userToInvite) return { success: false, message: 'User not found' }

    if (list.some(c => c.email === userEmail)) {
      return { success: false, message: 'User is already on the team' }
    }

    // Instructors must teach the project's course
    if (userToInvite.role === 'Course Instructor') {
      if (!projectCourseId || !userToInvite.teachingCourses?.includes(projectCourseId)) {
        return {
          success: false,
          message: 'This instructor does not teach the course associated with this project.'
        }
      }
    }

    const role: ProjectCollaborator['role'] =
      userToInvite.role === 'Course Instructor' ? 'instructor' : 'collaborator'

    const newMember: ProjectCollaborator = {
      collaboratorId: userId,
      name: userName,
      email: userEmail,
      role,
      invitationStatus: 'pending',
      invitedAt: new Date().toISOString(),
      profilePicture: null
    }

    collaboratorsByProject[projectId] = [...list, newMember]
    saveAndEmit(projectId)
    return { success: true }
  }, [projectId, projectCourseId])

  /** Cancel a pending invitation OR remove an accepted/rejected member. */
  const removeCollaborator = useCallback((email: string) => {
    const list = loadCollaborators(projectId)
    const member = list.find(c => c.email === email)
    if (!member || member.role === 'owner') return false

    collaboratorsByProject[projectId] = list.filter(c => c.email !== email)
    saveAndEmit(projectId)
    return true
  }, [projectId])

  /** Alias — canceling an invitation is the same as removing the pending entry. */
  const cancelInvitation = removeCollaborator

  /** Accept an invitation (recipient side). */
  const acceptInvitation = useCallback((collaboratorEmail: string) => {
    collaboratorsByProject[projectId] = loadCollaborators(projectId).map(c =>
      c.email === collaboratorEmail
        ? { ...c, invitationStatus: 'accepted', respondedAt: new Date().toISOString() }
        : c
    )
    saveAndEmit(projectId)
  }, [projectId])

  /** Reject an invitation (recipient side). */
  const rejectInvitation = useCallback((collaboratorEmail: string) => {
    collaboratorsByProject[projectId] = loadCollaborators(projectId).map(c =>
      c.email === collaboratorEmail
        ? { ...c, invitationStatus: 'rejected', respondedAt: new Date().toISOString() }
        : c
    )
    saveAndEmit(projectId)
  }, [projectId])

  // ── Derived data ───────────────────────────────────────────────────────────

  /** Search the user pool, excluding current collaborators. */
  const searchCollaborators = useCallback((query: string, roleFilter?: 'Student' | 'Course Instructor'): CollaborationSearchResult[] => {
    if (!query.trim()) return []
    const lower = query.toLowerCase()
    const currentList = loadCollaborators(projectId)
    return DUMMY_SEARCHABLE_USERS
      .filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower)
        const matchesRole = !roleFilter || u.role === roleFilter
        const notAlready = !currentList.some(c => c.email === u.email)
        return matchesSearch && matchesRole && notAlready
      })
      .map(u => ({ ...u, isAlreadyCollaborator: false }))
  }, [projectId])

  /** Instructors from the search pool who teach this project's course and aren't already on the team. */
  const suggestedInstructors = useMemo(() => {
    if (!projectCourseId) return []
    const currentList = loadCollaborators(projectId)
    return DUMMY_SEARCHABLE_USERS.filter(u =>
      u.role === 'Course Instructor' &&
      u.teachingCourses?.includes(projectCourseId) &&
      !currentList.some(c => c.email === u.email)
    )
  }, [projectId, projectCourseId, collaborators]) // collaborators in deps triggers recompute on change

  /** Collaborators sorted: owner → accepted → pending/rejected → alphabetical. */
  const sortedCollaborators = useMemo(() => {
    return [...collaborators].sort((a, b) => {
      if (a.role === 'owner') return -1
      if (b.role === 'owner') return 1
      if (a.invitationStatus === 'accepted' && b.invitationStatus !== 'accepted') return -1
      if (a.invitationStatus !== 'accepted' && b.invitationStatus === 'accepted') return 1
      return a.name.localeCompare(b.name)
    })
  }, [collaborators])

  const stats = useMemo(() => ({
    total: collaborators.length,
    accepted: collaborators.filter(c => c.invitationStatus === 'accepted').length,
    pending: collaborators.filter(c => c.invitationStatus === 'pending').length,
    rejected: collaborators.filter(c => c.invitationStatus === 'rejected').length,
    instructors: collaborators.filter(c => c.role === 'instructor').length
  }), [collaborators])

  return {
    collaborators: sortedCollaborators,
    stats,
    suggestedInstructors,

    searchCollaborators,
    sendInvitation,
    cancelInvitation,
    removeCollaborator,
    acceptInvitation,
    rejectInvitation,

    // legacy compat
    pendingInvitations: [] as ProjectInvitation[],
    searchQuery: '',
    setSearchQuery: (_q: string) => {}
  }
}