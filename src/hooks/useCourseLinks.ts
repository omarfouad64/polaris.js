import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import useDatabase from './useDatabase'
import type { Course, CourseLink } from '../types'

/**
 * useCourseLinks — reads course links from Redux store.
 */
export function useCourseLinks(instructorId: string) {
  const dispatch = useDispatch()
  const { courseLinks, courses } = useDatabase() as { courseLinks: CourseLink[]; courses: Course[] }

  const linkedCourseIds = courseLinks
    .filter(link => link.instructorId === instructorId && link.status === 'linked')
    .map(link => link.courseId)

  const linkedCourses = courses.filter(course => linkedCourseIds.includes(course.id))
  const availableCourses = courses.filter(course => !linkedCourseIds.includes(course.id))

  const linkCourse = useCallback((courseId: string) => {
    dispatch({
      type: 'database/updateDatabase',
      payload: {
        courseLinks: [...courseLinks, {
          instructorId,
          courseId,
          status: 'linked' as const,
          linkedAt: new Date().toISOString(),
        }],
      },
    })
  }, [dispatch, courseLinks, instructorId])

  const unlinkCourse = useCallback((courseId: string) => {
    const updated = courseLinks.map(link =>
      link.instructorId === instructorId && link.courseId === courseId
        ? { ...link, status: 'rejected' as const, linkedAt: new Date().toISOString() }
        : link
    )
    dispatch({ type: 'database/updateDatabase', payload: { courseLinks: updated } })
  }, [dispatch, courseLinks, instructorId])

  const requestLink = useCallback((courseId: string) => {
    const updated = [...courseLinks]
    const idx = updated.findIndex(l => l.instructorId === instructorId && l.courseId === courseId)
    if (idx >= 0) {
      updated[idx] = { ...updated[idx], status: 'pending' as const, direction: 'link' as const }
    } else {
      updated.push({
        instructorId,
        courseId,
        status: 'pending' as const,
        direction: 'link' as const,
        linkedAt: new Date().toISOString(),
      })
    }
    dispatch({ type: 'database/updateDatabase', payload: { courseLinks: updated } })
  }, [dispatch, courseLinks, instructorId])

  const requestUnlink = useCallback((courseId: string) => {
    const updated = [...courseLinks]
    const idx = updated.findIndex(l => l.instructorId === instructorId && l.courseId === courseId)
    if (idx >= 0) {
      updated[idx] = { ...updated[idx], status: 'pending' as const, direction: 'unlink' as const }
    } else {
      updated.push({
        instructorId,
        courseId,
        status: 'pending' as const,
        direction: 'unlink' as const,
        linkedAt: new Date().toISOString(),
      })
    }
    dispatch({ type: 'database/updateDatabase', payload: { courseLinks: updated } })
  }, [dispatch, courseLinks, instructorId])

  return {
    courses,
    linkedCourses,
    availableCourses,
    courseLinks,
    linkCourse,
    unlinkCourse,
    requestLink,
    requestUnlink,
  }
}
