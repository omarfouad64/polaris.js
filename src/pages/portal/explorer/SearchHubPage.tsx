import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../../globalContext'
import { useInstructorSearch } from '../../../hooks/useInstructorSearch'
import useProjectSearch from '../../../hooks/useProjectSearch'
import usePortfolioSearch from '../../../hooks/usePortfolioSearch'
import useCourses from '../../../hooks/useCourses'

/**
 * SearchHubPage — unified search hub with shared filters and sectioned results.
 */
export default function SearchHubPage(): React.JSX.Element {
  const { user } = useGlobalContext()
  const navigate = useNavigate()
  const rolePath = user?.role === 'Course Instructor'
    ? 'instructor'
    : user?.role === 'Administrator'
      ? 'administrator'
      : user?.role === 'Employer'
        ? 'employer'
        : 'student'

  const [searchQuery, setSearchQuery] = useState('')
  const {
    filteredResults,
    allInstructors,
    allCourses,
    selectedCourse,
    setSearchQuery: setInstructorQuery,
    setSelectedCourse
  } = useInstructorSearch()

  const { projects, filters: projectFilters, updateFilters } = useProjectSearch()
  const { courses, getCourseById } = useCourses()

  const {
    portfolios,
    recommendedPortfolios,
    filters: portfolioFilters,
    availableMajors,
    availableSkills,
    updateFilters: updatePortfolioFilters
  } = usePortfolioSearch()

  useEffect(() => {
    setInstructorQuery(searchQuery)
    updateFilters({ query: searchQuery })
    updatePortfolioFilters({ query: searchQuery })
  }, [searchQuery, setInstructorQuery, updateFilters, updatePortfolioFilters])

  const isDefaultSearch =
    !searchQuery.trim() &&
    !selectedCourse &&
    projectFilters.courseId === 'all' &&
    !projectFilters.dateFrom &&
    !projectFilters.dateTo &&
    projectFilters.sortBy === 'date_desc' &&
    portfolioFilters.major === 'all' &&
    portfolioFilters.skill === 'all'

  const recommendedInstructors = useMemo(() => {
    return [...allInstructors]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 3)
  }, [allInstructors])

  const recommendedProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
      .slice(0, 3)
  }, [projects])

  const handleViewProject = (id: string) => {
    window.location.assign(`/portal/${rolePath}/projects/${id}/view`)
  }

  const handleViewInstructor = (id: string) => {
    window.location.assign(`/portal/${rolePath}/instructors/${id}`)
  }

  const instructorResults = isDefaultSearch ? recommendedInstructors : filteredResults
  const projectResults = isDefaultSearch ? recommendedProjects : projects
  const portfolioResults = isDefaultSearch ? recommendedPortfolios : portfolios

  const [activePortfolio, setActivePortfolio] = useState<
    ReturnType<typeof usePortfolioSearch>['portfolios'][number] | null
  >(null)

  return (
    <div className="space-y-6 h-full">
      <div>
        <h1 className="text-3xl font-jakarta font-bold text-on-surface">Search</h1>
        <p className="text-sm font-lexend text-on-surface-variant">
          Explore instructors, projects, and portfolios from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:h-full lg:overflow-hidden">
        {/* Filters */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-5" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
            <h3 className="text-sm font-jakarta font-semibold text-on-surface mb-3">Search</h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-lexend text-sm text-on-surface placeholder:text-outline focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors"
                placeholder="Search everything..."
              />
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-5 space-y-4" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
            <h3 className="text-sm font-jakarta font-semibold text-on-surface">Instructor Filters</h3>
            <div>
              <label className="text-xs font-jakarta font-semibold text-on-surface-variant uppercase tracking-wider">
                Course
              </label>
              <select
                value={selectedCourse ?? ''}
                onChange={(e) => setSelectedCourse(e.target.value || null)}
                className="w-full mt-1 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm font-lexend text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20"
              >
                <option value="">All Courses</option>
                {allCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-5 space-y-4" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
            <h3 className="text-sm font-jakarta font-semibold text-on-surface">Project Filters</h3>
            <div>
              <label className="text-xs font-jakarta font-semibold text-on-surface-variant uppercase tracking-wider">
                Course
              </label>
              <select
                value={projectFilters.courseId}
                onChange={(e) => updateFilters({ courseId: e.target.value })}
                className="w-full mt-1 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm font-lexend text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-jakarta font-semibold text-on-surface-variant uppercase tracking-wider">
                  From
                </label>
                <input
                  type="date"
                  value={projectFilters.dateFrom}
                  onChange={(e) => updateFilters({ dateFrom: e.target.value })}
                  className="w-full mt-1 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm font-lexend text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20"
                />
              </div>
              <div>
                <label className="text-xs font-jakarta font-semibold text-on-surface-variant uppercase tracking-wider">
                  To
                </label>
                <input
                  type="date"
                  value={projectFilters.dateTo}
                  onChange={(e) => updateFilters({ dateTo: e.target.value })}
                  className="w-full mt-1 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm font-lexend text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-jakarta font-semibold text-on-surface-variant uppercase tracking-wider">
                Sort
              </label>
              <select
                value={projectFilters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value as typeof projectFilters.sortBy })}
                className="w-full mt-1 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm font-lexend text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20"
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="rating_desc">Highest Rated</option>
              </select>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-5 space-y-4" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
            <h3 className="text-sm font-jakarta font-semibold text-on-surface">Portfolio Filters</h3>
            <div>
              <label className="text-xs font-jakarta font-semibold text-on-surface-variant uppercase tracking-wider">
                Major
              </label>
              <select
                value={portfolioFilters.major}
                onChange={(e) => updatePortfolioFilters({ major: e.target.value })}
                className="w-full mt-1 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm font-lexend text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20"
              >
                <option value="all">All Majors</option>
                {availableMajors.map(major => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-jakarta font-semibold text-on-surface-variant uppercase tracking-wider">
                Skill
              </label>
              <select
                value={portfolioFilters.skill}
                onChange={(e) => updatePortfolioFilters({ skill: e.target.value })}
                className="w-full mt-1 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm font-lexend text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary/20"
              >
                <option value="all">All Skills</option>
                {availableSkills.map(skill => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-8 lg:overflow-y-auto lg:pr-2 lg:max-h-screen">
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-jakarta font-bold text-on-surface">Instructors</h2>
              <p className="text-sm font-lexend text-on-surface-variant">
                {isDefaultSearch ? 'Recommended instructors for you.' : `Found ${instructorResults.length} instructors.`}
              </p>
            </div>
            {instructorResults.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-8 text-center" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
                <p className="text-sm font-lexend text-on-surface-variant">No instructors match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {instructorResults.map(instructor => (
                  <div
                    key={instructor.instructorId}
                    onClick={() => handleViewInstructor(instructor.instructorId)}
                    className="group bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm hover:shadow-raised hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col h-full"
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary text-sm font-jakarta font-bold overflow-hidden">
                          {instructor.profilePicture ? (
                            <img src={instructor.profilePicture} alt={instructor.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{instructor.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] font-lexend text-outline uppercase tracking-wider">Instructor</p>
                          <p className="text-base font-jakarta font-bold text-on-surface group-hover:text-primary transition-colors">
                            {instructor.name}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-lexend text-on-surface-variant">
                        {instructor.email}
                      </p>
                    </div>
                    <p className="text-sm font-lexend text-on-surface-variant line-clamp-3 mb-6 flex-1">
                      {instructor.biography}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {instructor.researchInterests.slice(0, 3).map(interest => (
                        <span key={interest} className="px-2 py-1 bg-surface-container text-[10px] font-lexend font-bold text-on-surface-variant rounded-md border border-outline-variant/20">
                          {interest}
                        </span>
                      ))}
                      {instructor.researchInterests.length > 3 && (
                        <span className="text-[10px] font-lexend text-outline px-2 py-1">+{instructor.researchInterests.length - 3}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-jakarta font-bold text-on-surface">Projects</h2>
              <p className="text-sm font-lexend text-on-surface-variant">
                {isDefaultSearch ? 'Recommended projects based on recent activity.' : `Found ${projectResults.length} projects.`}
              </p>
            </div>
            {projectResults.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-8 text-center" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
                <p className="text-sm font-lexend text-on-surface-variant">No projects match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projectResults.map(project => {
                  const course = getCourseById(project.course)
                  return (
                    <div
                      key={project.id}
                      onClick={() => handleViewProject(project.id)}
                      className="group bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm hover:shadow-raised hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col h-full"
                    >
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-[10px] font-jakarta font-bold border border-primary/10">
                            {course?.code ?? 'GEN'}
                          </span>
                          <span className="text-[10px] font-lexend text-outline uppercase tracking-wider">
                            {new Date(project.createdDate).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-jakarta font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {project.title}
                        </h3>
                      </div>
                      <p className="text-sm font-lexend text-on-surface-variant line-clamp-3 mb-6 flex-1">
                        {project.projectReport}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.languages.slice(0, 3).map(lang => (
                          <span key={lang} className="px-2 py-1 bg-surface-container text-[10px] font-lexend font-bold text-on-surface-variant rounded-md border border-outline-variant/20">
                            {lang}
                          </span>
                        ))}
                        {project.languages.length > 3 && (
                          <span className="text-[10px] font-lexend text-outline px-2 py-1">+{project.languages.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-jakarta font-bold text-on-surface">Portfolios</h2>
              <p className="text-sm font-lexend text-on-surface-variant">
                {isDefaultSearch ? 'Recommended student portfolios for you.' : `Found ${portfolioResults.length} portfolios.`}
              </p>
            </div>
            {portfolioResults.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-8 text-center" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
                <p className="text-sm font-lexend text-on-surface-variant">No portfolios match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {portfolioResults.map(portfolio => (
                  <div
                    key={portfolio.studentId}
                    onClick={() => setActivePortfolio(portfolio)}
                    className="group bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm hover:shadow-raised hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col h-full"
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary text-sm font-jakarta font-bold overflow-hidden">
                          {portfolio.profilePicture ? (
                            <img src={portfolio.profilePicture} alt={portfolio.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{portfolio.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] font-lexend text-outline uppercase tracking-wider">Portfolio</p>
                          <p className="text-base font-jakarta font-bold text-on-surface group-hover:text-primary transition-colors">
                            {portfolio.name}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-lexend text-on-surface-variant">
                        {portfolio.major}
                      </p>
                    </div>
                    <p className="text-sm font-lexend text-on-surface-variant line-clamp-2 mb-6 flex-1">
                      {portfolio.bio}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {portfolio.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-surface-container text-[10px] font-lexend font-bold text-on-surface-variant rounded-md border border-outline-variant/20">
                          {skill}
                        </span>
                      ))}
                      {portfolio.skills.length > 3 && (
                        <span className="text-[10px] font-lexend text-outline px-2 py-1">+{portfolio.skills.length - 3}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {activePortfolio && (
        <PortfolioDetailModal
          portfolio={activePortfolio}
          onClose={() => setActivePortfolio(null)}
        />
      )}
    </div>
  )
}

interface PortfolioDetailModalProps {
  portfolio: ReturnType<typeof usePortfolioSearch>['portfolios'][number]
  onClose: () => void
}

/**
 * PortfolioDetailModal — shows portfolio highlights for search results.
 *
 * @param portfolio - Selected portfolio data.
 * @param onClose - Closes the modal.
 */
function PortfolioDetailModal({ portfolio, onClose }: PortfolioDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface-container-lowest border-b border-surface-container-high p-6 flex justify-between items-center">
          <h2 className="text-2xl font-jakarta font-bold text-on-surface">
            Portfolio Profile
          </h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface text-2xl"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-surface-container-high">
            <div className="w-24 h-24 rounded-full bg-secondary-container flex items-center justify-center text-secondary text-3xl font-jakarta font-bold overflow-hidden">
              {portfolio.profilePicture ? (
                <img src={portfolio.profilePicture} alt={portfolio.name} className="w-full h-full object-cover" />
              ) : (
                <span>{portfolio.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-jakarta font-bold text-on-surface mb-1">
                {portfolio.name}
              </h3>
              <p className="text-body-md text-on-surface-variant mb-2">
                {portfolio.email}
              </p>
              <p className="text-sm font-lexend text-on-surface-variant">
                Major: <span className="font-semibold text-on-surface">{portfolio.major}</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-jakarta font-bold text-on-surface">About</h4>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {portfolio.bio}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-jakarta font-bold text-on-surface">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 text-sm font-lexend bg-secondary-container/40 text-on-secondary-container rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-surface-container-high">
            <a
              href={portfolio.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-secondary text-on-secondary rounded-lg font-jakarta font-semibold hover:bg-secondary-container transition-colors"
            >
              View LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
