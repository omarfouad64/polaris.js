import { useState, useCallback } from 'react'
import type { StudentPortfolio } from '../types'

// Dummy initial portfolio data
const DUMMY_PORTFOLIO: StudentPortfolio = {
  studentId: 'student-001',
  name: 'Ahmed Hassan',
  email: 'ahmed.hassan@student.guc.edu.eg',
  major: 'Computer Science',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
  linkedinUrl: 'https://linkedin.com/in/ahmed-hassan',
  bio: 'Passionate about building modern web applications and solving complex problems.',
  profilePicture: null,
  createdAt: new Date('2024-01-15').toISOString(),
  updatedAt: new Date('2024-01-15').toISOString()
}

/**
 * useStudentPortfolio – manages student portfolio data with CRUD operations.
 * Provides access to portfolio information, update methods, and skill management.
 *
 * @returns Object containing portfolio state, update functions, and skill operations.
 */
export function useStudentPortfolio() {
  const [portfolio, setPortfolio] = useState<StudentPortfolio>(DUMMY_PORTFOLIO)

  const updatePortfolio = useCallback((updates: Partial<StudentPortfolio>) => {
    setPortfolio(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString()
    }))
  }, [])

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
    setPortfolio(prev => {
      const skillExists = prev.skills.some(s => s.toLowerCase() === skill.toLowerCase())
      if (skillExists) return prev

      return {
        ...prev,
        skills: [...prev.skills, skill],
        updatedAt: new Date().toISOString()
      }
    })
  }, [])

  const removeSkill = useCallback((skill: string) => {
    setPortfolio(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
      updatedAt: new Date().toISOString()
    }))
  }, [])

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