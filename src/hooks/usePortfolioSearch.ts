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
    bio: 'Passionate about building modern web applications and solving complex problems.',
    profilePicture: null,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    studentId: 'student-002',
    name: 'Sara Mohamed',
    email: 'sara.mohamed@guc.edu.eg',
    major: 'Media Engineering',
    year: 'Junior',
    projectCount: 5,
    skills: ['Mobile', 'UX Design', 'Flutter'],
    linkedinUrl: 'https://linkedin.com/in/sara-mohamed',
    bio: 'Mobile-first developer with a focus on UX and cross-platform apps.',
    profilePicture: null,
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString()
  },
  {
    studentId: 'student-003',
    name: 'Omar Khaled',
    email: 'omar.khaled@guc.edu.eg',
    major: 'Information Systems',
    year: 'Senior',
    projectCount: 9,
    skills: ['SQL', 'System Design', 'Cloud'],
    linkedinUrl: 'https://linkedin.com/in/omar-khaled',
    bio: 'Cloud-focused system analyst with an interest in scalable data workflows.',
    profilePicture: null,
    createdAt: new Date('2023-11-10').toISOString(),
    updatedAt: new Date('2023-11-10').toISOString()
  },
  {
    studentId: 'student-004',
    name: 'Nour Ali',
    email: 'nour.ali@guc.edu.eg',
    major: 'Design',
    year: 'Sophomore',
    projectCount: 6,
    skills: ['UI/UX', 'Figma', 'Research'],
    linkedinUrl: 'https://linkedin.com/in/nour-ali',
    bio: 'Design researcher focused on accessible, user-centered interfaces.',
    profilePicture: null,
    createdAt: new Date('2024-03-12').toISOString(),
    updatedAt: new Date('2024-03-12').toISOString()
  },
  {
    studentId: 'student-005',
    name: 'Yasmin Farid',
    email: 'yasmin.farid@guc.edu.eg',
    major: 'Computer Science',
    year: 'Junior',
    projectCount: 7,
    skills: ['Mobile Development', 'Flutter', 'Firebase'],
    linkedinUrl: 'https://linkedin.com/in/yasmin-farid',
    bio: 'Mobile developer focused on cross-platform applications with Flutter.',
    profilePicture: null,
    createdAt: new Date('2024-04-01').toISOString(),
    updatedAt: new Date('2024-04-01').toISOString()
  }
]

export default function usePortfolioSearch() {
  const [basePortfolios] = useState<StudentPortfolio[]>(() => {
    if (typeof window === 'undefined') return DUMMY_PORTFOLIOS
    const saved = window.localStorage.getItem('polaris_portfolios')
    if (!saved) return DUMMY_PORTFOLIOS
    try {
      const parsed = JSON.parse(saved) as StudentPortfolio[]
      const parsedIds = new Set(parsed.map(portfolio => portfolio.studentId))
      const missing = DUMMY_PORTFOLIOS.filter(portfolio => !parsedIds.has(portfolio.studentId))
      return [...parsed, ...missing]
    } catch {
      return DUMMY_PORTFOLIOS
    }
  })

  const [filters, setFilters] = useState<PortfolioFilters>({
    query: '',
    major: 'all',
    skill: 'all',
    sortBy: 'updated_desc'
  })

  const portfolios = useMemo(() => {
    let result = [...basePortfolios]

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
  }, [basePortfolios, filters])

  const availableMajors = useMemo(() => {
    return Array.from(new Set(basePortfolios.map(portfolio => portfolio.major)))
  }, [basePortfolios])

  const availableSkills = useMemo(() => {
    const allSkills = basePortfolios.flatMap(portfolio => portfolio.skills)
    return Array.from(new Set(allSkills))
  }, [basePortfolios])

  const recommendedPortfolios = useMemo(() => {
    return [...basePortfolios]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3)
  }, [basePortfolios])

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
