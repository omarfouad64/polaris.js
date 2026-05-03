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
    isAlreadyCollaborator: false
  },
  {
    userId: 'instructor-002',
    name: 'Prof. Ahmed Hassan',
    email: 'ahmed.hassan@guc.edu.eg',
    role: 'Course Instructor',
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
 * @returns Object containing collaborators, search functions, and invitation actions.
 */
export function useProjectInvitations(projectId: string, currentUserId: string) {
  const [collaborators, setCollaborators] = useState<ProjectCollaborator[]>(
    DUMMY_PROJECT_COLLABORATORS
  )
  const [pendingInvitations, setPendingInvitations] = useState<ProjectInvitation[]>(
    DUMMY_PENDING_INVITATIONS
  )
  const [searchQuery, setSearchQuery] = useState('')

  // Search collaborators/instructors by name or email
  const searchCollaborators = useCallback((query: string): CollaborationSearchResult[] => {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase()
    return DUMMY_SEARCHABLE_USERS.filter(user => {
      const isMatch =
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)

      // Mark if already a collaborator
      const isAlready = collaborators.some(c => c.email === user.email)

      return isMatch && !isAlready
    }).map(user => ({
      ...user,
      isAlreadyCollaborator: false
    }))
  }, [collaborators])

  // Send invitation to a user
  const sendInvitation = useCallback((userId: string, userEmail: string, userName: string) => {
    // Check if already collaborator
    const existingCollaborator = collaborators.find(c => c.email === userEmail)
    if (existingCollaborator) {
      console.warn('User is already a collaborator')
      return false
    }

    // Check if pending invitation already exists
    const existingInvitation = pendingInvitations.find(
      inv => inv.recipientEmail === userEmail && inv.projectId === projectId
    )
    if (existingInvitation) {
      console.warn('Invitation already sent to this user')
      return false
    }

    // Add as pending collaborator
    const newCollaborator: ProjectCollaborator = {
      collaboratorId: userId,
      name: userName,
      email: userEmail,
      role: 'collaborator',
      invitationStatus: 'pending',
      invitedAt: new Date().toISOString()
    }

    setCollaborators(prev => [...prev, newCollaborator])

    // Create invitation record
    const newInvitation: ProjectInvitation = {
      id: `inv-${Date.now()}`,
      projectId,
      projectTitle: 'Current Project',
      senderName: 'You',
      senderId: currentUserId,
      recipientEmail: userEmail,
      recipientName: userName,
      invitationStatus: 'pending',
      createdAt: new Date().toISOString()
    }

    setPendingInvitations(prev => [...prev, newInvitation])
    return true
  }, [projectId, currentUserId, collaborators, pendingInvitations])

  // Cancel invitation (unsend)
  const cancelInvitation = useCallback((collaboratorEmail: string) => {
    setCollaborators(prev =>
      prev.filter(c => c.email !== collaboratorEmail || c.invitationStatus === 'accepted')
    )

    setPendingInvitations(prev =>
      prev.filter(inv => inv.recipientEmail !== collaboratorEmail)
    )
  }, [])

  // Accept invitation (from recipient side)
  const acceptInvitation = useCallback((collaboratorEmail: string) => {
    setCollaborators(prev =>
      prev.map(c =>
        c.email === collaboratorEmail
          ? { ...c, invitationStatus: 'accepted', respondedAt: new Date().toISOString() }
          : c
      )
    )

    setPendingInvitations(prev =>
      prev.filter(inv => inv.recipientEmail !== collaboratorEmail)
    )
  }, [])

  // Reject invitation (from recipient side)
  const rejectInvitation = useCallback((collaboratorEmail: string) => {
    setCollaborators(prev =>
      prev.filter(c => c.email !== collaboratorEmail)
    )

    setPendingInvitations(prev =>
      prev.filter(inv => inv.recipientEmail !== collaboratorEmail)
    )
  }, [])

  // Remove collaborator (owner only)
  const removeCollaborator = useCallback((collaboratorEmail: string) => {
    // Cannot remove project owner
    const collaborator = collaborators.find(c => c.email === collaboratorEmail)
    if (collaborator?.role === 'owner') {
      console.warn('Cannot remove project owner')
      return false
    }

    setCollaborators(prev =>
      prev.filter(c => c.email !== collaboratorEmail)
    )
    return true
  }, [collaborators])

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
    instructors: collaborators.filter(c => c.role === 'instructor').length
  }), [collaborators])

  return {
    // State
    collaborators: sortedCollaborators,
    pendingInvitations,
    searchQuery,
    stats,

    // Actions
    setSearchQuery,
    searchCollaborators,
    sendInvitation,
    cancelInvitation,
    acceptInvitation,
    rejectInvitation,
    removeCollaborator
  }
}