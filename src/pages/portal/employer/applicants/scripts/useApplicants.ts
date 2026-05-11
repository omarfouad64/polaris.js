import { useState, useMemo } from 'react'
import { useGlobalContext } from '../../../../../globalContext'
import useFavorites from '../../../../../hooks/useFavorites'
import useDatabase from '../../../../../hooks/useDatabase'
import type { InternshipApplication } from '../../../../../types'
import { updateApplicationStatus } from '../../../../../store/databaseSlice'

/**
 * useApplicants — provides applicant data and management operations for a specific internship.
 *
 * @param internshipId - The ID of the internship to filter applicants for.
 * @returns applicants list, status update function, sort options, and suggested matches.
 */
export default function useApplicants(internshipId: string) {
  const dispatch = useDatabase().dispatch
  const applications = useDatabase().applications as InternshipApplication[]
  const [sortByContributors, setSortByContributors] = useState(false)
  const { user } = useGlobalContext()
  const { favoritePortfolios } = useFavorites(user?.username || '')

  const favoriteIds = useMemo(() => new Set(favoritePortfolios.map(favorite => favorite.id)), [favoritePortfolios])
  const favoriteNames = useMemo(() => new Set(favoritePortfolios.map(favorite => favorite.title.toLowerCase())), [favoritePortfolios])

  const filteredApplicants = useMemo(() => {
    const results = applications.filter(a => a.internshipId === internshipId)
    if (sortByContributors) {
      return [...results].sort((a, b) => {
        const scoreDiff = b.contributionScore - a.contributionScore
        if (scoreDiff !== 0) return scoreDiff
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      })
    }
    return [...results].sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
  }, [applications, internshipId, sortByContributors])

  const suggestedApplicants = useMemo(() => {
    return applications
      .filter(a => a.internshipId === internshipId)
      .filter(a => favoriteIds.has(a.studentId) || favoriteNames.has(a.studentName.toLowerCase()))
      .sort((a, b) => b.contributionScore - a.contributionScore)
  }, [applications, internshipId, favoriteIds, favoriteNames])

  const updateStatus = (applicationId: string, status: InternshipApplication['status']): void => {
    dispatch(updateApplicationStatus({ id: applicationId, status }))
  }

  const toggleSortByContributors = (): void => {
    setSortByContributors(prev => !prev)
  }

  return {
    applicants: filteredApplicants,
    suggestedApplicants,
    updateStatus,
    sortByContributors,
    toggleSortByContributors
  }
}
