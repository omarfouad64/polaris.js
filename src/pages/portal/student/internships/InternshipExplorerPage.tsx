import { useState } from 'react'
import useInternshipSearch from '../../../../hooks/useInternshipSearch'
import Button from '../../../../components/Button'

/**
 * InternshipExplorerPage — student interface for discovering and applying to internships.
 * Covers Req 79 (search), 80 (filter), 81 (view list), 82 (sort), 83 (select), 84 (apply), 89 (notifications via status), 90 (completed).
 */
export default function InternshipExplorerPage(): React.JSX.Element {
  const {
    internships, applications, completedInternships,
    searchQuery, setSearchQuery, companyFilter, setCompanyFilter,
    durationFilter, toggleDurationFilter, sortOrder, setSortOrder,
    applyForInternship, hasApplied
  } = useInternshipSearch()

  const [viewTab, setViewTab] = useState<'all' | 'applications' | 'completed'>('all')
  const [applyingTo, setApplyingTo] = useState<string | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(true)

  const handleApply = (): void => {
    if (!applyingTo || !coverLetter.trim()) return
    applyForInternship(applyingTo, coverLetter)
    setApplyingTo(null)
    setCoverLetter('')
  }

  const selectedInternship = internships.find(i => i.id === selectedId)
  const durations = ['1 month', '2 months', '3 months', '6 months']

  const statusColors: Record<string, string> = {
    Pending: 'bg-surface-container text-on-surface-variant',
    Nominated: 'bg-primary/10 text-primary',
    Accepted: 'bg-secondary/10 text-secondary',
    Rejected: 'bg-error/10 text-error'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-jakarta font-bold text-on-surface">Internships</h2>
        <p className="font-lexend text-on-surface-variant text-sm">Find and apply for internship opportunities.</p>
      </div>

      <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1 w-fit">
        {(['all', 'applications', 'completed'] as const).map(t => (
          <button key={t} onClick={() => setViewTab(t)} className={`px-5 py-2 rounded-lg text-sm font-jakarta font-semibold transition-all ${viewTab === t ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
            {t === 'all' ? 'All Internships' : t === 'applications' ? `My Applications (${applications.length})` : `Completed (${completedInternships.length})`}
          </button>
        ))}
      </div>

      {viewTab === 'all' && (
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          {showFilters && (
            <div className="hidden md:block w-64 flex-shrink-0 space-y-4">
              <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/40 space-y-4" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
                <h4 className="font-jakarta font-semibold text-on-surface text-sm">Filters</h4>
                <div>
                  <label className="font-jakarta text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Company</label>
                  <input value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} className="w-full mt-1 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 font-lexend text-sm text-on-surface placeholder:text-outline focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-colors" placeholder="Filter by company" />
                </div>
                <div>
                  <label className="font-jakarta text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Duration</label>
                  <div className="space-y-1.5 mt-1">
                    {durations.map(d => (
                      <label key={d} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={durationFilter.includes(d)} onChange={() => toggleDurationFilter(d)} className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary/20" />
                        <span className="text-sm font-lexend text-on-surface">{d}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button onClick={() => { setCompanyFilter(''); durations.forEach(d => { if (durationFilter.includes(d)) toggleDurationFilter(d) }) }} className="text-sm font-jakarta text-primary hover:underline">Clear Filters</button>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-lexend text-sm text-on-surface placeholder:text-outline focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors" placeholder="Search by title or company..." />
              </div>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value as 'newest' | 'oldest')} className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 font-lexend text-sm text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <button onClick={() => setShowFilters(p => !p)} className="md:hidden p-2.5 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors" aria-label="Toggle filters"><span className="material-symbols-outlined">filter_list</span></button>
            </div>

            {internships.length === 0 ? (
              <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-outline-variant/40" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
                <span className="material-symbols-outlined text-[48px] text-outline/40">search_off</span>
                <p className="font-lexend text-on-surface-variant mt-2">No internships match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {internships.map(i => (
                  <div key={i.id} onClick={() => setSelectedId(i.id)} className="group bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-5 cursor-pointer transition-all duration-200 hover:shadow-[0_4px_16px_rgba(55,48,163,0.10)]" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-jakarta font-semibold text-on-surface group-hover:text-primary transition-colors">{i.title}</h4>
                        <p className="text-sm font-lexend text-on-surface-variant">{i.companyName}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-jakarta font-semibold ${i.status === 'Hiring' ? 'bg-secondary/10 text-secondary' : 'bg-outline-variant/30 text-on-surface-variant'}`}>{i.status}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {i.skills.slice(0, 4).map(s => (<span key={s} className="px-2.5 py-0.5 bg-surface-container-high text-on-surface-variant rounded-full text-xs font-lexend">{s}</span>))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-lexend text-on-surface-variant">{i.duration} • Deadline: {i.applicationDeadline}</span>
                      {!hasApplied(i.id) && i.status === 'Hiring' ? (
                        <button onClick={e => { e.stopPropagation(); setApplyingTo(i.id) }} className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-jakarta font-semibold hover:bg-primary-container transition-colors active:translate-y-[1px] focus-visible:ring-2 focus-visible:ring-secondary">Apply</button>
                      ) : hasApplied(i.id) ? (
                        <span className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-lg text-xs font-jakarta font-semibold">Applied</span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail overlay */}
      {selectedId && selectedInternship && (
        <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-surface-container-lowest rounded-xl p-8 w-full max-w-lg space-y-4" style={{ boxShadow: '0 8px 32px rgba(55,48,163,0.14)' }}>
            <div className="flex justify-between items-start">
              <div><h3 className="text-xl font-jakarta font-bold text-on-surface">{selectedInternship.title}</h3><p className="text-sm font-lexend text-on-surface-variant">{selectedInternship.companyName}</p></div>
              <button onClick={() => setSelectedId(null)} className="p-1 rounded-lg hover:bg-surface-container transition-colors" aria-label="Close"><span className="material-symbols-outlined">close</span></button>
            </div>
            <p className="font-lexend text-on-surface text-sm leading-relaxed">{selectedInternship.description}</p>
            <div className="flex flex-wrap gap-1.5">{selectedInternship.skills.map(s => (<span key={s} className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-jakarta font-semibold">{s}</span>))}</div>
            <div className="grid grid-cols-2 gap-3 text-sm font-lexend text-on-surface-variant">
              <div><span className="font-jakarta font-semibold text-on-surface">Duration:</span> {selectedInternship.duration}</div>
              <div><span className="font-jakarta font-semibold text-on-surface">Deadline:</span> {selectedInternship.applicationDeadline}</div>
            </div>
            {!hasApplied(selectedInternship.id) && selectedInternship.status === 'Hiring' && (
              <Button onClick={() => { setApplyingTo(selectedInternship.id); setSelectedId(null) }}>Apply Now</Button>
            )}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyingTo && (
        <div className="fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Apply for internship">
          <div className="bg-surface-container-lowest rounded-xl p-8 w-full max-w-lg space-y-4" style={{ boxShadow: '0 8px 32px rgba(55,48,163,0.14)' }}>
            <h3 className="text-xl font-jakarta font-bold text-on-surface">Apply for Internship</h3>
            <div>
              <label className="font-jakarta text-sm font-semibold text-on-surface-variant">Cover Letter</label>
              <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value.slice(0, 500))} className="w-full mt-1 bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-lexend text-on-surface placeholder:text-outline focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-colors resize-none h-32" placeholder="Why do you think you fit this role?" />
              <span className="text-xs font-lexend text-on-surface-variant">{coverLetter.length}/500</span>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleApply} disabled={!coverLetter.trim()}>Submit Application</Button>
              <Button variant="ghost" onClick={() => { setApplyingTo(null); setCoverLetter('') }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {viewTab === 'applications' && (
        <div className="space-y-3">
          {applications.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-outline-variant/40" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
              <span className="material-symbols-outlined text-[48px] text-outline/40">assignment</span>
              <p className="font-lexend text-on-surface-variant mt-2">You haven&apos;t applied to any internships yet.</p>
            </div>
          ) : applications.map(a => (
            <div key={a.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-5 flex items-center justify-between" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
              <div>
                <h4 className="font-jakarta font-semibold text-on-surface">{a.internshipTitle}</h4>
                <p className="text-sm font-lexend text-on-surface-variant">{a.companyName} • Applied {a.appliedAt}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-jakarta font-semibold ${statusColors[a.status]}`}>{a.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Completed Tab - Req 90 */}
      {viewTab === 'completed' && (
        <div className="space-y-3">
          {completedInternships.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-outline-variant/40" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
              <span className="material-symbols-outlined text-[48px] text-outline/40">workspace_premium</span>
              <p className="font-lexend text-on-surface-variant mt-2">No completed internships yet.</p>
            </div>
          ) : completedInternships.map(ci => (
            <div key={ci.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-5 flex items-center gap-4" style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}>
              <span className="material-symbols-outlined text-secondary text-[28px]">verified</span>
              <div>
                <h4 className="font-jakarta font-semibold text-on-surface">{ci.title}</h4>
                <p className="text-sm font-lexend text-on-surface-variant">{ci.companyName} • {ci.duration} • Completed {ci.completedAt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
