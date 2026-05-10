import { useMemo, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import type { InstructorProfile } from '../types'

export interface InstructorSearchResult {
  instructorId: string
  name: string
  email: string
  biography: string
  researchInterests: string[]
  educationBackground: string
  linkedCourses: string[]
  profilePicture: string | null
  rating?: number
}

export interface CourseData {
  id: string
  name: string
  code: string
}

/**
 * useInstructorSearch — reads instructors and courses from Redux store.
 */
export function useInstructorSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorSearchResult | null>(null)

  const instructors = useSelector((state: RootState) => state.database.instructors) as InstructorProfile[]
  const courses = useSelector((state: RootState) => state.database.courses)

  const searchByNameOrEmail = useCallback((query: string): InstructorSearchResult[] => {
    if (!query.trim()) return instructors as unknown as InstructorSearchResult[]
    const lower = query.toLowerCase()
    return instructors.filter(
      (i: InstructorProfile) =>
        i.name.toLowerCase().includes(lower) || i.email.toLowerCase().includes(lower)
    ) as unknown as InstructorSearchResult[]
  }, [instructors])

  const filterByCourse = useCallback(
    (courseId: string, ins: InstructorSearchResult[]): InstructorSearchResult[] => {
      if (!courseId) return ins
      return ins.filter(i => i.linkedCourses.includes(courseId))
    },
    []
  )

  const filteredResults = useMemo(() => {
    let r = searchByNameOrEmail(searchQuery)
    if (selectedCourse) r = filterByCourse(selectedCourse, r)
    return r
  }, [searchQuery, selectedCourse, searchByNameOrEmail, filterByCourse])

  const allCourses: CourseData[] = courses.map(c => ({
    id: c.id,
    name: c.name,
    code: c.code,
  }))

  const getCourseById = useCallback(
    (courseId: string) => allCourses.find(c => c.id === courseId),
    [allCourses]
  )

  return {
    searchQuery,
    selectedCourse,
    selectedInstructor,
    filteredResults,
    allInstructors: instructors as unknown as InstructorSearchResult[],
    allCourses,
    setSearchQuery,
    setSelectedCourse,
    setSelectedInstructor,
    searchByNameOrEmail,
    filterByCourse,
    getCourseById,
  }
}
