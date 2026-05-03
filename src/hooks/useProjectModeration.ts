import { useState, useCallback, useMemo } from 'react'
import type { FlaggedProject, ProjectAppeal } from '../types'

// Dummy flagged projects
const DUMMY_FLAGGED_PROJECTS: FlaggedProject[] = [
  {
    id: 'flag-001',
    projectId: 'proj-002',
    projectTitle: 'AI Chatbot',
    projectOwnerId: 'student-002',
    projectOwnerName: 'Fatima Mousa',
    flaggedBy: 'instructor-001',
    flaggedByName: 'Dr. Fatima Al-Mansouri',
    reason: 'Potential plagiarism detected',
    description: 'Code structure appears to match publicly available GitHub repository',
    flaggedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'appealed'
  }
]

// Dummy appeals
const DUMMY_APPEALS: ProjectAppeal[] = [
  {
    id: 'appeal-001',
    flaggedProjectId: 'flag-001',
    projectId: 'proj-002',
    studentId: 'student-002',
    studentName: 'Fatima Mousa',
    appealMessage:
      'We did use an existing repository as reference, but all code was written by us from scratch. We can provide proof of our development process through git commits.',
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending'
  }
]

/**
 * useProjectModeration – manages project flagging and appeals.
 * Provides methods for flagging inappropriate projects and handling student appeals.
 *
 * @returns Object containing flagged projects, appeals, and moderation actions.
 */
export function useProjectModeration() {
  const [flaggedProjects, setFlaggedProjects] = useState<FlaggedProject[]>(
    DUMMY_FLAGGED_PROJECTS
  )
  const [appeals, setAppeals] = useState<ProjectAppeal[]>(DUMMY_APPEALS)

  // Flag a project
  const flagProject = useCallback(
    (
      projectId: string,
      projectTitle: string,
      projectOwnerId: string,
      projectOwnerName: string,
      flaggedBy: string,
      flaggedByName: string,
      reason: string,
      description?: string
    ) => {
      // Check if already flagged
      const existingFlag = flaggedProjects.find(f => f.projectId === projectId)
      if (existingFlag) {
        console.warn('Project is already flagged')
        return existingFlag
      }

      const newFlag: FlaggedProject = {
        id: `flag-${Date.now()}`,
        projectId,
        projectTitle,
        projectOwnerId,
        projectOwnerName,
        flaggedBy,
        flaggedByName,
        reason,
        description,
        flaggedAt: new Date().toISOString(),
        status: 'flagged'
      }
      setFlaggedProjects(prev => [...prev, newFlag])
      return newFlag
    },
    [flaggedProjects]
  )

  // Submit appeal
  const submitAppeal = useCallback(
    (flaggedProjectId: string, projectId: string, studentId: string, studentName: string, appealMessage: string) => {
      const newAppeal: ProjectAppeal = {
        id: `appeal-${Date.now()}`,
        flaggedProjectId,
        projectId,
        studentId,
        studentName,
        appealMessage,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      }
      setAppeals(prev => [...prev, newAppeal])

      // Update flagged project status
      setFlaggedProjects(prev =>
        prev.map(f =>
          f.id === flaggedProjectId ? { ...f, status: 'appealed' } : f
        )
      )

      return newAppeal
    },
    []
  )

  // Approve appeal (unflag project)
  const approveAppeal = useCallback((appealId: string, adminResponse?: string) => {
    setAppeals(prev =>
      prev.map(a =>
        a.id === appealId
          ? {
              ...a,
              status: 'approved',
              adminResponse,
              respondedAt: new Date().toISOString()
            }
          : a
      )
    )

    // Update flagged project
    const appeal = appeals.find(a => a.id === appealId)
    if (appeal) {
      setFlaggedProjects(prev =>
        prev.map(f =>
          f.id === appeal.flaggedProjectId
            ? { ...f, status: 'resolved' }
            : f
        )
      )
    }
  }, [appeals])

  // Reject appeal (keep flagged)
  const rejectAppeal = useCallback((appealId: string, adminResponse?: string) => {
    setAppeals(prev =>
      prev.map(a =>
        a.id === appealId
          ? {
              ...a,
              status: 'rejected',
              adminResponse,
              respondedAt: new Date().toISOString()
            }
          : a
      )
    )

    // Update flagged project
    const appeal = appeals.find(a => a.id === appealId)
    if (appeal) {
      setFlaggedProjects(prev =>
        prev.map(f =>
          f.id === appeal.flaggedProjectId
            ? { ...f, status: 'flagged' }
            : f
        )
      )
    }
  }, [appeals])

  // Get flagged project details
  const getFlaggedProjectById = useCallback(
    (flagId: string) => {
      return flaggedProjects.find(f => f.id === flagId)
    },
    [flaggedProjects]
  )

  // Get appeal for flagged project
  const getAppealForProject = useCallback(
    (projectId: string) => {
      return appeals.find(a => a.projectId === projectId)
    },
    [appeals]
  )

  // Statistics
  const stats = useMemo(() => ({
    totalFlagged: flaggedProjects.length,
    flagged: flaggedProjects.filter(f => f.status === 'flagged').length,
    appealed: flaggedProjects.filter(f => f.status === 'appealed').length,
    resolved: flaggedProjects.filter(f => f.status === 'resolved').length,
    totalAppeals: appeals.length,
    pendingAppeals: appeals.filter(a => a.status === 'pending').length,
    approvedAppeals: appeals.filter(a => a.status === 'approved').length
  }), [flaggedProjects, appeals])

  return {
    // State
    flaggedProjects,
    appeals,
    stats,

    // Actions
    flagProject,
    submitAppeal,
    approveAppeal,
    rejectAppeal,
    getFlaggedProjectById,
    getAppealForProject
  }
}