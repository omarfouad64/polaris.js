import { useState, useMemo } from 'react'
import useFavorites from '../../../../../hooks/useFavorites'
import type { InternshipApplication } from '../../../../../types'

const dummyApplicants: InternshipApplication[] = [
  {
    id: 'app-1', internshipId: 'int-1', internshipTitle: 'Software Engineering Intern',
    companyName: 'TechVentures Inc.', studentId: 'student-001', studentName: 'Ahmed Hassan', studentEmail: 'ahmed.hassan@guc.edu.eg',
    coverLetter: 'I am a senior CS student passionate about cloud-native development. My portfolio includes 3 full-stack projects using React and Node.js, and I led my team in the Software Engineering course project.',
    appliedAt: '2026-04-15', status: 'Pending', contributionScore: 92
  },
  {
    id: 'app-2', internshipId: 'int-1', internshipTitle: 'Software Engineering Intern',
    companyName: 'TechVentures Inc.', studentId: 'student-002', studentName: 'Sara Mohamed', studentEmail: 'sara.mohamed@guc.edu.eg',
    coverLetter: 'With strong experience in TypeScript and React from multiple academic and personal projects, I believe I can contribute meaningfully to your engineering team.',
    appliedAt: '2026-04-16', status: 'Nominated', contributionScore: 87
  },
  {
    id: 'app-3', internshipId: 'int-1', internshipTitle: 'Software Engineering Intern',
    companyName: 'TechVentures Inc.', studentId: 'student-003', studentName: 'Omar Khaled', studentEmail: 'omar.khaled@guc.edu.eg',
    coverLetter: 'I have completed several AWS projects and hold a cloud practitioner certification. I am eager to apply my skills in a real production environment.',
    appliedAt: '2026-04-18', status: 'Pending', contributionScore: 78
  },
  {
    id: 'app-4', internshipId: 'int-2', internshipTitle: 'UX Research Intern',
    companyName: 'TechVentures Inc.', studentId: 'student-004', studentName: 'Nour Ali', studentEmail: 'nour.ali@guc.edu.eg',
    coverLetter: 'As a design student with experience in user research methodologies, I am excited about the opportunity to work on real user studies.',
    appliedAt: '2026-04-12', status: 'Accepted', contributionScore: 95
  },
  {
    id: 'app-5', internshipId: 'int-2', internshipTitle: 'UX Research Intern',
    companyName: 'TechVentures Inc.', studentId: 'student-005', studentName: 'Yasmin Farid', studentEmail: 'yasmin.farid@guc.edu.eg',
    coverLetter: 'I have conducted 5 usability studies as part of my HCI coursework and am proficient in Figma prototyping.',
    appliedAt: '2026-04-14', status: 'Rejected', contributionScore: 70
  }
]

/**
 * useApplicants — provides applicant data and management operations for a specific internship.
 *
 * @param internshipId - The ID of the internship to filter applicants for.
 * @returns applicants list, status update function, sort options, and suggested matches.
 */
export default function useApplicants(internshipId: string) {
  const [applicants, setApplicants] = useState<InternshipApplication[]>(dummyApplicants)
  const [sortByContributors, setSortByContributors] = useState(false)
  const { favoritePortfolios } = useFavorites()

  const favoriteIds = useMemo(() => new Set(favoritePortfolios.map(favorite => favorite.id)), [favoritePortfolios])
  const favoriteNames = useMemo(() => new Set(favoritePortfolios.map(favorite => favorite.title.toLowerCase())), [favoritePortfolios])

  const filteredApplicants = useMemo(() => {
    const results = applicants.filter(a => a.internshipId === internshipId)
    if (sortByContributors) {
      return [...results].sort((a, b) => {
        const scoreDiff = b.contributionScore - a.contributionScore
        if (scoreDiff !== 0) return scoreDiff
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      })
    }
    return [...results].sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
  }, [applicants, internshipId, sortByContributors])

  const suggestedApplicants = useMemo(() => {
    return applicants
      .filter(a => a.internshipId === internshipId)
      .filter(a => favoriteIds.has(a.studentId) || favoriteNames.has(a.studentName.toLowerCase()))
      .sort((a, b) => b.contributionScore - a.contributionScore)
  }, [applicants, internshipId, favoriteIds, favoriteNames])

  const updateStatus = (applicationId: string, status: InternshipApplication['status']): void => {
    setApplicants(prev => prev.map(a =>
      a.id === applicationId ? { ...a, status } : a
    ))
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
