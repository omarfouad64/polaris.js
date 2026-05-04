import { useState, useCallback, useMemo } from 'react'

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

// Dummy instructor data for search
const DUMMY_INSTRUCTORS: InstructorSearchResult[] = [
  {
    instructorId: 'instructor-001',
    name: 'Dr. Fatima Al-Mansouri',
    email: 'fatima.mansouri@guc.edu.eg',
    biography: 'PhD in Computer Science from Cairo University. Specializing in software engineering and web technologies. Over 10 years of academic experience.',
    researchInterests: ['Web Development', 'Software Engineering', 'Cloud Computing'],
    educationBackground: 'PhD in Computer Science (Cairo University), M.Sc. in Information Systems (AUC).',
    linkedCourses: ['course-001', 'course-002', 'bachelor-project'],
    profilePicture: null,
    rating: 4.8
  },
  {
    instructorId: 'instructor-002',
    name: 'Prof. Ahmed Hassan',
    email: 'ahmed.hassan@guc.edu.eg',
    biography: 'Expert in database systems and data science. Published numerous papers on distributed databases and big data analytics.',
    researchInterests: ['Database Systems', 'Data Science', 'Big Data'],
    educationBackground: 'PhD in Computer Engineering (GUC), M.Sc. in Data Science (AUC).',
    linkedCourses: ['course-003', 'course-004', 'bachelor-project'],
    profilePicture: null,
    rating: 4.6
  },
  {
    instructorId: 'instructor-003',
    name: 'Dr. Layla Ibrahim',
    email: 'layla.ibrahim@guc.edu.eg',
    biography: 'Focused on cybersecurity and network security. Collaborates with industry leaders on cutting-edge security solutions.',
    researchInterests: ['Cybersecurity', 'Network Security', 'Encryption'],
    educationBackground: 'PhD in Information Security (Cairo University), B.Sc. in Computer Science (GUC).',
    linkedCourses: ['course-005', 'bachelor-project'],
    profilePicture: null,
    rating: 4.7
  },
  {
    instructorId: 'instructor-004',
    name: 'Prof. Mohammed Al-Aziz',
    email: 'mohammed.aziz@guc.edu.eg',
    biography: 'Passionate about AI and machine learning. Leads research group in deep learning applications for healthcare.',
    researchInterests: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning'],
    educationBackground: 'PhD in Artificial Intelligence (MIT), M.Sc. in Software Engineering (GUC).',
    linkedCourses: ['course-006', 'bachelor-project'],
    profilePicture: null,
    rating: 4.9
  },
  {
    instructorId: 'instructor-005',
    name: 'Dr. Sarah Al-Rashid',
    email: 'sarah.rashid@guc.edu.eg',
    biography: 'Specializes in mobile app development and user experience design. Industry experience with leading tech companies.',
    researchInterests: ['Mobile Development', 'UX Design', 'Human-Computer Interaction'],
    educationBackground: 'PhD in HCI (TU Munich), B.Sc. in Computer Engineering (GUC).',
    linkedCourses: ['course-001', 'bachelor-project'],
    profilePicture: null,
    rating: 4.5
  }
]

// Dummy course data
export interface CourseData {
  id: string
  name: string
  code: string
}

const DUMMY_COURSES: CourseData[] = [
  { id: 'course-001', name: 'Web Development Fundamentals', code: 'CS 101' },
  { id: 'course-002', name: 'Advanced React', code: 'CS 302' },
  { id: 'course-003', name: 'Database Systems', code: 'CS 201' },
  { id: 'course-004', name: 'Data Science Fundamentals', code: 'CS 210' },
  { id: 'course-005', name: 'Cybersecurity Essentials', code: 'CS 350' },
  { id: 'course-006', name: 'Machine Learning', code: 'CS 400' },
  { id: 'bachelor-project', name: 'Bachelor Project', code: 'CS 499' }
]

/**
 * useInstructorSearch – manages instructor search, filtering, and discovery.
 * Provides methods to search instructors by name/email and filter by course.
 *
 * @returns Object containing search results, filters, and search functions.
 */
export function useInstructorSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorSearchResult | null>(null)

  // Search instructors by name or email
  const searchByNameOrEmail = useCallback((query: string): InstructorSearchResult[] => {
    if (!query.trim()) return DUMMY_INSTRUCTORS

    const lowerQuery = query.toLowerCase()
    return DUMMY_INSTRUCTORS.filter(instructor =>
      instructor.name.toLowerCase().includes(lowerQuery) ||
      instructor.email.toLowerCase().includes(lowerQuery)
    )
  }, [])

  // Filter instructors by course
  const filterByCourse = useCallback((courseId: string, instructors: InstructorSearchResult[]): InstructorSearchResult[] => {
    if (!courseId) return instructors
    return instructors.filter(instructor => instructor.linkedCourses.includes(courseId))
  }, [])

  // Compute filtered results
  const filteredResults = useMemo(() => {
    let results = searchByNameOrEmail(searchQuery)
    if (selectedCourse) {
      results = filterByCourse(selectedCourse, results)
    }
    return results
  }, [searchQuery, selectedCourse, searchByNameOrEmail, filterByCourse])

  // Get course details by ID
  const getCourseById = useCallback((courseId: string): CourseData | undefined => {
    return DUMMY_COURSES.find(course => course.id === courseId)
  }, [])

  return {
    // State
    searchQuery,
    selectedCourse,
    selectedInstructor,
    filteredResults,
    allInstructors: DUMMY_INSTRUCTORS,
    allCourses: DUMMY_COURSES,
    
    // Actions
    setSearchQuery,
    setSelectedCourse,
    setSelectedInstructor,
    searchByNameOrEmail,
    filterByCourse,
    getCourseById
  }
}