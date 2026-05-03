import { useState, useCallback } from 'react'
import type { InstructorProfile } from '../types'

// Dummy initial instructor profile data
const DUMMY_INSTRUCTOR_PROFILE: InstructorProfile = {
  instructorId: 'instructor-001',
  name: 'Dr. Fatima Al-Mansouri',
  email: 'fatima.mansouri@guc.edu.eg',
  biography: 'PhD in Computer Science from Cairo University. Specializing in software engineering and web technologies. Over 10 years of academic experience.',
  researchInterests: ['Web Development', 'Software Engineering', 'Cloud Computing', 'Cybersecurity'],
  educationBackground: 'PhD in Computer Science (Cairo University), M.Sc. in Information Systems (AUC), B.Sc. in Computer Science (GUC)',
  linkedCourses: ['course-001', 'course-002', 'bachelor-project'],
  profilePicture: null,
  createdAt: new Date('2023-06-15').toISOString(),
  updatedAt: new Date('2024-01-20').toISOString()
}

/**
 * useInstructorProfile – manages instructor profile data with CRUD operations.
 * Provides access to profile information, research interests, and education background.
 *
 * @returns Object containing profile state and update functions.
 */
export function useInstructorProfile() {
  const [profile, setProfile] = useState<InstructorProfile>(DUMMY_INSTRUCTOR_PROFILE)

  const updateProfile = useCallback((updates: Partial<InstructorProfile>) => {
    setProfile(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString()
    }))
  }, [])

  const updateBiography = useCallback((biography: string) => {
    updateProfile({ biography })
  }, [updateProfile])

  const updateEducationBackground = useCallback((educationBackground: string) => {
    updateProfile({ educationBackground })
  }, [updateProfile])

  const addResearchInterest = useCallback((interest: string) => {
    setProfile(prev => {
      const interestExists = prev.researchInterests.some(
        r => r.toLowerCase() === interest.toLowerCase()
      )
      if (interestExists) return prev

      return {
        ...prev,
        researchInterests: [...prev.researchInterests, interest],
        updatedAt: new Date().toISOString()
      }
    })
  }, [])

  const removeResearchInterest = useCallback((interest: string) => {
    setProfile(prev => ({
      ...prev,
      researchInterests: prev.researchInterests.filter(r => r !== interest),
      updatedAt: new Date().toISOString()
    }))
  }, [])

  const updateProfilePicture = useCallback((pictureUrl: string | null) => {
    updateProfile({ profilePicture: pictureUrl })
  }, [updateProfile])

  return {
    profile,
    updateProfile,
    updateBiography,
    updateEducationBackground,
    addResearchInterest,
    removeResearchInterest,
    updateProfilePicture
  }
}