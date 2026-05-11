import { useCallback, useMemo } from 'react'
import useDatabase from './useDatabase'
import {
  acceptInvitation as acceptInvitationAction,
  rejectInvitation as rejectInvitationAction,
} from '../store/databaseSlice'

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

/**
 * useProjectInvitationsList — manages list of pending and accepted project invitations via Redux.
 * Maps projectInvitations from the store where the current user is the recipient.
 */
export function useProjectInvitationsList(currentUserEmail = 'alice.smith@student.guc.edu.eg') {
  const { projectInvitations, projects, dispatch } = useDatabase()

  // Map store invitations to the ProjectInvitationItem shape
  const allInvitations = useMemo((): ProjectInvitationItem[] => {
    return projectInvitations
      .filter(inv => inv.recipientEmail === currentUserEmail)
      .map(inv => {
        const project = projects.find(p => p.id === inv.projectId)
        return {
          id: inv.id,
          projectId: inv.projectId,
          projectTitle: inv.projectTitle,
          projectDescription: (project as any)?.projectReport || (project as any)?.description || '',
          senderName: inv.senderName,
          senderId: inv.senderId,
          senderEmail: '',
          invitedAt: inv.createdAt,
          status: inv.invitationStatus as 'pending' | 'accepted' | 'rejected',
          projectImage: null,
        }
      })
  }, [projectInvitations, projects, currentUserEmail])

  const pendingInvitations = useMemo(() => allInvitations.filter(inv => inv.status === 'pending'), [allInvitations])
  const acceptedInvitations = useMemo(() => allInvitations.filter(inv => inv.status === 'accepted'), [allInvitations])
  const rejectedInvitations = useMemo(() => allInvitations.filter(inv => inv.status === 'rejected'), [allInvitations])

  const acceptInvitation = useCallback((invitationId: string) => {
    dispatch(acceptInvitationAction({ invitationId, recipientEmail: currentUserEmail }))
  }, [dispatch, currentUserEmail])

  const rejectInvitation = useCallback((invitationId: string) => {
    dispatch(rejectInvitationAction({ invitationId, recipientEmail: currentUserEmail }))
  }, [dispatch, currentUserEmail])

  const getInvitationById = useCallback(
    (invitationId: string) => allInvitations.find(inv => inv.id === invitationId),
    [allInvitations]
  )

  const stats = useMemo(() => ({
    pending: pendingInvitations.length,
    accepted: acceptedInvitations.length,
    rejected: rejectedInvitations.length,
    total: allInvitations.length,
  }), [pendingInvitations, acceptedInvitations, rejectedInvitations, allInvitations])

  return {
    pendingInvitations,
    acceptedInvitations,
    rejectedInvitations,
    allInvitations,
    stats,
    acceptInvitation,
    rejectInvitation,
    getInvitationById,
  }
}
