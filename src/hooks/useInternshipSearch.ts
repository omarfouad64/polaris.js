import { useState, useMemo } from 'react'
import type { Internship, InternshipApplication, CompletedInternship } from '../types'

const allInternships: Internship[] = [
  { id: 'si-1', title: 'Software Engineering Intern', description: 'Build scalable cloud-native applications with modern web technologies.', skills: ['React', 'TypeScript', 'Node.js'], duration: '3 months', applicationDeadline: '2026-07-15', programmingLanguages: ['TypeScript', 'Python'], status: 'Hiring', archived: false, postedAt: '2026-04-01', companyName: 'TechVentures Inc.', companyLogo: '', applicantCount: 42 },
  { id: 'si-2', title: 'Frontend Developer Intern', description: 'Design and implement user interfaces for enterprise SaaS products.', skills: ['React', 'CSS', 'Figma'], duration: '2 months', applicationDeadline: '2026-06-30', programmingLanguages: ['JavaScript', 'TypeScript'], status: 'Hiring', archived: false, postedAt: '2026-03-20', companyName: 'CloudSync Ltd.', companyLogo: '', applicantCount: 28 },
  { id: 'si-3', title: 'Data Science Intern', description: 'Analyze datasets and build ML models for business intelligence.', skills: ['Python', 'TensorFlow', 'SQL'], duration: '6 months', applicationDeadline: '2026-08-01', programmingLanguages: ['Python', 'R'], status: 'Hiring', archived: false, postedAt: '2026-04-10', companyName: 'DataMind Corp.', companyLogo: '', applicantCount: 17 },
  { id: 'si-4', title: 'Mobile Developer Intern', description: 'Develop cross-platform mobile applications using Flutter.', skills: ['Flutter', 'Dart', 'Firebase'], duration: '3 months', applicationDeadline: '2026-07-20', programmingLanguages: ['Dart'], status: 'Hiring', archived: false, postedAt: '2026-04-15', companyName: 'AppFactory', companyLogo: '', applicantCount: 33 },
  { id: 'si-5', title: 'DevOps Intern', description: 'Manage CI/CD pipelines and cloud infrastructure.', skills: ['Docker', 'Kubernetes', 'AWS'], duration: '3 months', applicationDeadline: '2026-07-01', programmingLanguages: ['Python', 'Bash'], status: 'Position Filled', archived: false, postedAt: '2026-02-10', companyName: 'TechVentures Inc.', companyLogo: '', applicantCount: 20 },
  { id: 'si-6', title: 'UX Research Intern', description: 'Conduct user research and usability testing.', skills: ['User Testing', 'Figma', 'Prototyping'], duration: '2 months', applicationDeadline: '2026-06-15', programmingLanguages: [], status: 'Hiring', archived: false, postedAt: '2026-03-28', companyName: 'DesignCo', companyLogo: '', applicantCount: 55 }
]

const myApplications: InternshipApplication[] = [
  { id: 'myapp-1', internshipId: 'si-5', internshipTitle: 'DevOps Intern', companyName: 'TechVentures Inc.', studentName: 'Student', studentEmail: 'student@guc.edu.eg', coverLetter: 'I am passionate about DevOps...', appliedAt: '2026-03-01', status: 'Accepted', contributionScore: 0 },
  { id: 'myapp-2', internshipId: 'si-6', internshipTitle: 'UX Research Intern', companyName: 'DesignCo', studentName: 'Student', studentEmail: 'student@guc.edu.eg', coverLetter: 'I have experience in usability testing...', appliedAt: '2026-04-05', status: 'Rejected', contributionScore: 0 }
]

const completedInternships: CompletedInternship[] = [
  { id: 'ci-1', title: 'DevOps Intern', companyName: 'TechVentures Inc.', duration: '3 months', completedAt: '2026-02-28' }
]

/**
 * useInternshipSearch — provides internship search, filter, sort, and application functionality for students.
 *
 * @returns filtered internships, search/filter state, application functions, and completed internships.
 */
export default function useInternshipSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [durationFilter, setDurationFilter] = useState<string[]>([])
  const [postedDateFrom, setPostedDateFrom] = useState('')
  const [postedDateTo, setPostedDateTo] = useState('')
  const [sortOrder, setSortOrder] = useState<'posted_desc' | 'posted_asc'>('posted_desc')
  const [applications, setApplications] = useState<InternshipApplication[]>(myApplications)

  const filteredInternships = useMemo(() => {
    let results = allInternships.filter(i => !i.archived)

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      results = results.filter(i =>
        i.title.toLowerCase().includes(q) || i.companyName.toLowerCase().includes(q)
      )
    }

    if (companyFilter) {
      const cf = companyFilter.toLowerCase()
      results = results.filter(i => i.companyName.toLowerCase().includes(cf))
    }

    if (durationFilter.length > 0) {
      results = results.filter(i => durationFilter.includes(i.duration))
    }

    if (postedDateFrom) {
      const from = new Date(postedDateFrom).getTime()
      results = results.filter(i => new Date(i.postedAt).getTime() >= from)
    }

    if (postedDateTo) {
      const to = new Date(postedDateTo).getTime()
      results = results.filter(i => new Date(i.postedAt).getTime() <= to)
    }

    results.sort((a, b) => {
      const dateA = new Date(a.postedAt).getTime()
      const dateB = new Date(b.postedAt).getTime()
      return sortOrder === 'posted_desc' ? dateB - dateA : dateA - dateB
    })

    return results
  }, [searchQuery, companyFilter, durationFilter, postedDateFrom, postedDateTo, sortOrder])

  const applyForInternship = (internshipId: string, coverLetter: string): void => {
    const internship = allInternships.find(i => i.id === internshipId)
    if (!internship) return

    const app: InternshipApplication = {
      id: `myapp-${Date.now()}`,
      internshipId,
      internshipTitle: internship.title,
      companyName: internship.companyName,
      studentName: 'Student',
      studentEmail: 'student@guc.edu.eg',
      coverLetter,
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
      contributionScore: 0
    }
    setApplications(prev => [...prev, app])
  }

  const hasApplied = (internshipId: string): boolean => {
    return applications.some(a => a.internshipId === internshipId)
  }

  const toggleDurationFilter = (duration: string): void => {
    setDurationFilter(prev =>
      prev.includes(duration)
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    )
  }

  return {
    internships: filteredInternships,
    applications,
    completedInternships,
    searchQuery,
    setSearchQuery,
    companyFilter,
    setCompanyFilter,
    durationFilter,
    toggleDurationFilter,
    postedDateFrom,
    setPostedDateFrom,
    postedDateTo,
    setPostedDateTo,
    sortOrder,
    setSortOrder,
    applyForInternship,
    hasApplied
  }
}
