import { useState } from 'react';

export interface Course {
  id: string;
  name: string;
  code: string;
}

const DUMMY_COURSES: Course[] = [
  { id: 'course-001', name: 'Bachelor Project', code: 'BP' },
  { id: 'course-002', name: 'Web Development', code: 'WD101' },
  { id: 'course-003', name: 'Mobile Development', code: 'MD201' },
  { id: 'course-004', name: 'Machine Learning', code: 'ML301' },
  { id: 'course-005', name: 'Database Systems', code: 'DB102' },
  { id: 'course-006', name: 'Cloud Computing', code: 'CC202' },
  { id: 'course-007', name: 'Data Structures', code: 'DS101' },
  { id: 'course-008', name: 'Algorithms', code: 'ALG102' },
];

/**
 * useCourses — Provides a global list of courses available for project selection.
 *
 * @returns Course list and lookup function.
 */
export default function useCourses() {
  const [courses] = useState<Course[]>(DUMMY_COURSES);

  const getCourseById = (id: string): Course | undefined => {
    return courses.find((c) => c.id === id);
  };

  const getCourseByName = (name: string): Course | undefined => {
    return courses.find((c) => c.name === name);
  };

  return {
    courses,
    getCourseById,
    getCourseByName,
  };
}
