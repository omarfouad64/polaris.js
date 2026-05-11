import { useState, useCallback, useMemo } from 'react'
import type { ProjectCollaborator, CollaborationSearchResult } from '../types'
import useDatabase from './useDatabase'
import {
  sendInvitation as sendInvitationAction,
  addCollaborator,
  removeCollaborator as removeCollaboratorAction,
  updateCollaboratorStatus,
} from '../store/databaseSlice'

/**
 * useProjectInvitations — manages project collaboration and invitations via Redux.
 */
export function useProjectInvitations(projectId: string, _currentUserId: string, projectCourseId?: string) {
  const { projectCollaborators, projectInvitations, students, instructors, dispatch } = useDatabase()
  const [searchQuery, setSearchQuery] = useState('')

  const collaborators = useMemo(
    () => projectCollaborators.filter(c => (c as any).projectId === projectId),
    [projectCollaborators, projectId]
  )

  // Build a searchable user list from the store's students and instructors
  const searchableUsers = useMemo((): CollaborationSearchResult[] => {
    const currentEmails = new Set(collaborators.map(c => c.email))
    const studentResults: CollaborationSearchResult[] = students.map(s => ({
      userId: s.studentId,
      name: s.name,
      email: s.email,
      role: 'Student' as const,
      profilePicture: s.profilePicture,
      isAlreadyCollaborator: currentEmails.has(s.email),
    }))
    const instructorResults: CollaborationSearchResult[] = instructors.map(i => ({
      userId: i.instructorId,
      name: i.name,
      email: i.email,
      role: 'Course Instructor' as const,
      profilePicture: i.profilePicture,
      isAlreadyCollaborator: currentEmails.has(i.email),
      teachingCourses: i.linkedCourses,
    }))
    return [...studentResults, ...instructorResults]
  }, [students, instructors, collaborators])

  const sendInvitation = useCallback((userId: string, userEmail: string, userName: string) => {
    if (projectCourseId === 'course-001') {
      return { success: false, message: "Bachelor's projects cannot have collaborators." }
    }
    if (collaborators.some(c => c.email === userEmail)) {
      return { success: false, message: 'User is already on the team' }
    }
    const user = searchableUsers.find(u => u.userId === userId)
    if (!user) return { success: false, message: 'User not found' }

    const role: ProjectCollaborator['role'] = user.role === 'Course Instructor' ? 'instructor' : 'collaborator'

    // Add collaborator to store
    dispatch(addCollaborator({
      id: `collab-${Date.now()}`,
      projectId,
      collaboratorId: userId,
      name: userName,
      email: userEmail,
      role,
      invitationStatus: 'pending',
      invitedAt: new Date().toISOString(),
      profilePicture: null,
    }))

    // Also log a project invitation record
    const project = { title: projectId } // fallback; ideally pass projectTitle as prop
    dispatch(sendInvitationAction({
      projectId,
      projectTitle: project.title,
      recipientEmail: userEmail,
      recipientName: userName,
      senderName: 'Alice Smith',
      senderId: _currentUserId,
    }))

    return { success: true }
  }, [dispatch, collaborators, searchableUsers, projectId, _currentUserId, projectCourseId])

  const removeCollaborator = useCallback((email: string) => {
    const member = collaborators.find(c => c.email === email)
    if (!member || member.role === 'owner') return false
    dispatch(removeCollaboratorAction({ projectId, email }))
    return true
  }, [dispatch, collaborators, projectId])

  const cancelInvitation = removeCollaborator

  const acceptInvitation = useCallback((collaboratorEmail: string) => {
    dispatch(updateCollaboratorStatus({ projectId, email: collaboratorEmail, status: 'accepted' }))
  }, [dispatch, projectId])

  const rejectInvitation = useCallback((collaboratorEmail: string) => {
    dispatch(updateCollaboratorStatus({ projectId, email: collaboratorEmail, status: 'rejected' }))
  }, [dispatch, projectId])

  const searchCollaborators = useCallback((query: string, roleFilter?: 'Student' | 'Course Instructor'): CollaborationSearchResult[] => {
    if (!query.trim()) return []
    const lower = query.toLowerCase()
    const currentEmails = new Set(collaborators.map(c => c.email))
    return searchableUsers.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(lower) || u.email.toLowerCase().includes(lower)
      const matchesRole = !roleFilter || u.role === roleFilter
      const notAlready = !currentEmails.has(u.email)
      return matchesSearch && matchesRole && notAlready
    })
  }, [searchableUsers, collaborators])

  const suggestedInstructors = useMemo(() => {
    const currentEmails = new Set(collaborators.map(c => c.email))
    return searchableUsers.filter(u => u.role === 'Course Instructor' && !currentEmails.has(u.email))
  }, [searchableUsers, collaborators])

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
    instructors: collaborators.filter(c => c.role === 'instructor').length,
  }), [collaborators])

  const pendingInvitations = useMemo(
    () => projectInvitations.filter(inv => inv.projectId === projectId && inv.invitationStatus === 'pending'),
    [projectInvitations, projectId]
  )

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
    pendingInvitations,
    searchQuery,
    setSearchQuery,
  }
}
