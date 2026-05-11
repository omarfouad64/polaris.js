import { useCallback, useMemo } from 'react'
import useDatabase from './useDatabase'
import {
  flagProject as flagProjectAction,
  submitAppeal as submitAppealAction,
  approveAppeal as approveAppealAction,
  rejectAppeal as rejectAppealAction,
} from '../store/databaseSlice'

/**
 * useProjectModeration — reads flagged projects and appeals from Redux store and provides moderation actions.
 */
export function useProjectModeration() {
  const { flaggedProjects, projectAppeals: appeals, dispatch } = useDatabase()

  const flagProject = useCallback(
    (projectId: string, projectTitle: string, projectOwnerId: string, projectOwnerName: string, flaggedBy: string, flaggedByName: string, reason: string, description?: string) => {
      dispatch(flagProjectAction({
        projectId, projectTitle, projectOwnerId, projectOwnerName, flaggedBy, flaggedByName, reason, description
      }))
    },
    [dispatch]
  )

  const submitAppeal = useCallback(
    (flaggedProjectId: string, projectId: string, studentId: string, studentName: string, appealMessage: string) => {
      dispatch(submitAppealAction({
        flaggedProjectId, projectId, studentId, studentName, appealMessage
      }))
    },
    [dispatch]
  )

  const approveAppeal = useCallback((appealId: string, adminResponse?: string) => {
    dispatch(approveAppealAction({ appealId, adminResponse }))
  }, [dispatch])

  const rejectAppeal = useCallback((appealId: string, adminResponse?: string) => {
    dispatch(rejectAppealAction({ appealId, adminResponse }))
  }, [dispatch])

  const getFlaggedProjectById = useCallback(
    (flagId: string) => flaggedProjects.find(f => f.id === flagId),
    [flaggedProjects]
  )

  const getAppealForProject = useCallback(
    (projectId: string) => appeals.find(a => a.projectId === projectId),
    [appeals]
  )

  const stats = useMemo(() => ({
    totalFlagged: flaggedProjects.length,
    flagged: flaggedProjects.filter(f => f.status === 'flagged').length,
    appealed: flaggedProjects.filter(f => f.status === 'appealed').length,
    resolved: flaggedProjects.filter(f => f.status === 'resolved').length,
    totalAppeals: appeals.length,
    pendingAppeals: appeals.filter(a => a.status === 'pending').length,
    approvedAppeals: appeals.filter(a => a.status === 'approved').length,
  }), [flaggedProjects, appeals])

  return {
    flaggedProjects,
    appeals,
    stats,
    flagProject,
    submitAppeal,
    approveAppeal,
    rejectAppeal,
    getFlaggedProjectById,
    getAppealForProject,
  }
}
