import { useMemo, useState, useCallback } from 'react'
import useStudentProjects from '../pages/portal/student/projects/scripts/useStudentProjects'
import useCourses from './useCourses'

export interface ProjectFilters {
  query: string
  courseId: string
  instructorId: string
  dateFrom: string
  dateTo: string
  sortBy: 'date_desc' | 'date_asc' | 'rating_desc'
}

/**
 * useProjectSearch — reads projects from useStudentProjects (which will use Redux).
 */
export default function useProjectSearch() {
  const { projects: allStudentProjects } = useStudentProjects()
  const { getCourseById } = useCourses()

  const [filters, setFilters] = useState<ProjectFilters>({
    query: '',
    courseId: 'all',
    instructorId: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date_desc',
  })

  const filteredProjects = useMemo(() => {
    let result = [...allStudentProjects].filter((p: any) => (p as any).isPublic)
    if (filters.query) {
      const q = filters.query.toLowerCase()
      result = result.filter((p: any) =>
        p.title.toLowerCase().includes(q) || (p.projectReport || '').toLowerCase().includes(q)
      )
    }
    if (filters.courseId !== 'all') {
      result = result.filter((p: any) => p.course === filters.courseId)
    }
    if (filters.dateFrom) {
      result = result.filter((p: any) => p.createdDate >= filters.dateFrom)
    }
    if (filters.dateTo) {
      result = result.filter((p: any) => p.createdDate <= filters.dateTo)
    }
    result.sort((a: any, b: any) => {
      if (filters.sortBy === 'date_desc') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      if (filters.sortBy === 'date_asc') return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      return 0
    })
    return result
  }, [allStudentProjects, filters])

  const updateFilters = useCallback((updates: Partial<ProjectFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }, [])

  return {
    projects: filteredProjects,
    filters,
    updateFilters,
    getCourseById,
  }
}
