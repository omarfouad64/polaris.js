import { useState, useCallback } from 'react'
import type { Course, CourseLink } from '../types'

// Dummy course data
const DUMMY_COURSES: Course[] = [
  {
    id: 'course-001',
    name: 'Web Development Fundamentals',
    code: 'CS 101',
    semester: 'Fall 2024',
    description: 'Introduction to web development with HTML, CSS, and JavaScript'
  },
  {
    id: 'course-002',
    name: 'Advanced React',
    code: 'CS 302',
    semester: 'Spring 2025',
    description: 'Advanced concepts in React including hooks, state management, and performance'
  },
  {
    id: 'bachelor-project',
    name: 'Bachelor Project',
    code: 'CS 499',
    semester: 'Spring 2025',
    description: 'Capstone project for Computer Science majors'
  },
  {
    id: 'course-003',
    name: 'Database Systems',
    code: 'CS 201',
    semester: 'Fall 2024',
    description: 'Relational databases, SQL, and database design principles'
  },
  {
    id: 'course-004',
    name: 'Software Engineering',
    code: 'CS 250',
    semester: 'Spring 2025',
    description: 'Software development methodologies, design patterns, and project management'
  }
]

// Dummy course links
const DUMMY_COURSE_LINKS: CourseLink[] = [
  { instructorId: 'instructor-001', courseId: 'course-001', status: 'linked', linkedAt: new Date('2023-08-01').toISOString() },
  { instructorId: 'instructor-001', courseId: 'course-002', status: 'linked', linkedAt: new Date('2024-01-15').toISOString() },
  { instructorId: 'instructor-001', courseId: 'bachelor-project', status: 'linked', linkedAt: new Date('2023-09-01').toISOString() }
]

/**
 * useCourseLinks – manages course linking and unlinking for instructors.
 * Provides access to available courses, linked courses, and link/unlink operations.
 *
 * @param instructorId - The ID of the instructor
 * @returns Object containing courses, linked courses, and link/unlink functions.
 */
export function useCourseLinks(instructorId: string) {
  const [courseLinks, setCourseLinks] = useState<CourseLink[]>(DUMMY_COURSE_LINKS)
  const [courses] = useState<Course[]>(DUMMY_COURSES)

  // Get all linked course IDs
  const linkedCourseIds = courseLinks
    .filter(link => link.instructorId === instructorId && link.status === 'linked')
    .map(link => link.courseId)

  // Get linked courses with full details
  const linkedCourses = courses.filter(course => linkedCourseIds.includes(course.id))

  // Get available courses (not yet linked)
  const availableCourses = courses.filter(course => !linkedCourseIds.includes(course.id))

  const linkCourse = useCallback((courseId: string) => {
    setCourseLinks(prev => {
      // Check if already linked
      const existingLink = prev.find(
        link => link.instructorId === instructorId && link.courseId === courseId
      )

      if (existingLink) {
        // Update existing link to 'linked'
        return prev.map(link =>
          link.instructorId === instructorId && link.courseId === courseId
            ? { ...link, status: 'linked', linkedAt: new Date().toISOString() }
            : link
        )
      }

      // Create new link
      return [
        ...prev,
        {
          instructorId,
          courseId,
          status: 'linked',
          linkedAt: new Date().toISOString()
        }
      ]
    })
  }, [instructorId])

  const unlinkCourse = useCallback((courseId: string) => {
    setCourseLinks(prev =>
      prev.map(link =>
        link.instructorId === instructorId && link.courseId === courseId
          ? { ...link, status: 'rejected', linkedAt: new Date().toISOString() }
          : link
      )
    )
  }, [instructorId])

  const requestLink = useCallback((courseId: string) => {
    setCourseLinks(prev => {
      const existingLink = prev.find(
        link => link.instructorId === instructorId && link.courseId === courseId
      )

      if (existingLink) {
        return prev.map(link =>
          link.instructorId === instructorId && link.courseId === courseId
            ? { ...link, status: 'pending' }
            : link
        )
      }

      return [
        ...prev,
        {
          instructorId,
          courseId,
          status: 'pending',
          linkedAt: new Date().toISOString()
        }
      ]
    })
  }, [instructorId])

  return {
    courses,
    linkedCourses,
    availableCourses,
    courseLinks,
    linkCourse,
    unlinkCourse,
    requestLink
  }
}