import { useCallback, useMemo } from 'react'
import useDatabase from '../../../../../hooks/useDatabase'
import {
  addCourse as addCourseAction,
  editCourse as editCourseAction,
  deleteCourse as deleteCourseAction
} from '../../../../../store/databaseSlice'
import type { Course as DBCourse } from '../../../../../types'

export interface Course {
  id: string
  code: string
  name: string
  instructorsCount: number
}

export function useCourses() {
  const { courses: dbCourses, courseLinks, dispatch } = useDatabase()

  const courses = useMemo((): Course[] => {
    return dbCourses.map(c => ({
      id: c.id,
      code: c.code,
      name: c.name,
      instructorsCount: courseLinks.filter(l => l.courseId === c.id && l.status === 'linked').length
    }))
  }, [dbCourses, courseLinks])

  const addCourse = useCallback((data: { code: string; name: string }) => {
    const newCourse: DBCourse = {
      id: `course-${Date.now()}`,
      code: data.code,
      name: data.name,
      semester: 'Fall 2026', // Default or could be passed
      description: ''
    }
    dispatch(addCourseAction(newCourse))
  }, [dispatch])

  const editCourse = useCallback((id: string, data: { code: string; name: string }) => {
    dispatch(editCourseAction({ id, code: data.code, name: data.name }))
  }, [dispatch])

  const deleteCourse = useCallback((id: string) => {
    dispatch(deleteCourseAction(id))
  }, [dispatch])

  return {
    courses,
    addCourse,
    editCourse,
    deleteCourse
  }
}

