/**
 * usePortfolioSearch — provides portfolio search and filter behavior with dummy data.
 */
import { useMemo, useState } from 'react'
import type { StudentPortfolio } from '../types'

interface PortfolioFilters {
  query: string
  major: string
  skill: string
  sortBy: 'updated_desc' | 'projects_desc' | 'projects_asc'
}

const DUMMY_PORTFOLIOS: StudentPortfolio[] = [
  {
    studentId: 'student-001',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@student.guc.edu.eg',
    major: 'Computer Science',
    year: 'Senior',
    projectCount: 12,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
    linkedinUrl: 'https://linkedin.com/in/ahmed-hassan',
    bio: 'Focused on building modern web apps and strong UI systems.',
    profilePicture: null,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2026-02-10').toISOString()
  },
  {
    studentId: 'student-002',
    name: 'Mariam Khalil',
    email: 'mariam.khalil@student.guc.edu.eg',
    major: 'Computer Engineering',
    year: 'Junior',
    projectCount: 8,
    skills: ['Python', 'Machine Learning', 'Data Analysis'],
    linkedinUrl: 'https://linkedin.com/in/mariam-khalil',
    bio: 'Interested in applied machine learning and data-driven products.',
    profilePicture: null,
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2026-02-18').toISOString()
  },
  {
    studentId: 'student-003',
    name: 'Omar Ibrahim',
    email: 'omar.ibrahim@student.guc.edu.eg',
    major: 'Information Systems',
    year: 'Senior',
    projectCount: 15,
    skills: ['SQL', 'System Design', 'Project Management'],
    linkedinUrl: 'https://linkedin.com/in/omar-ibrahim',
    bio: 'System analyst with a focus on structured data and workflows.',
    profilePicture: null,
    createdAt: new Date('2023-11-10').toISOString(),
    updatedAt: new Date('2026-01-25').toISOString()
  },
  {
    studentId: 'student-004',
    name: 'Sara Ali',
    email: 'sara.ali@student.guc.edu.eg',
    major: 'Computer Science',
    year: 'Sophomore',
    projectCount: 5,
    skills: ['UI Design', 'Figma', 'Front-End Development'],
    linkedinUrl: 'https://linkedin.com/in/sara-ali',
    bio: 'Designing expressive interfaces with accessible front-end code.',
    profilePicture: null,
    createdAt: new Date('2024-03-12').toISOString(),
    updatedAt: new Date('2026-03-05').toISOString()
  }
]

export default function usePortfolioSearch() {
  const [filters, setFilters] = useState<PortfolioFilters>({
    query: '',
    major: 'all',
    skill: 'all',
    sortBy: 'updated_desc'
  })

  const portfolios = useMemo(() => {
    let result = [...DUMMY_PORTFOLIOS]

    if (filters.query.trim()) {
      const q = filters.query.toLowerCase()
      result = result.filter(portfolio =>
        portfolio.name.toLowerCase().includes(q) ||
        portfolio.email.toLowerCase().includes(q) ||
        portfolio.major.toLowerCase().includes(q) ||
        portfolio.skills.some(skill => skill.toLowerCase().includes(q))
      )
    }

    if (filters.major !== 'all') {
      result = result.filter(portfolio => portfolio.major === filters.major)
    }

    if (filters.skill !== 'all') {
      result = result.filter(portfolio => portfolio.skills.includes(filters.skill))
    }

    // Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'projects_desc') {
        return b.projectCount - a.projectCount
      }
      if (filters.sortBy === 'projects_asc') {
        return a.projectCount - b.projectCount
      }
      // default: updated_desc
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

    return result
  }, [filters])

  const availableMajors = useMemo(() => {
    return Array.from(new Set(DUMMY_PORTFOLIOS.map(portfolio => portfolio.major)))
  }, [])

  const availableSkills = useMemo(() => {
    const allSkills = DUMMY_PORTFOLIOS.flatMap(portfolio => portfolio.skills)
    return Array.from(new Set(allSkills))
  }, [])

  const recommendedPortfolios = useMemo(() => {
    return [...DUMMY_PORTFOLIOS]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3)
  }, [])

  const updateFilters = (updates: Partial<PortfolioFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }

  return {
    portfolios,
    recommendedPortfolios,
    availableMajors,
    availableSkills,
    filters,
    updateFilters
  }
}
