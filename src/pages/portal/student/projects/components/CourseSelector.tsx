import useCourses from 'src/hooks/useCourses';

interface CourseSelectorProps {
  selectedCourse: string;
  onSelectCourse: (courseId: string) => void;
  disabled?: boolean;
}

/**
 * CourseSelector — Dropdown to select a course for the project.
 *
 * @param selectedCourse - Currently selected course ID.
 * @param onSelectCourse - Callback when course selection changes.
 * @param disabled - Optional disabled state.
 */
export default function CourseSelector({
  selectedCourse,
  onSelectCourse,
  disabled = false,
}: CourseSelectorProps) {
  const { courses } = useCourses();

  return (
    <select
      value={selectedCourse}
      onChange={(e) => onSelectCourse(e.target.value)}
      disabled={disabled}
      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-base font-lexend text-on-surface placeholder:text-outline focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="">Select a course</option>
      {courses.map((course) => (
        <option key={course.id} value={course.id}>
          {course.name} ({course.code})
        </option>
      ))}
    </select>
  );
}
