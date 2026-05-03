import { useState } from 'react'
import { useInstructorSearch } from '../../../hooks/useInstructorSearch'

/**
 * InstructorDirectory – interface for searching and discovering course instructors.
 * Allows users to search by name, filter by course, and view instructor profiles.
 */
export default function InstructorDirectory() {
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [searchInputValue, setSearchInputValue] = useState('')
  
  const {
    searchQuery,
    selectedCourse,
    selectedInstructor,
    filteredResults,
    allCourses,
    setSearchQuery,
    setSelectedCourse,
    setSelectedInstructor,
    getCourseById
  } = useInstructorSearch()

  // Handler: Search
  const handleSearch = (value: string) => {
    setSearchInputValue(value)
    setSearchQuery(value)
  }

  // Handler: Select instructor to view details
  const handleSelectInstructor = (instructor: typeof filteredResults[0]) => {
    setSelectedInstructor(instructor)
    setShowDetailModal(true)
  }

  // Handler: Clear filters
  const handleClearFilters = () => {
    setSearchInputValue('')
    setSearchQuery('')
    setSelectedCourse(null)
  }

  // Get linked course names for instructor
  const getLinkedCourseNames = (instructorId: string) => {
    const instructor = filteredResults.find(i => i.instructorId === instructorId)
    if (!instructor) return []
    return instructor.linkedCourses
      .map(courseId => getCourseById(courseId))
      .filter(Boolean) as typeof allCourses
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-jakarta font-bold text-on-surface mb-2">
          Instructor Directory
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Search and discover course instructors at GUC
        </p>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm p-6 mb-8">
        {/* Search Input */}
        <div className="mb-6">
          <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
            Search by Name or Email
          </label>
          <input
            type="text"
            value={searchInputValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="e.g., Dr. Fatima or fatima.mansouri@guc.edu.eg"
            className="w-full px-4 py-3 border border-outline rounded-lg bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
        </div>

        {/* Course Filter */}
        <div className="mb-6">
          <label className="block text-sm font-jakarta font-semibold text-on-surface mb-2">
            Filter by Course (Optional)
          </label>
          <select
            value={selectedCourse || ''}
            onChange={(e) => setSelectedCourse(e.target.value || null)}
            className="w-full px-4 py-3 border border-outline rounded-lg bg-surface text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          >
            <option value="">All Courses</option>
            {allCourses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {(searchInputValue || selectedCourse) && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm font-jakarta font-semibold text-outline hover:bg-surface-container rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-body-md text-on-surface-variant">
          Found <span className="font-semibold text-on-surface">{filteredResults.length}</span> instructor
          {filteredResults.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Instructor Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.length > 0 ? (
          filteredResults.map(instructor => (
            <div
              key={instructor.instructorId}
              className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Instructor Card */}
              <div className="p-6">
                {/* Profile Picture Area */}
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-primary text-2xl font-jakarta font-bold">
                    {instructor.profilePicture ? (
                      <img
                        src={instructor.profilePicture}
                        alt={instructor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{instructor.name.charAt(0)}</span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                {instructor.rating && (
                  <div className="flex justify-center items-center gap-1 mb-3">
                    <span className="text-sm font-jakarta font-semibold text-on-surface">
                      {instructor.rating}
                    </span>
                    <span className="text-lg">⭐</span>
                  </div>
                )}

                {/* Name & Email */}
                <h3 className="text-lg font-jakarta font-bold text-on-surface text-center mb-1">
                  {instructor.name}
                </h3>
                <p className="text-sm text-on-surface-variant text-center mb-4">
                  {instructor.email}
                </p>

                {/* Bio Preview */}
                <p className="text-body-sm text-on-surface-variant mb-4 line-clamp-3">
                  {instructor.biography}
                </p>

                {/* Research Interests Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {instructor.researchInterests.slice(0, 2).map(interest => (
                      <span
                        key={interest}
                        className="px-2 py-1 text-xs font-lexend bg-primary-container/30 text-on-surface rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                    {instructor.researchInterests.length > 2 && (
                      <span className="px-2 py-1 text-xs font-lexend text-on-surface-variant">
                        +{instructor.researchInterests.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* View Profile Button */}
                <button
                  onClick={() => handleSelectInstructor(instructor)}
                  className="w-full px-4 py-2 bg-primary text-on-primary rounded-lg font-jakarta font-semibold hover:bg-primary-container transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-surface-container rounded-xl p-12 text-center">
            <p className="text-body-md text-on-surface-variant mb-2">
              No instructors found matching your search.
            </p>
            <button
              onClick={handleClearFilters}
              className="text-secondary hover:text-secondary-container font-jakarta font-semibold"
            >
              Clear filters and try again
            </button>
          </div>
        )}
      </div>

      {/* Instructor Detail Modal */}
      {showDetailModal && selectedInstructor && (
        <InstructorDetailModal
          instructor={selectedInstructor}
          linkedCourses={getLinkedCourseNames(selectedInstructor.instructorId)}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  )
}

/**
 * InstructorDetailModal – displays detailed instructor profile with all courses.
 * Shows biography, research interests, education, and linked courses.
 */
interface InstructorDetailModalProps {
  instructor: ReturnType<typeof useInstructorSearch>['selectedInstructor']
  linkedCourses: ReturnType<typeof useInstructorSearch>['allCourses']
  onClose: () => void
}

function InstructorDetailModal({
  instructor,
  linkedCourses,
  onClose
}: InstructorDetailModalProps) {
  if (!instructor) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-surface-container-lowest border-b border-surface-container-high p-6 flex justify-between items-center">
          <h2 className="text-2xl font-jakarta font-bold text-on-surface">
            Instructor Profile
          </h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface text-2xl"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center text-primary text-3xl font-jakarta font-bold">
                {instructor.profilePicture ? (
                  <img
                    src={instructor.profilePicture}
                    alt={instructor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{instructor.name.charAt(0)}</span>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-jakarta font-bold text-on-surface mb-1">
                {instructor.name}
              </h3>
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

          {/* Biography */}
          <div>
            <h4 className="text-lg font-jakarta font-bold text-on-surface mb-2">
              About
            </h4>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {instructor.biography}
            </p>
          </div>

          {/* Research Interests */}
          <div>
            <h4 className="text-lg font-jakarta font-bold text-on-surface mb-3">
              Research Interests
            </h4>
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

          {/* Linked Courses */}
          <div>
            <h4 className="text-lg font-jakarta font-bold text-on-surface mb-3">
              Linked Courses ({linkedCourses.length})
            </h4>
            <div className="space-y-2">
              {linkedCourses.length > 0 ? (
                linkedCourses.map(course => (
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
                ))
              ) : (
                <p className="text-body-sm text-on-surface-variant">
                  No courses linked yet.
                </p>
              )}
            </div>
          </div>

          {/* Contact Button */}
          <div className="pt-4 border-t border-surface-container-high">
            <button className="w-full px-4 py-2 bg-secondary text-on-secondary rounded-lg font-jakarta font-semibold hover:bg-secondary-container transition-colors">
              Send Message to Instructor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}