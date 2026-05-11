import { useSelector } from 'react-redux'
import type { RootState } from '../store'

/**
 * useCourses — reads courses from Redux store.
 */
export interface Course {
  id: string
  name: string
  code: string
}

export default function useCourses() {
  const courses = useSelector((state: RootState) => state.database.courses)

  const getCourseById = (id?: string): Course | undefined => {
    if (!id) return undefined
    return courses.find((c: Course) => c.id === id)
  }

  const getCourseByName = (name: string): Course | undefined => {
    return courses.find((c: Course) => c.name === name)
  }

  return {
    courses,
    getCourseById,
    getCourseByName,
  }
}
