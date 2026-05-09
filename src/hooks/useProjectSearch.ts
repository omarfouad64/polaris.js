import { useState, useMemo, useCallback } from 'react'
import useStudentProjects, { type ProjectData } from '../pages/portal/student/projects/scripts/useStudentProjects'
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
 * useProjectSearch — hook for searching, filtering, and sorting projects.
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
    sortBy: 'date_desc'
  })

  // In a real app, this would fetch from an API. 
  // For now, we use the student projects as a global pool of projects.
  const filteredProjects = useMemo(() => {
    let result = [...allStudentProjects].filter(p => p.isPublic) // Only public projects in search

    if (filters.query) {
      const q = filters.query.toLowerCase()
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.projectReport.toLowerCase().includes(q)
      )
    }

    if (filters.courseId !== 'all') {
      result = result.filter(p => p.course === filters.courseId)
    }

    // Filter by date
    if (filters.dateFrom) {
      result = result.filter(p => p.createdDate >= filters.dateFrom)
    }
    if (filters.dateTo) {
      result = result.filter(p => p.createdDate <= filters.dateTo)
    }

    // Sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'date_desc') {
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      }
      if (filters.sortBy === 'date_asc') {
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      }
      // Placeholder for rating sort (Req 45)
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
    getCourseById
  }
}
