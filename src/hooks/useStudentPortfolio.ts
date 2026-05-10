import { useState, useCallback, useEffect } from 'react'
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

const STORAGE_KEY = 'polaris_portfolios'

// ── Shared module-level state for synchronization ──────────────────────────
type Listener = () => void
const listeners: Set<Listener> = new Set()

const loadPortfolios = (): StudentPortfolio[] => {
  if (typeof window === 'undefined') return DUMMY_PORTFOLIOS
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) return DUMMY_PORTFOLIOS
  try {
    const parsed = JSON.parse(saved) as StudentPortfolio[]
    const parsedIds = new Set(parsed.map(p => p.studentId))
    const missingPortfolios = DUMMY_PORTFOLIOS.filter(p => !parsedIds.has(p.studentId))
    return [...parsed, ...missingPortfolios]
  } catch {
    return DUMMY_PORTFOLIOS
  }
}

let sharedPortfolios: StudentPortfolio[] = loadPortfolios()

function emit() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedPortfolios))
  }
  listeners.forEach(fn => fn())
}

/**
 * useStudentPortfolio – manages student portfolio data with CRUD operations.
 * Provides access to portfolio information, update methods, and skill management.
 *
 * @param studentId - Optional student ID to fetch a specific portfolio.
 * @returns Object containing portfolio state, update functions, and skill operations.
 */
export function useStudentPortfolio(studentId?: string) {
  const [, setTick] = useState(0)

  useEffect(() => {
    const listener = () => setTick(t => t + 1)
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, [])

  const portfolios = sharedPortfolios

  const portfolio = portfolios.find(p =>
    p.studentId === studentId ||
    p.email === studentId ||
    (studentId === 'student-001' && p.studentId === 'student-001')
  ) || DUMMY_PORTFOLIOS[0]

  const updatePortfolio = useCallback((updates: Partial<StudentPortfolio>) => {
    const targetId = studentId || 'student-001'
    sharedPortfolios = sharedPortfolios.map(p =>
      p.studentId === targetId
        ? { ...p, ...updates, updatedAt: new Date().toISOString() }
        : p
    )
    emit()
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
    const targetId = studentId || 'student-001'
    sharedPortfolios = sharedPortfolios.map(p => {
      if (p.studentId !== targetId) return p
      const skillExists = p.skills.some(s => s.toLowerCase() === skill.toLowerCase())
      if (skillExists) return p
      return {
        ...p,
        skills: [...p.skills, skill],
        updatedAt: new Date().toISOString()
      }
    })
    emit()
  }, [studentId])

  const removeSkill = useCallback((skill: string) => {
    const targetId = studentId || 'student-001'
    sharedPortfolios = sharedPortfolios.map(p =>
      p.studentId === targetId
        ? { ...p, skills: p.skills.filter(s => s !== skill), updatedAt: new Date().toISOString() }
        : p
    )
    emit()
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
