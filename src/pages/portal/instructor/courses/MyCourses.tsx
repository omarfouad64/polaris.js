import { useState } from 'react'
import { useCourseLinks } from '../../../../hooks/useCourseLinks'
import { useGlobalContext } from '../../../../globalContext'
import FeedbackDialog from '../../../../components/FeedbackDialog'

/**
 * MyCourses – allows instructors to view, link, and unlink courses.
 * Displays linked and available courses with link/unlink actions.
 * Shows automatic Bachelor Project link for all instructors.
 */
export default function MyCourses() {
  // State management
  const [activeTab, setActiveTab] = useState<'linked' | 'available'>('linked')
  const [feedback, setFeedback] = useState<{ title: string; message: string } | null>(null)
  
  // Get current user's ID (for demo purposes, using a fixed ID)
  const { user } = useGlobalContext()
  const instructorId = user?.username || 'instructor-001'

  // Hook for course links
  const {
    linkedCourses,
    availableCourses,
    linkCourse,
    unlinkCourse
  } = useCourseLinks(instructorId)

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-jakarta font-bold text-on-surface mb-2">
          My Courses
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Manage your course associations and link requests
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 border-b border-surface-container-high">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('linked')}
            className={`px-4 py-3 font-jakarta font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'linked'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Linked Courses ({linkedCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-3 font-jakarta font-semibold text-sm transition-all border-b-2 ${
              activeTab === 'available'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Available Courses ({availableCourses.length})
          </button>
        </div>
      </div>

      {/* LINKED COURSES TAB */}
      {activeTab === 'linked' && (
        <div className="space-y-4">
          {linkedCourses.length > 0 ? (
            linkedCourses.map(course => (
              <div
                key={course.id}
                className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Course Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-jakarta font-bold text-on-surface">
                        {course.name}
                      </h3>
                      {course.id === 'bachelor-project' && (
                        <span className="px-2 py-1 text-xs font-jakarta font-semibold bg-secondary-container text-on-secondary-container rounded-full">
                          Auto-Linked
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-lexend text-on-surface-variant mb-1">
                      Code: <span className="font-semibold">{course.code}</span>
                    </p>
                    <p className="text-body-sm text-on-surface-variant mb-2">
                      {course.description}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      Semester: {course.semester}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    {course.id !== 'bachelor-project' && (
                      <button
                        onClick={() => {
                          unlinkCourse(course.id)
                          setFeedback({
                            title: 'Course Unlinked',
                            message: `"${course.name}" has been removed from your linked courses.`
                          })
                        }}
                        className="px-4 py-2 text-sm font-jakarta font-semibold text-error hover:bg-error/10 rounded-lg transition-colors"
                      >
                        Unlink
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-surface-container rounded-xl p-8 text-center">
              <p className="text-body-md text-on-surface-variant">
                No linked courses yet. Link a course from the "Available Courses" tab.
              </p>
            </div>
          )}
        </div>
      )}

      {/* AVAILABLE COURSES TAB */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {availableCourses.length > 0 ? (
            availableCourses.map(course => (
              <div
                key={course.id}
                className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Course Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-jakarta font-bold text-on-surface mb-2">
                      {course.name}
                    </h3>
                    <p className="text-sm font-lexend text-on-surface-variant mb-1">
                      Code: <span className="font-semibold">{course.code}</span>
                    </p>
                    <p className="text-body-sm text-on-surface-variant mb-2">
                      {course.description}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      Semester: {course.semester}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    <button
                      onClick={() => {
                        linkCourse(course.id)
                        setFeedback({
                          title: 'Course Linked',
                          message: `"${course.name}" has been added to your linked courses.`
                        })
                      }}
                      className="px-4 py-2 text-sm font-jakarta font-semibold bg-secondary text-on-secondary hover:bg-secondary-container rounded-lg transition-colors"
                    >
                      Link Course
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-surface-container rounded-xl p-8 text-center">
              <p className="text-body-md text-on-surface-variant">
                All available courses are already linked!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Note Box */}
      <div className="mt-8 bg-primary-container/20 rounded-xl p-6 border border-primary/10">
        <h3 className="font-jakarta font-semibold text-on-surface mb-2">📌 Important Note</h3>
        <p className="text-body-sm text-on-surface-variant">
          All instructors are automatically linked to the "Bachelor Project" course. 
          You can link to other courses as needed. Course linking requests require administrator approval.
        </p>
      </div>

      <FeedbackDialog
        isOpen={!!feedback}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        actionLabel="OK"
        onClose={() => setFeedback(null)}
      />
    </div>
  )
}