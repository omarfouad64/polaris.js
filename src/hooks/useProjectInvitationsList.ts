import { useState, useCallback, useMemo } from 'react'

export interface ProjectInvitationItem {
  id: string
  projectId: string
  projectTitle: string
  projectDescription: string
  senderName: string
  senderId: string
  senderEmail: string
  invitedAt: string
  status: 'pending' | 'accepted' | 'rejected'
  projectImage?: string | null
}

// Dummy pending invitations
const DUMMY_PENDING_INVITATIONS: ProjectInvitationItem[] = [
  {
    id: 'inv-001',
    projectId: 'proj-001',
    projectTitle: 'E-Commerce Platform',
    projectDescription: 'A full-stack e-commerce platform with payment integration and admin dashboard',
    senderName: 'Ahmed Hassan',
    senderId: 'student-001',
    senderEmail: 'ahmed.hassan@student.guc.edu.eg',
    invitedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    projectImage: null
  },
  {
    id: 'inv-002',
    projectId: 'proj-002',
    projectTitle: 'AI Chatbot',
    projectDescription: 'An intelligent chatbot using NLP and machine learning for customer support',
    senderName: 'Fatima Mousa',
    senderId: 'student-002',
    senderEmail: 'fatima.mousa@student.guc.edu.eg',
    invitedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    projectImage: null
  },
  {
    id: 'inv-003',
    projectId: 'proj-003',
    projectTitle: 'Mobile App Development',
    projectDescription: 'A React Native mobile application for task management and collaboration',
    senderName: 'Dr. Fatima Al-Mansouri',
    senderId: 'instructor-001',
    senderEmail: 'fatima.mansouri@guc.edu.eg',
    invitedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    projectImage: null
  }
]

// Dummy accepted invitations
const DUMMY_ACCEPTED_INVITATIONS: ProjectInvitationItem[] = [
  {
    id: 'inv-004',
    projectId: 'proj-004',
    projectTitle: 'Learning Management System',
    projectDescription: 'A comprehensive LMS platform for online course delivery and student tracking',
    senderName: 'Omar Ibrahim',
    senderId: 'student-003',
    senderEmail: 'omar.ibrahim@student.guc.edu.eg',
    invitedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'accepted',
    projectImage: null
  }
]

/**
 * useProjectInvitationsList – manages list of pending and accepted project invitations.
 * Provides methods to view, accept, and reject invitations.
 *
 * @param currentUserId - The ID of the current user
 * @returns Object containing invitations, filtering, and action functions.
 */
export function useProjectInvitationsList() {
  const [pendingInvitations, setPendingInvitations] = useState<ProjectInvitationItem[]>(
    DUMMY_PENDING_INVITATIONS
  )
  const [acceptedInvitations, setAcceptedInvitations] = useState<ProjectInvitationItem[]>(
    DUMMY_ACCEPTED_INVITATIONS
  )
  const [rejectedInvitations, setRejectedInvitations] = useState<ProjectInvitationItem[]>([])

  // All invitations
  const allInvitations = useMemo(() => {
    return [
      ...pendingInvitations,
      ...acceptedInvitations,
      ...rejectedInvitations
    ]
  }, [pendingInvitations, acceptedInvitations, rejectedInvitations])

  // Accept invitation
  const acceptInvitation = useCallback((invitationId: string) => {
    setPendingInvitations(prev => {
      const invitation = prev.find(inv => inv.id === invitationId)
      if (!invitation) return prev

      setAcceptedInvitations(prevAccepted => [
        ...prevAccepted,
        { ...invitation, status: 'accepted' }
      ])

      return prev.filter(inv => inv.id !== invitationId)
    })
  }, [])

  // Reject invitation
  const rejectInvitation = useCallback((invitationId: string) => {
    setPendingInvitations(prev => {
      const invitation = prev.find(inv => inv.id === invitationId)
      if (!invitation) return prev

      setRejectedInvitations(prevRejected => [
        ...prevRejected,
        { ...invitation, status: 'rejected' }
      ])

      return prev.filter(inv => inv.id !== invitationId)
    })
  }, [])

  // Get invitation by ID
  const getInvitationById = useCallback((invitationId: string) => {
    return allInvitations.find(inv => inv.id === invitationId)
  }, [allInvitations])

  // Statistics
  const stats = useMemo(() => ({
    pending: pendingInvitations.length,
    accepted: acceptedInvitations.length,
    rejected: rejectedInvitations.length,
    total: allInvitations.length
  }), [pendingInvitations, acceptedInvitations, rejectedInvitations, allInvitations])

  return {
    // State
    pendingInvitations,
    acceptedInvitations,
    rejectedInvitations,
    allInvitations,
    stats,

    // Actions
    acceptInvitation,
    rejectInvitation,
    getInvitationById
  }
}