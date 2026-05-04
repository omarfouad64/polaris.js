import { useNavigate } from 'react-router-dom'
import useProjectSearch from '../../../../hooks/useProjectSearch'
import { useGlobalContext } from '../../../../globalContext'

/**
 * ProjectSearchPanel — Component to search and filter platform projects.
 * Covers Req 42, 43, 44, 45.
 */
export default function ProjectSearchPanel(): React.JSX.Element {
  const navigate = useNavigate()
  const { user } = useGlobalContext()
  const { projects, filters, updateFilters, getCourseById } = useProjectSearch()

  const rolePath = user?.role === 'Course Instructor' ? 'instructor' 
                 : user?.role === 'Administrator' ? 'administrator'
                 : user?.role === 'Employer' ? 'employer' 
                 : 'student'

  const handleViewProject = (id: string) => {
    navigate(`/portal/${rolePath}/projects/${id}/view`)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Search projects by title or content..." 
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm font-lexend outline-none focus:border-primary transition-all"
          />
        </div>
        
        <select 
          value={filters.sortBy}
          onChange={(e: any) => updateFilters({ sortBy: e.target.value })}
          className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm font-jakarta font-bold outline-none cursor-pointer"
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="rating_desc">Highest Rated</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-surface-container-low/20 rounded-3xl border border-dashed border-outline-variant/50">
            <span className="material-symbols-outlined text-4xl text-outline/30 mb-2">find_in_page</span>
            <p className="font-lexend text-on-surface-variant">No projects found matching your search.</p>
          </div>
        ) : (
          projects.map(p => {
            const course = getCourseById(p.course)
            return (
              <div 
                key={p.id} 
                onClick={() => handleViewProject(p.id)}
                className="group bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm hover:shadow-raised hover:scale-[1.01] transition-all duration-300 cursor-pointer flex flex-col h-full"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-[10px] font-jakarta font-bold border border-primary/10">
                      {course?.code ?? 'GEN'}
                    </span>
                    <span className="text-[10px] font-lexend text-outline uppercase tracking-wider">
                      {new Date(p.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-jakarta font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {p.title}
                  </h3>
                </div>
                
                <p className="text-sm font-lexend text-on-surface-variant line-clamp-3 mb-6 flex-1">
                  {p.projectReport}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {p.languages.slice(0, 3).map(lang => (
                    <span key={lang} className="px-2 py-1 bg-surface-container text-[10px] font-lexend font-bold text-on-surface-variant rounded-md border border-outline-variant/20">
                      {lang}
                    </span>
                  ))}
                  {p.languages.length > 3 && (
                    <span className="text-[10px] font-lexend text-outline px-2 py-1">+{p.languages.length - 3}</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-[10px] font-bold">JD</div>
                    <span className="text-xs font-jakarta font-bold text-on-surface-variant">John Doe</span>
                  </div>
                  <div className="flex items-center gap-1 text-secondary">
                    <span className="material-symbols-outlined text-[16px]">grade</span>
                    <span className="text-xs font-jakarta font-bold">4.8</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
