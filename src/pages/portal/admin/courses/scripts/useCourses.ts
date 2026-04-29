import { useState } from 'react'

export interface Course {
  id: string
  code: string
  name: string
  instructorsCount: number
}

const dummyCourses: Course[] = [
  { id: 'c1', code: 'CS311', name: 'Software Engineering', instructorsCount: 3 },
  { id: 'c2', code: 'CS341', name: 'Web Programming', instructorsCount: 2 },
  { id: 'c3', code: 'CS412', name: 'Project Management', instructorsCount: 1 },
  { id: 'c4', code: 'IS498', name: 'Bachelor Project', instructorsCount: 5 },
]

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>(dummyCourses)

  const addCourse = (data: { code: string; name: string }) => {
    const newCourse: Course = {
      id: Math.random().toString(36).substring(7),
      code: data.code,
      name: data.name,
      instructorsCount: 0
    }
    setCourses([...courses, newCourse])
  }

  const editCourse = (id: string, data: { code: string; name: string }) => {
    setCourses(courses.map(c => c.id === id ? { ...c, code: data.code, name: data.name } : c))
  }

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id))
  }

  return {
    courses,
    addCourse,
    editCourse,
    deleteCourse
  }
}
