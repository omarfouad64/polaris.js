import { useState, useCallback, useEffect } from 'react'
import type { InstructorProfile } from '../types'

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
  updatedAt: new Date('2024-01-20').toISOString(),
}

const STORAGE_KEY = 'polaris_instructor_profile'
type Listener = () => void
const listeners: Set<Listener> = new Set()

const loadProfile = (): InstructorProfile => {
  if (typeof window === 'undefined') return DUMMY_INSTRUCTOR_PROFILE
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) return DUMMY_INSTRUCTOR_PROFILE
  try {
    return JSON.parse(saved)
  } catch {
    return DUMMY_INSTRUCTOR_PROFILE
  }
}

let sharedProfile: InstructorProfile = loadProfile()

function emit() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sharedProfile))
  }
  listeners.forEach(fn => fn())
}

/**
 * useInstructorProfile — manages instructor profile data with CRUD operations.
 */
export function useInstructorProfile() {
  const [, setTick] = useState(0)

  useEffect(() => {
    const listener = () => setTick(t => t + 1)
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, [])

  const profile = sharedProfile

  const updateProfile = useCallback((updates: Partial<InstructorProfile>) => {
    sharedProfile = {
      ...sharedProfile,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    emit()
  }, [])

  const updateBiography = useCallback((biography: string) => updateProfile({ biography }), [updateProfile])
  const updateEducationBackground = useCallback(
    (educationBackground: string) => updateProfile({ educationBackground }),
    [updateProfile]
  )

  const addResearchInterest = useCallback((interest: string) => {
    const exists = sharedProfile.researchInterests.some(r => r.toLowerCase() === interest.toLowerCase())
    if (exists) return
    sharedProfile = {
      ...sharedProfile,
      researchInterests: [...sharedProfile.researchInterests, interest],
      updatedAt: new Date().toISOString(),
    }
    emit()
  }, [])

  const removeResearchInterest = useCallback((interest: string) => {
    sharedProfile = {
      ...sharedProfile,
      researchInterests: sharedProfile.researchInterests.filter(r => r !== interest),
      updatedAt: new Date().toISOString(),
    }
    emit()
  }, [])

  const updateProfilePicture = useCallback((pictureUrl: string | null) => updateProfile({ profilePicture: pictureUrl }), [updateProfile])

  return {
    profile,
    updateProfile,
    updateBiography,
    updateEducationBackground,
    addResearchInterest,
    removeResearchInterest,
    updateProfilePicture,
  }
}
