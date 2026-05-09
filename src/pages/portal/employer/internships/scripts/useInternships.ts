import { useState } from 'react'
import type { Internship } from '../../../../../types'

const dummyInternships: Internship[] = [
  {
    id: 'int-1',
    title: 'Software Engineering Intern',
    description: 'Join our engineering team to build scalable cloud-native applications using modern web technologies. You will work on real product features and participate in agile ceremonies.',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    duration: '3 months',
    applicationDeadline: '2026-07-15',
    programmingLanguages: ['TypeScript', 'Python'],
    status: 'Hiring',
    archived: false,
    postedAt: '2026-04-01',
    companyName: 'TechVentures Inc.',
    companyLogo: '',
    applicantCount: 3
  },
  {
    id: 'int-2',
    title: 'UX Research Intern',
    description: 'Conduct user research studies, create personas, and contribute to design decisions that impact millions of users.',
    skills: ['User Testing', 'Figma', 'Data Analysis', 'Prototyping'],
    duration: '2 months',
    applicationDeadline: '2026-06-30',
    programmingLanguages: [],
    status: 'Hiring',
    archived: false,
    postedAt: '2026-03-20',
    companyName: 'TechVentures Inc.',
    companyLogo: '',
    applicantCount: 2
  },
  {
    id: 'int-3',
    title: 'Data Science Intern',
    description: 'Analyze large datasets and build machine learning models to drive business insights and product improvements.',
    skills: ['Python', 'TensorFlow', 'SQL', 'Statistics'],
    duration: '6 months',
    applicationDeadline: '2026-08-01',
    programmingLanguages: ['Python', 'R'],
    status: 'Hiring',
    archived: false,
    postedAt: '2026-04-10',
    companyName: 'TechVentures Inc.',
    companyLogo: '',
    applicantCount: 0
  },
  {
    id: 'int-4',
    title: 'Product Marketing Intern',
    description: 'Support go-to-market strategy for new product launches, create content, and analyze campaign performance.',
    skills: ['Copywriting', 'Analytics', 'Social Media'],
    duration: '3 months',
    applicationDeadline: '2025-12-15',
    programmingLanguages: [],
    status: 'Position Filled',
    archived: true,
    postedAt: '2025-09-01',
    companyName: 'TechVentures Inc.',
    companyLogo: '',
    applicantCount: 0
  }
]

/**
 * useInternships — provides internship data and management operations for an employer.
 *
 * @returns internships list, CRUD functions, archive/status toggles, and filter state.
 */
export default function useInternships() {
  const [internships, setInternships] = useState<Internship[]>(dummyInternships)

  const addInternship = (data: Omit<Internship, 'id' | 'postedAt' | 'companyName' | 'companyLogo' | 'applicantCount' | 'archived'>): void => {
    const newInternship: Internship = {
      ...data,
      id: `int-${Date.now()}`,
      postedAt: new Date().toISOString().split('T')[0],
      companyName: 'TechVentures Inc.',
      companyLogo: '',
      applicantCount: 0,
      archived: false
    }
    setInternships(prev => [newInternship, ...prev])
  }

  const updateInternship = (id: string, updates: Partial<Internship>): void => {
    setInternships(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))
  }

  const deleteInternship = (id: string): void => {
    setInternships(prev => prev.filter(i => i.id !== id))
  }

  const toggleStatus = (id: string): void => {
    setInternships(prev => prev.map(i =>
      i.id === id
        ? { ...i, status: i.status === 'Hiring' ? 'Position Filled' as const : 'Hiring' as const }
        : i
    ))
  }

  const toggleArchive = (id: string): void => {
    setInternships(prev => prev.map(i => {
      if (i.id !== id) return i
      return { ...i, archived: !i.archived }
    }))
  }

  const activeInternships = internships.filter(i => !i.archived)
  const archivedInternships = internships.filter(i => i.archived)

  return {
    internships,
    activeInternships,
    archivedInternships,
    addInternship,
    updateInternship,
    deleteInternship,
    toggleStatus,
    toggleArchive
  }
}
