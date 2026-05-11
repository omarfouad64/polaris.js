import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../../../globalContext'
import { useInstructorSearch } from '../../../hooks/useInstructorSearch'

type InstructorSection = 'about' | 'research' | 'education'

const INSTRUCTOR_SECTIONS: { id: InstructorSection; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research Interests' },
  { id: 'education', label: 'Education' }
]

export default function InstructorProfileViewPage(): React.JSX.Element {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useGlobalContext()
  const [activeSection, setActiveSection] = useState<InstructorSection>('about')
  const [backLabel, setBackLabel] = useState<string>('Go Back')
  const { allInstructors, getCourseById } = useInstructorSearch()

  useEffect(() => {
    if (!localStorage.getItem('polaris_back_label')) {
      let newLabel = 'Go Back'
      if (location.pathname.includes('/instructor/oversight') || location.pathname.includes('/instructor/projects')) newLabel = 'Back to Oversight'
      else if (location.pathname.includes('/student/projects')) newLabel = 'Back to My Projects'
      else if (location.pathname.includes('/employer/internships') || location.pathname.includes('/employer/profile')) newLabel = 'Back to Internships'
      else if (location.pathname.includes('/administrator')) newLabel = 'Back to Dashboard'
      else if (location.pathname.includes('/search')) newLabel = 'Back to Search'
      localStorage.setItem('polaris_back_label', newLabel)
    }
    setBackLabel(localStorage.getItem('polaris_back_label') || 'Go Back')
  }, [location.pathname])

  const handleBack = () => {
    navigate(-1)
  }

  const instructor = useMemo(() => {
    return allInstructors.find(item => item.instructorId === id) ?? null
  }, [allInstructors, id])

  const linkedCourses = useMemo(() => {
    if (!instructor) return []
    return instructor.linkedCourses
      .map(courseId => getCourseById(courseId))
      .filter((course): course is NonNullable<typeof course> => Boolean(course))
  }, [instructor, getCourseById])

  if (!instructor) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-8">
        <h2 className="text-2xl font-jakarta font-bold text-on-surface mb-2">Instructor not found</h2>
        <p className="text-sm font-lexend text-on-surface-variant mb-6">
          We could not find the requested instructor profile.
        </p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-primary text-on-primary rounded-lg font-jakarta font-semibold hover:bg-primary-container transition-colors"
        >
          Back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-lexend text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {backLabel}
        </button>
        <div>
          <h1 className="text-3xl font-jakarta font-bold text-on-surface">Instructor Profile</h1>
          <p className="text-sm font-lexend text-on-surface-variant">Detailed instructor profile and linked courses.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-surface-container-high">
          <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center text-primary text-3xl font-jakarta font-bold overflow-hidden">
            {instructor.profilePicture ? (
              <img src={instructor.profilePicture} alt={instructor.name} className="w-full h-full object-cover" />
            ) : (
              <span>{instructor.name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-jakarta font-bold text-on-surface mb-1">
              {instructor.name}
            </h2>
            <p className="text-body-md text-on-surface-variant mb-2">
              {instructor.email}
            </p>
            {instructor.rating && (
              <div className="flex items-center gap-1">
                <span className="text-lg">⭐</span>
                <span className="font-jakarta font-semibold text-on-surface">
                  {instructor.rating}/5
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 border-b border-surface-container-high overflow-x-auto">
          {INSTRUCTOR_SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-3 font-jakarta font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${
                activeSection === section.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {activeSection === 'about' && (
          <div className="space-y-4">
            <h3 className="text-lg font-jakarta font-bold text-on-surface">About</h3>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {instructor.biography}
            </p>
          </div>
        )}

        {activeSection === 'research' && (
          <div className="space-y-4">
            <h3 className="text-lg font-jakarta font-bold text-on-surface">Research Interests</h3>
            <div className="flex flex-wrap gap-2">
              {instructor.researchInterests.map(interest => (
                <span
                  key={interest}
                  className="px-3 py-1 text-sm font-lexend bg-primary-container text-on-primary-container rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'education' && (
          <div className="space-y-4">
            <h3 className="text-lg font-jakarta font-bold text-on-surface">Education</h3>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {instructor.educationBackground ?? 'Education background not provided.'}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-lg font-jakarta font-bold text-on-surface">
            Linked Courses ({linkedCourses.length})
          </h3>
          {linkedCourses.length > 0 ? (
            <div className="space-y-2">
              {linkedCourses.map(course => (
                <div
                  key={course.id}
                  className="p-3 bg-surface-container rounded-lg border border-surface-container-high"
                >
                  <p className="text-sm font-jakarta font-semibold text-on-surface">
                    {course.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {course.code}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-body-sm text-on-surface-variant">No courses linked yet.</p>
          )}
        </div>

        <div className="pt-4 border-t border-surface-container-high">
          <button className="w-full px-4 py-2 bg-secondary text-on-secondary rounded-lg font-jakarta font-semibold hover:bg-secondary-container transition-colors">
            Send Message to Instructor
          </button>
        </div>
      </div>
    </div>
  )
}
