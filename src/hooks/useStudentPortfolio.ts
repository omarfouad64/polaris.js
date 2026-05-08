import { useState, useCallback } from 'react'
import type { StudentPortfolio } from '../types'

// Expanded dummy portfolio data
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
    updatedAt: new Date('2024-02-01').toISOString()
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
    updatedAt: new Date('2023-11-10').toISOString()
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
    updatedAt: new Date('2024-03-12').toISOString()
  },
  {
    studentId: 'student-005',
    name: 'Yasmin Farid',
    email: 'yasmin.farid@student.guc.edu.eg',
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

/**
 * useStudentPortfolio – manages student portfolio data with CRUD operations.
 * Provides access to portfolio information, update methods, and skill management.
 *
 * @param studentId - Optional student ID to fetch a specific portfolio.
 * @returns Object containing portfolio state, update functions, and skill operations.
 */
export function useStudentPortfolio(studentId?: string) {
  const [portfolios, setPortfolios] = useState<StudentPortfolio[]>(() => {
    const saved = localStorage.getItem('polaris_portfolios')
    if (!saved) return DUMMY_PORTFOLIOS
    
    // Merge saved portfolios with any new ones from DUMMY_PORTFOLIOS
    // that might not exist in the stale localStorage cache
    const parsed = JSON.parse(saved) as StudentPortfolio[]
    const parsedIds = new Set(parsed.map(p => p.studentId))
    const missingPortfolios = DUMMY_PORTFOLIOS.filter(p => !parsedIds.has(p.studentId))
    
    return [...parsed, ...missingPortfolios]
  })

  const portfolio = portfolios.find(p => 
    p.studentId === studentId || 
    p.email === studentId ||
    (studentId === 'student-001' && p.studentId === 'student-001')
  ) || DUMMY_PORTFOLIOS[0]

  const updatePortfolio = useCallback((updates: Partial<StudentPortfolio>) => {
    setPortfolios(prev => {
      const targetId = studentId || 'student-001'
      const updated = prev.map(p => 
        p.studentId === targetId 
          ? { ...p, ...updates, updatedAt: new Date().toISOString() } 
          : p
      )
      localStorage.setItem('polaris_portfolios', JSON.stringify(updated))
      return updated
    })
  }, [studentId])

  const updateMajor = useCallback((major: string) => {
    updatePortfolio({ major })
  }, [updatePortfolio])

  const updateBio = useCallback((bio: string) => {
    updatePortfolio({ bio })
  }, [updatePortfolio])

  const updateLinkedinUrl = useCallback((linkedinUrl: string) => {
    updatePortfolio({ linkedinUrl })
  }, [updatePortfolio])

  const addSkill = useCallback((skill: string) => {
    setPortfolios(prev => {
      const targetId = studentId || 'student-001'
      const updated = prev.map(p => {
        if (p.studentId !== targetId) return p
        const skillExists = p.skills.some(s => s.toLowerCase() === skill.toLowerCase())
        if (skillExists) return p
        return {
          ...p,
          skills: [...p.skills, skill],
          updatedAt: new Date().toISOString()
        }
      })
      localStorage.setItem('polaris_portfolios', JSON.stringify(updated))
      return updated
    })
  }, [studentId])

  const removeSkill = useCallback((skill: string) => {
    setPortfolios(prev => {
      const targetId = studentId || 'student-001'
      const updated = prev.map(p => 
        p.studentId === targetId 
          ? { ...p, skills: p.skills.filter(s => s !== skill), updatedAt: new Date().toISOString() } 
          : p
      )
      localStorage.setItem('polaris_portfolios', JSON.stringify(updated))
      return updated
    })
  }, [studentId])

  const updateProfilePicture = useCallback((pictureUrl: string | null) => {
    updatePortfolio({ profilePicture: pictureUrl })
  }, [updatePortfolio])

  return {
    portfolio,
    updatePortfolio,
    updateMajor,
    updateBio,
    updateLinkedinUrl,
    addSkill,
    removeSkill,
    updateProfilePicture
  }
}