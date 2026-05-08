import { useState, useCallback, useMemo } from 'react'
import type { ProjectCollaborator, ProjectInvitation, CollaborationSearchResult } from '../types'

// Dummy collaborators for a project
const DUMMY_PROJECT_COLLABORATORS: ProjectCollaborator[] = [
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

// Dummy searchable users
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
  },
  {
    userId: 'student-005',
    name: 'Sarah Ali',
    email: 'sarah.ali@student.guc.edu.eg',
    role: 'Student',
    profilePicture: null,
    isAlreadyCollaborator: false
  }
]

// Dummy pending invitations
const DUMMY_PENDING_INVITATIONS: ProjectInvitation[] = [
  {
    id: 'inv-001',
    projectId: 'proj-001',
    projectTitle: 'E-Commerce Platform',
    senderName: 'Ahmed Hassan',
    senderId: 'student-001',
    recipientEmail: 'fatima.mousa@student.guc.edu.eg',
    recipientName: 'Fatima Mousa',
    invitationStatus: 'pending',
    createdAt: new Date('2024-02-20').toISOString()
  }
]

/**
 * useProjectInvitations – manages project collaboration and invitations.
 * Provides methods to search collaborators, send invitations, and manage team members.
 *
 * @param projectId - The ID of the project
 * @param currentUserId - The ID of the current user (project owner)
 * @param projectCourseId - The course ID associated with the project (for instructor validation)
 * @returns Object containing collaborators, search functions, and invitation actions.
 */
export function useProjectInvitations(projectId: string, currentUserId: string, projectCourseId?: string) {
  const [collaborators, setCollaborators] = useState<ProjectCollaborator[]>(
    DUMMY_PROJECT_COLLABORATORS
  )
  const [pendingInvitations, setPendingInvitations] = useState<ProjectInvitation[]>(
    DUMMY_PENDING_INVITATIONS
  )
  const [searchQuery, setSearchQuery] = useState('')

  // Search collaborators/instructors with role filter
  const searchCollaborators = useCallback((query: string, roleFilter?: 'Student' | 'Course Instructor'): CollaborationSearchResult[] => {
    if (!query.trim()) return []
    const lowerQuery = query.toLowerCase()
    
    return DUMMY_SEARCHABLE_USERS.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
      
      const matchesRole = !roleFilter || user.role === roleFilter
      
      const isAlready = collaborators.some(c => c.email === user.email)
      
      return matchesSearch && matchesRole && !isAlready
    }).map(user => ({
      ...user,
      isAlreadyCollaborator: false
    }))
  }, [collaborators])

  // Send invitation logic with better state management
  const sendInvitation = useCallback((userId: string, userEmail: string, userName: string) => {
    const userToInvite = DUMMY_SEARCHABLE_USERS.find(u => u.userId === userId)
    if (!userToInvite) return { success: false, message: 'User not found' }

    // Check if already collaborator or pending
    if (collaborators.some(c => c.email === userEmail)) {
      return { success: false, message: 'User is already on the team' }
    }

    // Instructor Validation
    if (userToInvite.role === 'Course Instructor') {
      if (!projectCourseId || !userToInvite.teachingCourses?.includes(projectCourseId)) {
        return { 
          success: false, 
          message: 'Instructor does not teach the course associated with this project.' 
        }
      }
    }

    const role: ProjectCollaborator['role'] = userToInvite.role === 'Course Instructor' ? 'instructor' : 'collaborator'
    
    const newMember: ProjectCollaborator = {
      collaboratorId: userId,
      name: userName,
      email: userEmail,
      role,
      invitationStatus: 'pending',
      invitedAt: new Date().toISOString()
    }

    setCollaborators(prev => [...prev, newMember])
    return { success: true }
  }, [collaborators, projectCourseId])

  // Remove collaborator (revoking invitations or removing accepted members)
  const removeCollaborator = useCallback((email: string) => {
    const member = collaborators.find(c => c.email === email)
    if (!member) return false
    if (member.role === 'owner') return false // Cannot remove owner

    setCollaborators(prev => prev.filter(c => c.email !== email))
    return true
  }, [collaborators])

  // Get suggested instructors (Req: Display all assigned course instructors even if not yet invited)
  const suggestedInstructors = useMemo(() => {
    if (!projectCourseId) return []
    return DUMMY_SEARCHABLE_USERS.filter(user => 
      user.role === 'Course Instructor' && 
      user.teachingCourses?.includes(projectCourseId) &&
      !collaborators.some(c => c.email === user.email)
    )
  }, [projectCourseId, collaborators])

  // Get collaborators sorted by status
  const sortedCollaborators = useMemo(() => {
    return [...collaborators].sort((a, b) => {
      // Owner first
      if (a.role === 'owner') return -1
      if (b.role === 'owner') return 1

      // Accepted next
      if (a.invitationStatus === 'accepted' && b.invitationStatus !== 'accepted') return -1
      if (a.invitationStatus !== 'accepted' && b.invitationStatus === 'accepted') return 1

      // Then by name
      return a.name.localeCompare(b.name)
    })
  }, [collaborators])

  // Get statistics
  const stats = useMemo(() => ({
    total: collaborators.length,
    accepted: collaborators.filter(c => c.invitationStatus === 'accepted').length,
    pending: collaborators.filter(c => c.invitationStatus === 'pending').length,
    rejected: collaborators.filter(c => c.invitationStatus === 'rejected').length,
    instructors: collaborators.filter(c => c.role === 'instructor').length
  }), [collaborators])

  // Accept invitation (from recipient side)
  const acceptInvitation = useCallback((collaboratorEmail: string) => {
    setCollaborators(prev =>
      prev.map(c =>
        c.email === collaboratorEmail
          ? { ...c, invitationStatus: 'accepted', respondedAt: new Date().toISOString() }
          : c
      )
    )
  }, [])

  // Reject invitation (from recipient side)
  const rejectInvitation = useCallback((collaboratorEmail: string) => {
    setCollaborators(prev =>
      prev.map(c => 
        c.email === collaboratorEmail 
          ? { ...c, invitationStatus: 'rejected', respondedAt: new Date().toISOString() } 
          : c
      )
    )
  }, [])

  return {
    // State
    collaborators: sortedCollaborators,
    pendingInvitations,
    searchQuery,
    stats,
    suggestedInstructors,

    // Actions
    setSearchQuery,
    searchCollaborators,
    sendInvitation,
    cancelInvitation: removeCollaborator,
    acceptInvitation,
    rejectInvitation,
    removeCollaborator
  }
}